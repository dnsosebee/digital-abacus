import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const ADDER_ID = "adder000";
const DUMMY_POSITION = { x: 0, y: 0 };

export const addSubtractor = (position: CircuitPosition) => {
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
                value: {
                  x: 0,
                  y: 0,
                  delta: {
                    x: 0,
                    y: 0,
                  },
                },
                id: {
                  node: ADDER_ID,
                  handle: 0,
                },
                dragging: false,
                hidden: true,
                selected: false,
              },
              {
                value: {
                  x: 0,
                  y: 0,
                  delta: {
                    x: 0,
                    y: 0,
                  },
                },
                id: {
                  node: ADDER_ID,
                  handle: 1,
                },
                dragging: false,
                hidden: true,
                selected: false,
              },
              {
                value: {
                  x: 0,
                  y: 0,
                  delta: {
                    x: 0,
                    y: 0,
                  },
                },
                id: {
                  node: ADDER_ID,
                  handle: 2,
                },
                dragging: false,
                hidden: true,
                selected: false,
              },
            ],
            id: ADDER_ID,
            selected: false,
            operator: {
              primitive: true,
              type: "adder",
              bound: 0,
            },
            hidden: true,
            position: DUMMY_POSITION,
            label: "",
          },
        ],
        mode: UPDATE_MODE,
        focus: null,
      },
      boundArray: [2],
      interfaceVertexIds: [
        {
          node: ADDER_ID,
          handle: 2,
        },
        {
          node: ADDER_ID,
          handle: 1,
        },
        {
          node: ADDER_ID,
          handle: 0,
        },
      ],
    },
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "a - b"
  );
  mainGraph.edges.push(edge);
};
