import { canvasHeight, canvasWidth } from "@/lib/canvas";
import { NodeEdge } from "@/model/coords/edges/nodeEdge";
import { settings } from "@/model/settings";
import { p } from "@/model/setup";
import {
  beginEditingComposite,
  cancelEncapsulation,
  commitEncapsulation,
  mainGraph,
  startEncapsulation,
  useMainGraph,
} from "@/model/store";
import { Math as MathNode } from "@/schema/node";
import {
  ArrowsPointingInIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  ViewfinderCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { NodeToolbar } from "reactflow";

export const MultiSelectionToolbar = ({ selectedNodes }: { selectedNodes: MathNode[] }) => {
  const { encapsulationInterface, encapsulatedNodes } = useMainGraph();

  const encapsulating = encapsulationInterface !== null;
  const selectedNodeIds = selectedNodes.map((node) => node.id);
  const isVisible = encapsulating ? true : selectedNodeIds.length > 0;

  const hidden = selectedNodes.every((node) => node.data.edge.hidden);
  const toggleHidden = () => {
    selectedNodes.forEach((node) => {
      const edge = mainGraph()._getEdge(node.id) as NodeEdge;
      edge.setHidden(!hidden);
    });
  };

  const centerLinkages = async () => {
    const boundingBox = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };

    const w = canvasWidth(p!.windowWidth);
    const h = canvasHeight(p!.windowHeight);

    const numVertices = selectedNodes.reduce((acc, node) => acc + node.data.vertices.length, 0);

    selectedNodes.forEach((node) => {
      node.data.vertices.forEach((vertex) => {
        boundingBox.minX = Math.min(boundingBox.minX, vertex.value.x);
        boundingBox.maxX = Math.max(boundingBox.maxX, vertex.value.x);
        boundingBox.minY = Math.min(boundingBox.minY, vertex.value.y);
        boundingBox.maxY = Math.max(boundingBox.maxY, vertex.value.y);
      });
    });
    const xScale = w / (boundingBox.maxX - boundingBox.minX);
    const yScale = h / (boundingBox.maxY - boundingBox.minY);
    const scale =
      numVertices < 2 ? settings.globalScale : Math.min(1100, Math.min(xScale, yScale) * 0.8);
    const xBuffer = w - (boundingBox.maxX - boundingBox.minX) * scale;
    const yBuffer = h - (boundingBox.maxY - boundingBox.minY) * scale;

    const newCenterX = 0 - boundingBox.minX * scale + xBuffer / 2;
    const newCenterY = h + boundingBox.minY * scale - yBuffer / 2;

    const oldScale = settings.globalScale;
    const oldCenterX = settings.CENTER_X;
    const oldCenterY = settings.CENTER_Y;
    for (let i = 1; i <= 25; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      settings.CENTER_X = oldCenterX + (newCenterX - oldCenterX) * (i / 25);
      settings.CENTER_Y = oldCenterY + (newCenterY - oldCenterY) * (i / 25);
      settings.globalScale = oldScale + (scale - oldScale) * (i / 25);
    }
  };

  const nodeId = encapsulating ? (encapsulatedNodes! as string[]) : selectedNodeIds;

  return (
    <NodeToolbar nodeId={nodeId} isVisible={isVisible} offset={20} className="select-none">
      <div className="space-x-2 flex">
        {!encapsulating && (
          <div className="btn-group">
            <button onClick={toggleHidden} className="btn">
              {hidden ? (
                <>
                  {/* <p className="mr-2">linkages</p> */}
                  <EyeSlashIcon className="w-5 h-5" />
                </>
              ) : (
                <>
                  {/* <p className="mr-2">linkages</p> */}
                  <EyeIcon className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="border-l-2 border-slate-500" />
            <button onClick={centerLinkages} className="btn">
              <ViewfinderCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <EncapsulationControls
          encapsulationInterface={encapsulationInterface}
          selectedNodes={selectedNodes}
        />
      </div>
    </NodeToolbar>
  );
};

const EncapsulationControls = ({
  encapsulationInterface,
  selectedNodes,
}: {
  encapsulationInterface:
    | readonly {
        readonly node: string;
        readonly handle: number;
      }[]
    | null;
  selectedNodes: MathNode[];
}) => {
  const encapsulating = encapsulationInterface !== null;

  const editable = selectedNodes.length === 1 && selectedNodes[0].data.opType === "composite";

  const endEncapsulation = () => {
    const label = prompt("Enter a label for the encapsulated node", "Encapsulated Node");
    if (!label) return;
    commitEncapsulation(label);
  };

  const edit = () => {
    beginEditingComposite(selectedNodes[0].id);
  };

  return (
    <div className="btn-group">
      {encapsulating ? (
        <>
          <button onClick={cancelEncapsulation} className="btn btn-error">
            <XCircleIcon className="w-5 h-5" />
          </button>
          <div className="border-l-2 border-slate-500" />
          {encapsulationInterface.length > 0 ? (
            <button onClick={endEncapsulation} className="btn btn-success">
              <CheckCircleIcon className="w-5 h-5" />
            </button>
          ) : (
            <button className="btn btn-default btn-active" disabled>
              <CheckCircleIcon className="w-5 h-5" />
            </button>
          )}
        </>
      ) : (
        <>
          <button onClick={startEncapsulation} className="btn">
            <ArrowsPointingInIcon className="w-5 h-5" />
          </button>
          {editable && (
            <>
              <div className="border-l-2 border-slate-500" />

              <button className="btn" onClick={edit}>
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};
