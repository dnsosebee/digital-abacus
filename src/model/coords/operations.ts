//////////////////////////////////////////////////////////////////////////////////
// "ideal" constraints that simply perform the relevant calculation all at once //

import { Cp, Eq, EqualityConstraint, OperatorConstraint } from "../graph/constraint";
import { p } from "../sketch";
import { Coord, Polar } from "./coord/coord";
import { DifferentialCoord } from "./coord/differentialCoord";

//////////////////////////////////////////////////////////////////////////////////
export class IdealComplexAdder extends OperatorConstraint<DifferentialCoord> {
  constructor() {
    let subL = function (d: Coord[]) {
      return d[2].copy().mut_subtract(d[1]);
    };
    let subR = function (d: Coord[]) {
      return d[2].subtract(d[0]);
    };
    let add = function (d: Coord[]) {
      return d[0].translate(d[1]);
    };
    let eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    let cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      return zOld.copy().mut_sendTo(zNew);
    };
    let check = function (d: Coord[]) {
      return eq(add(d), d[2]);
    };
    super([subL, subR, add], eq, cp, check);
  }

  updateDifferentials(data: DifferentialCoord[]) {
    switch (this.bound) {
      case 0:
        if (data[1].delta && data[2].delta) {
          data[0].delta = data[2].delta.subtract(data[1].delta);
        } else {
          data[0].delta = null;
        }
        break;
      case 1:
        if (data[2].delta && data[0].delta) {
          data[1].delta = data[2].delta.subtract(data[0].delta);
        } else {
          data[1].delta = null;
        }
        break;
      case 2:
        if (data[0].delta && data[1].delta) {
          data[2].delta = data[0].delta.translate(data[1].delta);
        } else {
          data[2].delta = null;
        }
        break;
      default:
      // should not get here
    }
    return data;
  }
}

export class IdealComplexMultiplier extends OperatorConstraint<DifferentialCoord> {
  constructor() {
    let divL = function (d: Coord[]) {
      return d[2].divide(d[1]);
    };
    let divR = function (d: Coord[]) {
      return d[2].divide(d[0]);
    };
    let mult = function (d: Coord[]) {
      return d[0].multiply(d[1]);
    };
    let eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    let cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      return zOld.copy().mut_sendTo(zNew);
    };
    let check = function (d: Coord[]) {
      return eq(mult(d), d[2]);
    };
    super([divL, divR, mult], eq, cp, check);
  }

  accepts(data: DifferentialCoord[]) {
    // if constraint is in a division mode, check for 0 divisor
    if ((this.bound == 0 && data[1].isOrigin()) || (this.bound == 1 && data[0].isOrigin())) {
      return false;
    } else {
      return super.accepts(data);
    }
  }

  updateDifferentials(data: DifferentialCoord[]) {
    let fprimeg, fgprime, gsquare;
    switch (this.bound) {
      case 0:
        if (data[1].delta && data[2].delta) {
          fprimeg = data[2].delta.multiply(data[1]);
          fgprime = data[2].multiply(data[1].delta);
          gsquare = data[1].multiply(data[1]);
          data[0].delta = fprimeg.subtract(fgprime).divide(gsquare);
        } else {
          data[0].delta = null;
        }
        break;
      case 1:
        if (data[2].delta && data[0].delta) {
          fprimeg = data[2].delta.multiply(data[0]);
          fgprime = data[2].multiply(data[0].delta);
          gsquare = data[0].multiply(data[0]);
          data[1].delta = fprimeg.subtract(fgprime).divide(gsquare);
        } else {
          data[1].delta = null;
        }
        break;
      case 2:
        if (data[0].delta && data[1].delta) {
          fprimeg = data[0].delta.multiply(data[1]);
          fgprime = data[0].multiply(data[1].delta);
          data[2].delta = fprimeg.translate(fgprime);
        } else {
          data[2].delta = null;
        }
        break;
      default:
      // should not get here
    }
    return data;
  }
}

export class IdealComplexConjugator extends OperatorConstraint<DifferentialCoord> {
  constructor() {
    let conjL = function (d: Coord[]) {
      return d[1].conjugate();
    };
    let conjR = function (d: Coord[]) {
      return d[0].conjugate();
    };
    let eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    let cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      return zOld.copy().mut_sendTo(zNew);
    };
    let check = function (d: Coord[]) {
      return eq(conjL(d), d[0]);
    };
    super([conjL, conjR], eq, cp, check);
  }

  // conjugate is non-differentiable
  updateDifferentials(data: DifferentialCoord[]) {
    data[this.bound].delta = null;
    return data;
  }
}

export class IdealComplexExponent extends OperatorConstraint<DifferentialCoord> {
  constructor(alwaysUsePrincipal = true) {
    let zlog = function (d: Coord[]) {
      let n = IdealComplexExponent._nearestN(d[1].log(0), d[0]);
      return d[1].log(n);
    };
    if (alwaysUsePrincipal) {
      zlog = function (d) {
        return d[1].log(0);
      };
    }
    let zexp = function (d: Coord[]) {
      return d[0].exp();
    };
    let eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    let cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
      return zOld.copy().mut_sendTo(zNew);
    };
    let check = function (d: Coord[]) {
      return eq(zexp(d), d[1]);
    };
    super([zlog, zexp], eq, cp, check);
  }

  static _nearestN(principal: Coord, guess: Coord) {
    let ySol = principal.getY();
    let yGuess = guess.getY();
    let circles = 0;
    let diff = ySol - yGuess;
    while (p!.abs(diff) > p!.PI) {
      let yPos = ySol + 2 * p!.PI;
      let yNeg = ySol - 2 * p!.PI;
      if (p!.abs(yGuess - yPos) < p!.abs(yGuess - yNeg)) {
        circles++;
        ySol = yPos;
      } else {
        circles--;
        ySol = yNeg;
      }
      diff = ySol - yGuess;
    }
    return circles;
  }

  updateDifferentials(data: DifferentialCoord[]) {
    switch (this.bound) {
      case 0:
        if (data[1].delta) {
          data[0].delta = data[1].delta.divide(data[1]);
        } else {
          data[0].delta = null;
        }
        break;
      case 1:
        if (data[0].delta) {
          data[1].delta = data[1].multiply(data[0].delta);
        } else {
          data[1].delta = null;
        }
        break;
      default:
      // should not get here
    }
    return data;
  }
}

///////////////////////////////////////////////////////////////////////
// "naive" constraints that update iteratively at a given resolution //
///////////////////////////////////////////////////////////////////////

export class IterativeComplexAdder extends IdealComplexAdder {
  // :Constraint<Coord>

  stepSize: number;
  iters: number;

  constructor(stepSize: number, iters: number) {
    super();
    this.stepSize = stepSize; // :number
    this.iters = iters; // :nat
  }

  update(data: DifferentialCoord[]) {
    for (let i = 0; i < this.iters; i++) {
      data = this.iterate(data);
    }
    return this.updateDifferentials(data);
  }

  iterate(data: DifferentialCoord[]) {
    switch (this.bound) {
      case 0:
        data[0] = this.iterateDiff(data[2], data[1], data[0]);
        break;
      case 1:
        data[1] = this.iterateDiff(data[2], data[0], data[1]);
        break;
      case 2:
        data[2] = this.iterateSum(data[0], data[1], data[2]);
        break;
      default:
      // should not get here
    }
    return data;
  }

  iterateSum(z1: DifferentialCoord, z2: DifferentialCoord, guess: DifferentialCoord) {
    let sum = z1.translate(z2);
    if (sum.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(sum);
    } else {
      let theta = sum.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }

  iterateDiff(z: DifferentialCoord, zsub: DifferentialCoord, guess: DifferentialCoord) {
    let diff = z.subtract(zsub);
    if (diff.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(diff);
    } else {
      let theta = diff.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }
}

export class IterativeComplexMultiplier extends IdealComplexMultiplier {
  // :Constraint<Coord>

  stepSize: number;
  iters: number;

  constructor(stepSize: number, iters: number) {
    super();
    this.stepSize = stepSize; // :number
    this.iters = iters; // :nat
  }

  update(data: DifferentialCoord[]) {
    for (let i = 0; i < this.iters; i++) {
      data = this.iterate(data);
    }
    return this.updateDifferentials(data);
  }

  iterate(data: DifferentialCoord[]) {
    switch (this.bound) {
      case 0:
        data[0] = this.iterateQuot(data[2], data[1], data[0]);
        break;
      case 1:
        data[1] = this.iterateQuot(data[2], data[0], data[1]);
        break;
      case 2:
        data[2] = this.iterateProd(data[0], data[1], data[2]);
        break;
      default:
      // should not get here
    }
    return data;
  }

  iterateProd(z1: DifferentialCoord, z2: DifferentialCoord, guess: DifferentialCoord) {
    let prod = z1.multiply(z2);
    if (prod.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(prod);
    } else {
      let theta = prod.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }

  iterateQuot(z: DifferentialCoord, zdiv: DifferentialCoord, guess: DifferentialCoord) {
    // if dividing by 0, just move the quotient towards infinity
    if (zdiv.isOrigin()) {
      return guess.mut_translate(new Polar(this.stepSize, guess.getTh()));
    }

    let quot = z.divide(zdiv);
    if (quot.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(quot);
    } else {
      let theta = quot.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }
}

export class IterativeComplexConjugator extends IdealComplexConjugator {
  // :Constraint<Coord>

  stepSize: number;
  iters: number;
  constructor(stepSize: number, iters: number) {
    super();
    this.stepSize = stepSize; // :number
    this.iters = iters; // :nat
  }

  update(data: DifferentialCoord[]) {
    for (let i = 0; i < this.iters; i++) {
      data = this.iterate(data);
    }
    return this.updateDifferentials(data);
  }

  iterate(data: DifferentialCoord[]) {
    data[this.bound] = this.iterateConj(data[1 - this.bound], data[this.bound]);
    return data;
  }

  iterateConj(z: DifferentialCoord, guess: DifferentialCoord) {
    let conj = z.conjugate();
    if (conj.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(conj);
    } else {
      let theta = conj.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }
}

export class IterativeComplexExponent extends IdealComplexExponent {
  // :Constraint<Coord>

  stepSize: number;
  iters: number;

  constructor(stepSize: number, iters: number) {
    super(false);
    this.stepSize = stepSize; // :number
    this.iters = iters; // :nat
  }

  update(data: DifferentialCoord[]) {
    for (let i = 0; i < this.iters; i++) {
      data = this.iterate(data);
    }
    return this.updateDifferentials(data);
  }

  iterate(data: DifferentialCoord[]) {
    switch (this.bound) {
      case 0:
        data[0] = this.iterateLog(data[1], data[0]);
        break;
      case 1:
        data[1] = this.iterateExp(data[0], data[1]);
        break;
      default:
      // should not get here
    }
    return data;
  }

  iterateLog(z: DifferentialCoord, guess: DifferentialCoord) {
    let zlog = z.log(IdealComplexExponent._nearestN(z.log(0), guess));
    if (zlog.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(zlog);
    } else {
      let theta = zlog.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }

  iterateExp(z: DifferentialCoord, guess: DifferentialCoord) {
    let zexp = z.exp();
    if (zexp.isNear(guess, this.stepSize)) {
      return guess.mut_sendTo(zexp);
    } else {
      let theta = zexp.subtract(guess).getTh();
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }
}

export class IterativeComplexEqualityConstraint extends EqualityConstraint<DifferentialCoord> {
  stepSize: number;
  iters: number;

  constructor(
    eq: Eq<DifferentialCoord>,
    cp: Cp<DifferentialCoord>,
    stepSize: number,
    iters: number
  ) {
    super(eq, cp);
    this.stepSize = stepSize;
    this.iters = iters;
  }

  update(data: DifferentialCoord[]) {
    for (let i = 0; i < this.iters; i++) {
      let newdata = data.slice();
      if (this.primaryLeft) {
        newdata[1] = this.iterate(data[0], data[1]);
      } else {
        newdata[0] = this.iterate(data[1], data[0]);
      }
      data = newdata;
    }
    return data;
  }

  iterate(z: DifferentialCoord, guess: DifferentialCoord) {
    if (z.isNear(guess, this.stepSize)) {
      // TODO: update deltas ??
      // guess.delta = z.delta;
      // z.delta = new Coord(0, 0);
      return guess.mut_sendTo(z);
    } else {
      let theta = this.findApproachAngle(z, guess);
      return guess.mut_translate(new Polar(this.stepSize, theta));
    }
  }

  findApproachAngle(z: DifferentialCoord, guess: DifferentialCoord) {
    // "guess" is the bound variable, it's trying to line up its position with z

    // angle from +real axis to vector pointing from guess to z
    const theta = z.subtract(guess).getTh();

    if (z.delta) {
      // angle from guess->z vector to differential of z
      const thetaZ = z.delta.getTh() - theta;

      // relative speed of z with respect to guess
      // const speedRatio = z.delta.getR() / guess.delta.getR();

      // naive solution is to just move directly toward z
      // TODO use differentials to make a better choice
      return theta;
    } else {
      return theta;
    }
  }
}

export function makeIterativeComplexEqualityConstraintBuilder(
  eq: Eq<DifferentialCoord>,
  cp: Cp<DifferentialCoord>,
  STEP_SIZE: number,
  ITERATIONS: number
) {
  return function () {
    return new IterativeComplexEqualityConstraint(eq, cp, STEP_SIZE, ITERATIONS);
  };
}

////////////////////////////////////////////////////////////////////////////
// "differential" constraints that update with automatic differentiation  //
//  (note that this algorithm is not compatible with basic Coord class)   //
// right now calling update on this constraint ONLY updates differentials //
////////////////////////////////////////////////////////////////////////////

// export class DifferentialComplexAdder extends IdealComplexAdder {
//   // :Constraint<LinkagePoint>
//   constructor() {
//     super();
//   }

//   update(data: DifferentialCoord[]) {
//     switch (this.bound) {
//       case 0:
//         data[0].delta = data[2].delta.subtract(data[1].delta);
//         break;
//       case 1:
//         data[1].delta = data[2].delta.subtract(data[0].delta);
//         break;
//       case 2:
//         data[2].delta = data[0].delta.translate(data[1].delta);
//         break;
//       default:
//       // should not get here
//     }
//     return data;
//   }
// }

// export class DifferentialComplexMultiplier extends IdealComplexMultiplier {
//   // :Constraint<LP>
//   constructor() {
//     super();
//   }

//   update(data: DifferentialCoord[]) {
//     let fprimeg, fgprime, gsquare;
//     switch (this.bound) {
//       case 0:
//         fprimeg = data[2].delta.multiply(data[1]);
//         fgprime = data[2].multiply(data[1].delta);
//         gsquare = data[1].multiply(data[1]);
//         data[0].delta = fprimeg.subtract(fgprime).divide(gsquare);
//         break;
//       case 1:
//         fprimeg = data[2].delta.multiply(data[0]);
//         fgprime = data[2].multiply(data[0].delta);
//         gsquare = data[0].multiply(data[0]);
//         data[1].delta = fprimeg.subtract(fgprime).divide(gsquare);
//         break;
//       case 2:
//         fprimeg = data[0].delta.multiply(data[1]);
//         fgprime = data[0].multiply(data[1].delta);
//         data[2].delta = fprimeg.translate(fgprime);
//         break;
//       default:
//       // should not get here
//     }
//     return data;
//   }
// }

// export class DifferentialComplexConjugator extends IdealComplexConjugator {
//   // :Constraint<LP>
//   constructor() {
//     super();
//   }

//   update(data: DifferentialCoord[]) {
//     // we need the conjugate at the next step, not here!
//     // delta gets multiplied by the actual movement of the input,
//     // but there's no factor we can give here to do that
//     let deltaIn = data[1 - this.bound].delta;
//     data[this.bound].delta = new DifferentialCoord(deltaIn.getX(), deltaIn.getY() * -1);
//     return data;
//   }
// }

// export class DifferentialComplexExponent extends IdealComplexExponent {
//   // :Constraint<LP>

//   one: Coord;
//   constructor() {
//     super();
//     this.one = new Coord(1, 0);
//   }

//   update(data: DifferentialCoord[]) {
//     switch (this.bound) {
//       case 0:
//         data[0].delta = data[1].delta.divide(data[1]);
//         break;
//       case 1:
//         data[1].delta = data[1].multiply(data[0].delta);
//         break;
//       default:
//       // should not get here
//     }
//     return data;
//   }
// }
