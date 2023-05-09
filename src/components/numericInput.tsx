import { Coord } from "@/model/coords/coord/coord";
import { CoordVertex } from "@/model/coords/coordVertex";
import { vertexIdEq } from "@/model/graph/vertex";
import { mainGraph, updateCoord, useMainGraph } from "@/model/store";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";

export const NumericInput = ({ vertex, wide = false }: { vertex: CoordVertex; wide?: boolean }) => {
  const onChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "onChangeX");
    updateCoord(vertex.id, new Coord(Number(e.target.value), vertex.value.y));
  };
  const onChangeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "onChangeY");
    updateCoord(vertex.id, new Coord(vertex.value.x, Number(e.target.value)));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "handleFocus");
    mainGraph.setVertexSelectedness(vertex.id, true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "handleBlur");
    mainGraph.setVertexSelectedness(vertex.id, false);
  };

  const roundedX = vertex.value.x < 0.000001 && vertex.value.x > -0.000001 ? 0 : vertex.value.x;
  const roundedY = vertex.value.y < 0.000001 && vertex.value.y > -0.000001 ? 0 : vertex.value.y;

  return (
    <div className={`p-1 flex nodrag ${vertex.selected ? "rounded-lg bg-blue-400" : ""}`}>
      {/* center the contents of the following div */}
      <div className="flex flex-col justify-center">
        <LockButton vertex={vertex} />
      </div>
      <div className="flex flex-col space-y-1">
        <div>
          <input
            type="number"
            value={roundedX}
            onChange={onChangeX}
            readOnly={vertex.isBound()}
            className={`${
              wide ? "w-28" : "w-16"
            } text-lg font-bold rounded-lg px-1 border border-slate-300`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span className="ml-1 font-extrabold">+</span>
        </div>
        <div>
          <input
            type="number"
            value={roundedY}
            onChange={onChangeY}
            readOnly={vertex.isBound()}
            className={`${
              wide ? "w-28" : "w-16"
            } text-lg font-bold rounded-lg px-1 border border-slate-300`}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
const LockButton = ({ vertex }: { vertex: CoordVertex }) => {
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
  const clickableClasses = `bg-slate-300 hover:bg-slate-400 ${
    isBound ? "" : "ring-offset-2 ring-4 ring-yellow-400"
  }`;
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
      className={`rounded-full p-1 m-1 ${isClickable ? clickableClasses : ""} ${
        reversing && vertexIdEq(focus.id, vertex.id) ? "bg-red-400" : ""
      }`}
      disabled={!isClickable}
      onClick={isBound ? handleStartReversal : handleCompleteReversal}
    >
      <Icon className="w-6 h-6 text-slate-800" />
    </button>
  );
};
