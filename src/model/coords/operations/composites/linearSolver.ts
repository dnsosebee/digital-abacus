import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const MULTIPLIER_1_ID = "multipl1";
const MULTIPLIER_2_ID = "multipl2";
const ADDER_1_ID = "adder000";
const ADDER_2_ID = "adder111";

export const SIN_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_1_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_1_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_1_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: MULTIPLIER_1_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: false,
        position: { x: -29.792760305612934, y: 70.03818944183789 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_1_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_1_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_1_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: ADDER_1_ID,
        selected: false,
        operator: { primitive: true, type: "adder", bound: 2 },
        hidden: false,
        position: { x: 96.93548250055198, y: 340.58162914039224 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: MULTIPLIER_2_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 1 },
        hidden: false,
        position: { x: 459.8358742887669, y: 76.44620288936619 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_2_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_2_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: ADDER_2_ID,
        selected: false,
        operator: { primitive: true, type: "adder", bound: 1 },
        hidden: false,
        position: { x: 585.0216124619025, y: 367.04301414769327 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_1_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_2_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "yBgUCCcG",
        selected: false,
        source: { node: ADDER_1_ID, handle: 2 },
        target: { node: ADDER_2_ID, handle: 2 },
      },
      {
        vertices: [
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "iXfxBGgW",
        selected: false,
        source: { node: ADDER_2_ID, handle: 1 },
        target: { node: MULTIPLIER_2_ID, handle: 2 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_1_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "rJTECzQh",
        selected: false,
        source: { node: MULTIPLIER_2_ID, handle: 1 },
        target: { node: MULTIPLIER_1_ID, handle: 1 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_1_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_1_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "PbRxFpXa",
        selected: false,
        source: { node: MULTIPLIER_1_ID, handle: 2 },
        target: { node: ADDER_1_ID, handle: 1 },
      },
    ],
    mode: 1,
    focus: null,
  },
  bound: 4,
  interfaceVertexIds: [
    {
      node: MULTIPLIER_1_ID,
      handle: 0,
    },
    {
      node: ADDER_1_ID,
      handle: 0,
    },
    {
      node: MULTIPLIER_2_ID,
      handle: 0,
    },
    {
      node: ADDER_2_ID,
      handle: 0,
    },
    {
      node: MULTIPLIER_1_ID,
      handle: 1,
    },
  ],
};

export const addLinearSolver = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(1, 0, { node: id, handle: 0 }),
    mainGraph.addFree(1, 0, { node: id, handle: 1 }),
    mainGraph.addFree(2, 0, { node: id, handle: 2 }),
    mainGraph.addFree(0, 0, { node: id, handle: 3 }),
    mainGraph.addFree(1, 0, { node: id, handle: 4 }),
  ];
  const edge = new NodeEdge(
    vertices,
    SIN_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "ax + b = cx + d"
  );
  mainGraph.edges.push(edge);
};
