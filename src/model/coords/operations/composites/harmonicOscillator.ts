import { genNodeId } from "../../../../schema/node";
import { UPDATE_MODE } from "../../../settings";
import { mainGraph } from "../../../store";
import { CircuitPosition, NodeEdge } from "../../edges/nodeEdge";

const MULTIPLIER_ID = "multipl1";
const MULTIPLIER_2_ID = "multipl2";
const SIN_ID = "sin00000";
const ADDER_ID = "adder000";

export const HARMONIC_OSCILLATOR_JSON = {
  primitive: false as const,
  subgraph: {
    edges: [
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0.8414709848078964, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0.8414709848078964, y: 0, delta: { x: 0, y: 0 } },
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
        position: { x: 637.2441956603398, y: 1615.172214270055 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: SIN_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0.8414709848078964, y: 0, delta: { x: 0, y: 0 } },
            id: { node: SIN_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: SIN_ID,
        selected: false,
        operator: {
          primitive: false,
          boundArray: [1],
          interfaceVertexIds: [
            { node: "inputmu", handle: 0 },
            { node: "outputmu", handle: 0 },
          ],
          subgraph: {
            edges: [
              {
                vertices: [
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "internal", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: -1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "internal", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: -1.8369701987210297e-16, y: -1, delta: { x: 0, y: 0 } },
                    id: { node: "internal", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "internal",
                selected: false,
                operator: { primitive: true, type: "multiplier", bound: 2 },
                hidden: true,
                position: { x: 331.6279478186962, y: 414.3879980708546 },
                label: "",
              },
              {
                vertices: [
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "8RbDj3zb", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0.5403023058681398, y: 0.8414709848078965, delta: { x: 0, y: 0 } },
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
                    value: { x: -1.8369701987210297e-16, y: -1, delta: { x: 0, y: 0 } },
                    id: { node: "WTD9LYzp", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0.5403023058681397, y: -0.8414709848078963, delta: { x: 0, y: 0 } },
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
                    value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "inputmu", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "inputmu", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "inputmu", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "inputmu",
                selected: false,
                operator: { primitive: true, type: "multiplier", bound: 2 },
                hidden: true,
                position: { x: 138.62254611597575, y: 41.05638163858521 },
                label: "",
              },
              {
                vertices: [
                  {
                    value: {
                      x: 1.1102230246251565e-16,
                      y: 1.6829419696157928,
                      delta: { x: 0, y: 0 },
                    },
                    id: { node: "yJMXBRCT", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0.5403023058681397, y: -0.8414709848078963, delta: { x: 0, y: 0 } },
                    id: { node: "yJMXBRCT", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0.5403023058681398, y: 0.8414709848078965, delta: { x: 0, y: 0 } },
                    id: { node: "yJMXBRCT", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "yJMXBRCT",
                selected: false,
                operator: { primitive: true, type: "adder", bound: 0 },
                hidden: true,
                position: { x: 379.96951824570215, y: 1126.686711746492 },
                label: "",
              },
              {
                vertices: [
                  {
                    value: { x: 0.8414709848078964, y: 0, delta: { x: 0, y: 0 } },
                    id: { node: "outputmu", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0, y: 2, delta: { x: 0, y: 0 } },
                    id: { node: "outputmu", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: {
                      x: 1.1102230246251565e-16,
                      y: 1.6829419696157928,
                      delta: { x: 0, y: 0 },
                    },
                    id: { node: "outputmu", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "outputmu",
                selected: false,
                operator: { primitive: true, type: "multiplier", bound: 0 },
                hidden: true,
                position: { x: -326.03048175429785, y: 838.6867117464919 },
                label: "",
              },
              {
                vertices: [
                  {
                    value: { x: -1.8369701987210297e-16, y: -1, delta: { x: 0, y: 0 } },
                    id: { node: "internal", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: -1.8369701987210297e-16, y: -1, delta: { x: 0, y: 0 } },
                    id: { node: "WTD9LYzp", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "nctJcKNE",
                selected: false,
                source: { node: "internal", handle: 2 },
                target: { node: "WTD9LYzp", handle: 0 },
              },
              {
                vertices: [
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "inputmu", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "8RbDj3zb", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "U7qLi6Mj",
                selected: false,
                source: { node: "inputmu", handle: 2 },
                target: { node: "8RbDj3zb", handle: 0 },
              },
              {
                vertices: [
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "inputmu", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 6.123233995736766e-17, y: 1, delta: { x: 0, y: 0 } },
                    id: { node: "internal", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "8iGG3q9t",
                selected: false,
                source: { node: "inputmu", handle: 2 },
                target: { node: "internal", handle: 0 },
              },
              {
                vertices: [
                  {
                    value: { x: 0.5403023058681398, y: 0.8414709848078965, delta: { x: 0, y: 0 } },
                    id: { node: "8RbDj3zb", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0.5403023058681398, y: 0.8414709848078965, delta: { x: 0, y: 0 } },
                    id: { node: "yJMXBRCT", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "FLh6mKni",
                selected: false,
                source: { node: "8RbDj3zb", handle: 1 },
                target: { node: "yJMXBRCT", handle: 2 },
              },
              {
                vertices: [
                  {
                    value: { x: 0.5403023058681397, y: -0.8414709848078963, delta: { x: 0, y: 0 } },
                    id: { node: "WTD9LYzp", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: { x: 0.5403023058681397, y: -0.8414709848078963, delta: { x: 0, y: 0 } },
                    id: { node: "yJMXBRCT", handle: 1 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "AGqdp4yh",
                selected: false,
                source: { node: "WTD9LYzp", handle: 1 },
                target: { node: "yJMXBRCT", handle: 1 },
              },
              {
                vertices: [
                  {
                    value: {
                      x: 1.1102230246251565e-16,
                      y: 1.6829419696157928,
                      delta: { x: 0, y: 0 },
                    },
                    id: { node: "yJMXBRCT", handle: 0 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                  {
                    value: {
                      x: 1.1102230246251565e-16,
                      y: 1.6829419696157928,
                      delta: { x: 0, y: 0 },
                    },
                    id: { node: "outputmu", handle: 2 },
                    dragging: false,
                    hidden: true,
                    selected: false,
                  },
                ],
                id: "8UXCDzWB",
                selected: false,
                source: { node: "yJMXBRCT", handle: 0 },
                target: { node: "outputmu", handle: 2 },
              },
            ],
            mode: 1,
            focus: null,
          },
        },
        hidden: false,
        position: { x: 882.1658304909, y: 1269.1718095094216 },
        label: "sin(a)",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: MULTIPLIER_2_ID,
        selected: false,
        operator: { primitive: true, type: "multiplier", bound: 2 },
        hidden: false,
        position: { x: 775.2555930648617, y: 569.395709993534 },
        label: "",
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
            value: { x: 0, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
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
        position: { x: 1020.1772278954229, y: 927.0590497460988 },
        label: "",
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_2_ID, handle: 2 },
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
        id: "jGNpnmTP",
        selected: false,
        source: { node: MULTIPLIER_2_ID, handle: 2 },
        target: { node: ADDER_ID, handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: ADDER_ID, handle: 2 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 1, y: 0, delta: { x: 0, y: 0 } },
            id: { node: SIN_ID, handle: 0 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "MqfQCVgP",
        selected: false,
        source: { node: ADDER_ID, handle: 2 },
        target: { node: SIN_ID, handle: 0 },
      },
      {
        vertices: [
          {
            value: { x: 0.8414709848078964, y: 0, delta: { x: 0, y: 0 } },
            id: { node: SIN_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
          {
            value: { x: 0.8414709848078964, y: 0, delta: { x: 0, y: 0 } },
            id: { node: MULTIPLIER_ID, handle: 1 },
            dragging: false,
            hidden: false,
            selected: false,
          },
        ],
        id: "eBVrrfpR",
        selected: false,
        source: { node: SIN_ID, handle: 1 },
        target: { node: MULTIPLIER_ID, handle: 1 },
      },
    ],
    mode: 1,
    focus: null,
  },
  boundArray: [4],
  interfaceVertexIds: [
    {
      node: MULTIPLIER_ID,
      handle: 0,
    },
    {
      node: MULTIPLIER_2_ID,
      handle: 0,
    },
    {
      node: MULTIPLIER_2_ID,
      handle: 1,
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
};

export const addHarmonicOscillator = (position: CircuitPosition) => {
  const id = genNodeId();
  const vertices = [
    mainGraph.addFree(1, 0, { node: id, handle: 0 }),
    mainGraph.addFree(1, 0, { node: id, handle: 1 }),
    mainGraph.addFree(1, 0, { node: id, handle: 2 }),
    mainGraph.addFree(1, 0, { node: id, handle: 3 }),
    mainGraph.addFree(1, 0, { node: id, handle: 4 }),
  ];
  const edge = new NodeEdge(
    vertices,
    HARMONIC_OSCILLATOR_JSON,
    UPDATE_MODE,
    id,
    position,
    false,
    false,
    "a × sin(bc + d)"
  );
  mainGraph.edges.push(edge);
};
