import React from "react";
import { Symbol } from "./symbol";

export const Draggable = ({
  onDragStart,
  symbol,
  squeeze = false,
}: {
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  symbol: string;
  squeeze?: boolean;
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
      <Symbol squeeze={squeeze} text={symbol} selected={hovered} />
    </div>
  );
};
