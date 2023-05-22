import { UPDATE_MODE } from "../../../settings";
import { CoordGraph } from "../../coordGraph";

export const buildSubtractor = () => {
  const graph = new CoordGraph(UPDATE_MODE);
  const adderId = graph.addOperation("adder", { x: 0, y: 0 });
};
