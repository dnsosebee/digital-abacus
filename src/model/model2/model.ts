import z from "zod";

export const vertexSchema = z.object({
  value: z.object({
    x: z.number(),
    y: z.number(),
  }),
  differential: z.object({
    x: z.number(),
    y: z.number(),
  }),
  selected: z.boolean(),
});

export const Operation = z.intersection(
  z.object({
    interface: z.array(vertexSchema),
    selected: z.boolean(),
  }),
  z.union([
    z.object({
      primitive: z.literal(true),
      opType: z.string(),
      boundVertex: z.number(),
    }),
    z.object({
      primitive: z.literal(false),
      boundVertices: z.array(z.number()),
      implementation: z.any(),
    }),
  ])
);
