import { logger } from "@/lib/logger";
import { Coord } from "@/model/coords/coord/coord";
import { CoordVertex } from "@/model/coords/coordVertex";
import { updateCoord } from "@/model/store";

export const NumericInput = ({ vertex }: { vertex: CoordVertex }) => {
  const onChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.debug({ e }, "onChangeX");
    updateCoord(vertex.id, new Coord(Number(e.target.value), vertex.value.y));
  };
  const onChangeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.debug({ e }, "onChangeY");
    updateCoord(vertex.id, new Coord(vertex.value.x, Number(e.target.value)));
  };

  return (
    <div className="nodrag flex flex-col space-y-1 rounded-xl">
      <div>
        <input
          type="number"
          value={vertex.value.x}
          onChange={onChangeX}
          readOnly={vertex.isBound()}
          className="w-16 text-lg font-bold rounded-lg px-1 border border-slate-300"
        />
        <span className="ml-1 font-extrabold">+</span>
      </div>
      <div>
        <input
          type="number"
          value={vertex.value.y}
          onChange={onChangeY}
          readOnly={vertex.isBound()}
          className="w-16 text-lg font-bold rounded-lg px-1 border border-slate-300"
        />
        <span className="ml-1 font-extrabold italic">i</span>
      </div>
    </div>
  );
};
