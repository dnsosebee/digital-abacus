import { logger } from "@/lib/logger";
import { Coord } from "./coords/coord/coord";
import { DifferentialCoord } from "./coords/coord/differentialCoord";
import { CoordGraph } from "./coords/coordGraph";
import { CoordVertex, SerialCoordVertex } from "./coords/coordVertex";
import { NodeEdge, SerialNodeEdge } from "./coords/edges/nodeEdge";
import { SerialWireEdge, WireEdge } from "./coords/edges/wireEdge";
import { vertexIdEq } from "./graph/vertex";
import { SerialCoordGraph } from "./serialSchemas/serialCoordGraph";

export const deserializeGraph = (data: SerialCoordGraph): CoordGraph => {
  const equalityConstraintBuilder = CoordGraph.getEqualityConstraintBuilder(data.mode);
  const nodes: SerialNodeEdge[] = [];
  const wires: SerialWireEdge[] = [];
  data.edges.forEach((e) => {
    if (e.hasOwnProperty("source")) {
      wires.push(e as SerialWireEdge);
    } else {
      nodes.push(e as SerialNodeEdge);
    }
  });

  const vertices: CoordVertex[] = [];
  logger.debug("mode", data.mode);

  const nodeEdges = nodes.map((e: SerialNodeEdge) => {
    const nodeEdge = new NodeEdge(
      e.vertices.map((v: SerialCoordVertex) => {
        const vertex = new CoordVertex(
          new DifferentialCoord(v.value.x, v.value.y, new Coord(v.value.delta.x, v.value.delta.y)),
          v.id,
          v.dragging,
          v.hidden,
          v.selected
        );
        vertices.push(vertex);
        return vertex;
      }),
      e.operator,
      data.mode,
      e.id,
      e.position,
      e.hidden ?? false,
      e.selected ?? false,
      e.label ?? undefined
    );
    return nodeEdge;
  });

  const wireEdges = wires.map((e) => {
    return new WireEdge(
      e.vertices.map((v) => {
        const vertex = vertices.find((v2) => vertexIdEq(v2.id, v.id));
        if (vertex == null) {
          throw new Error("Vertex not found");
        }
        return vertex;
      }),
      e.id,
      e.source,
      e.target,
      equalityConstraintBuilder(),
      e.selected ?? false
    );
  });

  wireEdges.forEach((e) => {
    e.updateDependencies();
  });

  return new CoordGraph(
    data.mode,
    data.focus ? vertices.find((v) => v.id == data.focus) ?? undefined : undefined,
    [...nodeEdges, ...wireEdges],
    vertices
  );
};
