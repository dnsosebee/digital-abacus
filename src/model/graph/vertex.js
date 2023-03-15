class Vertex {
  // :Vertex<T>
  constructor(datum, id, deps) {
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
  bindingEdge(v) {
    // :Vertex<T> -> index(graph.edges)
    for (const p of this.deps) {
      if (p[0] == v.id) {
        return p[1];
      }
    }
    return -1;
  }
}
