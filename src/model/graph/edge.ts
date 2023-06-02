import { logger as parentLogger } from "@/lib/logger";
import { z } from "zod";
import { Constraint } from "./constraint";
import { Serializable } from "./serializable";
import { Vertex, serialVertexSchema } from "./vertex";

const logger = parentLogger.child({ module: "Edge" });

// DOES NOT INCLUDE CONSTRAINT
export const serialEdgeSchema = z.object({
  vertices: z.array(serialVertexSchema),
  id: z.string(),
});

export type SerialEdge = z.infer<typeof serialEdgeSchema>;

export class Edge<T extends Serializable, V extends Vertex<T> = Vertex<T>> {
  vertices: V[]; // :[Vertex<T>]
  constraint: Constraint<T>; // :Constraint<T>
  id: string;
  // :Edge<T>
  constructor(v: V[], c: Constraint<T>, id: string) {
    this.vertices = v;
    this.constraint = c;
    this.id = id;
    this.updateDependencies();
  }

  serialize(): SerialEdge {
    return {
      vertices: this.vertices.map((v) => v.serialize()),
      // constraint: this.constraint.serialize(),
      id: this.id,
    };
  }

  // is the given position a bound/output position for this edge?
  dependentAt(i: number) {
    // :index(this.vertices) -> bool
    return this.constraint.getDependencies()[i];
  }

  getFreeVertices() {
    // :-> [Vertex<T>]
    let deps = this.constraint.getDependencies();
    let free = [];
    for (let i = 0; i < this.vertices.length; i++) {
      if (!deps[i]) {
        free.push(this.vertices[i]);
      }
    }
    return free;
  }

  getBoundVertices() {
    // :-> [Vertex<T>]
    let deps = this.constraint.getDependencies();
    let bound = [];
    for (let i = 0; i < this.vertices.length; i++) {
      if (deps[i]) {
        bound.push(this.vertices[i]);
      }
    }
    return bound;
  }

  updateDependencies() {
    // :-> void
    this.removeDependencies();
    let eid = this.id;
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

  removeDependencies() {
    let eid = this.id;
    for (let v of this.vertices) {
      v.deps = v.deps.filter(function (p) {
        return p.edge != eid;
      });
    }
  }

  // invert this edge's constraint by exchanging free/bound status of two positions
  invert(take: number, give: number) {
    // :index(this.vertices) -> index(this.vertices) -> bool
    if (this.constraint.invert(take, give)) {
      this.updateDependencies();
      return true;
    } else {
      return false;
    }
  }

  // use the constraint to update vertex data in bound positions
  // returns true if any data was changed
  // argument is the notion of equality by which changes are checked
  update(eq = this.constraint.eq) {
    // : (T -> T -> bool) -> bool
    let changed = false;
    let olddata = this.vertices.map(function (v) {
      return v.value;
    });
    let newdata = this.constraint.update(olddata);
    for (let i = 0; i < this.vertices.length; i++) {
      if (!eq(olddata[i], newdata[i])) {
        this.vertices[i].value = newdata[i];
        changed = true;
      }
    }
    return changed;
  }
}
