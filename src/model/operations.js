//////////////////////////////////////////////////////////////////////////////////
// "ideal" constraints that simply perform the relevant calculation all at once //
//////////////////////////////////////////////////////////////////////////////////
class IdealComplexAdder extends OperatorConstraint { // :Constraint<Coord>
    constructor() {
        let subL = function(d) { return d[2].subtract(d[1]); };
        let subR = function(d) { return d[2].subtract(d[0]); };
        let add = function(d) { return d[0].translate(d[1]); };
        let eq = function(z1, z2) { return z1.equals(z2); };
        let cp = function(zOld, zNew) { return zOld.copy().mut_sendTo(zNew); };
        let check = function(d) { return eq(add(d),d[2]); };
        super([subL, subR, add], eq, cp, check);
    }
}

class IdealComplexMultiplier extends OperatorConstraint { // :Constraint<Coord>
    constructor() {
        let divL = function(d) { return d[2].divide(d[1]); };
        let divR = function(d) { return d[2].divide(d[0]); };
        let mult = function(d) { return d[0].multiply(d[1]); };
        let eq = function(z1, z2) { return z1.equals(z2); };
        let cp = function(zOld, zNew) { return zOld.copy().mut_sendTo(zNew); };
        let check = function(d) { return eq(mult(d),d[2]); };
        super([divL, divR, mult], eq, cp, check);
    }

    accepts(data) {
        // if constraint is in a division mode, check for 0 divisor
        if ((this.bound==0 && data[1].isOrigin()) ||
            (this.bound==1 && data[0].isOrigin())) {
            return false;
        } else {
            return super.accepts(data);
        }
    }
}

class IdealComplexConjugator extends OperatorConstraint { // :Constraint<Coord>
    constructor() {
        let conjL = function(d) { return d[1].conjugate(); };
        let conjR = function(d) { return d[0].conjugate(); };
        let eq = function(z1, z2) { return z1.equals(z2); };
        let cp = function(zOld, zNew) { return zOld.copy().mut_sendTo(zNew); };
        let check = function(d) { return eq(conjL(d),d[0]); };
        super([conjL, conjR], eq, cp, check);
    }
}

class IdealComplexExponent extends OperatorConstraint { // :Constraint<Coord>
    constructor(alwaysUsePrincipal = true) {
        let zlog = function(d) { let n = IdealComplexExponent._nearestN(d[1].log(0), d[0]);
                                 return d[1].log(n); };
        if (alwaysUsePrincipal) {
            zlog = function(d) { return d[1].log(0); };
        }
        let zexp = function(d) { return d[0].exp(); }
        let eq = function(z1, z2) { return z1.equals(z2); };
        let cp = function(zOld, zNew) { return zOld.copy().mut_sendTo(zNew); };
        let check = function(d) { return eq(zexp(d), d[1]); };
        super([zlog, zexp], eq, cp, check);
    }

    static _nearestN(principal, guess) {
        let ySol = principal.getY();
        let yGuess = guess.getY();
        let circles = 0;
        let diff = ySol - yGuess;
        while (abs(diff) > PI) {
            let yPos = ySol + 2*PI;
            let yNeg = ySol - 2*PI;
            if (abs(yGuess - yPos) < abs(yGuess - yNeg)) {
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
}

///////////////////////////////////////////////////////////////////////
// "naive" constraints that update iteratively at a given resolution //
///////////////////////////////////////////////////////////////////////

class IterativeComplexAdder extends IdealComplexAdder { // :Constraint<Coord>
    constructor(stepSize, iters) {
        super();
        this.stepSize = stepSize; // :number
        this.iters = iters;       // :nat
    }

    update(data) {
        for (let i=0; i<this.iters; i++) {
            data = this.iterate(data);
        }
        return data;
    }
    
    iterate(data) {
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

    iterateSum(z1, z2, guess) {
        let sum = z1.translate(z2);
        if (sum.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(sum);
        } else {
            let theta = sum.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }

    iterateDiff(z, zsub, guess) {
        let diff = z.subtract(zsub);
        if (diff.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(diff);
        } else {
            let theta = diff.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }
}

class IterativeComplexMultiplier extends IdealComplexMultiplier { // :Constraint<Coord>
    constructor(stepSize, iters) {
        super();
        this.stepSize = stepSize; // :number
        this.iters = iters;       // :nat
    }

    update(data) {
        for (let i=0; i<this.iters; i++) {
            data = this.iterate(data);
        }
        return data;
    }
    
    iterate(data) {
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

    iterateProd(z1, z2, guess) {
        let prod = z1.multiply(z2);
        if (prod.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(prod);
        } else {
            let theta = prod.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }

    iterateQuot(z, zdiv, guess) {
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

class IterativeComplexConjugator extends IdealComplexConjugator { // :Constraint<Coord>
    constructor(stepSize, iters) {
        super();
        this.stepSize = stepSize; // :number
        this.iters = iters;       // :nat
    }
    
    update(data) {
        for (let i=0; i<this.iters; i++) {
            data = this.iterate(data);
        }
        return data;
    }
    
    iterate(data) {
        data[this.bound] = this.iterateConj(data[1-this.bound], data[this.bound]);
        return data;
    }

    iterateConj(z, guess) {
        let conj = z.conjugate();
        if (conj.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(conj);
        } else {
            let theta = conj.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }
}

class IterativeComplexExponent extends IdealComplexExponent { // :Constraint<Coord>
    constructor(stepSize, iters) {
        super(false);
        this.stepSize = stepSize; // :number
        this.iters = iters;       // :nat
    }

    update(data) {
        for (let i=0; i<this.iters; i++) {
            data = this.iterate(data);
        }
        return data;
    }
    
    iterate(data) {
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

    iterateLog(z, guess) {
        let zlog = z.log(IdealComplexExponent._nearestN(z.log(0), guess));
        if (zlog.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(zlog);
        } else {
            let theta = zlog.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }

    iterateExp(z, guess) {
        let zexp = z.exp();
        if (zexp.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(zexp);
        } else {
            let theta = zexp.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }
}

class IterativeComplexEqualityConstraint extends EqualityConstraint {
    constructor(eq, cp, stepSize, iters) {
        super(eq, cp);
        this.stepSize = stepSize;
        this.iters = iters;
    }

    update(data) {
        for (let i=0; i<this.iters; i++) {
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

    iterate(z, guess) {
        if (z.isNear(guess, this.stepSize)) {
            return guess.mut_sendTo(z);
        } else {
            let theta = z.subtract(guess).getTh();
            return guess.mut_translate(new Polar(this.stepSize, theta));
        }
    }
}

function makeIterativeComplexEqualityConstraintBuilder(eq, cp) {
    return function() {
        return new IterativeComplexEqualityConstraint(eq, cp, STEP_SIZE, ITERATIONS);
    }
}

////////////////////////////////////////////////////////////////////////////
// "differential" constraints that update with automatic differentiation  //
//  (note that this algorithm is not compatible with basic Coord class)   //
// right now calling update on this constraint ONLY updates differentials //
////////////////////////////////////////////////////////////////////////////

class DifferentialComplexAdder extends IdealComplexAdder { // :Constraint<LinkagePoint>
    constructor() {
        super();
    }

    update(data) {
        switch (this.bound) {
        case 0:
            data[0].delta = data[2].delta.subtract(data[1].delta);
            break;
        case 1:
            data[1].delta = data[2].delta.subtract(data[0].delta);
            break;
        case 2:
            data[2].delta = data[0].delta.translate(data[1].delta);
            break;
        default:
            // should not get here
        }
        return data;
    }
}

class DifferentialComplexMultiplier extends IdealComplexMultiplier { // :Constraint<LP>
    constructor() {
        super();
    }

    update(data) {
        let fprimeg, fgprime, gsquare;
        switch (this.bound) {
        case 0:
            fprimeg = data[2].delta.multiply(data[1]);
            fgprime = data[2].multiply(data[1].delta);
            gsquare = data[1].multiply(data[1]);
            data[0].delta = fprimeg.subtract(fgprime).divide(gsquare);
            break;
        case 1:
            fprimeg = data[2].delta.multiply(data[0]);
            fgprime = data[2].multiply(data[0].delta);
            gsquare = data[0].multiply(data[0]);
            data[1].delta = fprimeg.subtract(fgprime).divide(gsquare);
            break;
        case 2:
            fprimeg = data[0].delta.multiply(data[1]);
            fgprime = data[0].multiply(data[1].delta);
            data[2].delta = fprimeg.translate(fgprime);
            break;
        default:
            // should not get here
        }
        return data;
    }
}

class DifferentialComplexConjugator extends IdealComplexConjugator { // :Constraint<LP>
    constructor() {
        super();
    }

    update(data) {
        // we need the conjugate at the next step, not here!
        // delta gets multiplied by the actual movement of the input,
        // but there's no factor we can give here to do that
        let deltaIn = data[1-this.bound].delta;
        data[this.bound].delta = new Coord(deltaIn.getX(),deltaIn.getY()*-1);
        return data;
    }
}

class DifferentialComplexExponent extends IdealComplexExponent { // :Constraint<LP>
    constructor() {
        super();
        this.one = new Coord(1,0);
    }

    update(data) {
        switch (this.bound) {
        case 0:
            data[0].delta = data[1].delta.divide(data[1]);
            break;
        case 1:
            data[1].delta = data[1].multiply(data[0].delta);
            break;
        default:
            // should not get here
        }
        return data;
    }
}
