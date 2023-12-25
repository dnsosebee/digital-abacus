import { BUFFER } from "@/components/nodes/interfaceNode";
import { handleIdToNum, handleNumToId } from "@/schema/handle";
import { AddNode, CircuitNode, genNodeId, stickySchema } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { Connection, NodePositionChange } from "reactflow";
import { proxy, useSnapshot } from "valtio";
import { z } from "zod";
import { addAverage } from "../model/coords/operations/composites/average";
import { addCirclePlus } from "../model/coords/operations/composites/circlePlus";
import { addE } from "../model/coords/operations/composites/constants/e";
import { addI } from "../model/coords/operations/composites/constants/i";
import { addPhi } from "../model/coords/operations/composites/constants/phi";
import { addPi } from "../model/coords/operations/composites/constants/pi";
import { addDivider } from "../model/coords/operations/composites/divider";
import { addExponent } from "../model/coords/operations/composites/exponent";
import { addGeometricMean } from "../model/coords/operations/composites/geometricMean";
import { addHarmonicOscillator } from "../model/coords/operations/composites/harmonicOscillator";
import { addLinearSolver } from "../model/coords/operations/composites/linearSolver";
import { addLog } from "../model/coords/operations/composites/log";
import { addNthRoot } from "../model/coords/operations/composites/nthRoot";
import { addReciprocal } from "../model/coords/operations/composites/reciprocal";
import { addSubtractor } from "../model/coords/operations/composites/subtractor";
import { addTemperature } from "../model/coords/operations/composites/temperature";
import { Coord } from "./coords/coord/coord";
import { CoordGraph } from "./coords/coordGraph";
import { SerialCoordVertex } from "./coords/coordVertex";
import { CircuitEdge } from "./coords/edges/circuitEdge";
import { NodeEdge, OP_TYPE, SerialNodeEdge } from "./coords/edges/nodeEdge";
import { WireEdge } from "./coords/edges/wireEdge";
import {
  BUILTIN_COMPOSITES,
  CompositeOperation,
  Layout,
  SerialCompositeOperation,
} from "./coords/operations/composites/compositeOperation";
import { addCos } from "./coords/operations/composites/trig/cos";
import { addCosh } from "./coords/operations/composites/trig/cosh";
import { addDegreesToRadians } from "./coords/operations/composites/trig/degreeToRadian";
import { addSin } from "./coords/operations/composites/trig/sin";
import { addSinh } from "./coords/operations/composites/trig/sinh";
import { addTan } from "./coords/operations/composites/trig/tan";
import { addTanh } from "./coords/operations/composites/trig/tanh";
import { OperatorConstraint } from "./graph/constraint";
import { VertexId, vertexIdEq } from "./graph/vertex";
import { SerialCoordGraph, serialCoordGraphSchema } from "./serialSchemas/serialCoordGraph";
import { UPDATE_MODE, settings } from "./settings";
import { p } from "./setup";

const initialGraph = new CoordGraph(UPDATE_MODE);
// const initialNodeEdge = new NodeEdge(
//   [],
//   {
//     primitive: false,
//     subgraph: initialGraph.serialize(),
//     boundArray: [],
// interfaceVertexIds: [
//    ],
//   },
//   UPDATE_MODE,
//   "REPLACE ME",
//   {x:0,y:0},
//   false,
//   false,
//   "REPLACE ME"
// );
// const initialSerialNodeEdge = initialNodeEdge.serialize();

export type Ancestor = {
  graph: CoordGraph;
  node: NodeEdge;
};

export const store = proxy({
  ancestors: [] as Ancestor[],
  visibleGraph: initialGraph, // this exists for backwards compatibility, because a lot of the code need a pointer to the mainGraph to work
  // mainGraphSerialEdge: initialSerialNodeEdge,
  components: [] as SerialNodeEdge[],
});

export const beginEditingComposite = (nodeId: string) => {
  const edge = store.visibleGraph._getEdge(nodeId) as NodeEdge;
  if (!edge) {
    throw new Error("edge not found");
  }
  if (edge.type !== OP_TYPE.COMPOSITE) {
    throw new Error("edge is not a composite");
  }
  if (!(edge.constraint instanceof CompositeOperation && edge.constraint.layout)) {
    alert("This cannot be edited.");
    return;
  }
  const compositeConstraint = edge.constraint as CompositeOperation;
  store.ancestors.push({ graph: store.visibleGraph, node: edge });
  store.visibleGraph = compositeConstraint.graph;
};

export const endEditingComposite = () => {
  const { graph, node } = store.ancestors.pop()!;
  store.visibleGraph = graph;
};

export const popToAncestor = (ancestorIdx: number) => {
  while (store.ancestors.length > ancestorIdx) {
    endEditingComposite();
  }
};

export const isEditingComposite = () => store.ancestors.length > 0;

export let mainGraph = () => store.visibleGraph; // would be better if const
export const userDefinedComposites = store.components;
export const stickies = () => {
  return store.visibleGraph.stickies;
};

let locked = false;
setInterval(() => {
  if (!p || locked) {
    return;
  }
  if (!settings.centered) {
    settings.centered = true;
    settings.CENTER_X = p!.width / 2;
    settings.CENTER_Y = p!.height / 2;
  }

  locked = true;
  const outermostGraph = store.ancestors.length === 0 ? mainGraph() : store.ancestors[0].graph;
  outermostGraph.update(settings.updateCycles);
  // console.log(mainGraph);
  locked = false;
}, 1000 / 60);

const isSticky = (id: string) => stickies().find((s) => s.id === id) !== undefined;
const findSticky = (id: string) => stickies().find((s) => s.id === id)!;

export const updateNodePosition = (e: NodePositionChange) => {
  if (e.id === "left" || e.id === "right" || e.id === "top" || e.id === "bottom") {
    // we don't process position changes on the parent node
    return;
  }
  if (isSticky(e.id)) {
    const sticky = findSticky(e.id);
    sticky.position = e.position ?? sticky.position;
  } else {
    // is math
    const node = mainGraph()._getEdge(e.id) as NodeEdge;
    node.position = e.position ?? node.position;
  }
};

export const addWire = (conn: Connection) => {
  mainGraph().addWire(
    { node: conn.source!, handle: handleIdToNum(conn.sourceHandle!) },
    { node: conn.target!, handle: handleIdToNum(conn.targetHandle!) }
  );
};

export const removeWire = (id: string) => mainGraph().removeWire(id);

export const addNode = (addNode: AddNode) => {
  switch (addNode.type) {
    case "sticky":
      stickies().push({
        id: genNodeId(),
        type: "sticky",
        position: addNode.position,
        data: { tiptapJson: {}, width: 200, height: 100 },
        selected: false,
        dragHandle: ".draggable",
      });
      break;
    case "math":
      mainGraph().addOperation(addNode.data.opType, addNode.position);
      break;
    case "built in composite":
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
        case BUILTIN_COMPOSITES.SINH:
          addSinh(addNode.position);
          break;
        case BUILTIN_COMPOSITES.COSH:
          addCosh(addNode.position);
          break;
        case BUILTIN_COMPOSITES.TANH:
          addTanh(addNode.position);
          break;
        case BUILTIN_COMPOSITES.TEMPERATURE:
          addTemperature(addNode.position);
          break;
        case BUILTIN_COMPOSITES.DEGREES_TO_RADIANS:
          addDegreesToRadians(addNode.position);
          break;
        default:
          throw new Error("unknown composite type");
      }
      break;
    case "user defined composite":
      const serialEdge = addNode.data.serialEdge;
      serialEdge.position = addNode.position;
      mainGraph().addCompositeOperation(serialEdge);
      break;
    default:
      throw new Error("unknown node type");
  }
};

export const removeNode = (id: string) => {
  if (isSticky(id)) {
    stickies().splice(stickies().indexOf(findSticky(id)), 1);
  } else {
    mainGraph().removeNode(id);
  }
};

const DEBUG_SELECTED = true;
export const changeSelection = (id: string, selected: boolean) => {
  if (id === "left" || id === "right" || id === "top" || id === "bottom") {
    // we don't process selections on the parent node
    return;
  }
  if (isSticky(id)) {
    const sticky = findSticky(id);
    sticky.selected = selected;
  } else {
    const edge = mainGraph()._getEdge(id) as CircuitEdge | undefined;
    if (!edge) {
      throw new Error("edge for selection change not found");
    }
    // if (!mainGraph().isEncapsulating()) {
    // if we are encapsulating, then we keep selection constant
    edge.selected = selected;
    // }
    if (DEBUG_SELECTED && selected) {
      console.log({ selectedEdge: JSON.parse(JSON.stringify(edge, null, 2)) });
    }
  }
};

export const updateCoord = (vertexId: VertexId, coord: Coord, graph = mainGraph()) => {
  const vertex = graph._getVertex(vertexId);
  vertex.value.mut_sendTo(coord);
};

export const updateStickyJson = (id: string, json: any) => {
  const sticky = findSticky(id);
  sticky.data.tiptapJson = json;
};

export const updateStickyDimensions = (
  id: string,
  dimensions: { width: number | undefined; height: number | undefined }
) => {
  const sticky = findSticky(id);
  sticky.data.width = dimensions.width ?? sticky.data.width;
  sticky.data.height = dimensions.height ?? sticky.data.height;
};

export const updateLabel = (id: string, label: string) => {
  const edge = mainGraph()._getEdge(id);
  if (edge && edge instanceof NodeEdge) {
    edge.label = label;
  } else {
    throw new Error("edge not found");
  }
};

export const startEncapsulation = () => {
  const selected = mainGraph().edges.filter((e) => (e as CircuitEdge).selected) as CircuitEdge[];
  selected.forEach((e) => {
    e.selected = false;
  });
  selected.forEach((e) => {
    e.selected = true;
  });
  const internalNodes = selected.filter((e) => e instanceof NodeEdge) as NodeEdge[];
  const externalWires = (
    mainGraph().edges.filter((e) => e instanceof WireEdge) as WireEdge[]
  ).filter((e) => {
    const isSourceInternal = internalNodes.find((n) => n.id === e.source.node);
    const isTargetInternal = internalNodes.find((n) => n.id === e.target.node);
    return (isSourceInternal && !isTargetInternal) || (!isSourceInternal && isTargetInternal);
  });

  const externalVertices = internalNodes
    .map((n) => n.vertices)
    .flat()
    .filter((v) =>
      externalWires.find((w) => vertexIdEq(v.id, w.source) || vertexIdEq(v.id, w.target))
    );

  mainGraph().encapsulatedNodes = internalNodes.map((n) => n.id);
  mainGraph().encapsulationInterface = [...externalVertices.map((v) => v.id)];
  mainGraph().requiredInterfaceVertices = [...externalVertices.map((v) => v.id)];
};

export const toggleEncapsulationInterfaceVertex = (id: VertexId) => {
  if (!mainGraph().isEncapsulating()) {
    throw new Error("tried to toggle encapsulation interface while not encapsulating");
  }
  if (mainGraph().requiredInterfaceVertices?.find((v) => vertexIdEq(v, id))) {
    throw new Error("tried to toggle encapsulation interface vertex that is required");
  }
  if (!mainGraph().encapsulatedNodes!.find((n) => n === id.node)) {
    throw new Error("tried to toggle encapsulation interface vertex that is not encapsulated");
  }
  if (mainGraph().encapsulationInterface!.find((v) => vertexIdEq(v, id))) {
    mainGraph().encapsulationInterface = mainGraph().encapsulationInterface!.filter(
      (v) => !vertexIdEq(v, id)
    );
  } else {
    mainGraph().encapsulationInterface!.push(id);
  }
};

export const cancelEncapsulation = () => {
  mainGraph().encapsulationInterface = null;
  mainGraph().requiredInterfaceVertices = null;
  mainGraph().encapsulatedNodes = null;
};

// TODO
export const commitEncapsulation = (label: string) => {
  const internalNodes = mainGraph().edges.filter((e) =>
    mainGraph().encapsulatedNodes?.includes(e.id)
  ) as NodeEdge[];
  const connectedWires = (
    mainGraph().edges.filter((e) => e instanceof WireEdge) as WireEdge[]
  ).filter((e) => {
    return (
      internalNodes.find((n) => n.id === e.source.node) ||
      internalNodes.find((n) => n.id === e.target.node)
    );
  });
  const internalWires = connectedWires.filter((w) => {
    return (
      internalNodes.find((n) => n.id === w.source.node) &&
      internalNodes.find((n) => n.id === w.target.node)
    );
  });
  const externalWires = connectedWires.filter((w) => !internalWires.includes(w));
  // const externalVertices = internalNodes
  //   .map((n) => n.vertices)
  //   .flat()
  //   .filter((v) =>
  //     externalWires.find((w) => vertexIdEq(v.id, w.source) || vertexIdEq(v.id, w.target))
  //   );
  const externalVertices = mainGraph().encapsulationInterface!.map(
    (id) => mainGraph()._getVertex(id)!
  );

  const boundExternalVertices = externalVertices.filter((v) =>
    v.deps.find(
      (d) =>
        internalWires.find((w) => w.id === d.edge) || internalNodes.find((n) => n.id === d.edge)
    )
  );
  const freeExternalVertices = externalVertices.filter((v) => !boundExternalVertices.includes(v));

  // console.log({
  //   internalNodes,
  //   connectedWires,
  //   internalWires,
  //   externalWires,
  //   externalVertices,
  //   boundExternalVertices,
  //   freeExternalVertices,
  // });

  // const incomingWires = externalWires.filter((w) =>
  //   internalNodes.find((n) => n.id === w.target.node)
  // );
  // const outgoingWires = externalWires.filter((w) =>
  //   internalNodes.find((n) => n.id === w.source.node)
  // );

  // const verticesWithOutgoingWires = outgoingWires.map((w) =>
  //   w.vertices.find((v) => vertexIdEq(v.id, w.source))
  // );
  // const verticesWithOnlyIncomingWires = incomingWires
  //   .map((w) => w.vertices.find((v) => vertexIdEq(v.id, w.target)))
  //   .filter((v) => !verticesWithOutgoingWires.includes(v));

  const fakeId = "REPLACE_ME";

  const serialVerticesWithOldIds: SerialCoordVertex[] = [
    ...freeExternalVertices.map((v) => v!.serialize()),
    ...boundExternalVertices.map((v) => v!.serialize()),
  ];

  const serialVertices = serialVerticesWithOldIds.map((v, i) => ({
    ...v,
    id: { node: fakeId, handle: i },
  }));

  const boundArray: number[] = boundExternalVertices.map((_, i) => i + freeExternalVertices.length);

  const serialSubgraph: SerialCoordGraph = {
    edges: [...internalNodes.map((n) => n.serialize()), ...internalWires.map((w) => w.serialize())],
    mode: UPDATE_MODE,
    focus: null,
    stickies: [],
  };
  const interfaceVertexIds = [
    ...freeExternalVertices.map((v) => v.id),
    ...boundExternalVertices.map((v) => v.id),
  ];

  const layout: Layout = {
    type: "topAndBottom",
    data: {
      top: freeExternalVertices.map((_, i) => i),
      bottom: boundArray.map((i) => i),
    },
  };

  const serialCompositeOperation: SerialCompositeOperation = {
    primitive: false,
    boundArray,
    interfaceVertexIds,
    subgraph: serialSubgraph,
    layout,
  };

  const serialNodeEdge: SerialNodeEdge = {
    id: fakeId,
    position: { x: 0, y: 0 },
    selected: false,
    vertices: serialVertices,
    hidden: false,
    operator: serialCompositeOperation,
    label,
  };

  connectedWires.forEach((w) => {
    mainGraph().removeWire(w.id);
  });
  internalNodes.forEach((n) => {
    mainGraph().removeNode(n.id);
  });

  const sumPosition = internalNodes.reduce(
    (acc, n) => ({ x: acc.x + n.position.x, y: acc.y + n.position.y }),
    { x: 0, y: 0 }
  );
  const averagePosition = {
    x: sumPosition.x / internalNodes.length,
    y: sumPosition.y / internalNodes.length,
  };
  serialNodeEdge.position = averagePosition;
  const newNodeId = mainGraph().addCompositeOperation(serialNodeEdge);

  externalWires.forEach((w) => {
    if (internalNodes.find((n) => n.id === w.source.node)) {
      const sourceHandle = serialVerticesWithOldIds.findIndex((v) => vertexIdEq(v.id, w.source));
      mainGraph().addWire({ node: newNodeId, handle: sourceHandle }, w.target);
    } else {
      const targetHandle = serialVerticesWithOldIds.findIndex((v) => vertexIdEq(v.id, w.target));
      mainGraph().addWire(w.source, { node: newNodeId, handle: targetHandle });
    }
  });

  cancelEncapsulation();

  beginEditingComposite(newNodeId);
};

const cloneNodeEdge = (e: NodeEdge, selected: undefined | boolean = undefined) => {
  const id = genNodeId();
  const verticesClone = e.vertices.map((v) =>
    mainGraph().addFree(v.value.x, v.value.y, { node: id, handle: v.id.handle }, v.label)
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
    selected === undefined ? e.selected : selected,
    e.label
  );
  mainGraph().edges.push(newEdge);
  return id;
};

export const cloneSelected = () => {
  const selected = mainGraph().edges.filter((e) => (e as CircuitEdge).selected);
  const unselected = mainGraph().edges.filter((e) => !(e as CircuitEdge).selected);
  const idMap = new Map<string, string>();
  selected.forEach((e) => {
    if (e instanceof NodeEdge) {
      const id = cloneNodeEdge(e, false);
      idMap.set(e.id, id);
    }
  });
  // wait until our map is full to process wires
  // give precedence to unselected wires
  unselected.forEach((e) => {
    if (e instanceof WireEdge) {
      // transfer unselected wires to the clone
      removeWire(e.id);
      mainGraph().addWire(
        { node: idMap.get(e.source.node) ?? e.source.node, handle: e.source.handle },
        { node: idMap.get(e.target.node) ?? e.target.node, handle: e.target.handle }
      );
    }
  });
  selected.forEach((e) => {
    if (e instanceof WireEdge) {
      const addedWire = mainGraph().addWire(
        { node: idMap.get(e.source.node) ?? e.source.node, handle: e.source.handle },
        { node: idMap.get(e.target.node) ?? e.target.node, handle: e.target.handle }
      );
      if (!addedWire) {
        // if we are unable to clone a wire, it should not be stolen from the original
        removeWire(e.id);
        mainGraph().addWire(
          { node: idMap.get(e.source.node) ?? e.source.node, handle: e.source.handle },
          { node: idMap.get(e.target.node) ?? e.target.node, handle: e.target.handle }
        );
      }
    }
  });

  stickies().forEach((s) => {
    if (s.selected) {
      const newId = genNodeId();
      stickies().push({
        id: newId,
        type: "sticky",
        position: s.position,
        data: { tiptapJson: s.data.tiptapJson, width: s.data.width, height: s.data.height },
        selected: false,
        dragHandle: ".draggable",
      });
    }
  });
};

// deprecated
// export const registerNodeInternalsUpdated = () => {
//   mainGraph().registerNodeInternalsUpdated();
// };

// const logGraph = () => {
//   logger.debug({ mainGraph: JSON.parse(JSON.stringify(mainGraph)) }, "mainGraph got new snapshot");
// };

export const serialStateSchema = z.object({
  graph: serialCoordGraphSchema,
  stickies: z.array(stickySchema),
});

export type SerialState = z.infer<typeof serialStateSchema>;

export const useStore = (cartesian = false) => {
  // logger.debug({ initial }, "useMainGraph called");
  const { visibleGraph: graphSnap, ancestors } = useSnapshot(store);

  // TODO: COMMENTING OUT URL ENCODING... for now
  // useEffect(() => {
  //   if (initial) {
  //     // logger.debug({ initial }, "restoring from url");
  //     mainGraph = proxy(deserializeGraph(initial.graph));
  //     stickies.splice(0, stickies.length, ...initial.stickies);
  //     // logger.debug({ mainGraph, stickies }, "restored from url");
  //   }
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const serial: SerialState = {
  //       graph: mainGraph().serialize(),
  //       stickies,
  //     };
  //     const str = encodeURIComponent(JSON.stringify(serial));
  //     window.history.pushState({}, "", str);
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {}, [stickiesSnap]);

  let nodes: CircuitNode[] = [];
  const wires: Wire[] = [];
  if (isEditingComposite()) {
    const { node } = ancestors[ancestors.length - 1];
    if (!(node.constraint instanceof CompositeOperation)) {
      throw new Error("node constraint is not composite");
    }
    const layout = node.constraint.layout;
    if (!layout) {
      throw new Error("layout is undefined");
    }
    ["top" as const, "bottom" as const].forEach((side) =>
      layout.data[side].forEach((interfaceVertexIdsIdx, layoutSideIdx) => {
        if (!(node.constraint instanceof CompositeOperation)) {
          throw new Error("node constraint is not composite");
        }
        // const v = node.vertices[i];
        const interfaceVertexId = node.constraint.interfaceVertexIds[interfaceVertexIdsIdx];
        const internalVertex = node.constraint.graph._getVertex(interfaceVertexId);
        // const internalVertex = internalNode.vertices[interfaceVertexId.handle];
        const internallyBound = internalVertex.isBound();

        const interfaceHandleId = handleNumToId(layoutSideIdx);
        console.log({
          interfaceHandleId,
          interfaceVertexId,
          internallyBound,
          side,
          layoutSideIdx,
          interfaceVertexIdsIdx,
          layout,
        });
        wires.push({
          id: `interface-${side}-${layoutSideIdx}`,
          source: internallyBound ? interfaceVertexId.node : side,
          sourceHandle: internallyBound
            ? handleNumToId(interfaceVertexId.handle)
            : interfaceHandleId,
          target: internallyBound ? side : interfaceVertexId.node,
          targetHandle: internallyBound
            ? interfaceHandleId
            : handleNumToId(interfaceVertexId.handle),
          type: "coord",
          animated: true,
          // selected: edge.selected,
        });
      })
    );
    const sides = ["left" as const, "right" as const, "top" as const, "bottom" as const];
    const boundingRect = getBoundingRectangleForGraph(graphSnap as CoordGraph);
    sides.forEach((side) => {
      nodes.push({
        id: side,
        position:
          side === "left"
            ? {
                x: boundingRect.minX - BUFFER,
                y: boundingRect.minY - BUFFER,
              }
            : side === "top"
            ? {
                x: boundingRect.minX - BUFFER,
                y: boundingRect.minY - BUFFER,
              }
            : side === "right"
            ? {
                x: boundingRect.maxX + BUFFER,
                y: boundingRect.minY - BUFFER,
              }
            : {
                x: boundingRect.minX - BUFFER,
                y: boundingRect.maxY + BUFFER,
              },
        type: "interface",
        selected: false,
        data: {
          width: boundingRect.maxX - boundingRect.minX + 2 * BUFFER,
          height: boundingRect.maxY - boundingRect.minY + 2 * BUFFER,
        },
      });
    });
  }
  (graphSnap.edges as CircuitEdge[]).forEach((edge) => {
    if (edge instanceof WireEdge) {
      wires.push(edgeToWire(edge));
    } else {
      nodes.push(edgeToNode(edge as NodeEdge, cartesian));
    }
  });

  nodes = nodes.concat(graphSnap.stickies);
  return {
    // shouldUpdateNodeInternals: graphSnap.shouldUpdateNodeInternals,
    nodes,
    wires,
    focus: graphSnap.focus,
    encapsulationInterface: graphSnap.encapsulationInterface,
    requiredInterfaceVertices: graphSnap.requiredInterfaceVertices,
    encapsulatedNodes: graphSnap.encapsulatedNodes,
    ancestors,
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
  // parent: "interface",
});

const VERTEX_WIDTH = 140;
// const NODE_BUFFER = 50;
const STANDALONE_WIDTH = 220;
const NODE_HEIGHT = 150;
const EXTRA_TOP_BUFFER = 65;

// gets a bounding box around every Node in a graph
function getBoundingRectangleForGraph(graph: CoordGraph) {
  const nodes = graph.edges.filter((e) => e instanceof NodeEdge) as NodeEdge[];
  const minX = Math.min(...nodes.map((n) => n.position.x));
  const maxX = Math.max(...nodes.map((n) => n.position.x + getNodeWidth(n)));
  const minY = Math.min(...nodes.map((n) => n.position.y)) - EXTRA_TOP_BUFFER;
  const maxY = Math.max(...nodes.map((n) => n.position.y + NODE_HEIGHT));
  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

// returns the max number of vertices across either the top or bottom row on a node
function getNodeWidth(node: NodeEdge) {
  if (node.constraint instanceof CompositeOperation) {
    const { layout } = node.constraint;
    if (!layout) {
      return (node.vertices.length - 1) * VERTEX_WIDTH;
    }
    return Math.max(layout.data.top.length, layout.data.bottom.length) * VERTEX_WIDTH;
  }
  switch (node.type) {
    case OP_TYPE.ADDER:
    case OP_TYPE.MULTIPLIER:
      return 2 * VERTEX_WIDTH;
    case OP_TYPE.CONJUGATOR:
    case OP_TYPE.EXPONENTIAL:
      return VERTEX_WIDTH;
    case OP_TYPE.STANDALONE:
      return STANDALONE_WIDTH;

    default:
      throw new Error("unknown node type");
  }
}
