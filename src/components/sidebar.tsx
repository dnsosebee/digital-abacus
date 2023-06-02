import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { BUILTIN_COMPOSITES } from "@/model/coords/operations/composites/compositeOperation";
import { AddNode } from "@/schema/node";
import { Draggable } from "./draggable";

export const Sidebar = () => {
  return (
    <div className="flex flex-col items-center bg-gray-800">
      <ComponentSidebar />
    </div>
  );
};

const ComponentSidebar = () => {
  const onDragStart = (event: React.DragEvent<HTMLElement>, addNode: AddNode) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(addNode));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={`w-40 overflow-y-scroll spotlight my-2 select-none px-4 overflow-x-hidden`}>
      <div className="flex flex-col items-stretch">
        <p className="py-2 text-gray-300 text-xl text-center">Add Nodes</p>
        <p className="text-gray-550 text-lg text-center">Number</p>
        <div className={`flex flex-col items-center space-y-4 py-4`}>
          <Draggable
            symbol="#"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "math",
                data: { opType: OP_TYPE.STANDALONE },
                position: { x: 0, y: 0 },
              })
            }
          />
        </div>
      </div>

      <p className="text-gray-550 text-lg text-center">Constants</p>
      <div className="flex place-content-center space-x-4">
        <div className={`flex flex-col items-center space-y-4 py-4`}>
          <Draggable
            symbol="π"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "composite",
                data: { opType: BUILTIN_COMPOSITES.PI },
                position: { x: 0, y: 0 },
              })
            }
          />
          <Draggable
            symbol="e"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "composite",
                data: { opType: BUILTIN_COMPOSITES.E },
                position: { x: 0, y: 0 },
              })
            }
          />
        </div>
        <div className={`flex flex-col items-center space-y-4 py-4`}>
          <Draggable
            symbol="i"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "composite",
                data: { opType: BUILTIN_COMPOSITES.I },
                position: { x: 0, y: 0 },
              })
            }
          />
          <Draggable
            symbol="φ"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "composite",
                data: { opType: BUILTIN_COMPOSITES.PHI },
                position: { x: 0, y: 0 },
              })
            }
          />
        </div>
      </div>

      <p className="text-gray-550 text-lg text-center">Basics</p>
      <div className={`flex flex-col items-center space-y-4 py-4`}>
        <Draggable
          symbol="a + b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.ADDER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="a × b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.MULTIPLIER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="eᵃ"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.EXPONENTIAL },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="ā"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.CONJUGATOR },
              position: { x: 0, y: 0 },
            })
          }
        />
      </div>

      <p className="text-gray-550 text-lg text-center">Composites</p>
      <div className={`flex flex-col items-center space-y-4 py-4`}>
        <Draggable
          symbol="a - b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.SUBTRACTOR },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="a ÷ b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.DIVIDER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="¹⁄ₐ"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.RECIPROCAL },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          squeeze
          symbol="1/a + 1/b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.CIRCLE_PLUS },
              position: { x: 0, y: 0 },
            })
          }
        />

        <Draggable
          symbol="aᵇ"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.EXPONENT },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="ᵃ√b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.NTH_ROOT },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="㏒ₐb"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.LOG },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          squeeze
          symbol="harmonic oscillator"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: {
                opType: BUILTIN_COMPOSITES.HARMONIC_OSCILLATOR,
              },
              position: { x: 0, y: 0 },
            })
          }
        />
      </div>

      <p className="text-gray-550 text-lg text-center">Means</p>
      <div className={`flex flex-col items-center space-y-4 py-4`}>
        <Draggable
          squeeze
          symbol="arithmetic mean"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.AVERAGE },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          squeeze
          symbol="geometric mean"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: {
                opType: BUILTIN_COMPOSITES.GEOMETRIC_MEAN,
              },
              position: { x: 0, y: 0 },
            })
          }
        />
      </div>

      <p className="text-gray-550 text-lg text-center">Trig</p>
      <div className={`flex flex-col items-center space-y-4 py-4`}>
        <Draggable
          symbol="sin(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.SIN },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="cos(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.COS },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="tan(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.TAN },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="sinh(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.SINH },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="cosh(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.COSH },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="tanh(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.TANH },
              position: { x: 0, y: 0 },
            })
          }
        />
      </div>

      <p className="text-gray-550 text-lg text-center">Solvers</p>
      <div className={`flex flex-col items-center space-y-4 py-4`}>
        <Draggable
          symbol="linear"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "composite",
              data: { opType: BUILTIN_COMPOSITES.LINEAR_SOLVER },
              position: { x: 0, y: 0 },
            })
          }
        />
      </div>

      <p className="text-gray-550 text-lg text-center">Sticky Note</p>
      <div className={`flex flex-col items-center space-y-4 py-4`}>
        <Draggable
          symbol="Aa"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "sticky",
              position: { x: 0, y: 0 },
            })
          }
        />
      </div>
    </div>
  );
};
