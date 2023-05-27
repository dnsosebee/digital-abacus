import { Symbol } from "./symbol";

export const Draggable = ({
  onDragStart,
  symbol,
}: {
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  symbol: string;
}) => {
  return (
    <div onDragStart={(event) => onDragStart(event)} draggable>
      <Symbol text={symbol} />
    </div>
  );
};
