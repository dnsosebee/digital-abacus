import { logger } from "@/lib/logger";
import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { useEffect } from "react";
import { Connection, NodePositionChange } from "reactflow";
import { proxy, useSnapshot } from "valtio";
import { operationToNode, operationToWire } from "./adapter";
import { Graph, updateGraph } from "./solver/graph";
import { getSubOperation } from "./solver/operation/node/effectives/composite";
import { NodeOperation, handleIdToNum } from "./solver/operation/node/node";
import { Operation, genOperationId } from "./solver/operation/operation";
import { VertexId } from "./solver/operation/vertex/vertex";
import { INITIAL_STORE, Store, storeSchema } from "./solver/store";

export const store = proxy(INITIAL_STORE);

export const useStore = (initial?: Store) => {
  if (initial) {
    storeSchema.parse(initial);
    store.graphs = initial.graphs;
    store.currentGraphIndex = initial.currentGraphIndex;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const serial = storeSchema.parse(store);
      const str = encodeURIComponent(JSON.stringify(serial));
      window.history.pushState({}, "", str);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const storeSnap = useSnapshot(store);
  const current = storeSnap.graphs[storeSnap.currentGraphIndex];

  let nodes: CircuitNode[] = [];
  let wires: Wire[] = [];
  current.operation.implementation.forEach((o) => {
    if (o.isNode) {
      nodes.push(operationToNode(o as NodeOperation));
    } else {
      wires.push(operationToWire(o));
    }
  });

  return { nodes, wires, storeSnap };
};

export const getCurrentGraph = () => {
  return store.graphs[store.currentGraphIndex];
};

export const getOperation = (id: string) => {
  const graph = getCurrentGraph();
  return getSubOperation(graph.operation, id);
};

export const getVertex = (id: VertexId) => {
  const graph = getCurrentGraph();
  const { operation } = graph;
  if (id.operationId === operation.id) {
    return operation.exposedVertices[id.index];
  }
  const op = getSubOperation(operation, id.operationId);
  logger.debug("getVertex", { op });
  if (op && op.isNode && op.isEffective) {
    logger.debug("getVertex found", { op });
    return op.exposedVertices[id.index];
  }
  return undefined;
};

export const cloneSelected = () => {
  const graph = getCurrentGraph();
  let selected: Operation[] = [];
  let unselected: Operation[] = [];
  graph.operation.implementation.forEach((o) => {
    if (o.selected) {
      selected.push(o);
    } else {
      unselected.push(o);
    }
  });
  const idMap = new Map<string, string>();
  throw new Error("not implemented");
};

export const addNode = (node: NodeOperation) => {
  const graph = getCurrentGraph();
  graph.operation.implementation.push(node);
};

export const findOperationAndIndex = (graph: Graph, id: string) => {
  const idx = graph.operation.implementation.findIndex((o) => o.id === id);
  if (idx === -1) {
    return { operation: undefined, idx: -1 };
  }
  return { operation: graph.operation.implementation[idx], idx };
};

export const updateNodePosition = (e: NodePositionChange) => {
  const graph = getCurrentGraph();
  const { operation } = findOperationAndIndex(graph, e.id);
  if (operation && operation.isNode) {
    operation.position = e.position ?? operation.position;
  } else {
    throw new Error("node not found");
  }
};

export const removeNode = (id: string) => {
  const graph = getCurrentGraph();
  const { operation, idx } = findOperationAndIndex(graph, id);
  if (operation && operation.isNode) {
    graph.operation.implementation.splice(idx, 1);
  } else {
    throw new Error("node not found");
  }
};

export const addWire = (conn: Connection) => {
  const graph = getCurrentGraph();
  graph.operation.implementation.push({
    id: genOperationId(),
    selected: false,
    isNode: false,
    sourceVertexId: {
      operationId: conn.source!,
      index: handleIdToNum(conn.sourceHandle!),
    },
    targetVertexId: {
      operationId: conn.target!,
      index: handleIdToNum(conn.targetHandle!),
    },
  });
};

export const removeWire = (id: string) => {
  const graph = getCurrentGraph();
  const { operation, idx } = findOperationAndIndex(graph, id);
  if (operation && operation.isNode === false) {
    graph.operation.implementation.splice(idx, 1);
  } else {
    throw new Error("wire not found");
  }
};

export const changeSelection = (id: string, selected: boolean) => {
  const graph = getCurrentGraph();
  const { operation } = findOperationAndIndex(graph, id);
  if (operation) {
    operation.selected = selected;
  } else {
    throw new Error("edge for selection change not found");
  }
};

export const updateCurrentGraph = () => {
  const graph = getCurrentGraph();
  updateGraph(graph);
};
