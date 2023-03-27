import { logger as parentLogger } from "@/lib/logger";
import { handleIdToNum, handleNumToId } from "@/schema/handle";
import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { Connection, NodePositionChange } from "reactflow";
import { proxy, useSnapshot } from "valtio";
import { CoordGraph } from "./coords/coordGraph";
import { NodeEdge } from "./coords/edges/nodeEdge";
import { WireEdge } from "./coords/edges/wireEdge";
import { VertexId } from "./graph/vertex";
import { UPDATE_MODE } from "./settings";

const logger = parentLogger.child({ module: "store" });

export let mainGraph = proxy(new CoordGraph(UPDATE_MODE)); // would be better if const

export const resetGraph = () => {
  mainGraph = proxy(new CoordGraph(UPDATE_MODE));
};

export const updateNodePosition = (e: NodePositionChange) => {
  const node = mainGraph._getEdge(e.id) as NodeEdge;
  node.position = e.position ?? node.position;
};

export const addWire = (conn: Connection) => {
  mainGraph.addWire(
    { node: conn.source!, handle: handleIdToNum(conn.sourceHandle!).idx },
    { node: conn.target!, handle: handleIdToNum(conn.targetHandle!).idx }
  );
};

// deprecated
export const registerNodeInternalsUpdated = () => {
  mainGraph.registerNodeInternalsUpdated();
};

export const updateCoord = (vertexId: VertexId, coord: { x: number; y: number }) => {
  const vertex = mainGraph._getVertex(vertexId);
  vertex.value.x = coord.x;
  vertex.value.y = coord.y;
};

const logGraph = () => {
  logger.debug({ mainGraph: JSON.parse(JSON.stringify(mainGraph)) }, "mainGraph got new snapshot");
};

export const useGraph = (cartesian = false) => {
  const graph = useSnapshot(mainGraph);
  logGraph();
  const nodes: CircuitNode[] = [];
  const wires: Wire[] = [];
  graph.edges.forEach((edge) => {
    if (edge instanceof WireEdge) {
      wires.push(edgeToWire(edge));
    } else {
      nodes.push(edgeToNode(edge as NodeEdge, cartesian));
    }
  });
  return {
    shouldUpdateNodeInternals: graph.shouldUpdateNodeInternals,
    nodes,
    wires,
  };
};

const edgeToWire = (edge: WireEdge): Wire => ({
  id: edge.id,
  source: edge.source.node,
  sourceHandle: handleNumToId(edge.source.handle, true),
  target: edge.target.node,
  targetHandle: handleNumToId(edge.target.handle, false),
  type: "coord",
  animated: true,
});

const edgeToNode = (edge: NodeEdge, cartesian: boolean): CircuitNode => ({
  id: edge.id,
  type: "math",
  position: edge.position,
  data: {
    cartesian,
    opType: edge.type,
    vertices: edge.vertices.map((v) => ({
      coord: {
        x: v.value.x,
        y: v.value.y,
      },
      bound: v.isBound(),
    })),
  },
});
