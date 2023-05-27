import { Coord } from "@/model/coords/coord/coord";
import { CoordVertex } from "@/model/coords/coordVertex";
import { vertexIdEq } from "@/model/graph/vertex";
import { mainGraph, updateCoord, useMainGraph } from "@/model/store";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useDrag } from "./dragProvider";

export const NumericInput = ({ vertex, wide = false }: { vertex: CoordVertex; wide?: boolean }) => {
  const { beginDrag } = useDrag();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "handleFocus");
    mainGraph.setVertexSelectedness(vertex.id, true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "handleBlur");
    mainGraph.setVertexSelectedness(vertex.id, false);
  };

  const onMousedownReal = (e: React.MouseEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "onMousedownReal");
    if (!vertex.isBound()) {
      beginDrag(vertex.id, e.clientX, vertex.value.copy(), true);
    }
  };

  const onMousedownImaginary = (e: React.MouseEvent<HTMLInputElement>) => {
    // logger.debug({ e }, "onMousedownImaginary");
    if (!vertex.isBound()) {
      beginDrag(vertex.id, e.clientX, vertex.value.copy(), false);
    }
  };

  return (
    <div className={`p-1 flex nodrag ${vertex.selected ? "rounded-lg bg-blue-400" : ""}`}>
      {/* center the contents of the following div */}
      <div className="flex flex-col justify-center">
        <LockButton vertex={vertex} />
      </div>
      <div className="flex flex-col space-y-1">
        <div>
          <PureSingleNumericInput
            value={vertex.value.x}
            onChange={(value) => updateCoord(vertex.id, new Coord(value, vertex.value.y))}
            wide={wide}
            readonly={vertex.isBound()}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onMouseDown={onMousedownReal}
          />
          <span className="ml-1 font-extrabold">+</span>
        </div>
        <div>
          <PureSingleNumericInput
            value={vertex.value.y}
            onChange={(value) => updateCoord(vertex.id, new Coord(vertex.value.x, value))}
            wide={wide}
            readonly={vertex.isBound()}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onMouseDown={onMousedownImaginary}
          />
          <span className="ml-1 font-extrabold italic">i</span>
        </div>
      </div>
    </div>
  );
};

export const PureSingleNumericInput = ({
  value,
  onChange,
  wide = false,
  readonly = false,
  onBlur = () => {},
  onFocus = () => {},
  onMouseDown = () => {},
}: {
  value: number;
  onChange: (value: number) => void;
  wide?: boolean;
  readonly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
}) => {
  const [pending, setPending] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  // const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.value === "" || e.target.value === "-") {
  //     if (!pending) setPending(true);
  //   } else {
  //     onChange(Number(e.target.value));
  //     if (pending) setPending(false);
  //   }
  // };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || e.target.value === "-") {
      if (!pending) setPending(true);
    } else {
      onChange(Number(e.target.value));
      setInternalValue(Number(e.target.value));
      if (pending) setPending(false);
    }
  };

  const rounded = internalValue < 0.000001 && internalValue > -0.000001 ? 0 : internalValue;

  return (
    <input
      type="number"
      value={pending ? "" : rounded}
      onChange={onChangeValue}
      readOnly={readonly}
      className={`${wide ? "w-28" : "w-16"} rounded px-0.5 bg-slate-900 border-2 border-slate-600`}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
    />
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
  const clickableClasses = `bg-slate-900 hover:bg-slate-500 border-2 border-slate-500 p-2 ${
    isBound ? "" : "ring-offset-2 ring-4 ring-yellow-400"
  }`;

  const unClickableClasses = "text-gray-500";

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
      className={`rounded-full p-1 m-1 ${isClickable ? clickableClasses : unClickableClasses} ${
        reversing && vertexIdEq(focus.id, vertex.id) ? "bg-red-400" : ""
      }`}
      disabled={!isClickable}
      onClick={isBound ? handleStartReversal : handleCompleteReversal}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};
