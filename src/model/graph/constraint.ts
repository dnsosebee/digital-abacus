// data structure for representing relations

export type Eq<T> = (dat1: T, dat2: T) => boolean;
export type Cp<T> = (dat1: T, dat2: T) => T;

export abstract class Constraint<T> {
  // :Constraint<T>

  arity: number; // :index
  constructor(arity: number) {
    this.arity = arity;
  }

  ///////////////////////////////////////
  // methods that should be overridden //
  ///////////////////////////////////////

  // checks if two pieces of data are equal for purposes of this constraint
  abstract eq: Eq<T>; // :T -> T -> bool

  // checks if the given data exactly satisfies the constraint
  accepts(data: T[]) {
    // :[T] -> bool
    return this.checkArity(data);
  }

  // returns an array representation of the dependency structure of the relation
  // array values mean:
  //   false - free/independent/input
  //   true - bound/dependent/output
  getDependencies() {
    // :-> [bool]
    return new Array(this.arity).fill(false);
  }

  // exchange free/bound status of two positions
  // returns true if successful
  // note: we want all constraint classes to have the property that
  //       if invert(a,b) succeeds than a subsequent invert(b,a) will also succeed
  //       (we probably also want it to give back the original constraint)
  invert(take: number, give: number) {
    // : index -> index -> bool
    if (take == give) {
      return false;
    }
    if (take >= this.arity || give >= this.arity) {
      return false;
    }
    return true;
  }

  // change data in dependent/bound positions to fit the requirements of this constraint
  update(data: T[]) {
    // :[T] -> [T]
    return data;
  }

  /////////////////////
  // utility methods //
  /////////////////////

  checkArity(data: T[]) {
    // :[T] -> bool
    return this.arity == data.length;
  }
}

export class NonConstraint<T> extends Constraint<T> {
  // :Constraint<T>

  constructor(arity: number) {
    super(arity);
  }

  eq: Eq<T> = (dat1: T, dat2: T) => true;
}

export class StandaloneConstraint<T> extends NonConstraint<T> {
  // :Constraint<Coord>

  constructor() {
    super(1);
  }
}

// constraint specifying that two data must be equal
export class EqualityConstraint<T> extends Constraint<T> {
  // :Constraint<T>
  // eq - notion of equality
  // cp - "copy" function, sends data from 1st arg to 2nd arg

  cp: Cp<T>; // :T -> T -> _
  eq: Eq<T>; // :T -> T -> bool
  primaryLeft: boolean; // :bool

  constructor(eq: Eq<T>, cp: Cp<T>, primaryLeft = true) {
    // :T -> T -> bool -> T -> T -> _
    super(2);
    this.cp = cp; // T -> T -> _
    this.eq = eq; // T -> T -> bool
    this.primaryLeft = primaryLeft; // bool
  }

  accepts(data: T[]) {
    // :[T] -> bool
    return super.accepts(data) && this.eq(data[0], data[1]);
  }

  getDependencies() {
    return [!this.primaryLeft, this.primaryLeft];
  }

  invert(take: number, give: number) {
    if (super.invert(take, give)) {
      this.primaryLeft = !this.primaryLeft;
      return true;
    } else {
      return false;
    }
  }

  update(data: T[]) {
    // :[T] -> [T]
    let newdata = data.slice();
    if (this.primaryLeft) {
      newdata[1] = this.cp(data[1], data[0]);
    } else {
      newdata[0] = this.cp(data[0], data[1]);
    }
    return newdata;
  }
}

export function makeEqualityConstraintBuilder<T>(eq: Eq<T>, cp: Cp<T>) {
  // (T -> T -> bool) ->
  // (T -> T -> _) ->
  // (-> EqualityConstraint<T>)
  return function (primaryLeft = true) {
    return new EqualityConstraint(eq, cp, primaryLeft);
  };
}

export function defaultEqualityConstraintBuilder<T>() {
  // :-> EqualityConstraint<T>
  return makeEqualityConstraintBuilder<T>(
    function (x, y) {
      return x === y;
    },
    function (xIn, xOut) {
      return xIn; // TODO verify this is correct
    }
  );
}

type Ops<T> = ((data: T[]) => any)[];
type Check<T> = (data: T[]) => boolean;

export class OperatorConstraint<T> extends Constraint<T> {
  // :Constraint<T>

  ops: Ops<T>; // :[[T] -> T]
  eq: Eq<T>; // :T -> T -> bool
  cp: Cp<T>; // :T -> T -> T
  check: Check<T>; // :[T] -> bool
  bound: number; // :index

  constructor(updaters: Ops<T>, eq: Eq<T>, cp: Cp<T>, check: Check<T>) {
    super(updaters.length);
    this.ops = updaters; // :[[T] -> T]
    this.eq = eq; // :T -> T -> bool
    this.cp = cp; // :T -> T -> T
    this.check = check; // :[T] -> bool
    this.bound = updaters.length - 1; // :index
  }

  accepts(data: T[]) {
    // :[T] -> bool
    return super.accepts(data) && this.check(data);
  }

  getDependencies() {
    let deps = super.getDependencies();
    deps[this.bound] = true;
    return deps;
  }

  invert(take: number, give: number) {
    if (take == this.bound && super.invert(take, give)) {
      this.bound = give;
      return true;
    } else {
      return false;
    }
  }

  update(data: T[]) {
    // :[T] -> [T]
    let newdata = data.slice();
    newdata[this.bound] = this.cp(data[this.bound], this.ops[this.bound](data));
    return newdata;
  }
}
