import { logger as parentLogger } from "@/lib/logger";
import { genNodeId } from "@/schema/node";
import { genWireId } from "@/schema/wire";
import { makeEqualityConstraintBuilder } from "../graph/constraint";
import { RelGraph } from "../graph/relGraph";
import { VertexId, vertexIdEq } from "../graph/vertex";
import { SerialCoordGraph, SerialSubgraph } from "../serialSchemas/serialCoordGraph";
import { UPDATE_IDEAL, UPDATE_ITERATIVE } from "../settings";
import { Coord } from "./coord/coord";
import { DifferentialCoord } from "./coord/differentialCoord";
import { CoordVertex } from "./coordVertex";
import { CircuitEdge } from "./edges/circuitEdge";
import {
  ITERATIONS,
  NodeEdge,
  OP_TYPE,
  PrimitiveOpType,
  STEP_SIZE,
  SerialNodeEdge,
} from "./edges/nodeEdge";
import { SerialWireEdge, WireEdge } from "./edges/wireEdge";
import { makeIterativeComplexEqualityConstraintBuilder } from "./operations/iterative";

const logger = parentLogger.child({ module: "CoordGraph" });

export class CoordGraph extends RelGraph<DifferentialCoord, CoordVertex> {
  // :RelGraph<LinkagePoint>

  focus: CoordVertex | null;
  mode: number;

  // shouldUpdateNodeInternals: boolean;

  constructor(
    mode = UPDATE_IDEAL,
    focus: CoordVertex | null = null,
    edges: CircuitEdge[] = [],
    vertices: CoordVertex[] = []
  ) {
    let eq = CoordGraph.getEqualityConstraintBuilder(mode);

    super(vertices, edges, eq);

    this.focus = focus;
    this.mode = mode;
    // this.shouldUpdateNodeInternals = false;
  }

  // adding this because we need to preserve identity of our maingraph when we load up a new file.
  mutateCopy(other: CoordGraph) {
    logger.debug(other.serialize());
    this.vertices = other.vertices;
    this.edges = other.edges;
    this.mode = other.mode;
    this.focus = other.focus;
  }

  static getEqualityConstraintBuilder(mode: number) {
    let f_eq = function (z1: DifferentialCoord, z2: DifferentialCoord) {
      return z1.equals(z2);
    };
    let f_cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      let z = zOld.copy();
      z.mut_sendTo(zNew);

      if (z.delta && zNew.delta) {
        z.delta.mut_avg(zNew.delta);
      } else {
        z.delta = null;
      }

      return z;
    };
    let eq = makeEqualityConstraintBuilder(f_eq, f_cp);
    if (mode == UPDATE_ITERATIVE) {
      eq = makeIterativeComplexEqualityConstraintBuilder(f_eq, f_cp, STEP_SIZE, ITERATIONS);
    }
    return eq;
  }

  serialize(): SerialCoordGraph {
    return {
      edges: this.edges.map((e) => e.serialize() as SerialNodeEdge | SerialWireEdge),
      mode: this.mode,
      focus: this.focus?.id ?? null,
    };
  }

  serializeAsSubgraph(): SerialSubgraph {
    return {
      edges: this.edges.map((e) => e.serialize() as SerialNodeEdge | SerialWireEdge),
    };
  }

  addCompositeOperation(serialNodeEdge: SerialNodeEdge) {
    const nodeId = genNodeId();
    const vs: CoordVertex[] = [];
    serialNodeEdge.vertices.forEach((v) => {
      // todo add iterator
      vs.push(this.addFree(v.value.x, v.value.y, { node: nodeId, handle: v.id.handle }));
    });
    this.edges.push(
      new NodeEdge(
        vs,
        serialNodeEdge.operator,
        this.mode,
        nodeId,
        serialNodeEdge.position,
        false,
        false,
        serialNodeEdge.label
      )
    );
    return nodeId;
  }

  // use this instead of addRelated
  addOperation(type: PrimitiveOpType, position = { x: 0, y: 0 }): string {
    const nodeId = genNodeId();

    let vs: CoordVertex[] = [];
    if (type == OP_TYPE.ADDER) {
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 1 }));
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 2 }));
    } else if (type == OP_TYPE.MULTIPLIER) {
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 1 }));
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 2 }));
    } else if (type == OP_TYPE.CONJUGATOR) {
      vs.push(this.addFree(0, 1, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(0, -1, { node: nodeId, handle: 1 }));
    } else if (type == OP_TYPE.EXPONENTIAL) {
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 0 }));
      vs.push(this.addFree(1, 0, { node: nodeId, handle: 1 }));
    } else if (type == OP_TYPE.STANDALONE) {
      vs.push(this.addFree(0, 0, { node: nodeId, handle: 0 }));
    } else {
      throw new Error("Invalid operation type");
    }

    const operationData = {
      primitive: true as const,
      type,
    };

    let e = new NodeEdge(vs, operationData, this.mode, nodeId, position);
    this.edges.push(e);
    return nodeId;
  }

  addFree(x: number, y: number, id: VertexId) {
    let v = new CoordVertex(new DifferentialCoord(x, y), id);
    return this.vertices[this.vertices.push(v) - 1]; // WARNING THIS IS REQUIRED BECAUSE PUSHING CREATES A PROXY OBJECT
  }

  // wires
  addWire(source: VertexId, target: VertexId) {
    // this.instances.forEach((i) => (i as CoordGraph).addWire(source, target));
    const id = genWireId();
    const c = this.buildWireConstraint();
    const vSource = this.edges.find((e) => e.id === source.node)!.vertices[source.handle];
    const vTarget = this.edges.find((e) => e.id === target.node)!.vertices[target.handle];
    if (vTarget.isFree() && vTarget !== vSource) {
      vTarget.value.delta = new Coord(1, 0);
      const e = new WireEdge([vSource, vTarget], id, source, target, c);
      return this.edges[this.edges.push(e) - 1];
    } else {
      return null;
    }
  }

  removeWire(id: string) {
    this._removeEdge(id);
  }

  // nodes
  removeNode(id: string) {
    this._removeEdge(id, true);
  }

  // // must provide the hidden vertex in order to resume display
  // disunify(v: CoordVertex) {
  //   if (this._disunify(v)) {
  //     v.hidden = false;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  applyDifferential(delta: Coord) {
    for (let v of this.vertices) {
      (v.value as DifferentialCoord).mut_applyDifferential(delta);
    }
  }

  display() {
    for (const e of this.edges) {
      if (e instanceof NodeEdge) {
        e.displayLinkage();
      }
    }

    for (const v of this.vertices) {
      if (this.focus) {
        if (vertexIdEq(v.id, this.focus.id)) {
          v.display(true, false);
        } else if (this.getDepends(this.focus).includes(v)) {
          v.display(false, true);
        } else {
          v.display();
        }
      } else {
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

  startReversal(focusId: VertexId) {
    this.focus = this._getVertex(focusId);
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

  completeReversal(targetId: VertexId) {
    if (this.focus) {
      let target = this._getVertex(targetId);
      if (target && this.invert(this.focus, target)) {
        // this.shouldUpdateNodeInternals = true;
        this.focus = null;
      } else {
        this.cancelReversal();
      }
    }
  }

  setNodeVisibility(id: string, hidden: boolean) {
    let e = this._getEdge(id);
    if (e instanceof NodeEdge) {
      e.hidden = hidden;
      e.vertices.forEach((v) => (v.hidden = hidden));
    } else {
      throw new Error("setNodeVisibility called on non-node edge");
    }
  }

  setVertexSelectedness(id: VertexId, selected: boolean) {
    let v = this._getVertex(id);
    if (v) {
      v.selected = selected;
    }
  }

  // registerNodeInternalsUpdated() {
  //   this.shouldUpdateNodeInternals = false;
  // }

  // findUnify() {
  //   let v1 = this.findMouseover();
  //   if (v1) {
  //     v1.hidden = true;
  //     let v2 = this.findMouseover();
  //     v1.hidden = false;
  //     if (v2 && this.unify(v1, v2)) {
  //       v2.hidden = true;
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}
