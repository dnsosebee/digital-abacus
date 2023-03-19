// graph structure that tracks free/bound dependency for multiple relations

import {
  Constraint,
  defaultEqualityConstraintBuilder,
  EqualityConstraint,
  NonConstraint,
} from "../constraint";
import { Edge } from "./edge";
import { Vertex } from "./vertex";

// (technically this structure is a directed hypergraph, not strictly a graph)
console.log("graph.js loaded");

export class RelGraph<T> {
  // :RelGraph<T>
  // eq :T -> T -> bool - notion of equality for vertex data
  // cp :T -> T -> void - function that copies data from 1st arg to 2nd arg
  //                      TODO: default for cp doesn't really make sense

  vertices: Vertex<T>[]; // :[Vertex<T>]
  edges: Edge<T>[]; // :[Edge<T>]
  buildEqualityConstraint: () => EqualityConstraint<T>; // :-> EqualityConstraint<T>
  history: number[]; // :[index(this.edges)]

  constructor(eq = defaultEqualityConstraintBuilder<T>()) {
    this.vertices = []; // :[Vertex<T>]
    this.edges = []; // :[Edge<T>]

    // internal
    this.buildEqualityConstraint = eq; // :-> EqualityConstraint<T>
    this.history = []; // :[index(this.edges)]
  }

  // add a new vertex that is not connected to any relation
  // returns the vertex
  addFree(datum: T) {
    // :T -> Vertex<T>
    let v = new Vertex(datum, this.vertices.length, []);
    this.vertices.push(v);
    return v;
  }

  // add a set of vertices and a constraint relating them to the graph as an edge
  // returns the edge, or null if given data do not satisfy given constraint
  addRelated(data: T[], constraint: Constraint<T>) {
    // :[T] -> Constraint<T> -> Edge<T>
    if (constraint.accepts(data)) {
      // add all the needed vertices to the graph
      let vs = []; // :[Vertex<T>]
      for (let i = 0; i < data.length; i++) {
        vs.push(this.addFree(data[i]));
      }
      return this._addEdge(vs, constraint);
    } else {
      return null;
    }
  }

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
  unify(v1: Vertex<T>, v2: Vertex<T>) {
    // :Vertex<T> -> Vertex<T> -> Edge<T>
    if (v1.isFree() && v2.isFree()) {
      return this._unify(v1, v2);
    } else {
      return null; // can only unify free vertices
    }
  }

  // remove the most recently created unification involving vertex v
  // returns true if disunification successful, false if not
  // WARNING: repeated unification & disunification creates a small memory leak
  disunify(v: Vertex<T>) {
    // :Vertex<T> -> bool
    return this._disunify(v);
  }

  // returns a list of vertices that should be able to invert with the given bound vertex
  getDepends(v: Vertex<T>) {
    // :Vertex<T> -> [Vertex<T>]
    let vs = this.vertices;
    return this._leafDeps(v).map(function (p) {
      return vs[p[0]];
    });
  }

  // attempt to gain control of a vertex by giving up control of another vertex
  // returns true if successful
  invert(take: Vertex<T>, give: Vertex<T>) {
    // :Vertex<T> -> Vertex<T> -> bool
    // if vertex to take is already free, nothing to do
    if (take.isFree()) {
      return true;
    }
    // can't give up control of an already-bound vertex
    if (give.isBound()) {
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

  // find free nodes in the given vertex's dependency tree
  _leafDeps(v: Vertex<T>, seen: number[] = []) {
    // :Vertex<T> -> [index(this.vertices)]
    // -> [index(this.vertices) x index(this.edges)]
    if (seen.includes(v.id)) {
      // loop detection
      return [];
    }
    let deps: [number, number][] = [];
    for (const p of v.deps) {
      if (this.vertices[p[0]].isFree()) {
        deps.push(p);
      } else {
        seen.push(v.id);
        deps = deps.concat(this._leafDeps(this.vertices[p[0]], seen));
      }
    }
    return deps;
  }

  // find bound nodes in the given vertex's dependency tree
  _intermedDeps(v: Vertex<T>, seen: number[] = []) {
    // :Vertex<T> -> [index(this.vertices)]
    // -> [index(this.vertices) x index(this.edges)]
    if (seen.includes(v.id)) {
      // loop detection
      return [];
    }
    let deps: [number, number][] = [];
    for (const p of v.deps) {
      if (this.vertices[p[0]].isFree()) {
        continue;
      } else {
        deps.push(p);
        seen.push(v.id);
        deps = deps.concat(this._intermedDeps(this.vertices[p[0]], seen));
      }
    }
    return deps;
  }

  _addEdge(vs: Vertex<T>[], constraint: Constraint<T>) {
    // :[Vertex<T>] -> Constraint<T> -> Edge<T>
    let e = new Edge(vs, constraint, this.edges.length);
    this.edges.push(e);
    e.updateDependencies();
    return e;
  }

  _unify(v1: Vertex<T>, v2: Vertex<T>) {
    // :Vertex<T> -> Vertex<T> -> Edge<T>
    this.history.unshift(this.edges.length); // history is LIFO
    let e = new Edge([v1, v2], this.buildEqualityConstraint(), this.edges.length); // TODO: added extra parens to buildEqualityConstraint
    this.edges.push(e);
    e.updateDependencies();
    return e;
  }

  _disunify(v: Vertex<T>) {
    // :Vertex<T> -> bool
    for (let i = 0; i < this.history.length; i++) {
      let idxE = this.history[i]; // :index(this.edges)
      let e = this.edges[idxE];
      if (!(e.constraint instanceof EqualityConstraint)) {
        continue;
      }

      // since we know e has an EqualityConstraint, pos can only be -1, 0, or 1
      let pos = e.vertices.indexOf(v); // :index(e.vertices)

      if (pos < 0) {
        continue;
      } // not the edge we're looking for

      let v2 = e.vertices[1 - pos]; // :Vertex<T>

      // we've found the unification to remove: e relates v with v2

      // remove the undone unification from the history
      this.history.splice(i, 1);

      // we don't want to actually delete an edge since we're tracking stuff
      // based on indexing into this.edges, so we'll just replace the
      // equality constraint with a base constraint (this is the memory leak)
      this.edges[idxE].constraint = new NonConstraint(2);
      this.edges[idxE].updateDependencies();
      return true;
    }
    return false;
  }

  _invert(take: Vertex<T>, give: Vertex<T>, recur: boolean) {
    // :Vertex<T> -> Vertex<T> -> bool -> bool
    // check argument validity
    if (take.isFree() || give.isBound()) {
      // should not get here: external method has already checked this,
      // and recursive calls should be well-behaved
      console.log("Warning: Tried to invert inappropriate vertices.");
      return false;
    }

    // see if a direct (single-step) dependency exists
    let idxE = take.bindingEdge(give); // :index(this.edges)
    if (idxE >= 0) {
      let e = this.edges[idxE];
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
        console.log("Warning: Relational graph is out of sync with itself.");
        return false;
      }

      if (e.invert(idxT, idxG)) {
        return true;
      } else {
        // should not get here; issue is probably with e.constraint
        console.log("Warning: Unexpected failure to perform inversion.");
        return false;
      }
    } else if (recur) {
      // try to find an intermediate vertex to invert through
      for (const p of this._intermedDeps(take)) {
        // see if this vertex can invert with the target in one step
        if (this._invert(this.vertices[p[0]], give, false)) {
          // success! now do the rest
          if (this._invert(take, this.vertices[p[0]], true)) {
            return true;
          } else {
            // recursive step failed, so undo the last step
            if (this._invert(give, this.vertices[p[0]], false)) {
              console.log("Warning: Failure during multi-step inversion.");
            } else {
              console.log(
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

  _printDeps() {
    let str = "Dependencies:\n";
    for (let i = 0; i < this.vertices.length; i++) {
      str = str + i + ": ";
      for (let j = 0; j < this.vertices[i].deps.length; j++) {
        str = str + "[" + this.vertices[i].deps[j] + "]";
      }
      str = str + "\n";
    }
    console.log(str);
  }
}
