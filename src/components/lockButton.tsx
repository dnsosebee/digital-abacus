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

  const isReversalFocus = reversing && vertexIdEq(focus.id, vertex.id);
  const isReversalTarget =
    reversing &&
    mainGraph.getDepends(focus as CoordVertex).find((v) => vertexIdEq(v.id, vertex.id));

  const Icon = isBound ? LockClosedIcon : LockOpenIcon;

  const handleStartReversal = () => {
    mainGraph.startReversal(vertex.id);
  };

  const handleCompleteReversal = () => {
    mainGraph.completeReversal(vertex.id);
  };

  const handleCancelReversal = () => {
    mainGraph.cancelReversal();
  };

  const handleClick = () => {
    if (reversing) {
      if (isReversalTarget) {
        handleCompleteReversal();
      } else if (isReversalFocus) {
        handleCancelReversal();
      }
    } else {
      handleStartReversal();
    }
  };

  return (
    <div>
      <button
        className={` mr-2 btn btn-sm btn-circle btn-outline ${
          isReversalTarget && "ring-8 ring-yellow-400 ring-opacity-50 z-10"
        } ${isReversalFocus && "btn-error ring-8 ring-red-400 ring-opacity-50 z-10"}`}
        disabled={reversing ? !isReversalFocus && !isReversalTarget : !isBound}
        onClick={handleClick}
      >
        <Icon className="w-4 h-4" />
      </button>
    </div>
  );
};
