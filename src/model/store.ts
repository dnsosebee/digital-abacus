import { logger as parentLogger } from "@/lib/logger";
import { handleIdToNum, handleNumToId } from "@/schema/handle";
import { AddNode, CircuitNode, genNodeId, Sticky } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { useEffect } from "react";
import { Connection, NodePositionChange } from "reactflow";
import { proxy, useSnapshot } from "valtio";
import { Coord } from "./coords/coord/coord";
import { CoordGraph } from "./coords/coordGraph";
import { NodeEdge } from "./coords/edges/nodeEdge";
import { WireEdge } from "./coords/edges/wireEdge";
import { VertexId } from "./graph/vertex";
import { UPDATE_MODE } from "./settings";

const logger = parentLogger.child({ module: "store" });

export let mainGraph = proxy(new CoordGraph(UPDATE_MODE)); // would be better if const
const stickies = proxy([] as Sticky[]);
const isSticky = (id: string) => stickies.find((s) => s.id === id) !== undefined;
const findSticky = (id: string) => stickies.find((s) => s.id === id)!;

export const resetGraph = () => {
  mainGraph = proxy(new CoordGraph(UPDATE_MODE));
};

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
      });
      break;
    case "math":
      mainGraph.addOperation(addNode.data.opType, addNode.position);
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

export const updateCoord = (vertexId: VertexId, coord: Coord) => {
  const vertex = mainGraph._getVertex(vertexId);
  vertex.value.mut_sendTo(coord);
};

export const updateStickyText = (id: string, text: string) => {
  const sticky = findSticky(id);
  sticky.data.text = text;
};

// deprecated
export const registerNodeInternalsUpdated = () => {
  mainGraph.registerNodeInternalsUpdated();
};

const logGraph = () => {
  logger.debug({ mainGraph: JSON.parse(JSON.stringify(mainGraph)) }, "mainGraph got new snapshot");
};

export const useNodesAndEdges = (cartesian = false) => {
  const graphSnap = useSnapshot(mainGraph);
  const stickiesSnap = useSnapshot(stickies);
  useEffect(() => {
    logger.debug({ stickiesSnap }, "stickiesSnap got new snapshot");
  }, [stickiesSnap]);

  logGraph();
  let nodes: CircuitNode[] = [];
  const wires: Wire[] = [];
  graphSnap.edges.forEach((edge) => {
    if (edge instanceof WireEdge) {
      wires.push(edgeToWire(edge));
    } else {
      nodes.push(edgeToNode(edge as NodeEdge, cartesian));
    }
  });
  nodes = nodes.concat(stickiesSnap);
  return {
    shouldUpdateNodeInternals: graphSnap.shouldUpdateNodeInternals,
    nodes,
    wires,
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
});

const edgeToNode = (edge: NodeEdge, cartesian: boolean): CircuitNode => ({
  id: edge.id,
  type: "math",
  position: edge.position,
  data: {
    cartesian,
    opType: edge.type,
    vertices: edge.vertices,
  },
});
