import { Cp, Eq, EqualityConstraint } from "../../graph/constraint";
import { settings } from "../../settings";
import { Coord, Polar } from "../coord/coord";
import { DifferentialCoord } from "../coord/differentialCoord";
import {
  IdealComplexAdder,
  IdealComplexConjugator,
  IdealComplexExponent,
  IdealComplexMultiplier,
} from "./ideal";

///////////////////////////////////////////////////////////////////////
//         constraints that update iteratively at a given resolution //
///////////////////////////////////////////////////////////////////////

export class IterativeComplexAdder extends IdealComplexAdder {
  // :Constraint<Coord>

  iters: number;

  constructor(iters: number) {
    super();
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
    if (sum.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(sum);
    } else {
      let theta = sum.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }

  iterateDiff(z: DifferentialCoord, zsub: DifferentialCoord, guess: DifferentialCoord) {
    let diff = z.subtract(zsub);
    if (diff.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(diff);
    } else {
      let theta = diff.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }
}

export class IterativeComplexMultiplier extends IdealComplexMultiplier {
  // :Constraint<Coord>

  iters: number;

  constructor(iters: number) {
    super();
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
    if (prod.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(prod);
    } else {
      let theta = prod.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }

  iterateQuot(z: DifferentialCoord, zdiv: DifferentialCoord, guess: DifferentialCoord) {
    // if dividing by 0, just move the quotient towards infinity
    if (zdiv.isOrigin()) {
      return guess.mut_translate(new Polar(settings.stepSize, guess.getTh()));
    }

    let quot = z.divide(zdiv);
    if (quot.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(quot);
    } else {
      let theta = quot.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }
}

export class IterativeComplexConjugator extends IdealComplexConjugator {
  // :Constraint<Coord>

  iters: number;
  constructor(iters: number) {
    super();
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
    if (conj.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(conj);
    } else {
      let theta = conj.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }
}

export class IterativeComplexExponent extends IdealComplexExponent {
  // :Constraint<Coord>

  iters: number;

  constructor(iters: number) {
    super(false);
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
    if (zlog.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(zlog);
    } else {
      let theta = zlog.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }

  iterateExp(z: DifferentialCoord, guess: DifferentialCoord) {
    let zexp = z.exp();
    if (zexp.isNear(guess, settings.stepSize)) {
      return guess.mut_sendTo(zexp);
    } else {
      let theta = zexp.subtract(guess).getTh();
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }
}

export class IterativeComplexEqualityConstraint extends EqualityConstraint<DifferentialCoord> {
  iters: number;
  tracked: boolean;
  delayCounter: number;

  constructor(eq: Eq<DifferentialCoord>, cp: Cp<DifferentialCoord>, iters: number) {
    super(eq, cp);
    this.iters = iters;
    this.tracked = true;
    this.delayCounter = 0;
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
    if (!z.delta) {
      this.tracked = false;
    }
    if (!this.tracked) {
      guess.delta = z.delta;
    }
    if (z.isNear(guess, settings.stepSize * 4)) {
      if (this.tracked) {
        // logger.debug({ guess: JSON.stringify(guess), z: JSON.stringify(z) }, "ending tracking");
        guess.delta = new Coord(0, 0);
        z.delta = new Coord(0, 0);
        this.tracked = false;
      }
      // return guess;
      return guess.mut_sendTo(z);
    } else {
      if (this.tracked) {
        this.delayCounter++;
        if (this.delayCounter < z.delta!.getR()) {
          return guess;
        }
        this.delayCounter = 0;
      }
      let theta = this.findApproachAngle(z, guess);
      return guess.mut_translate(new Polar(settings.stepSize, theta));
    }
  }

  findApproachAngle(z: DifferentialCoord, guess: DifferentialCoord) {
    // "guess" is the bound variable, it's trying to line up its position with z

    // angle from +real axis to vector pointing from guess to z
    let phi = z.subtract(guess).getTh();
    let theta = phi;

    if (this.tracked && z.delta) {
      // logger.debug({ theta, z: JSON.stringify(z), guess: JSON.stringify(guess) }, "theta initial");

      const psi = z.delta.getTh(); // - theta;
      const M = z.delta.getR();
      // logger.debug("psi: " + psi + ", M: " + M);

      const bound = Math.acos(1 / M);
      if (M > 1 && -bound < psi && psi < bound) {
        // logger.debug("running away");
        const numerator = M * Math.sin(-psi);
        const denominator = Math.sqrt(1 + M * M - 2 * M * Math.cos(-psi));
        theta = Math.asin(numerator / denominator) + Math.PI + phi;
      } else if ((0 < M && M < 1) || (M == 1 && psi != 0)) {
        const numerator = M * Math.sin(psi);
        const denominator = Math.sqrt(1 + M * M - 2 * M * Math.cos(psi));
        theta = Math.asin(numerator / denominator) + phi;
      }
    }

    return theta;
  }
}

export function makeIterativeComplexEqualityConstraintBuilder(
  eq: Eq<DifferentialCoord>,
  cp: Cp<DifferentialCoord>,
  STEP_SIZE: number,
  ITERATIONS: number
) {
  return function () {
    return new IterativeComplexEqualityConstraint(eq, cp, ITERATIONS);
  };
}
