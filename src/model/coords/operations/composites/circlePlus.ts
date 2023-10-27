import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const RECIP_1_ID = "recip111";
const RECIP_2_ID = "recip222";
const ADDER_ID = "adder000";

export const CIRCLE_PLUS_CONFIG_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: RECIP_1_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: RECIP_1_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: RECIP_1_ID,
        selected: false,
        operator: {
          primitive: false,
          boundArray: [1],
          interfaceVertexIds: [
            { node: "multiply", handle: 1 },
            { node: "multiply", handle: 0 },
          ],
          subgraph: {
            edges: [
              {
                vertices: [
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
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
        position: { x: 190.22915649414062, y: 232.84895706176758 },
        label: "¹⁄ₐ",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: RECIP_2_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: RECIP_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: RECIP_2_ID,
        selected: false,
        operator: {
          primitive: false,
          boundArray: [1],
          interfaceVertexIds: [
            { node: "multiply", handle: 1 },
            { node: "multiply", handle: 0 },
          ],
          subgraph: {
            edges: [
              {
                vertices: [
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "multiply", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
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
        position: { x: 402.2291564941406, y: 229.84895706176758 },
        label: "¹⁄ₐ",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 2, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: ADDER_ID,
        selected: false,
        operator: { primitive: true, type: "adder", bound: 2 },
        hidden: false,
        position: { x: 248.22915649414062, y: 493.8489570617676 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: RECIP_1_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "TjBMFXXk",
        selected: false,
        source: { node: RECIP_1_ID, handle: 1 },
        target: { node: ADDER_ID, handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: RECIP_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "YgE6ADk8",
        selected: false,
        source: { node: RECIP_2_ID, handle: 1 },
        target: { node: ADDER_ID, handle: 1 },
      },
    ],
    mode: 1,
    focus: null,
  },
  boundArray: [2],
  interfaceVertexIds: [
    {
      node: RECIP_1_ID,
      handle: 0,
    },
    {
      node: RECIP_2_ID,
      handle: 0,
    },
    {
      node: ADDER_ID,
      handle: 2,
    },
  ],
};

export const addCirclePlus = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph().addFree(1, 0, { node: id, handle: 0 }),
    mainGraph().addFree(1, 0, { node: id, handle: 1 }),
    mainGraph().addFree(2, 0, { node: id, handle: 2 }),
  ];
  const edge = new NodeEdge(
    vertices,
    CIRCLE_PLUS_CONFIG_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "1/a + 1/b"
  );
  mainGraph().edges.push(edge);
};
