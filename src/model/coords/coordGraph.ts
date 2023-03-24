import { logger as parentLogger } from "@/lib/logger";
import { genNodeId } from "@/schema/node";
import { genWireId } from "@/schema/wire";
import { makeEqualityConstraintBuilder } from "../graph/constraint";
import { RelGraph } from "../graph/relGraph";
import { VertexId } from "../graph/vertex";
import { UPDATE_IDEAL } from "../settings";
import { p } from "../sketch";
import { Coord } from "./coord/coord";
import { DifferentialCoord } from "./coord/differentialCoord";
import { CoordVertex } from "./coordVertex";
import { ADDER, CONJUGATOR, EXPONENTIAL, MULTIPLIER, NodeEdge, STANDALONE } from "./edges/nodeEdge";
import { WireEdge } from "./edges/wireEdge";

const logger = parentLogger.child({ module: "CoordGraph" });

export class CoordGraph extends RelGraph<Coord, CoordVertex> {
  // :RelGraph<LinkagePoint>

  focus: CoordVertex | null;
  mode: number;

  // for reviewing history
  frames: string[][];
  record: number;

  constructor(updateMode = UPDATE_IDEAL) {
    let f_eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    let f_cp = function (zOld: Coord, zNew: Coord) {
      let z = zOld.copy();
      z.mut_sendTo(zNew);
      if (z instanceof DifferentialCoord && zNew instanceof DifferentialCoord) {
        z.delta.mut_avg(zNew.delta);
      }
      return z;
    };
    let eq = makeEqualityConstraintBuilder(f_eq, f_cp);
    // if (updateMode == UPDATE_ITERATIVE) {
    //   eq = makeIterativeComplexEqualityConstraintBuilder(f_eq, f_cp);
    // }
    super(eq);

    this.focus = null;
    this.mode = updateMode;

    // for reviewing history
    this.frames = [];
    this.record = 0;
  }

  // use this instead of addRelated
  addOperation(type: number, position = { x: 0, y: 0 }) {
    const nodeId = genNodeId();

    let vs: CoordVertex[] = [];
    if (type == ADDER) {
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 1 }));
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 2 }));
    } else if (type == MULTIPLIER) {
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 1 }));
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 2 }));
    } else if (type == CONJUGATOR) {
      vs.push(this.addFree(0, 1, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(0, -1, { node: nodeId, handle: 1 }));
    } else if (type == EXPONENTIAL) {
      vs.push(this.addFree(0, p!.PI, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(-1, 0, { node: nodeId, handle: 1 }));
    } else if (type == STANDALONE) {
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 0 }));
    } else {
      return null;
    }

    let e = new NodeEdge(vs, type, this.mode, nodeId, position);
    e.updateDependencies();
    this.edges.push(e);
    logger.debug({ edge: e, vertices: this.vertices }, "addOperation");
    logger.debug({ deps: JSON.parse(JSON.stringify(this.getAllDeps())) }, "printDeps");
  }

  addFree(x: number, y: number, id: VertexId) {
    let v = new CoordVertex(new DifferentialCoord(x, y), id);
    return this.vertices[this.vertices.push(v) - 1]; // WARNING THIS IS REQUIRED BECAUSE PUSHING CREATES A PROXY OBJECT
  }

  addWire(source: VertexId, target: VertexId) {
    const id = genWireId();
    const c = this.buildWireConstraint();
    const vSource = this.edges.find((e) => e.id === source.node)!.vertices[source.handle];
    const vTarget = this.edges.find((e) => e.id === target.node)!.vertices[target.handle];
    if (vTarget.isFree()) {
      const e = new WireEdge([vSource, vTarget], id, source, target, c);
      this.edges.push(e);
      e.updateDependencies();
      return e;
    } else {
      return null;
    }
  }

  // must provide the hidden vertex in order to resume display
  disunify(v: CoordVertex) {
    if (this._disunify(v)) {
      v.hidden = false;
      return true;
    } else {
      return false;
    }
  }

  applyDifferential(delta: Coord) {
    for (let v of this.vertices) {
      (v.value as DifferentialCoord).mut_applyDifferential(delta);
    }
  }

  display(reversing = false) {
    for (const e of this.edges) {
      if (e instanceof NodeEdge) {
        e.displayLinkage();
      }
    }
    for (const v of this.vertices) {
      if (reversing && this.focus && this.getDepends(this.focus).includes(v)) {
        v.display(reversing);
      } else {
        // need more than 2 states! want depends to look more distinct
        // from other free vertices
        v.display();
      }
    }
  }

  // returns the first free vertex close to the cursor
  // if none, returns a bound vertex close to the cursor
  // if no vertices are close to the cursor, returns null
  findMouseover() {
    let result: CoordVertex | null = null;
    for (const v of this.vertices) {
      if (v.checkMouseover()) {
        if (v.isFree()) {
          return v;
        } else {
          result = v;
        }
      }
    }
    return result;
  }

  startReversal() {
    this.focus = this.findMouseover();
    if (this.focus && this.focus.isBound()) {
      return true;
    } else {
      this.focus = null;
      return false;
    }
  }

  cancelReversal() {
    this.focus = null;
  }

  completeReversal() {
    if (this.focus) {
      let target = this.findMouseover();
      if (target && this.invert(this.focus, target)) {
        this.focus = null;
      } else {
        this.cancelReversal();
      }
    }
  }

  findUnify() {
    let v1 = this.findMouseover();
    if (v1) {
      v1.hidden = true;
      let v2 = this.findMouseover();
      v1.hidden = false;
      if (v2 && this.unify(v1, v2)) {
        v2.hidden = true;
        return true;
      }
    }
    return false;
  }
}