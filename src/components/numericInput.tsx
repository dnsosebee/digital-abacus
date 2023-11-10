import { Coord } from "@/model/coords/coord/coord";
import { CoordGraph } from "@/model/coords/coordGraph";
import { CoordVertex } from "@/model/coords/coordVertex";
import { vertexIdEq } from "@/model/graph/vertex";
import { settings } from "@/model/settings";
import { mainGraph, updateCoord, useStore } from "@/model/store";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { useDrag } from "./dragProvider";
import { LockButton } from "./lockButton";

export const NumericInput = ({
  vertex,
  wide = false,
  alwaysBound = false,
  graph = mainGraph(),
}: {
  vertex: CoordVertex;
  wide?: boolean;
  alwaysBound?: boolean;
  graph?: CoordGraph;
}) => {
  const { showComplex, stepSize } = useSnapshot(settings);
  const { encapsulationInterface } = useStore();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    graph.setVertexSelectedness(vertex.id, true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    graph.setVertexSelectedness(vertex.id, false);
  };

  const readonly = alwaysBound || vertex.isBound();

  const encapsulating = encapsulationInterface !== null;
  const showAsSelected = encapsulating
    ? encapsulationInterface!.find((v) => vertexIdEq(v, vertex.id)) !== undefined
    : vertex.selected;

  return (
    <div
      className={`p-1 flex items-center nodrag rounded-2xl ${showAsSelected ? "bg-blue-400" : ""}`}
    >
      {/* center the contents of the following div */}
      <div className="flex flex-col justify-center">
        {!alwaysBound && <LockButton vertex={vertex} />}
      </div>
      <div className="flex flex-col space-y-0.5 items-center">
        <div className="flex">
          <PureSingleNumericInput
            value={vertex.value.x}
            onChange={(value) => updateCoord(vertex.id, new Coord(value, vertex.value.y), graph)}
            wide={wide}
            readonly={readonly}
            onBlur={handleBlur}
            onFocus={handleFocus}
            fineness={alwaysBound ? undefined : stepSize}
            dragFineness={1}
          />
          {/* if not then blank char */}
          {showComplex ? (
            <span className="ml-1 font-extrabold">+</span>
          ) : (
            <span className="ml-1 font-extrabold">&nbsp;</span>
          )}
        </div>
        {showComplex && (
          <div className="flex">
            <PureSingleNumericInput
              value={vertex.value.y}
              onChange={(value) => updateCoord(vertex.id, new Coord(vertex.value.x, value))}
              wide={wide}
              readonly={readonly}
              onBlur={handleBlur}
              onFocus={handleFocus}
              fineness={alwaysBound ? undefined : stepSize}
              dragFineness={1}
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
  fineness,
  dragFineness,
  className = "",
  min,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  dragFineness: number;
  wide?: boolean;
  readonly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  fineness?: number;
  className?: string;
  min?: number;
  max?: number;
}) => {
  const [pending, setPending] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { beginDrag, drag } = useDrag();

  useEffect(() => {
    if (dragging) {
      if (drag.dragging === false) {
        setDragging(false);
      }
    }
  }, [drag]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur(e);
  };

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const changeValue = (value: string | number) => {
    if (value === "-") {
      if (min !== undefined && min < 0) {
        if (!pending) setPending(true);
      }
      return;
    }
    if (value === "") {
      if (!pending) setPending(true);
      return;
    }
    const num = Number(value);
    if (isNaN(num) || (min !== undefined && num < min) || (max !== undefined && num > max)) {
      return;
    }
    setInternalValue(Number(value));
    onChange(Number(value));
    if (pending) setPending(false);
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    return changeValue(e.target.value);
  };

  const onMouseMove = (basis: number, delta: number) => {
    if (!dragging) setDragging(true);
    const calculatedVal = basis + (delta / 10) * dragFineness;
    const rounded = dragFineness
      ? Math.round(calculatedVal / dragFineness) * dragFineness
      : calculatedVal;
    changeValue(rounded);
  };

  const onMousedown = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!readonly) {
      beginDrag({
        dragging: true,
        initialX: e.clientX,
        currentX: e.clientX,
        basis: internalValue,
        onMouseMove,
        breakBeyond: 5,
      });
    }
  };

  const rounded = fineness
    ? parseFloat(
        (Math.round(internalValue / fineness) * fineness).toFixed(
          fineness.toString().split(".")[1]?.length
        )
      )
    : internalValue;

  return (
    <input
      type="number"
      value={pending ? "" : focused && !dragging ? internalValue : rounded}
      onChange={onChangeValue}
      readOnly={readonly}
      className={`${wide ? "w-28" : "w-16"} rounded-lg px-0.5 border border-gray-800 ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={onMousedown}
      min={min}
      max={max}
    />
  );
};
