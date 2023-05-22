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
