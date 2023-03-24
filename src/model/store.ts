import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { proxy, useSnapshot } from "valtio";
import { LinkageGraph } from "./linkages/linkagegraph";
import { NodeEdge } from "./linkages/nodeEdge";
import { UPDATE_MODE } from "./settings";

export let mainGraph = proxy(new LinkageGraph(UPDATE_MODE)); // would be better if const

export const resetGraph = () => {
  mainGraph = proxy(new LinkageGraph(UPDATE_MODE));
};

export const useGraph = () => {
  const graph = useSnapshot(mainGraph);
  const x = graph.edges;
};

// adapters
export const graphtoCircuit = (
  edges: LinkageGraph["edges"]
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
