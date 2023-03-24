export type VertexId = { node: string; handle: number };

export function vertexIdEq(v1: VertexId, v2: VertexId) {
  return v1.node == v2.node && v1.handle == v2.handle;
}

export type Dep = { vertex: VertexId; edge: string };

export class Vertex<T> {
  // :Vertex<T>

  value: T; // :T
  id: VertexId; // :index(graph.vertices)
  deps: Dep[]; // :[index(graph.vertices) x index(graph.edges)]
  constructor(datum: T, id: VertexId, deps: Dep[] = []) {
    this.value = datum; // :T
    this.id = id; // :index(graph.vertices)
    this.deps = deps; // :[index(graph.vertices) x index(graph.edges)]
  }

  isFree() {
    return this.deps.length == 0;
  }
  isBound() {
    return this.deps.length > 0;
  }

  // get index of the edge that captures this vertex's dependency on the given vertex
  // (i.e. return the edge index paired with v.id in this.deps)
  // returns -1 if this vertex is not dependent on the given vertex
  bindingEdge(v: VertexId) {
    // :Vertex<T> -> index(graph.edges)
    const dep = this.deps.find((d) => vertexIdEq(d.vertex, v));
    return dep ? dep.edge : undefined;
  }
}
