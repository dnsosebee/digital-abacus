import { z } from "zod";
import { baseOperationSchema } from "./baseOperation";
import { vertexIdSchema } from "./vertex/vertex";

export const wireOperationSchema = baseOperationSchema.extend({
  isNode: z.literal(false),
  sourceVertexId: vertexIdSchema,
  targetVertexId: vertexIdSchema,
  tracked: z.boolean(),
  delayCounter: z.number(),
});

export type WireOperation = z.infer<typeof wireOperationSchema>;
