import { genNodeId } from "../../../../../schema/node";
import { UPDATE_MODE } from "../../../../settings";
import { p } from "../../../../setup";
import { mainGraph } from "../../../../store";
import { CircuitPosition, NodeEdge } from "../../../edges/nodeEdge";

const EXPONENTIAL_ID = "exponent";

export const addE = (position: CircuitPosition) => {
  const PI_CONFIG_JSON = {
    primitive: false as const,
    subgraph: {
      edges: [
        {
          vertices: [
            {
              value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
              id: { node: EXPONENTIAL_ID, handle: 0 },
              dragging: false,
              hidden: false,
              selected: false,
            },
            {
              value: { x: 2.718281828459045, y: 0, delta: { x: 0, y: 0 } },
              id: { node: EXPONENTIAL_ID, handle: 1 },
              dragging: false,
              hidden: false,
              selected: false,
            },
          ],
          id: EXPONENTIAL_ID,
          selected: false,
          operator: { primitive: true, type: "exponential", bound: 1 },
          hidden: false,
          position: { x: 44.313804840760206, y: 457.4748497714713 },
          label: "",
        },
      ],
      mode: 1,
      focus: null,
    },
    bound: 0,
    interfaceVertexIds: [
      {
        node: EXPONENTIAL_ID,
        handle: 1,
      },
    ],
  };

  const id = genNodeId();
  const vertices = [mainGraph.addFree(p!.PI, 0, { node: id, handle: 0 })];
  const edge = new NodeEdge(vertices, PI_CONFIG_JSON, UPDATE_MODE, id, position, false, false, "e");
  mainGraph.edges.push(edge);
};
