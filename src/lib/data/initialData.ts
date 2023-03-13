import { CircuitNode, genNodeId } from "@/schema/node";
import { genWireId, Wire } from "@/schema/wire";

const INITIAL_NODE_IDS = [genNodeId(), genNodeId(), genNodeId()];

export const INITIAL_NODES: CircuitNode[] = [
  {
    id: INITIAL_NODE_IDS[0],
    position: { x: 0, y: 0 },
    type: "value",
    data: {
      value: {
        x: 0,
        y: 0,
      },
      mode: "single",
    },
  },
  {
    id: INITIAL_NODE_IDS[1],
    position: { x: 200, y: 200 },
    type: "value",
    data: {
      value: {
        x: 0,
        y: 0,
      },
      mode: "single",
    },
  },
  {
    id: INITIAL_NODE_IDS[2],
    position: { x: 100, y: 100 },
    type: "unop",
    data: {
      carrying: "value",
      operand: {
        x: 0,
        y: 0,
      },
      operator: "exp",
      result: {
        x: 0,
        y: 0,
      },
    },
  },
];

export const INITIAL_EDGES: Wire[] = [
  {
    id: genWireId(),
    source: INITIAL_NODE_IDS[0],
    target: INITIAL_NODE_IDS[2],
    sourceHandle: "valSource",
    targetHandle: "operand",
    type: "value",
    animated: true,
  },
  {
    id: genWireId(),
    source: INITIAL_NODE_IDS[2],
    target: INITIAL_NODE_IDS[1],
    sourceHandle: "result",
    targetHandle: "valTarget",
    type: "value",
    animated: true,
  },
];
