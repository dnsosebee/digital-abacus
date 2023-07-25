import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const ADDER_ID = "adder000";
const MULTIPLIER_ID = "multiply";

export const addTemperature = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(212, 0, { node: id, handle: 0 }),
    mainGraph.addFree(100, 0, { node: id, handle: 1 }),
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
                value: { x: 180, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 32, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 1 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 212, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 2 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: ADDER_ID,
            selected: false,
            operator: { primitive: true, type: "adder", bound: 0 },
            hidden: false,
            position: { x: 205.22915649414062, y: 485.8489570617676 },
            label: "",
          },
          {
            vertices: [
              {
                value: { x: 180, y: 0, delta: { x: 0, y: 0 } },
                id: { node: MULTIPLIER_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 0.5555555555555556, y: 0, delta: { x: 0, y: 0 } },
                id: { node: MULTIPLIER_ID, handle: 1 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 100, y: 0, delta: { x: 0, y: 0 } },
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
            position: { x: 126.22915649414062, y: 1063.8489570617676 },
            label: "",
          },
          {
            vertices: [
              {
                value: { x: 180, y: 0, delta: { x: 0, y: 0 } },
                id: { node: ADDER_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 180, y: 0, delta: { x: 0, y: 0 } },
                id: { node: MULTIPLIER_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: "XRNEBzjM",
            selected: false,
            source: { node: ADDER_ID, handle: 0 },
            target: { node: MULTIPLIER_ID, handle: 0 },
            primaryLeft: true,
          },
          {
            vertices: [
              {
                value: { x: 5, y: 0, delta: { x: 0, y: 0 } },
                id: { node: "R4zXnBx6", handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 9, y: 0, delta: { x: 0, y: 0 } },
                id: { node: "R4zXnBx6", handle: 1 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 0.5555555555555556, y: 0, delta: { x: 0, y: 0 } },
                id: { node: "R4zXnBx6", handle: 2 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: "R4zXnBx6",
            selected: false,
            operator: {
              primitive: false,
              bound: 2,
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
                        value: { x: 0.5555555555555556, y: 0, delta: { x: 0, y: 0 } },
                        id: { node: "multiply", handle: 0 },
                        dragging: false,
                        hidden: true,
                        selected: false,
                      },
                      {
                        value: { x: 9, y: 0, delta: { x: 0, y: 0 } },
                        id: { node: "multiply", handle: 1 },
                        dragging: false,
                        hidden: true,
                        selected: false,
                      },
                      {
                        value: { x: 5, y: 0, delta: { x: 0, y: 0 } },
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
            position: { x: 311.2291564941406, y: 794.8489570617676 },
            label: "a ÷ b",
          },
          {
            vertices: [
              {
                value: { x: 0.5555555555555556, y: 0, delta: { x: 0, y: 0 } },
                id: { node: "R4zXnBx6", handle: 2 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 0.5555555555555556, y: 0, delta: { x: 0, y: 0 } },
                id: { node: MULTIPLIER_ID, handle: 1 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: "rBaUmyDL",
            selected: false,
            source: { node: "R4zXnBx6", handle: 2 },
            target: { node: MULTIPLIER_ID, handle: 1 },
            primaryLeft: true,
          },
        ],
        mode: 1,
        focus: null,
      },
      bound: 1,
      interfaceVertexIds: [
        {
          node: ADDER_ID,
          handle: 2,
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
    "°F → °C"
  );
  mainGraph.edges.push(edge);
};
