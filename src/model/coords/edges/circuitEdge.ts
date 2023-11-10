import { vertexIdEq } from "@/model/graph/vertex";
import { z } from "zod";
import { Constraint } from "../../graph/constraint";
import { Edge, SerialEdge, serialEdgeSchema } from "../../graph/edge";
import { DifferentialCoord } from "../coord/differentialCoord";
import { CoordVertex, SerialCoordVertex, serialCoordVertexSchema } from "../coordVertex";
import { CompositeOperation } from "../operations/composites/compositeOperation";

export const serialCircuitEdgeSchema = serialEdgeSchema.extend({
  vertices: z.array(serialCoordVertexSchema),
  selected: z.boolean(),
});

export type SerialCircuitEdge = z.infer<typeof serialCircuitEdgeSchema>;

export class CircuitEdge extends Edge<DifferentialCoord, CoordVertex> {
  selected: boolean;
  // parent: NodeEdge | null;

  constructor(
    v: CoordVertex[],
    c: Constraint<DifferentialCoord>,
    id: string,
    selected = false
    // parent = null
  ) {
    super(v, c, id);
    this.selected = selected;
    // this.parent = parent;
  }

  serialize(): SerialCircuitEdge {
    const serialized = super.serialize() as SerialEdge & { vertices: SerialCoordVertex[] };
    return { ...serialized, selected: this.selected };
  }

  updateDependencies() {
    // :-> void
    this.removeDependencies();
    let eid = this.id;

    if (this.constraint instanceof CompositeOperation) {
      const { graph, interfaceVertexIds } = this.constraint;
      for (let boundVertex of this.getBoundVertices()) {
        const internalVertexId = interfaceVertexIds[boundVertex.id.handle];
        const internalVertex = graph._getVertex(internalVertexId);
        const internalDependentVertices = graph.getDepends(internalVertex);
        const internalInterfaceDependentVertices = internalDependentVertices
          .filter((v) => interfaceVertexIds.some((id) => vertexIdEq(id, v.id)))
        const externalDependencies = internalInterfaceDependentVertices
          .map((v) => ({
            edge: eid,
            vertex: { node: eid, handle: interfaceVertexIds.indexOf(interfaceVertexIds.find((id) => vertexIdEq(id, v.id))!) },
          }));
        boundVertex.deps = boundVertex.deps.concat(externalDependencies.slice());
      }
    } else {
      // TODO: WARNING: big hack! Setting a dependency on every vertex, including itself! Even though it's kinda redundant to say you depend on yourself, though technically not false? Why this is here: this allows constant composite operator/edges to have their vertex be perceived as bound.
      let free = this.vertices.map(function (v) {
        return {
          vertex: v.id,
          edge: eid,
        };
      });
      // logger.debug({ free }, "free vertices");
      for (let v of this.getBoundVertices()) {
        v.deps = v.deps.concat(free.slice());
        // logger.debug({ deps: v.deps }, "bound vertex deps");
      }
    }
  }
}
