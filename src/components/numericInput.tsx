import { Coord } from "@/model/coords/coord/coord";
import { CoordVertex } from "@/model/coords/coordVertex";
import { vertexIdEq } from "@/model/graph/vertex";
import { settings } from "@/model/settings";
import { mainGraph, updateCoord, useMainGraph } from "@/model/store";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { useDrag } from "./dragProvider";

export const NumericInput = ({ vertex, wide = false }: { vertex: CoordVertex; wide?: boolean }) => {
  const { beginDrag } = useDrag();
  const { showComplex } = useSnapshot(settings);

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
    <div
      className={`p-1 flex items-center nodrag ${vertex.selected ? "rounded-lg bg-blue-500" : ""}`}
    >
      {/* center the contents of the following div */}
      <div className="flex flex-col justify-center">
        <LockButton vertex={vertex} />
      </div>
      <div className="flex flex-col space-y-0.5 items-center">
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
          {/* if not then blank char */}
          {showComplex ? (
            <span className="ml-1 font-extrabold">+</span>
          ) : (
            <span className="ml-1 font-extrabold">&nbsp;</span>
          )}
        </div>
        {showComplex && (
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
        )}
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
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  wide?: boolean;
  readonly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  const [pending, setPending] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

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
      className={`${
        wide ? "w-28" : "w-16"
      } rounded-lg px-0.5 bg-slate-900 border-2 border-slate-500 ${className}`}
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
  const clickableClasses = `bg-slate-900 hover:bg-slate-500 border-2 border-slate-500 ${
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
      className={`rounded-full mr-2  p-2 ${isClickable ? clickableClasses : unClickableClasses} ${
        reversing && vertexIdEq(focus.id, vertex.id) ? "bg-red-400" : ""
      }`}
      disabled={!isClickable}
      onClick={isBound ? handleStartReversal : handleCompleteReversal}
    >
      <div className="w-5 h-5">
        <Icon className="w-5 h-5" />
      </div>
    </button>
  );
};
