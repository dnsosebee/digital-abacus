import { z } from "zod";
import { INITIAL_GRAPH, graphSchema } from "./graph";

const globalSettingsSchema = z.object({
  showDifferentials: z.boolean(),
  showLinkages: z.boolean(),
  showComplex: z.boolean(),
});

export const storeSchema = z.object({
  graphs: z.array(graphSchema),
  currentGraphIndex: z.number(),
  globalSettings: globalSettingsSchema,
});

export type Store = z.infer<typeof storeSchema>;

export const INITIAL_STORE: Store = {
  graphs: [INITIAL_GRAPH],
  currentGraphIndex: 0,
  globalSettings: {
    showDifferentials: false,
    showLinkages: true,
    showComplex: true,
  },
};

export const resetGraph = (store: Store) => {
  store.graphs[store.currentGraphIndex] = INITIAL_GRAPH;
};
