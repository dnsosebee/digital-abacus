import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { NodePositionChange } from "reactflow";
import { proxy, useSnapshot } from "valtio";
import { CoordGraph } from "./coords/coordGraph";
import { NodeEdge } from "./coords/edges/nodeEdge";
import { WireEdge } from "./coords/edges/wireEdge";
import { UPDATE_MODE } from "./settings";

export let mainGraph = proxy(new CoordGraph(UPDATE_MODE)); // would be better if const

export const resetGraph = () => {
  mainGraph = proxy(new CoordGraph(UPDATE_MODE));
};

const updateNodePosition = (e: NodePositionChange) => {
  const node = mainGraph._getEdge(e.id) as NodeEdge;
  node.position = e.position ?? node.position;
};

export const useGraph = (cartesian = false) => {
  const graph = useSnapshot(mainGraph);
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
    nodes,
    wires,
    updateNodePosition,
  };
};

const edgeToWire = (edge: WireEdge): Wire => ({
  id: edge.id,
  source: edge.source.node,
  sourceHandle: "source-" + edge.source.handle,
  target: edge.target.node,
  targetHandle: "target-" + edge.target.handle,
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
