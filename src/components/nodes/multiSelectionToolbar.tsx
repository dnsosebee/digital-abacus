import { canvasHeight, canvasWidth } from "@/lib/canvas";
import { NodeEdge } from "@/model/coords/edges/nodeEdge";
import { settings } from "@/model/settings";
import { p } from "@/model/setup";
import { mainGraph } from "@/model/store";
import { Math as MathNode } from "@/schema/node";
import { EyeIcon, EyeSlashIcon, ViewfinderCircleIcon } from "@heroicons/react/20/solid";
import { NodeToolbar } from "reactflow";
import { Button } from "../button";

export const MultiSelectionToolbar = ({ selectedNodes }: { selectedNodes: MathNode[] }) => {
  const selectedNodeIds = selectedNodes.map((node) => node.id);
  const isVisible = selectedNodeIds.length > 0;

  const hidden = selectedNodes.every((node) => node.data.edge.hidden);
  const toggleHidden = () => {
    selectedNodes.forEach((node) => {
      const edge = mainGraph._getEdge(node.id) as NodeEdge;
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

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible} className="select-none">
      <div className="m-2 flex flex-row bg-slate-900 border-2 border-slate-500 select-none">
        <Button onClick={toggleHidden} className="hover:bg-slate-700 p-1">
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
        </Button>
        <div className="border-l-2 border-slate-500" />
        <Button onClick={centerLinkages} className="hover:bg-slate-700 p-1">
          <ViewfinderCircleIcon className="w-5 h-5" />
        </Button>
      </div>
    </NodeToolbar>
  );
};
