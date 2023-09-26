import { genNodeId } from "../../../../../schema/node";
import { UPDATE_MODE } from "../../../../settings";
import { mainGraph } from "../../../../store";
import { CircuitPosition, NodeEdge } from "../../../edges/nodeEdge";

const INPUT_MULTIPLIER_ID = "inputmu";
const OUTPUT_MULTIPLIER_ID = "outputmu";

export const DEGREE_RADIAN_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 180, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
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
        operator: { primitive: true, type: "multiplier", bound: 1 },
        hidden: false,
        position: { x: 31.935153520547317, y: 267.77536348746855 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 3.141592653589793, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "aUgeAJe4", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "aUgeAJe4",
        selected: true,
        operator: {
          primitive: false,
          boundArray: [0],
          interfaceVertexIds: [{ node: "standalo", handle: 0 }],
          subgraph: {
            edges: [
              {
                vertices: [
                  {
                    value: { x: 3.141592653589793, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "standalo", handle: 0 },
                    dragging: false,
                    hidden: false,
                    selected: false,
                  },
                ],
                id: "standalo",
                selected: false,
                operator: { primitive: true, type: "standalone" },
                hidden: false,
                position: { x: 175.22915649414062, y: 165.84895706176758 },
                label: "",
              },
            ],
            mode: 1,
            focus: null,
          },
        },
        hidden: false,
        position: { x: 427.5232522986346, y: 147.12099336015203 },
        label: "π",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 3.141592653589793, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: OUTPUT_MULTIPLIER_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: false,
        position: { x: 327.6372573571677, y: 350.8488642308669 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: INPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "PbeXqcLG",
        selected: false,
        source: { node: INPUT_MULTIPLIER_ID, handle: 1 },
        target: { node: OUTPUT_MULTIPLIER_ID, handle: 0 },
        primaryLeft: true,
      },
      {
        vertices: [
          {
            value: { x: 3.141592653589793, y: 0, delta: { x: 0, y: 0 } },
            id: { node: "aUgeAJe4", handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 3.141592653589793, y: 0, delta: { x: 0, y: 0 } },
            id: { node: OUTPUT_MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "QFng4DLA",
        selected: false,
        source: { node: "aUgeAJe4", handle: 0 },
        target: { node: OUTPUT_MULTIPLIER_ID, handle: 1 },
        primaryLeft: true,
      },
    ],
    mode: 1,
    focus: null,
  },
  boundArray: [1],
  interfaceVertexIds: [
    {
      node: INPUT_MULTIPLIER_ID,
      handle: 2,
    },
    {
      node: OUTPUT_MULTIPLIER_ID,
      handle: 2,
    },
  ],
};

export const addDegreesToRadians = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(0, 0, { node: id, handle: 0 }),
    mainGraph.addFree(0, 0, { node: id, handle: 1 }),
  ];
  const edge = new NodeEdge(
    vertices,
    DEGREE_RADIAN_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "degrees → radians"
  );
  mainGraph.edges.push(edge);
};
