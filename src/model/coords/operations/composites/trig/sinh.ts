import { genNodeId } from "../../../../../schema/node";
import { UPDATE_MODE } from "../../../../settings";
import { mainGraph } from "../../../../store";
import { CircuitPosition, NodeEdge } from "../../../edges/nodeEdge";

const INPUT_MULTIPLIER_ID = "multiply";
const OUTPUT_DIVIDER_ID = "divide00";

export const SINH_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 3, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: -1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: -3, y: 3.6739403974420594e-16, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: INPUT_MULTIPLIER_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: true,
        position: { x: 404.0309261200257, y: 506.2621085337307 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 3, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 20.085536923187668, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "DiAhJyTA",
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: true,
        position: { x: 304.6728108509008, y: 771.9115239819547 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: -3, y: 3.6739403974420594e-16, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0.049787068367863944, y: 1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "rHabMQPh",
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: true,
        position: { x: 636.0594311727974, y: 803.9811969163318 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 20.085536923187668, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "fDJK7mhr", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0.049787068367863944, y: 1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: "fDJK7mhr", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 20.035749854819805, y: -1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: "fDJK7mhr", handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "fDJK7mhr",
        selected: false,
        operator: {
          primitive: false,
          boundArray: [2],
          interfaceVertexIds: [
            { node: "adder000", handle: 2 },
            { node: "adder000", handle: 1 },
            { node: "adder000", handle: 0 },
          ],
          subgraph: {
            edges: [
              {
                vertices: [
                  {
                    value: {
                      x: 20.035749854819805,
                      y: -1.8291472174690505e-17,
                      delta: { x: 0, y: 0 },
                    },
                    id: { node: "adder000", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: {
                      x: 0.049787068367863944,
                      y: 1.8291472174690505e-17,
                      delta: { x: 0, y: 0 },
                    },
                    id: { node: "adder000", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 20.085536923187668, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "adder000", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "adder000",
                selected: false,
                operator: { primitive: true, type: "adder", bound: 0 },
                hidden: true,
                position: { x: 0, y: 0 },
                label: "",
              },
            ],
            mode: 1,
            focus: null,
          },
        },
        hidden: true,
        position: { x: 387.1376841107276, y: 1121.6236716949238 },
        label: "a - b",
      },
      {
        vertices: [
          {
            value: { x: 20.035749854819805, y: -1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 10.017874927409903, y: -9.145736087345252e-18, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 2 },
            dragging: false,
            hidden: true,
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
                    value: {
                      x: 10.017874927409903,
                      y: -9.145736087345252e-18,
                      delta: { x: 0, y: 0 },
                    },
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
                    value: {
                      x: 20.035749854819805,
                      y: -1.8291472174690505e-17,
                      delta: { x: 0, y: 0 },
                    },
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
        hidden: true,
        position: { x: 651.9440836767947, y: 1455.011453108759 },
        label: "a ÷ b",
      },
      {
        vertices: [
          {
            value: { x: 3, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 3, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 0 },
            dragging: false,
            hidden: true,
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
            value: { x: -3, y: 3.6739403974420594e-16, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: -3, y: 3.6739403974420594e-16, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 0 },
            dragging: false,
            hidden: true,
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
            value: { x: 20.085536923187668, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "DiAhJyTA", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 20.085536923187668, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "fDJK7mhr", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "KwJjBGa6",
        selected: false,
        source: { node: "DiAhJyTA", handle: 1 },
        target: { node: "fDJK7mhr", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 0.049787068367863944, y: 1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: "rHabMQPh", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0.049787068367863944, y: 1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: "fDJK7mhr", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "m8HECEmj",
        selected: false,
        source: { node: "rHabMQPh", handle: 1 },
        target: { node: "fDJK7mhr", handle: 1 },
      },
      {
        vertices: [
          {
            value: { x: 20.035749854819805, y: -1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: "fDJK7mhr", handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 20.035749854819805, y: -1.8291472174690505e-17, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_DIVIDER_ID, handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "nLkytKwe",
        selected: false,
        source: { node: "fDJK7mhr", handle: 2 },
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

export const addSinh = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph().addFree(0, 0, { node: id, handle: 0 }),
    mainGraph().addFree(0, 0, { node: id, handle: 1 }),
  ];
  const edge = new NodeEdge(
    vertices,
    SINH_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "sinh(a)"
  );
  mainGraph().edges.push(edge);
};
