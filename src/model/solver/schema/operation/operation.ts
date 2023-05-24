import { genId } from "@/schema/id";
import { z } from "zod";
import { nodeOperationSchema } from "./node/node";
import { wireOperationSchema } from "./wire";

export const operationSchema = z.union([nodeOperationSchema, wireOperationSchema]);

export const genOperationId = genId(8);

export type Operation = z.infer<typeof operationSchema>;
