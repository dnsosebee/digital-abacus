import { genNodeId } from "../../../../../schema/node";
import { UPDATE_MODE } from "../../../../settings";
import { mainGraph } from "../../../../store";
import { CircuitPosition, NodeEdge } from "../../../edges/nodeEdge";

const INPUT_MULTIPLIER_ID = "multiply";
const OUTPUT_DIVIDER_ID = "divide00";

export const COSH_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: -1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: INPUT_MULTIPLIER_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: false,
        position: { x: 404.0309261200257, y: 506.2621085337307 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "DiAhJyTA",
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: false,
        position: { x: 304.6728108509008, y: 771.9115239819547 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "rHabMQPh",
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: false,
        position: { x: 636.0594311727974, y: 803.9811969163318 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "mmXTNtdY",
        selected: false,
        source: { node: INPUT_MULTIPLIER_ID, handle: 0 },
        target: { node: "DiAhJyTA", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "GWmqEJUK",
        selected: false,
        source: { node: INPUT_MULTIPLIER_ID, handle: 2 },
        target: { node: "rHabMQPh", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "4XBtEwAA", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "4XBtEwAA", handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "4XBtEwAA", handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "4XBtEwAA",
        selected: false,
        operator: { primitive: true, type: "adder", bound: 2 },
        hidden: false,
        position: { x: 392.5751195453314, y: 1195.188416034307 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: OUTPUT_DIVIDER_ID,
        selected: false,
        operator: {
          primitive: false,
          boundArray: [2],
          interfaceVertexIds: [
            { node: "multiply", handle: 2 },
            { node: "multiply", handle: 1 },
            { node: "multiply", handle: 0 },
          ],
          subgraph: {
            edges: [
              {
                vertices: [
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "multiply",
                selected: false,
                operator: { primitive: true, type: "multiplier", bound: 0 },
                hidden: true,
                position: { x: 0, y: 0 },
                label: "",
              },
            ],
            mode: 1,
            focus: null,
          },
        },
        hidden: false,
        position: { x: 844.5751195453314, y: 1571.188416034307 },
        label: "a ÷ b",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "4XBtEwAA", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "warXcf4N",
        selected: false,
        source: { node: "DiAhJyTA", handle: 1 },
        target: { node: "4XBtEwAA", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "4XBtEwAA", handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "bzjYyr6B",
        selected: false,
        source: { node: "rHabMQPh", handle: 1 },
        target: { node: "4XBtEwAA", handle: 1 },
      },
      {
        vertices: [
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "4XBtEwAA", handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "xeCjjkYi",
        selected: false,
        source: { node: "4XBtEwAA", handle: 2 },
        target: { node: OUTPUT_DIVIDER_ID, handle: 0 },
      },
    ],
    mode: 1,
    focus: null,
  },
  boundArray: [1],
  interfaceVertexIds: [
    {
      node: INPUT_MULTIPLIER_ID,
      handle: 0,
    },
    {
      node: OUTPUT_DIVIDER_ID,
      handle: 2,
    },
  ],
};

export const addCosh = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(0, 0, { node: id, handle: 0 }),
    mainGraph.addFree(1, 0, { node: id, handle: 1 }),
  ];
  const edge = new NodeEdge(
    vertices,
    COSH_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "cosh(a)"
  );
  mainGraph.edges.push(edge);
};
