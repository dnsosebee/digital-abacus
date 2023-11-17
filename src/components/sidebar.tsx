import { OP_TYPE, SerialNodeEdge } from "@/model/coords/edges/nodeEdge";
import { BUILTIN_COMPOSITES } from "@/model/coords/operations/composites/compositeOperation";
import { userDefinedComposites } from "@/model/store";
import { AddNode } from "@/schema/node";
import { ArrowDownTrayIcon, ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useSnapshot } from "valtio";
import { Draggable } from "./draggable";
import { saveTemplate } from "./navbar";

export const Sidebar = () => {
  return (
    <div className="flex flex-col items-center bg-gray-800">
      <ComponentSidebar />
    </div>
  );
};

const ComponentSidebar = () => {
  const userDefinedSnapshot = useSnapshot(userDefinedComposites);

  const onDragStart = (event: React.DragEvent<HTMLElement>, addNode: AddNode) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(addNode));
    event.dataTransfer.effectAllowed = "move";
  };

  const deleteHandler = (index: number) => {
    const newComponents = [...userDefinedComposites];
    newComponents.splice(index, 1);
    userDefinedComposites.splice(0, userDefinedComposites.length, ...newComponents);
  }

  const saveHandler = async (composite: SerialNodeEdge) => {
    const json = { node: composite, schemaVersion: 1 };
    console.log(json);
    try {
      const newHandle = await (window as any).showSaveFilePicker({
        suggestedName: "title.node.json",
      });
      const writableStream = await newHandle.createWritable();
      await writableStream.write(JSON.stringify(json));
      await writableStream.close();
    } catch (e) {
      console.error(e);
    }
  };

  const loadHandler = async () => {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "JSON",
            accept: {
              "application/*": [".json"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });

      // get file contents
      const fileData = await fileHandle.getFile();
      const stringData = await fileData.text();
      const json = JSON.parse(stringData);
      saveTemplate(json["node"]);
    } catch (e) {
      console.error(e);
    }
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
                type: "built in composite",
                data: { opType: BUILTIN_COMPOSITES.PI },
                position: { x: 0, y: 0 },
              })
            }
          />
          <Draggable
            symbol="e"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "built in composite",
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
                type: "built in composite",
                data: { opType: BUILTIN_COMPOSITES.I },
                position: { x: 0, y: 0 },
              })
            }
          />
          <Draggable
            symbol="φ"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "built in composite",
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
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.SUBTRACTOR },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="a ÷ b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.DIVIDER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="¹⁄ₐ"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
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
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.CIRCLE_PLUS },
              position: { x: 0, y: 0 },
            })
          }
        />

        <Draggable
          symbol="aᵇ"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.EXPONENT },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="ᵃ√b"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.NTH_ROOT },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="㏒ₐb"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.LOG },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          squeeze
          symbol="linear equation solver"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.LINEAR_SOLVER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          squeeze
          symbol="harmonic oscillator"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: {
                opType: BUILTIN_COMPOSITES.HARMONIC_OSCILLATOR,
              },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          squeeze
          symbol="°F → °C"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: {
                opType: BUILTIN_COMPOSITES.TEMPERATURE,
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
              type: "built in composite",
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
              type: "built in composite",
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
          squeeze
          symbol="degrees → radians"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.DEGREES_TO_RADIANS },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="sin(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.SIN },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="cos(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.COS },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="tan(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.TAN },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="sinh(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.SINH },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="cosh(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.COSH },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="tanh(a)"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "built in composite",
              data: { opType: BUILTIN_COMPOSITES.TANH },
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

      <p className="text-gray-550 text-lg text-center">Your Templates</p>
      <div className={`flex flex-col items-center space-y-4 py-4 overflow-x-hidden`}>
        {userDefinedSnapshot.map((composite, idx) => (
          <div className="flex flex-col" key={composite.label}>
            <div className="flex-grow flex items-center justify-items-center overflow-x-hidden">
              <Draggable
                symbol={composite.label}
                squeeze={composite.label.length > 6}
                onDragStart={(event: React.DragEvent<HTMLElement>) =>
                  onDragStart(event, {
                    type: "user defined composite",
                    data: { serialEdge: composite as SerialNodeEdge },
                    position: { x: 0, y: 0 },
                  })
                }
              />
            </div>
            <div className="btn-group mt-2 self-center">
            <button className="btn btn-xs" onClick={() => saveHandler(composite as SerialNodeEdge)}>
              <ArrowDownTrayIcon className="w-5 h-5 inline-block text-white" />
            </button><div className="border-l-2 border-slate-500" />
            <button className="btn btn-xs" onClick={() => deleteHandler(idx)}>
              <TrashIcon className="w-5 h-5 inline-block text-red-400" />
            </button>
            </div>
          </div>
        ))}
        <button className="justify-self-stretch border border-1 border-white p-2 rounded-full hover:bg-gray-550 self-stretch" onClick={loadHandler}>
          <ArrowUpTrayIcon className="w-5 h-5 inline-block text-white" />
        </button>
      </div>
    </div>
  );
};
