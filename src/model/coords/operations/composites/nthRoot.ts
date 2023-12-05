import { mainGraph } from "../../../store";
import { CircuitPosition, SerialNodeEdge } from "../../edges/nodeEdge";

const EXPONENT_ID = "exponent";
const DUMMY_POSITION = { x: 0, y: 0 };

export const addNthRoot = (position: CircuitPosition) => {
  const serialNodeEdge: SerialNodeEdge = {
    vertices: [
      {
        value: {
          x: 1,
          y: 0,
          delta: {
            x: 0,
            y: 0,
          },
        },
        id: {
          node: "m76pr9WM",
          handle: 0,
        },
        dragging: false,
        hidden: false,
        selected: false,
        label: "",
      },
      {
        value: {
          x: 1,
          y: 0,
          delta: {
            x: 0,
            y: 0,
          },
        },
        id: {
          node: "m76pr9WM",
          handle: 1,
        },
        dragging: false,
        hidden: false,
        selected: false,
        label: "",
      },
      {
        value: {
          x: 1,
          y: 0,
          delta: {
            x: 0,
            y: 0,
          },
        },
        id: {
          node: "m76pr9WM",
          handle: 2,
        },
        dragging: false,
        hidden: false,
        selected: false,
        label: "",
      },
    ],
    id: "m76pr9WM",
    selected: false,
    operator: {
      primitive: false,
      boundArray: [2],
      interfaceVertexIds: [
        {
          node: "k7JzA3Ke",
          handle: 1,
        },
        {
          node: "k7JzA3Ke",
          handle: 2,
        },
        {
          node: "k7JzA3Ke",
          handle: 0,
        },
      ],
      subgraph: {
        edges: [
          {
            vertices: [
              {
                value: {
                  x: 2.9999999999999996,
                  y: 0,
                  delta: {
                    x: 0,
                    y: 0,
                  },
                },
                id: {
                  node: "k7JzA3Ke",
                  handle: 0,
                },
                dragging: false,
                hidden: false,
                selected: false,
                label: "",
              },
              {
                value: {
                  x: 2,
                  y: 0,
                  delta: {
                    x: 0,
                    y: 0,
                  },
                },
                id: {
                  node: "k7JzA3Ke",
                  handle: 1,
                },
                dragging: false,
                hidden: false,
                selected: false,
                label: "",
              },
              {
                value: {
                  x: 8.999999999999998,
                  y: 0,
                  delta: {
                    x: 0,
                    y: 0,
                  },
                },
                id: {
                  node: "k7JzA3Ke",
                  handle: 2,
                },
                dragging: false,
                hidden: false,
                selected: false,
                label: "",
              },
            ],
            id: "k7JzA3Ke",
            selected: true,
            operator: {
              primitive: false,
              boundArray: [0],
              interfaceVertexIds: [
                {
                  node: "log00000",
                  handle: 1,
                },
                {
                  node: "multiply",
                  handle: 1,
                },
                {
                  node: "exponent",
                  handle: 1,
                },
              ],
              subgraph: {
                edges: [
                  {
                    vertices: [
                      {
                        value: {
                          x: 1.0986122886681096,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "log00000",
                          handle: 0,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                      {
                        value: {
                          x: 2.9999999999999996,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "log00000",
                          handle: 1,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                    ],
                    id: "log00000",
                    selected: false,
                    operator: {
                      primitive: true,
                      type: "exponential",
                      bound: 1,
                    },
                    hidden: false,
                    position: {
                      x: 147.78583226354175,
                      y: 175.59003854461594,
                    },
                    label: "",
                  },
                  {
                    vertices: [
                      {
                        value: {
                          x: 1.0986122886681096,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "multiply",
                          handle: 0,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                      {
                        value: {
                          x: 2,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "multiply",
                          handle: 1,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                      {
                        value: {
                          x: 2.197224577336219,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "multiply",
                          handle: 2,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                    ],
                    id: "multiply",
                    selected: false,
                    operator: {
                      primitive: true,
                      type: "multiplier",
                      bound: 0,
                    },
                    hidden: false,
                    position: {
                      x: 375.2633608974397,
                      y: 184.51072594202378,
                    },
                    label: "",
                  },
                  {
                    vertices: [
                      {
                        value: {
                          x: 2.197224577336219,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "exponent",
                          handle: 0,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                      {
                        value: {
                          x: 8.999999999999998,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "exponent",
                          handle: 1,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                    ],
                    id: "exponent",
                    selected: false,
                    operator: {
                      primitive: true,
                      type: "exponential",
                      bound: 0,
                    },
                    hidden: false,
                    position: {
                      x: 455.6024225425043,
                      y: 495.0893784132097,
                    },
                    label: "",
                  },
                  {
                    vertices: [
                      {
                        value: {
                          x: 1.0986122886681096,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "log00000",
                          handle: 0,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                      {
                        value: {
                          x: 1.0986122886681096,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "multiply",
                          handle: 0,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                    ],
                    id: "wire0000",
                    selected: false,
                    source: {
                      node: "multiply",
                      handle: 0,
                    },
                    target: {
                      node: "log00000",
                      handle: 0,
                    },
                    primaryLeft: false,
                  },
                  {
                    vertices: [
                      {
                        value: {
                          x: 2.197224577336219,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "multiply",
                          handle: 2,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                      {
                        value: {
                          x: 2.197224577336219,
                          y: 0,
                          delta: {
                            x: 0,
                            y: 0,
                          },
                        },
                        id: {
                          node: "exponent",
                          handle: 0,
                        },
                        dragging: false,
                        hidden: false,
                        selected: false,
                      },
                    ],
                    id: "wire1111",
                    selected: false,
                    source: {
                      node: "exponent",
                      handle: 0,
                    },
                    target: {
                      node: "multiply",
                      handle: 2,
                    },
                    primaryLeft: false,
                  },
                ],
                mode: 1,
                focus: null,
              },
            },
            hidden: false,
            position: {
              x: 213.53168528707891,
              y: 328.70077398616917,
            },
            label: "aᵇ",
          },
        ],
        mode: 1,
        focus: null,
      },
    },
    hidden: false,
    position: {
      x: 213.53168528707891,
      y: 328.70077398616917,
    },
    label: "ᵃ√b",
  };
  mainGraph().addCompositeOperation(serialNodeEdge);
};
