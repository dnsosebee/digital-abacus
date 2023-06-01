import { Coord } from "@/model/coords/coord/coord";
import { CoordVertex } from "@/model/coords/coordVertex";
import { settings } from "@/model/settings";
import { mainGraph, updateCoord } from "@/model/store";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { useDrag } from "./dragProvider";
import { LockButton } from "./lockButton";

export const NumericInput = ({ vertex, wide = false }: { vertex: CoordVertex; wide?: boolean }) => {
  const { showComplex, stepSize } = useSnapshot(settings);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    mainGraph.setVertexSelectedness(vertex.id, true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    mainGraph.setVertexSelectedness(vertex.id, false);
  };

  return (
    <div
      className={`p-1 flex items-center nodrag rounded-2xl ${vertex.selected ? "bg-blue-400" : ""}`}
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
            fineness={stepSize}
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
          <div>
            <PureSingleNumericInput
              value={vertex.value.y}
              onChange={(value) => updateCoord(vertex.id, new Coord(vertex.value.x, value))}
              wide={wide}
              readonly={vertex.isBound()}
              onBlur={handleBlur}
              onFocus={handleFocus}
              fineness={stepSize}
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
}) => {
  const [pending, setPending] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur(e);
  };

  const { beginDrag } = useDrag();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || e.target.value === "-") {
      if (!pending) setPending(true);
    } else {
      setInternalValue(Number(e.target.value));
      onChange(Number(e.target.value));
      if (pending) setPending(false);
    }
  };

  const onMouseMove = (basis: number, delta: number) => {
    console.log({ basis, delta }, "basis, delta");
    const calculatedVal = basis + (delta / 10) * dragFineness;
    const rounded = dragFineness
      ? Math.round(calculatedVal / dragFineness) * dragFineness
      : calculatedVal;
    onChange(rounded);
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

  const rounded = fineness ? Math.round(internalValue / fineness) * fineness : internalValue;
  console.log({ rounded, internalValue, fineNess: fineness }, "rounded");

  return (
    <input
      type="number"
      value={pending ? "" : focused ? internalValue : rounded}
      onChange={onChangeValue}
      readOnly={readonly}
      className={`${wide ? "w-28" : "w-16"} rounded-lg px-0.5 border border-gray-800 ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={onMousedown}
    />
  );
};
