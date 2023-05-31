import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const ADDER_ID = "adder000";
const MULTIPLIER_ID = "multiply";
const WIRE_ID = "wire000";
const DUMMY_POSITION = { x: 0, y: 0 };

export const addAverage = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(0, 0, { node: id, handle: 0 }),
    mainGraph.addFree(0, 0, { node: id, handle: 1 }),
    mainGraph.addFree(0, 0, { node: id, handle: 2 }),
  ];
  const edge = new NodeEdge(
    vertices,
    {
      primitive: false as const,
      subgraph: {
        edges: [
          {
            vertices: [
              {
                value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 1 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 2 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: ADDER_ID,
            selected: false,
            operator: { primitive: true, type: "adder", bound: 2 },
            hidden: true,
            position: DUMMY_POSITION,
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
                value: { x: 0.5, y: 0, delta: { x: 0, y: 0 } },
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
            hidden: true,
            position: DUMMY_POSITION,
            label: "",
          },
          {
            vertices: [
              {
                value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 2 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
                id: { node: MULTIPLIER_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: WIRE_ID,
            selected: false,
            source: { node: ADDER_ID, handle: 2 },
            target: { node: MULTIPLIER_ID, handle: 0 },
          },
        ],
        mode: 1,
        focus: null,
      },
      bound: 2,
      interfaceVertexIds: [
        {
          node: ADDER_ID,
          handle: 0,
        },
        {
          node: ADDER_ID,
          handle: 1,
        },
        {
          node: MULTIPLIER_ID,
          handle: 2,
        },
      ],
    },
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "avg(a,b)"
  );
  mainGraph.edges.push(edge);
};
