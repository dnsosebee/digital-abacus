import { logger } from "@/lib/logger";
import { z } from "zod";
import { OperatorConstraint } from "../../../graph/constraint";
import { VertexId, serialVertexIdSchema } from "../../../graph/vertex";
import { Coord } from "../../coord/coord";
import { DifferentialCoord } from "../../coord/differentialCoord";
import { CoordGraph } from "../../coordGraph";

export const BUILTIN_COMPOSITES = {
  SUBTRACTOR: "subtractor" as const,
  DIVIDER: "divider" as const,
  EXPONENTIATOR: "exponentiator" as const,
} as const;

export const builtinCompositeSchema = z.union([
  z.literal(BUILTIN_COMPOSITES.SUBTRACTOR),
  z.literal(BUILTIN_COMPOSITES.DIVIDER),
  z.literal(BUILTIN_COMPOSITES.EXPONENTIATOR),
]);

export type BuiltinComposite = z.infer<typeof builtinCompositeSchema>;

export const serialCompositeOperationSchema = z.object({
  primitive: z.literal(false),
  subgraph: z.any(),
  bound: z.number(),
  interfaceVertexIds: z.array(serialVertexIdSchema),
});

export type SerialCompositeOperation = z.infer<typeof serialCompositeOperationSchema>;

export class CompositeOperation extends OperatorConstraint<DifferentialCoord> {
  graph: CoordGraph;
  interfaceVertexIds: VertexId[];
  constructor(graph: CoordGraph, interfaceVertexIds: VertexId[]) {
    const eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    const cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      return zOld.copy().mut_sendTo(zNew);
    };
    const check = (d: Coord[]) => true; // WARNING: MAYBE WRONG
    const dummyUpdaters = [1, 2, 3].map((i) => (data: any) => new Coord(0, 0));
    super(dummyUpdaters, eq, cp, check);
    this.graph = graph;
    this.interfaceVertexIds = interfaceVertexIds;
  }

  update(data: DifferentialCoord[]): DifferentialCoord[] {
    data.forEach((d, i) => {
      const interfaceVertexId = this.interfaceVertexIds[i];
      const interfaceVertex = this.graph._getVertex(interfaceVertexId);
      interfaceVertex.value.mut_sendTo(d);
    });

    this.graph.update(1);

    return this.interfaceVertexIds.map((vertexId) => this.graph._getVertex(vertexId).value);
  }

  serialize(): SerialCompositeOperation {
    return {
      primitive: false,
      bound: this.bound,
      interfaceVertexIds: this.interfaceVertexIds,
      subgraph: this.graph.serialize(),
    };
  }

  invert(take: number, give: number) {
    const innerTake = this.interfaceVertexIds[take];
    const innerGive = this.interfaceVertexIds[give];
    const innerTakeVertex = this.graph._getVertex(innerTake);
    const innerGiveVertex = this.graph._getVertex(innerGive);
    if (!innerTakeVertex || !innerGiveVertex) {
      return false;
    }
    if (this.graph.invert(innerTakeVertex, innerGiveVertex)) {
      // logger.debug({ graph: JSON.parse(JSON.stringify(this.graph.edges[0])) }, "inverted");
      if (super.invert(take, give)) {
        logger.debug({ graph: JSON.parse(JSON.stringify(this.graph.edges[0])) }, "inverted");

        return true;
      }
      if (this.graph.invert(innerGiveVertex, innerTakeVertex)) {
        return false;
      }
      throw new Error("Failed to abort inversion");
    }
    return false;
  }
}
