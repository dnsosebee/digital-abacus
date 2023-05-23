import { z } from "zod";
import { Coord } from "../../vertex/coord";
import { vertexSchema } from "../../vertex/vertex";
import { baseNodeOperationSchema, genBaseNodeOperation } from "../baseNode";

export const baseEffectiveNodeOperationSchema = baseNodeOperationSchema.extend({
  isEffective: z.literal(true),
  exposedVertices: z.array(vertexSchema),
  hideLinkages: z.boolean(),
});

export type BaseEffectiveNodeOperation = z.infer<typeof baseEffectiveNodeOperationSchema>;

export const genBaseEffectiveNodeOperation = (position: Coord): BaseEffectiveNodeOperation => ({
  ...genBaseNodeOperation(position),
  isEffective: true,
  exposedVertices: [],
  hideLinkages: false,
});
