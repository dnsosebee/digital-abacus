import { z } from "zod";
import { adderSchema } from "./adder";
import { conjugatorSchema } from "./conjugator";
import { exponentialSchema } from "./exponential";
import { multiplierSchema } from "./multiplier";
import { standaloneSchema } from "./standalone";

export const primitiveOperationSchema = z.union([
  adderSchema,
  multiplierSchema,
  exponentialSchema,
  conjugatorSchema,
  standaloneSchema,
]);

export type PrimitiveOperation = z.infer<typeof primitiveOperationSchema>;
