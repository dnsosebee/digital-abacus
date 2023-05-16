// graph structure that tracks free/bound dependency for multiple relations

import { logger as parentLogger } from "@/lib/logger";
import { genNodeId } from "@/schema/node";
import { z } from "zod";
import { Constraint, defaultEqualityConstraintBuilder, EqualityConstraint } from "./constraint";
import { Edge, serialEdgeSchema } from "./edge";
import { Serializable } from "./serializable";
import { Dep, Vertex, VertexId } from "./vertex";
const logger = parentLogger.child({ module: "RelGraph" });

// (technically this structure is a directed hypergraph, not strictly a graph)
console.log("graph.js loaded");

// DOES NOT INCLUDE VERTICES
export const serialRelGraphSchema = z.object({
  // vertices: z.array(serialVertexSchema),
  edges: z.array(serialEdgeSchema),
});

export type SerialRelGraph = z.infer<typeof serialRelGraphSchema>;

export class RelGraph<T extends Serializable, V extends Vertex<T> = Vertex<T>> {
  // :RelGraph<T>
  // eq :T -> T -> bool - notion of equality for vertex data
  // cp :T -> T -> void - function that copies data from 1st arg to 2nd arg
  //                      TODO: default for cp doesn't really make sense

  vertices: V[]; // :[Vertex<T>]
  edges: Edge<T, V>[]; // :[Edge<T>]
  buildWireConstraint: () => EqualityConstraint<T>; // :-> EqualityConstraint<T>

  constructor(
    vertices: V[] = [],
    edges: Edge<T, V>[] = [],
    eq = defaultEqualityConstraintBuilder<T>()
  ) {
    this.vertices = vertices;
    this.edges = edges;

    // internal
    this.buildWireConstraint = eq; // :-> EqualityConstraint<T>
  }

  serialize(): SerialRelGraph {
    let data: any = {};
    data["edges"] = this.edges.map(function (e) {
      return e.serialize();
    });
    return data;
  }

  // // add a set of vertices and a constraint relating them to the graph as an edge
  // // returns the edge, or null if given data do not satisfy given constraint
  // addRelated(data: T[], constraint: Constraint<T>) {
  //   // :[T] -> Constraint<T> -> Edge<T>
  //   if (constraint.accepts(data)) {
  //     // add all the needed vertices to the graph
  //     let vs = []; // :[Vertex<T>]
  //     for (let i = 0; i < data.length; i++) {
  //       vs.push(this._addFree(data[i]));
  //     }
  //     return this._addEdge(vs, constraint);
  //   } else {
  //     return null;
  //   }
  // }

  getFreeVertices() {
    // :-> [Vertex<T>]
    return this.vertices.filter(function (v) {
      return v.isFree();
    });
  }

  getBoundVertices() {
    // :-> [Vertex<T>]
    return this.vertices.filter(function (v) {
      return v.isBound();
    });
  }

  // link two free vertices to the same datum by adding an equality constraint
  // returns the new Edge, or null if unification could not be performed
  // unify(v1: V, v2: V) {
  //   // :Vertex<T> -> Vertex<T> -> Edge<T>
  //   if (v1.isFree() && v2.isFree()) {
  //     return this._unify(v1, v2);
  //   } else {
  //     return null; // can only unify free vertices
  //   }
  // }

  // // remove the most recently created unification involving vertex v
  // // returns true if disunification successful, false if not
  // // WARNING: repeated unification & disunification creates a small memory leak
  // disunify(v: V) {
  //   // :Vertex<T> -> bool
  //   return this._disunify(v);
  // }

  // returns a list of vertices that should be able to invert with the given bound vertex
  getDepends(v: V) {
    // :Vertex<T> -> [Vertex<T>]
    return this._leafDeps(v).map((p) => this._getVertex(p.vertex));
  }

  // attempt to gain control of a vertex by giving up control of another vertex
  // returns true if successful
  invert(take: V, give: V) {
    // :Vertex<T> -> Vertex<T> -> bool
    // if vertex to take is already free, nothing to do
    if (take.isFree()) {
      logger.debug("invert: vertex to take is already free");
      return true;
    }
    // can't give up control of an already-bound vertex
    if (give.isBound()) {
      logger.debug("invert: vertex to give is already bound");
      return false;
    }

    return this._invert(take, give, true);
  }

  // tell all the edges to run their constraints a given number of times
  // if given a negative argument, run until equilibrium
  // note multiple iterations are often necessary because of interdepenent contraints
  // BE CAREFUL RUNNING INDEFINITE ITERATIONS, YOU PROBABLY DON'T WANT THIS
  // IF YOUR GRAPH HAS ANY INSTABILITY OR MARGIN FOR ERROR
  update(iters = 1) {
    logger.debug({ millis: Date.now() }, "update");
    // : nat -> void
    if (iters < 0) {
      let changes = true;
      while (changes) {
        changes = false;
        for (let e of this.edges) {
          let changed = e.update();
          changes = changes || changed;
        }
      }
    } else {
      for (let i = 0; i < iters; i++) {
        for (let e of this.edges) {
          e.update();
        }
      }
    }
  }

  //////////////////////
  // internal methods //
  //////////////////////

  _getEdge(id: string) {
    return this.edges.find((e) => e.id === id);
  }

  _getVertex(id: VertexId) {
    const parent = this._getEdge(id.node)!;
    return parent.vertices[id.handle];
  }

  // find free nodes in the given vertex's dependency tree
  _leafDeps(v: V, seen: VertexId[] = []) {
    // :Vertex<T> -> [index(this.vertices)]
    // -> [index(this.vertices) x index(this.edges)]
    if (seen.includes(v.id)) {
      // loop detection
      return [];
    }
    let deps: Dep[] = [];
    for (const p of v.deps) {
      const vertex = this._getVertex(p.vertex)!;
      if (vertex?.isFree()) {
        deps.push(p);
      } else {
        seen.push(v.id);
        deps = deps.concat(this._leafDeps(vertex, seen));
      }
    }
    return deps;
  }

  // find bound nodes in the given vertex's dependency tree
  _intermedDeps(v: V, seen: VertexId[] = []) {
    // :Vertex<T> -> [index(this.vertices)]
    // -> [index(this.vertices) x index(this.edges)]
    if (seen.includes(v.id)) {
      // loop detection
      return [];
    }
    let deps: Dep[] = [];
    for (const p of v.deps) {
      const vertex = this._getVertex(p.vertex)!;
      if (vertex?.isFree()) {
        continue;
      } else {
        deps.push(p);
        seen.push(v.id);
        deps = deps.concat(this._intermedDeps(vertex, seen));
      }
    }
    return deps;
  }

  _addEdge(vs: V[], constraint: Constraint<T>) {
    // :[Vertex<T>] -> Constraint<T> -> Edge<T>
    let e = new Edge(vs, constraint, genNodeId());
    return this.edges[this.edges.push(e) - 1];
  }

  _removeEdge(id: string, removeVertices = false) {
    let idx = this.edges.findIndex((e) => e.id === id);
    if (idx >= 0) {
      let e = this.edges[idx];
      e.removeDependencies();
      this.edges.splice(idx, 1);
      if (removeVertices) {
        for (let v of e.vertices) {
          const vIdx = this.vertices.findIndex((v2) => v2.id === v.id);
          if (v.isBound()) {
            logger.warn({ e, v }, "removing bound vertex");
          }
          if (vIdx >= 0) {
            this.vertices.splice(vIdx, 1);
          } else {
            throw new Error("vertex not found");
          }
        }
      }
    }
  }

  // _unify(v1: V, v2: V) {
  //   // :Vertex<T> -> Vertex<T> -> Edge<T>
  //   let e = new Edge([v1, v2], this.buildWireConstraint(), genNodeId()); // TODO: added extra parens to buildEqualityConstraint
  //   e.updateDependencies();
  //   return this.edges[this.edges.push(e) - 1];
  // }

  // _disunify(v: V) {
  //   // :Vertex<T> -> bool
  //   for (let i = 0; i < this.history.length; i++) {
  //     let idxE = this.history[i]; // :index(this.edges)
  //     let e = this.edges[idxE];
  //     if (!(e.constraint instanceof EqualityConstraint)) {
  //       continue;
  //     }

  //     // since we know e has an EqualityConstraint, pos can only be -1, 0, or 1
  //     let pos = e.vertices.indexOf(v); // :index(e.vertices)

  //     if (pos < 0) {
  //       continue;
  //     } // not the edge we're looking for

  //     let v2 = e.vertices[1 - pos]; // :Vertex<T>

  //     // we've found the unification to remove: e relates v with v2

  //     // remove the undone unification from the history
  //     this.history.splice(i, 1);

  //     // we don't want to actually delete an edge since we're tracking stuff
  //     // based on indexing into this.edges, so we'll just replace the
  //     // equality constraint with a base constraint (this is the memory leak)
  //     this.edges[idxE].constraint = new NonConstraint(2);
  //     this.edges[idxE].updateDependencies();
  //     return true;
  //   }
  //   return false;
  // }

  _invert(take: V, give: V, recur: boolean) {
    // :Vertex<T> -> Vertex<T> -> bool -> bool
    // check argument validity
    if (take.isFree() || give.isBound()) {
      // should not get here: external method has already checked this,
      // and recursive calls should be well-behaved
      logger.warn("Tried to invert inappropriate vertices.");
      return false;
    }

    // see if a direct (single-step) dependency exists
    const idxE = take.bindingEdge(give.id); // :index(this.edges)
    const edge = idxE ? this._getEdge(idxE) : undefined;
    if (edge) {
      let e = edge;
      let idxT = e.vertices.indexOf(take); // :index(e.vertices)
      let idxG = e.vertices.indexOf(give); // :index(e.vertices)
      if (
        idxT < 0 ||
        !e.dependentAt(idxT) || // "take" should be present and bound
        idxG < 0 ||
        e.dependentAt(idxG)
      ) {
        // "give" should be present and free
        // should not get here, edge disagrees with vertex
        logger.warn("Warning: Relational graph is out of sync with itself.");
        return false;
      }

      if (e.invert(idxT, idxG)) {
        return true;
      } else {
        // should not get here; issue is probably with e.constraint
        logger.warn("Warning: Unexpected failure to perform inversion.");
        return false;
      }
    } else if (recur) {
      // try to find an intermediate vertex to invert through
      for (const p of this._intermedDeps(take)) {
        // see if this vertex can invert with the target in one step
        if (this._invert(this._getVertex(p.vertex), give, false)) {
          // success! now do the rest
          if (this._invert(take, this._getVertex(p.vertex), true)) {
            return true;
          } else {
            // recursive step failed, so undo the last step
            if (this._invert(give, this._getVertex(p.vertex), false)) {
              logger.warn("Warning: Failure during multi-step inversion.");
            } else {
              logger.warn(
                "Warning: Could not restore original state" + " after failure during inversion."
              );
            }
            return false;
          }
        } else {
          continue;
        }
      }
    }
    // no error, we just failed to find a way to invert as requested
    return false;
  }

  getAllDeps() {
    return this.vertices.map((v) => v.deps);
    // return this.vertices.map((v) => v.deps);
    // let str = "Dependencies:\n";
    // for (let i = 0; i < this.vertices.length; i++) {
    //   str = str + i + ": ";
    //   for (let j = 0; j < this.vertices[i].deps.length; j++) {
    //     str = str + "[" + JSON.stringify(this.vertices[i].deps[j]) + "]";
    //   }
    //   str = str + "\n";
    // }
    // return str;
  }

  reset() {
    this.vertices = [];
    this.edges = [];
  }
}
