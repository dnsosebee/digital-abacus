import React from "react";
import { Symbol } from "./symbol";

export const Draggable = ({
  onDragStart,
  symbol,
}: {
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  symbol: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onDragStart={(event) => onDragStart(event)}
      draggable
      className="cursor-grab"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Symbol text={symbol} selected={hovered} />
    </div>
  );
};
