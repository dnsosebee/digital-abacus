import { logger } from "@/lib/logger";
import { Graph, checkIfTarget, completeInversion, startInversion } from "@/model/solver/graph";
import { isBound } from "@/model/solver/operation/node/effectives/effective";
import { Vertex, VertexId, vertexIdEq } from "@/model/solver/operation/vertex/vertex";
import { getCurrentGraph, getVertex, useStore } from "@/model/useStore";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useDrag } from "./dragProvider";

export const NumericInput = ({
  vertex,
  id,
  wide = false,
}: {
  vertex: Vertex;
  wide?: boolean;
  id: VertexId;
}) => {
  const { beginDrag } = useDrag();
  const [pendingReal, setPendingReal] = useState(false);
  const [pendingImaginary, setPendingImaginary] = useState(false);

  const onChangeReal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || e.target.value === "-") {
      if (!pendingReal) setPendingReal(true);
    } else {
      vertex.value.x = Number(e.target.value);
      if (pendingReal) setPendingReal(false);
    }
  };
  const onChangeImaginary = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || e.target.value === "-") {
      if (!pendingImaginary) setPendingImaginary(true);
    } else {
      vertex.value.y = Number(e.target.value);
      if (pendingImaginary) setPendingImaginary(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    logger.debug({ e, id, currentGraph: getCurrentGraph() }, "handleFocus");
    getVertex(id)!.selected = true;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "handleBlur");
    getVertex(id)!.selected = false;
  };

  const roundedX = vertex.value.x < 0.000001 && vertex.value.x > -0.000001 ? 0 : vertex.value.x;
  const roundedY = vertex.value.y < 0.000001 && vertex.value.y > -0.000001 ? 0 : vertex.value.y;

  const onMousedownReal = (e: React.MouseEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "onMousedownReal");
    if (!isBound(vertex)) {
      beginDrag(id, e.clientX, vertex.value, true);
    }
  };

  const onMousedownImaginary = (e: React.MouseEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "onMousedownImaginary");
    if (!isBound(vertex)) {
      beginDrag(id, e.clientX, vertex.value, false);
    }
  };

  return (
    <div className={`p-1 flex nodrag ${vertex.selected ? "rounded-lg bg-blue-400" : ""}`}>
      {/* center the contents of the following div */}
      <div className="flex flex-col justify-center">
        <LockButton vertex={vertex} id={id} />
      </div>
      <div className="flex flex-col space-y-1">
        <div>
          <input
            type="number"
            value={pendingReal ? "" : roundedX}
            onChange={onChangeReal}
            readOnly={isBound(vertex)}
            className={`${
              wide ? "w-28" : "w-16"
            } text-lg font-bold rounded-lg px-1 border border-slate-300`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={onMousedownReal}
          />
          <span className="ml-1 font-extrabold">+</span>
        </div>
        <div>
          <input
            type="number"
            value={pendingImaginary ? "" : roundedY}
            onChange={onChangeImaginary}
            readOnly={isBound(vertex)}
            className={`${
              wide ? "w-28" : "w-16"
            } text-lg font-bold rounded-lg px-1 border border-slate-300`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={onMousedownImaginary}
          />
          <span className="ml-1 font-extrabold italic">i</span>
        </div>
      </div>
    </div>
  );
};

/**
 * If the vertex is bound, show a lock icon and make it clickable. Otherwise show an open lock icon and make it unclickable.
 */
const LockButton = ({ vertex, id }: { vertex: Vertex; id: VertexId }) => {
  const { current } = useStore();
  const { inversionState } = current;
  const { inverting } = inversionState;

  const bound = isBound(vertex);
  const isClickable = bound ? !inverting : inverting && checkIfTarget(current as Graph, id);
  // mainGraph.getDepends(focus as CoordVertex).find((v) => vertexIdEq(v.id, vertex.id));

  // if not bound, make the lock glow overtly
  const clickableClasses = `bg-slate-300 hover:bg-slate-400 ${
    bound ? "" : "ring-offset-2 ring-4 ring-yellow-400"
  }`;
  const Icon = bound ? LockClosedIcon : LockOpenIcon;

  const handleStartInversion = () => {
    startInversion(getCurrentGraph(), id);
  };

  const handleCompleteInversion = () => {
    completeInversion(getCurrentGraph(), id);
  };

  const isFocus = inverting && vertexIdEq(inversionState.focus, id);

  return (
    <button
      className={`rounded-full p-1 m-1 ${isClickable ? clickableClasses : ""} ${
        isFocus ? "bg-red-400" : ""
      }`}
      disabled={!isClickable}
      onClick={bound ? handleStartInversion : handleCompleteInversion}
    >
      <Icon className="w-6 h-6 text-slate-800" />
    </button>
  );
};
