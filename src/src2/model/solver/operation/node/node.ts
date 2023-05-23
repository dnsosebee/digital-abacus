import { z } from "zod";
import { effectiveNodeOperationSchema } from "./effectives/effective";
import { stickySchema } from "./sticky";

export const nodeOperationSchema = z.union([stickySchema, effectiveNodeOperationSchema]);

export type NodeOperation = z.infer<typeof nodeOperationSchema>;

export const handleNumToId = (idx: number) => {
  return `${idx}`;
};

export const handleIdToNum = (id: string) => parseInt(id, 10);

export type AddNode = Omit<NodeOperation, "id" | "position">;
