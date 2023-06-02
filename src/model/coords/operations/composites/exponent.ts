import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const MULTIPLIER_ID = "multiply";
const EXPONENTIATOR_ID = "exponent";
const LOG_ID = "log00000";
const WIRE_LOG_TO_MULTIPLIER_ID = "wire0000";
const WIRE_MULTIPLIER_TO_EXPONENTIATOR_ID = "wire1111";

export const EXPONENT_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: LOG_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: LOG_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: LOG_ID,
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 0 },
        hidden: false,
        position: { x: 147.78583226354175, y: 175.59003854461594 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: MULTIPLIER_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: false,
        position: { x: 375.2633608974397, y: 184.51072594202378 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: LOG_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: WIRE_LOG_TO_MULTIPLIER_ID,
        selected: false,
        source: { node: LOG_ID, handle: 0 },
        target: { node: MULTIPLIER_ID, handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: EXPONENTIATOR_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: EXPONENTIATOR_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: EXPONENTIATOR_ID,
        selected: false,
        operator: { primitive: true, type: "exponential", bound: 1 },
        hidden: false,
        position: { x: 455.6024225425043, y: 495.0893784132097 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: EXPONENTIATOR_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: WIRE_MULTIPLIER_TO_EXPONENTIATOR_ID,
        selected: false,
        source: { node: MULTIPLIER_ID, handle: 2 },
        target: { node: EXPONENTIATOR_ID, handle: 0 },
      },
    ],
    mode: 1,
    focus: null,
  },
  bound: 2,
  interfaceVertexIds: [
    {
      node: LOG_ID,
      handle: 1,
    },
    {
      node: MULTIPLIER_ID,
      handle: 1,
    },
    {
      node: EXPONENTIATOR_ID,
      handle: 1,
    },
  ],
};

export const addExponent = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(1, 0, { node: id, handle: 0 }),
    mainGraph.addFree(1, 0, { node: id, handle: 1 }),
    mainGraph.addFree(1, 0, { node: id, handle: 2 }),
  ];
  const edge = new NodeEdge(
    vertices,
    EXPONENT_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "aᵇ"
  );
  mainGraph.edges.push(edge);
};
