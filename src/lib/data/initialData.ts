import { CircuitNode, genNodeId } from "@/schema/node";
import { genWireId, Wire } from "@/schema/wire";

const VAL1_NODE_ID = genNodeId();
const UNOP_NODE_ID = genNodeId();
const BINOP_NODE_ID = genNodeId();
const VAL2_NODE_ID = genNodeId();
const STICKY_NODE_ID = genNodeId();

export const INITIAL_NODES: CircuitNode[] = [
  {
    id: VAL1_NODE_ID,
    position: { x: 300, y: 100 },
    type: "value",
    data: {
      value: {
        x: 10,
        y: 0,
      },
      cartesian: true,
    },
  },
  {
    id: UNOP_NODE_ID,
    position: { x: 100, y: 100 },
    type: "unop",
    data: {
      carrying: "value",
      operand: {
        x: 10,
        y: 0,
      },
      operator: "exp",
      result: {
        x: 10,
        y: 0,
      },
      cartesian: true,
    },
  },
  {
    id: BINOP_NODE_ID,
    position: { x: 300, y: 300 },
    type: "binop",
    data: {
      carrying: "value",
      operand1: {
        x: 10,
        y: 0,
      },
      operand2: {
        x: 10,
        y: 0,
      },
      operator: "add",
      result: {
        x: 10,
        y: 0,
      },
      cartesian: true,
    },
  },
  {
    id: VAL2_NODE_ID,
    position: { x: 500, y: 500 },
    type: "value",
    data: {
      value: {
        x: 10,
        y: 0,
      },
      cartesian: true,
    },
  },
  {
    id: STICKY_NODE_ID,
    position: { x: 550, y: 300 },
    type: "sticky",
    data: {
      text: "Hello, world!",
    },
  },
];

export const INITIAL_EDGES: Wire[] = [
  {
    id: genWireId(),
    source: VAL1_NODE_ID,
    target: BINOP_NODE_ID,
    sourceHandle: "valSource",
    targetHandle: "operand2",
    type: "value",
    animated: true,
  },
  {
    id: genWireId(),
    source: UNOP_NODE_ID,
    target: BINOP_NODE_ID,
    sourceHandle: "result",
    targetHandle: "operand1",
    type: "value",
    animated: true,
  },
  {
    id: genWireId(),
    source: BINOP_NODE_ID,
    target: VAL2_NODE_ID,
    sourceHandle: "result",
    targetHandle: "valTarget",
    type: "value",
    animated: true,
  },
];
