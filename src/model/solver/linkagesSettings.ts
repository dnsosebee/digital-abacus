import { z } from "zod";
import { coordSchema } from "./operation/vertex/coord";
import { vertexIdSchema } from "./operation/vertex/vertex";

export const linkagesSettingsSchema = z.object({
  dragData: z.union([
    z.object({
      dragging: z.literal(false),
    }),
    z.object({
      dragging: z.literal(true),
      panning: z.literal(false),
      activeVertexId: vertexIdSchema,
    }),
    z.object({
      dragging: z.literal(true),
      panning: z.literal(true),
      panStart: coordSchema,
      originalCenter: coordSchema,
    }),
  ]),
  centerX: z.number(),
  centerY: z.number(),
  scale: z.number(),
});
