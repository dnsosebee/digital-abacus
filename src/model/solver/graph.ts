import z from "zod";
import { linkagesSettingsSchema } from "./linkagesSettings";
import {
  compositeOperationSchema,
  invert,
  targetPath,
} from "./operation/node/effectives/composite";
import { genOperationId } from "./operation/operation";
import { Dep, VertexId, vertexIdSchema } from "./operation/vertex/vertex";

export const modeSchema = z.union([
  z.literal("ideal"),
  z.literal("iterative"),
  z.literal("differential"),
]);

const baseGraphSchema = z.object({
  mode: modeSchema,
  stepSize: z.number(),
  linkagesSettings: linkagesSettingsSchema,
  operation: compositeOperationSchema,
});

export const invertingGraphSchema = baseGraphSchema.extend({
  inversionState: z.object({
    inverting: z.literal(true),
    focus: vertexIdSchema,
  }),
});

export const nonInvertingGraphSchema = baseGraphSchema.extend({
  inversionState: z.object({
    inverting: z.literal(false),
  }),
});

export const graphSchema = z.union([invertingGraphSchema, nonInvertingGraphSchema]);

export type Graph = z.infer<typeof graphSchema>;

export const PRIMITIVE_UPDATE_ITERATIONS = 3;

export const INITIAL_GRAPH: Graph = {
  mode: "iterative",
  stepSize: 0.02,
  linkagesSettings: {
    dragData: {
      dragging: false,
    },
    centerX: 650,
    centerY: 450,
    scale: 50,
  },
  inversionState: {
    inverting: false,
  },
  operation: {
    id: genOperationId(),
    isNode: true,
    isEffective: true,
    selected: false,
    isPrimitive: false,
    exposedVertices: [],
    label: "mainGraph",
    hideLinkages: false,
    boundVertex: 0,
    implementation: [],
    position: { x: 0, y: 0 },
  },
};

export const checkIfTarget = (graph: Graph, vertexId: VertexId): boolean => {
  if (graph.inversionState.inverting) {
    const res = getTargetPath(graph, graph.inversionState.focus, vertexId);
    return res !== null;
  }
  return false;
};

export const getTargetPath = (
  graph: Graph,
  sourceId: VertexId,
  targetId: VertexId
): Dep[] | null => {
  return targetPath(graph.operation, sourceId, targetId);
};

export const updateGraph = (graph: Graph) => {
  // throw new Error("not implemented");
};

export const startInversion = (graph: Graph, id: VertexId) => {
  graph.inversionState = {
    inverting: true,
    focus: id,
  };
};

export const completeInversion = (graph: Graph, id: VertexId) => {
  if (graph.inversionState.inverting === false) {
    throw new Error("not inverting");
  }
  const targetPath = getTargetPath(graph, graph.inversionState.focus, id);
  if (!targetPath) {
    throw new Error("target path not found");
  }
  invert(graph.operation, targetPath);
  cancelInversion(graph);
};

export const cancelInversion = (graph: Graph) => {
  graph.inversionState = {
    inverting: false,
  };
};

//

// export const findNode = (graph: Graph, id: string) =>
//   graph.operation.implementation.find((n) => n.isNode && n.id === id) as NodeOperation | undefined;

// export const findOperationAndIndex = (graph: Graph, id: string) => {
//   const idx = graph.operation.implementation.findIndex((n) => n.id === id);
//   return { operation: graph.operation.implementation[idx], idx };
// };

// export const addNode = (graph: Graph, node: NodeOperation) => {
//   graph.operation.implementation.push(node);
// };

// export const updateNodePosition = (graph: Graph, e: NodePositionChange) => {
//   const node = findNode(graph, e.id);
//   if (node) {
//     node.position = e.position ?? node.position;
//   } else {
//     throw new Error("node not found");
//   }
// };

// export const removeNode = (graph: Graph, id: string) => {
//   const { operation, idx } = findOperationAndIndex(graph, id);
//   if (operation && operation.isNode) {
//     graph.operation.implementation.splice(idx, 1);
//   } else {
//     throw new Error("node not found");
//   }
// };

// export const handleNumToId = (idx: number) => {
//   return `${idx}`;
// };

// export const handleIdToNum = (id: string) => parseInt(id, 10);

// export const addWire = (graph: Graph, conn: Connection) => {
//   graph.operation.implementation.push({
//     id: genOperationId(),
//     selected: false,
//     isNode: false,
//     sourceVertexId: {
//       operationId: conn.source!,
//       index: handleIdToNum(conn.sourceHandle!),
//     },
//     targetVertexId: {
//       operationId: conn.target!,
//       index: handleIdToNum(conn.targetHandle!),
//     },
//   });
// };

// export const removeWire = (graph: Graph, id: string) => {
//   const { operation, idx } = findOperationAndIndex(graph, id);
//   if (operation && operation.isNode === false) {
//     graph.operation.implementation.splice(idx, 1);
//   } else {
//     throw new Error("wire not found");
//   }
// };

// export const changeSelection = (graph: Graph, id: string, selected: boolean) => {
//   const { operation } = findOperationAndIndex(graph, id);
//   if (operation) {
//     operation.selected = selected;
//   } else {
//     throw new Error("edge for selection change not found");
//   }
// };
