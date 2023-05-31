import { Coord } from "@/model/coords/coord/coord";
import { CoordVertex } from "@/model/coords/coordVertex";
import { settings } from "@/model/settings";
import { mainGraph, updateCoord } from "@/model/store";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { useDrag } from "./dragProvider";
import { LockButton } from "./lockButton";

export const NumericInput = ({ vertex, wide = false }: { vertex: CoordVertex; wide?: boolean }) => {
  const { beginDrag } = useDrag();
  const { showComplex, stepSize } = useSnapshot(settings);

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
            onMouseDown={onMousedownReal}
            fineNess={stepSize}
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
              fineNess={stepSize}
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
  fineNess,
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  wide?: boolean;
  readonly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
  fineNess?: number;
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

  const rounded = fineNess ? Math.round(internalValue / fineNess) * fineNess : internalValue;
  console.log({ rounded, internalValue, fineNess }, "rounded");

  return (
    <input
      type="number"
      value={pending ? "" : rounded}
      onChange={onChangeValue}
      readOnly={readonly}
      className={`${wide ? "w-28" : "w-16"} rounded-lg px-0.5 border border-gray-800 ${className}`}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
    />
  );
};
