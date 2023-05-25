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
    const updaters = CompositeOperation.buildUpdaters(graph, interfaceVertexIds);
    const eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    const cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      return zOld.copy().mut_sendTo(zNew);
    };
    const check = (d: Coord[]) => true; // WARNING: MAYBE WRONG
    super(updaters, eq, cp, check);
    this.graph = graph;
    this.interfaceVertexIds = interfaceVertexIds;
  }

  static buildUpdaters(
    graph: CoordGraph,
    interfaceVertexIds: VertexId[]
  ): ((data: DifferentialCoord[]) => DifferentialCoord)[] {
    return interfaceVertexIds.map((vertexId) => (data: DifferentialCoord[]) => {
      data.forEach((d, i) => {
        const interfaceVertexId = interfaceVertexIds[i];
        const interfaceVertex = graph._getVertex(interfaceVertexId);
        interfaceVertex.value.mut_sendTo(d);
      });

      graph.update(1);

      return graph._getVertex(vertexId).value;
    });
  }

  serialize(): SerialCompositeOperation {
    return {
      primitive: false,
      bound: this.bound,
      interfaceVertexIds: this.interfaceVertexIds,
      subgraph: this.graph.serialize(),
    };
  }
}
