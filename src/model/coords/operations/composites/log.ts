import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";
import { CompositeOperation } from "./compositeOperation";
import { EXPONENT_CONFIG_JSON } from "./exponent";

const EXPONENT_ID = "exponent";
const DUMMY_POSITION = { x: 0, y: 0 };

export const addLog = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(2, 0, { node: id, handle: 0 }),
    mainGraph.addFree(1, 0, { node: id, handle: 1 }),
    mainGraph.addFree(1, 0, { node: id, handle: 2 }),
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
                value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                id: { node: EXPONENT_ID, handle: 0 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                id: { node: EXPONENT_ID, handle: 1 },
                dragging: false,
                hidden: false,
                selected: false,
              },
              {
                value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                id: { node: EXPONENT_ID, handle: 2 },
                dragging: false,
                hidden: false,
                selected: false,
              },
            ],
            id: EXPONENT_ID,
            selected: false,
            operator: EXPONENT_CONFIG_JSON,
            hidden: false,
            position: { x: 242.01734924316406, y: 275.11631774902344 },
            label: "aᵇ",
          },
        ],
        mode: 1,
        focus: null,
      },
      boundArray: [2],
      interfaceVertexIds: [
        {
          node: EXPONENT_ID,
          handle: 0,
        },
        {
          node: EXPONENT_ID,
          handle: 2,
        },
        {
          node: EXPONENT_ID,
          handle: 1,
        },
      ],
    },
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "㏒ₐb"
  );
  const constraint = edge.constraint as CompositeOperation;
  const vertex2 = constraint.graph.vertices[2];
  const vertex1 = constraint.graph.vertices[1];
  (edge.constraint as CompositeOperation).graph.invert(vertex2, vertex1);
  mainGraph.edges.push(edge);
};
