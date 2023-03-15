class LinkageGraph extends RelGraph { // :RelGraph<LinkagePoint>
    constructor(updateMode = UPDATE_IDEAL) {
        let f_eq = function(z1,z2) { return z1.equals(z2) && z1.delta.equals(z2.delta); };
        let f_cp = function(zOld,zNew) { let z = zOld.copy();
                                         z.mut_sendTo(zNew);
                                         z.delta.mut_avg(zNew.delta);
                                         return z; };
        let eq = makeEqualityConstraintBuilder(f_eq, f_cp);
        if (updateMode==UPDATE_ITERATIVE) {
            eq = makeIterativeComplexEqualityConstraintBuilder(f_eq, f_cp);
        }
        super(eq);

        this.focus = null;
        this.mode = updateMode;

        // for reviewing history
        this.frames = [];
        this.record = 0;
    }

    // use this instead of addRelated
    addOperation(type) {
        let vs = [];
        if (type==ADDER) {
            vs.push(this.addFree(0,0));
            vs.push(this.addFree(0,0));
            vs.push(this.addFree(0,0));
        } else if (type==MULTIPLIER) {
            vs.push(this.addFree(1,0));
            vs.push(this.addFree(1,0));
            vs.push(this.addFree(1,0));
        } else if (type==CONJUGATOR) {
            vs.push(this.addFree(0,1));
            vs.push(this.addFree(0,-1));
        } else if (type==EXPONENTIAL) {
            vs.push(this.addFree(0,PI));
            vs.push(this.addFree(-1,0));
        } else {
            return null;
        }
        
        let e = new LinkageOp(vs, type, this.mode, this.edges.length);
        this.edges.push(e);
        e.updateDependencies();
        return e;
    }

    addFree(x,y) {
        let z = super.addFree(new LinkagePoint(x,y));
        z.value.canDrag = function() { return z.isFree(); };
        return z;
    }

    // must provide the hidden vertex in order to resume display
    disunify(v) {
        if (this._disunify(v)) {
            v.value.hidden = false;
            return true;
        } else {
            return false;
        }
    }

    applyDifferential(delta) {
        for (let v of this.vertices) {
            v.value.mut_applyDifferential(delta);
        }
    }

    display(reversing=false) {
        for (const e of this.edges) {
            if (e instanceof LinkageOp) {
                e.display();
            }
        }
        for (const v of this.vertices) {
            if (reversing && this.focus && this.getDepends(this.focus).includes(v)) {
                v.value.display(reversing);
            } else {
                // need more than 2 states! want depends to look more distinct
                // from other free vertices
                v.value.display();
            }
        }
    }

    // returns the first free vertex close to the cursor
    // if none, returns a bound vertex close to the cursor
    // if no vertices are close to the cursor, returns null
    findMouseover() {
        let result = null;
        for (const v of this.vertices) {
            if (v.value.checkMouseover()) {
                if (v.isFree()) {
                    return v;
                } else {
                    result = v;
                }
            }
        }
        return result;
    }

    startReversal() {
        this.focus = this.findMouseover();
        if (this.focus && this.focus.isBound()) {
            return true;
        } else {
            this.focus = null;
            return false;
        }
        
    }

    cancelReversal() {
        this.focus = null;
    }

    completeReversal() {
        if (this.focus) {
            let target = this.findMouseover();
            if (target && this.invert(this.focus, target)) {
                this.focus = null;
            } else {
                this.cancelReversal();
            }
        }
    }

    findUnify() {
        let v1 = this.findMouseover();
        if (v1) {
            v1.value.hidden = true;
            let v2 = this.findMouseover();
            v1.value.hidden = false;
            if (v2 && this.unify(v1, v2)) {
                v2.value.hidden = true;
                return true;
            }
        }
        return false;
    }

    saveFrame() {
        if (this.record>0) {
            let fr = [];
            for (const v of this.vertices) {
                fr.push(v.value.delta.toString());
            }
            this.frames.push(fr);
            this.record--;
        }
    }

    update(iters = 1) {
        if (this.record>0) {
            this.saveFrame();
        }
        super.update(iters);
    }

    recordNext(nframes, clearOld = false) {
        this.record = nframes;
        if (clearOld) { this.frames = []; }
    }
}
