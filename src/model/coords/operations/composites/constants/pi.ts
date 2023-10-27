import { genNodeId } from "../../../../../schema/node";
import { UPDATE_MODE } from "../../../../settings";
import { p } from "../../../../setup";
import { mainGraph } from "../../../../store";
import { CircuitPosition, NodeEdge } from "../../../edges/nodeEdge";

const STANDALONE_ID = "standalo";

export const addPi = (position: CircuitPosition) => {
  const PI_CONFIG_JSON = {
    primitive: false as const,
    subgraph: {
      edges: [
        {
          vertices: [
            {
              value: { x: p!.PI, y: 0, delta: { x: 0, y: 0 } },
              id: { node: STANDALONE_ID, handle: 0 },
              dragging: false,
              hidden: false,
              selected: false,
            },
          ],
          id: STANDALONE_ID,
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
    boundArray: [0],
    interfaceVertexIds: [
      {
        node: STANDALONE_ID,
        handle: 0,
      },
    ],
  };

  const id = genNodeId();
  const vertices = [mainGraph().addFree(p!.PI, 0, { node: id, handle: 0 })];
  const edge = new NodeEdge(vertices, PI_CONFIG_JSON, UPDATE_MODE, id, position, false, false, "π");
  mainGraph().edges.push(edge);
};
