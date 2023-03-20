import { proxy } from "valtio";
import { LinkageGraph } from "./linkages/linkagegraph";
import { UPDATE_MODE } from "./settings";

export let mainGraph = proxy(new LinkageGraph(UPDATE_MODE)); // would be better if const

export const resetGraph = () => {
  mainGraph = proxy(new LinkageGraph(UPDATE_MODE));
};
