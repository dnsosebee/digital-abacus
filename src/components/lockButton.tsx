import { CoordVertex } from "@/model/coords/coordVertex";
import { vertexIdEq } from "@/model/graph/vertex";
import { mainGraph, useMainGraph } from "@/model/store";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";

/**
 * If the vertex is bound, show a lock icon and make it clickable. Otherwise show an open lock icon and make it unclickable.
 */
export const LockButton = ({ vertex }: { vertex: CoordVertex }) => {
  const { focus } = useMainGraph();
  const reversing = !!focus;

  const isBound = vertex.isBound();
  const isClickable = isBound
    ? !reversing
    : reversing &&
      mainGraph.getDepends(focus as CoordVertex).find((v) => vertexIdEq(v.id, vertex.id));

  if (reversing) {
    // logger.debug({ depends: mainGraph.getDepends(focus as CoordVertex) }, "LockButton");
  } else {
    // logger.debug("LockButton not reversing");
  }

  // if not bound, make the lock glow overtly
  const clickableClasses = `hover:bg-gray-200 border-2 ${
    isBound ? "" : "ring-8 ring-yellow-400 ring-offset-8 ring-offset-slate-700 ring-opacity-50 z-10"
  }`;

  const unClickableClasses = "text-slate-500 border-2 border-slate-700";

  const Icon = isBound ? LockClosedIcon : LockOpenIcon;

  const handleStartReversal = () => {
    // logger.debug({ focus: focus }, "handleStartReversal");
    mainGraph.startReversal(vertex.id);
  };

  const handleCompleteReversal = () => {
    // logger.debug({ focus: focus }, "handleCompleteReversal");
    mainGraph.completeReversal(vertex.id);
  };

  return (
    <button
      className={`rounded-full mr-2  p-1 ${isClickable ? clickableClasses : unClickableClasses} ${
        reversing && vertexIdEq(focus.id, vertex.id) ? "bg-red-400" : ""
      }`}
      disabled={!isClickable}
      onClick={isBound ? handleStartReversal : handleCompleteReversal}
    >
      <div className="w-4 h-4">
        <Icon className="w-4 h-4" />
      </div>
    </button>
  );
};
