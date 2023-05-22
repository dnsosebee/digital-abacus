import { OperatorConstraint } from "../../graph/constraint";
import { p } from "../../sketch";
import { Coord } from "../coord/coord";
import { DifferentialCoord } from "../coord/differentialCoord";

//////////////////////////////////////////////////////////////////////////////////
// "ideal" constraints that simply perform the relevant calculation all at once //
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
