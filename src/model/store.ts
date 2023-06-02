import { logger as parentLogger } from "@/lib/logger";
import { handleIdToNum, handleNumToId } from "@/schema/handle";
import { AddNode, CircuitNode, Sticky, genNodeId, stickySchema } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { useEffect } from "react";
import { Connection, NodePositionChange } from "reactflow";
import { proxy, useSnapshot } from "valtio";
import { z } from "zod";
import { addAverage } from "../model/coords/operations/composites/average";
import { addCirclePlus } from "../model/coords/operations/composites/circlePlus";
import { addE } from "../model/coords/operations/composites/constants/e";
import { addI } from "../model/coords/operations/composites/constants/i";
import { addPhi } from "../model/coords/operations/composites/constants/phi";
import { addPi } from "../model/coords/operations/composites/constants/pi";
import { addCos } from "../model/coords/operations/composites/cos";
import { addDivider } from "../model/coords/operations/composites/divider";
import { addExponent } from "../model/coords/operations/composites/exponent";
import { addGeometricMean } from "../model/coords/operations/composites/geometricMean";
import { addHarmonicOscillator } from "../model/coords/operations/composites/harmonicOscillator";
import { addLinearSolver } from "../model/coords/operations/composites/linearSolver";
import { addLog } from "../model/coords/operations/composites/log";
import { addNthRoot } from "../model/coords/operations/composites/nthRoot";
import { addReciprocal } from "../model/coords/operations/composites/reciprocal";
import { addSin } from "../model/coords/operations/composites/sin";
import { addSubtractor } from "../model/coords/operations/composites/subtractor";
import { addTan } from "../model/coords/operations/composites/tan";
import { Coord } from "./coords/coord/coord";
import { CoordGraph } from "./coords/coordGraph";
import { CircuitEdge } from "./coords/edges/circuitEdge";
import { NodeEdge, OP_TYPE } from "./coords/edges/nodeEdge";
import { WireEdge } from "./coords/edges/wireEdge";
import {
  BUILTIN_COMPOSITES,
  CompositeOperation,
} from "./coords/operations/composites/compositeOperation";
import { deserializeGraph } from "./deserializeGraph";
import { OperatorConstraint } from "./graph/constraint";
import { VertexId } from "./graph/vertex";
import { serialCoordGraphSchema } from "./serialSchemas/serialCoordGraph";
import { UPDATE_MODE, settings } from "./settings";
import { p } from "./setup";

const logger = parentLogger.child({ module: "store" });

export let mainGraph = proxy(new CoordGraph(UPDATE_MODE)); // would be better if const

setInterval(() => {
  if (!p) {
    return;
  }
  if (!settings.centered) {
    settings.centered = true;
    settings.CENTER_X = p!.width / 2;
    settings.CENTER_Y = p!.height / 2;
  }

  mainGraph.update(settings.updateCycles);
}, 1000 / 60);

const stickies = proxy([] as Sticky[]);
const isSticky = (id: string) => stickies.find((s) => s.id === id) !== undefined;
const findSticky = (id: string) => stickies.find((s) => s.id === id)!;

export const updateNodePosition = (e: NodePositionChange) => {
  if (isSticky(e.id)) {
    const sticky = findSticky(e.id);
    sticky.position = e.position ?? sticky.position;
  } else {
    // is math
    const node = mainGraph._getEdge(e.id) as NodeEdge;
    node.position = e.position ?? node.position;
  }
};

export const addWire = (conn: Connection) => {
  mainGraph.addWire(
    { node: conn.source!, handle: handleIdToNum(conn.sourceHandle!) },
    { node: conn.target!, handle: handleIdToNum(conn.targetHandle!) }
  );
};

export const removeWire = (id: string) => mainGraph.removeWire(id);

export const addNode = (addNode: AddNode) => {
  switch (addNode.type) {
    case "sticky":
      stickies.push({
        id: genNodeId(),
        type: "sticky",
        position: addNode.position,
        data: { text: "" },
        selected: false,
      });
      break;
    case "math":
      mainGraph.addOperation(addNode.data.opType, addNode.position);
      break;
    case "composite":
      switch (addNode.data.opType) {
        case BUILTIN_COMPOSITES.SUBTRACTOR:
          addSubtractor(addNode.position);
          break;
        case BUILTIN_COMPOSITES.DIVIDER:
          addDivider(addNode.position);
          break;
        case BUILTIN_COMPOSITES.RECIPROCAL:
          addReciprocal(addNode.position);
          break;
        case BUILTIN_COMPOSITES.AVERAGE:
          addAverage(addNode.position);
          break;
        case BUILTIN_COMPOSITES.EXPONENT:
          addExponent(addNode.position);
          break;
        case BUILTIN_COMPOSITES.NTH_ROOT:
          addNthRoot(addNode.position);
          break;
        case BUILTIN_COMPOSITES.LOG:
          addLog(addNode.position);
          break;
        case BUILTIN_COMPOSITES.SIN:
          addSin(addNode.position);
          break;
        case BUILTIN_COMPOSITES.COS:
          addCos(addNode.position);
          break;
        case BUILTIN_COMPOSITES.TAN:
          addTan(addNode.position);
          break;
        case BUILTIN_COMPOSITES.PI:
          addPi(addNode.position);
          break;
        case BUILTIN_COMPOSITES.E:
          addE(addNode.position);
          break;
        case BUILTIN_COMPOSITES.I:
          addI(addNode.position);
          break;
        case BUILTIN_COMPOSITES.PHI:
          addPhi(addNode.position);
          break;
        case BUILTIN_COMPOSITES.LINEAR_SOLVER:
          addLinearSolver(addNode.position);
          break;
        case BUILTIN_COMPOSITES.CIRCLE_PLUS:
          addCirclePlus(addNode.position);
          break;
        case BUILTIN_COMPOSITES.GEOMETRIC_MEAN:
          addGeometricMean(addNode.position);
          break;
        case BUILTIN_COMPOSITES.HARMONIC_OSCILLATOR:
          addHarmonicOscillator(addNode.position);
          break;
        default:
          throw new Error("unknown composite type");
      }
      break;
    default:
      throw new Error("unknown node type");
  }
};

export const removeNode = (id: string) => {
  if (isSticky(id)) {
    stickies.splice(stickies.indexOf(findSticky(id)), 1);
  } else {
    mainGraph.removeNode(id);
  }
};

export const changeSelection = (id: string, selected: boolean) => {
  if (isSticky(id)) {
    const sticky = findSticky(id);
    sticky.selected = selected;
  } else {
    const edge = mainGraph._getEdge(id) as CircuitEdge | undefined;
    if (!edge) {
      throw new Error("edge for selection change not found");
    }
    edge.selected = selected;
  }
};

export const updateCoord = (vertexId: VertexId, coord: Coord) => {
  const vertex = mainGraph._getVertex(vertexId);
  vertex.value.mut_sendTo(coord);
};

export const updateStickyText = (id: string, text: string) => {
  const sticky = findSticky(id);
  sticky.data.text = text;
};

export const updateLabel = (id: string, label: string) => {
  const edge = mainGraph._getEdge(id);
  if (edge && edge instanceof NodeEdge) {
    edge.label = label;
  } else {
    throw new Error("edge not found");
  }
};

export const cloneSelected = () => {
  const selected = mainGraph.edges.filter((e) => (e as CircuitEdge).selected);
  const unselected = mainGraph.edges.filter((e) => !(e as CircuitEdge).selected);
  const idMap = new Map<string, string>();
  selected.forEach((e) => {
    if (e instanceof NodeEdge) {
      const id = genNodeId();
      const verticesClone = e.vertices.map((v) =>
        mainGraph.addFree(v.value.x, v.value.y, { node: id, handle: v.id.handle })
      );
      const newEdge = new NodeEdge(
        verticesClone,
        e.type === OP_TYPE.COMPOSITE
          ? (e.constraint as CompositeOperation).serialize()
          : {
              primitive: true as const,
              type: e.type,
              bound: e.constraint.hasOwnProperty("bound")
                ? (e.constraint as OperatorConstraint<any>).bound
                : undefined,
            },
        UPDATE_MODE,
        id,
        { ...e.position },
        e.hidden,
        e.selected,
        e.label
      );
      mainGraph.edges.push(newEdge);
      idMap.set(e.id, id);
    }
  });
  // wait until our map is full to process wires
  // give precedence to unselected wires
  unselected.forEach((e) => {
    if (e instanceof WireEdge) {
      // transfer unselected wires to the clone
      removeWire(e.id);
      mainGraph.addWire(
        { node: idMap.get(e.source.node) ?? e.source.node, handle: e.source.handle },
        { node: idMap.get(e.target.node) ?? e.target.node, handle: e.target.handle }
      );
    }
  });
  selected.forEach((e) => {
    if (e instanceof WireEdge) {
      const addedWire = mainGraph.addWire(
        { node: idMap.get(e.source.node) ?? e.source.node, handle: e.source.handle },
        { node: idMap.get(e.target.node) ?? e.target.node, handle: e.target.handle }
      );
      if (!addedWire) {
        // if we are unable to clone a wire, it should not be stolen from the original
        removeWire(e.id);
        mainGraph.addWire(
          { node: idMap.get(e.source.node) ?? e.source.node, handle: e.source.handle },
          { node: idMap.get(e.target.node) ?? e.target.node, handle: e.target.handle }
        );
      }
    }
  });

  stickies.forEach((s) => {
    if (s.selected) {
      const newId = genNodeId();
      stickies.push({
        id: newId,
        type: "sticky",
        position: s.position,
        data: { text: s.data.text },
        selected: false,
      });
    }
  });
};

// deprecated
// export const registerNodeInternalsUpdated = () => {
//   mainGraph.registerNodeInternalsUpdated();
// };

// const logGraph = () => {
//   logger.debug({ mainGraph: JSON.parse(JSON.stringify(mainGraph)) }, "mainGraph got new snapshot");
// };

export const serialStateSchema = z.object({
  graph: serialCoordGraphSchema,
  stickies: z.array(stickySchema),
});

export type SerialState = z.infer<typeof serialStateSchema>;

export const useMainGraph = (initial?: SerialState, cartesian = false) => {
  // logger.debug({ initial }, "useMainGraph called");
  const graphSnap = useSnapshot(mainGraph);
  const stickiesSnap = useSnapshot(stickies);

  // TODO: COMMENTING OUT URL ENCODING... for now
  useEffect(() => {
    if (initial) {
      // logger.debug({ initial }, "restoring from url");
      mainGraph = proxy(deserializeGraph(initial.graph));
      stickies.splice(0, stickies.length, ...initial.stickies);
      // logger.debug({ mainGraph, stickies }, "restored from url");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const serial: SerialState = {
        graph: mainGraph.serialize(),
        stickies,
      };
      const str = encodeURIComponent(JSON.stringify(serial));
      window.history.pushState({}, "", str);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {}, [stickiesSnap]);

  let nodes: CircuitNode[] = [];
  const wires: Wire[] = [];
  (graphSnap.edges as CircuitEdge[]).forEach((edge) => {
    if (edge instanceof WireEdge) {
      wires.push(edgeToWire(edge));
    } else {
      nodes.push(edgeToNode(edge as NodeEdge, cartesian));
    }
  });

  nodes = nodes.concat(stickiesSnap);
  return {
    // shouldUpdateNodeInternals: graphSnap.shouldUpdateNodeInternals,
    nodes,
    wires,
    focus: graphSnap.focus,
  };
};

const edgeToWire = (edge: WireEdge): Wire => ({
  id: edge.id,
  source: edge.source.node,
  sourceHandle: handleNumToId(edge.source.handle),
  target: edge.target.node,
  targetHandle: handleNumToId(edge.target.handle),
  type: "coord",
  animated: true,
  selected: edge.selected,
});

const edgeToNode = (edge: NodeEdge, cartesian: boolean): CircuitNode => ({
  id: edge.id,
  type: "math",
  position: edge.position,
  data: {
    cartesian,
    opType: edge.type,
    vertices: edge.vertices,
    label: edge.label,
    edge: edge,
  },
  selected: edge.selected,
});
