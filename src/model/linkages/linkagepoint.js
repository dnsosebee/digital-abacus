class LinkagePoint extends Coord {
    constructor(x, y) {
        // position of point
        super(x,y);

        // is this point user-moveable?
        this.canDrag = null;

        this.dragging = false;
        this.hidden = false;

        this.delta = new Coord(0,0);
    }

    copy(parent = null) {
        let z = new LinkagePoint(this.x, this.y);
        if (parent) {
            z.canDrag = function() { return parent.isFree(); };
        } else {
            z.canDrag = this.canDrag;
        }
        z.dragging = this.dragging;
        z.hidden = this.hidden;
        z.delta = this.delta.copy();
        return z;
    }

    checkMouseover() { // :-> bool
        if (this.hidden) { return false; }
        return this.isNearPx(getMousePx(), 25);
    }

    notifyClick() { // :-> bool
        if (this.hidden) { return false; }
        if (this.canDrag) { // only call drag check method if it exists
            if (this.canDrag() && this.checkMouseover()) {
                this.dragging = true;
                this.delta = new Coord(1,0);
            }
        } else if (this.checkMouseover()) {
            this.dragging = true;
            this.delta = new Coord(1,0);
        }
        return this.dragging;
    }

    notifyRelease() {
        this.dragging = false;
        this.delta = new Coord(0,0);
    }

    sendToMouse() {
        if (this.dragging) {
            this.mut_sendTo(getMouse());
        }
    }

    mut_applyDifferential(delta) {
        this.mut_translate(this.delta.multiply(delta));
    }

    _drawNode(reversing = false) {
        noStroke();
        if (reversing) {
            fill(255);
        } else {
            fill(100, 150, 255);
        }
        ellipse(this.getXPx(), this.getYPx(), 15, 15);
    }

    _drawRing() {
        noFill();
        stroke(255, 200);
        strokeWeight(3);
        ellipse(this.getXPx(), this.getYPx(), 20, 20);
    }

    display(reversing = false) { // :bool -> void
        if (this.hidden) { return; }

        this._drawNode(reversing);
        
        if (this.canDrag && this.canDrag()) { // check for method existing, then call
            this._drawRing();
        }

        if (showDifferentials) {
            fill(255);
            noStroke();
            text(this.delta.toString(), this.getXPx()+10, this.getYPx()-20);
        }
    }
}
