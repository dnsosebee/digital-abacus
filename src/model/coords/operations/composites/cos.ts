import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const INPUT_MULTIPLIER_ID = "inputmu";
const OUTPUT_MULTIPLIER_ID = "outputmu";

export const COS_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "EPDDzMKY", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: -1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "EPDDzMKY", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "EPDDzMKY", handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "EPDDzMKY",
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: true,
        position: { x: 331.6279478186962, y: 414.3879980708546 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "8RbDj3zb", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "8RbDj3zb", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "8RbDj3zb",
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: true,
        position: { x: 1.9690865162394289, y: 398.891213992534 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "WTD9LYzp", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "WTD9LYzp", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "WTD9LYzp",
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: true,
        position: { x: 444.7588959666771, y: 759.7700391093557 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0, y: 1, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
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
        position: { x: 138.62254611597575, y: 41.05638163858521 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "yJMXBRCT", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "yJMXBRCT", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "yJMXBRCT", handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "yJMXBRCT",
        selected: false,
        operator: { primitive: true, type: "adder", bound: 2 },
        hidden: true,
        position: { x: 111.52032792318755, y: 1089.7749480771463 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: OUTPUT_MULTIPLIER_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 0 },
        hidden: true,
        position: { x: -326.03048175429785, y: 838.6867117464919 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "EPDDzMKY", handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "WTD9LYzp", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "nctJcKNE",
        selected: false,
        source: { node: "EPDDzMKY", handle: 2 },
        target: { node: "WTD9LYzp", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "8RbDj3zb", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "U7qLi6Mj",
        selected: false,
        source: { node: INPUT_MULTIPLIER_ID, handle: 2 },
        target: { node: "8RbDj3zb", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "EPDDzMKY", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "8iGG3q9t",
        selected: false,
        source: { node: INPUT_MULTIPLIER_ID, handle: 2 },
        target: { node: "EPDDzMKY", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "8RbDj3zb", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "yJMXBRCT", handle: 0 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "K7qdU7LR",
        selected: false,
        source: { node: "8RbDj3zb", handle: 1 },
        target: { node: "yJMXBRCT", handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "WTD9LYzp", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "yJMXBRCT", handle: 1 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "Aw9TQ6Fr",
        selected: false,
        source: { node: "WTD9LYzp", handle: 1 },
        target: { node: "yJMXBRCT", handle: 1 },
      },
      {
        vertices: [
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "yJMXBRCT", handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: true,
            selected: false,
          },
        ],
        id: "ee8HieMD",
        selected: false,
        source: { node: "yJMXBRCT", handle: 2 },
        target: { node: OUTPUT_MULTIPLIER_ID, handle: 2 },
      },
    ],
    mode: 1,
    focus: null,
  },
  bound: 1,
  interfaceVertexIds: [
    {
      node: INPUT_MULTIPLIER_ID,
      handle: 0,
    },
    {
      node: OUTPUT_MULTIPLIER_ID,
      handle: 0,
    },
  ],
};

export const addCos = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(0, 0, { node: id, handle: 0 }),
    mainGraph.addFree(1, 0, { node: id, handle: 1 }),
  ];
  const edge = new NodeEdge(
    vertices,
    COS_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "cos(a)"
  );
  mainGraph.edges.push(edge);
};
