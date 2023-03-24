import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { proxy, useSnapshot } from "valtio";
import { CoordGraph } from "./coords/coordGraph";
import { NodeEdge } from "./coords/edges/nodeEdge";
import { UPDATE_MODE } from "./settings";

export let mainGraph = proxy(new CoordGraph(UPDATE_MODE)); // would be better if const

export const resetGraph = () => {
  mainGraph = proxy(new CoordGraph(UPDATE_MODE));
};

export const useGraph = () => {
  const graph = useSnapshot(mainGraph);
  const x = graph.edges;
};

// adapters
export const graphtoCircuit = (
  edges: CoordGraph["edges"]
): { nodes: CircuitNode[]; wires: Wire[] } => {
  const nodes: CircuitNode[] = [];
  const wires: Wire[] = [];
  edges.forEach((edge) => {
    if (edge instanceof NodeEdge) {
    }
  });

  return {
    nodes,
    wires: [],
  };
};
