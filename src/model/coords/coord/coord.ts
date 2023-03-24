import { CENTER_X, CENTER_Y, settings } from "../../settings";
import { p } from "../../sketch";

export class Coord {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }
  getReal() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getImaginary() {
    return this.y;
  }

  getXPx() {
    return this.x * settings.globalScale + CENTER_X;
  }
  getYPx() {
    return CENTER_Y - this.y * settings.globalScale;
  }

  getR() {
    return p!.sqrt(this.x * this.x + this.y * this.y);
  }
  getTh() {
    return p!.atan2(this.y, this.x);
  }
  getThDegrees() {
    return p!.map(this.getTh(), -p!.PI, p!.PI, -180, 180);
  }

  translate(vector: any) {
    return new Coord(this.x + vector.getX(), this.y + vector.getY());
  }

  mut_translate(vector: any) {
    this.x += vector.getX();
    this.y += vector.getY();
    return this;
  }

  subtract(vector: any) {
    return new Coord(this.x - vector.getX(), this.y - vector.getY());
  }

  mut_subtract(vector: any) {
    this.x -= vector.getX();
    this.y -= vector.getY();
    return this;
  }

  scale(factor: number) {
    return new Coord(this.x * factor, this.y * factor);
  }

  mut_scale(factor: number) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  conjugate() {
    return new Coord(this.x, -this.y);
  }

  mut_conjugate() {
    this.y *= -1;
    return this;
  }

  multiply(vector: any) {
    let r = this.getR() * vector.getR();
    let th = this.getTh() + vector.getTh();

    return new Coord(r * p!.cos(th), r * p!.sin(th));
  }

  mut_multiply(vector: any) {
    let r = this.getR() * vector.getR();
    let th = this.getTh() + vector.getTh();
    this.x = r * p!.cos(th);
    this.y = r * p!.sin(th);
    return this;
  }

  divide(vector: any) {
    let r = this.getR() / vector.getR();
    let th = this.getTh() - vector.getTh();

    return new Coord(r * p!.cos(th), r * p!.sin(th));
  }

  mut_divide(vector: any) {
    let r = this.getR() / vector.getR();
    let th = this.getTh() - vector.getTh();
    this.x = r * p!.cos(th);
    this.y = r * p!.sin(th);
    return this;
  }

  avg(vector: any) {
    let x = (this.x + vector.getX()) / 2;
    let y = (this.y + vector.getY()) / 2;
    return new Coord(x, y);
  }

  mut_avg(vector: any) {
    this.x = (this.x + vector.getX()) / 2;
    this.y = (this.y + vector.getY()) / 2;
    return this;
  }

  exp() {
    let r = p!.exp(this.x);
    let th = this.y;
    return new Polar(r, th);
  }

  mut_exp() {
    return this.mut_sendTo(this.exp());
  }

  log(n = 0) {
    let x = p!.log(this.getR());
    let y = this.getTh() + 2 * p!.PI * n;
    return new Coord(x, y);
  }

  mut_log(n = 0) {
    return this.mut_sendTo(this.log(n));
  }

  copy() {
    return new Coord(this.x, this.y);
  }

  mut_sendTo(vector: any) {
    this.x = vector.getX();
    this.y = vector.getY();
    return this;
  }

  toString(precision = 1) {
    // hack so that nfc doesn't display small floating point values wrong
    let x = this.x;
    if (p!.abs(x) < 0.01) {
      x = 0;
    }
    let y = this.y;
    if (p!.abs(y) < 0.01) {
      y = 0;
    }

    return "(" + p!.nfc(x, precision) + ", " + p!.nfc(y, precision) + "i)";
  }

  isOrigin() {
    return this.x == 0 && this.y == 0;
  }

  equals(vector: any) {
    return this.x == vector.getX() && this.y == vector.getY();
  }

  distance(vector: any) {
    return p!.dist(this.x, this.y, vector.x, vector.y);
  }

  isNear(coord: Coord, tolerance: number) {
    return this.distance(coord) < tolerance;
  }

  isNearPx(coord: Coord, tolerancePx: number) {
    return axisToPixel(this).distance(coord) < tolerancePx;
  }
}

// alternate constructor for building a Coord with polar components
export class Polar extends Coord {
  constructor(r: number, th: number) {
    super(r * p!.cos(th), r * p!.sin(th));
  }
}

function pixelToAxis(coord: Coord) {
  let x = coord.getX();
  let y = coord.getY();
  return new Coord((x - CENTER_X) / settings.globalScale, (CENTER_Y - y) / settings.globalScale);
}

function axisToPixel(coord: Coord) {
  let x = coord.getX();
  let y = coord.getY();
  return new Coord(x * settings.globalScale + CENTER_X, CENTER_Y - y * settings.globalScale);
}

export function pixelToAxisX(coord: number) {
  return (coord - CENTER_X) / settings.globalScale;
}

export function pixelToAxisY(coord: number) {
  return (CENTER_Y - coord) / settings.globalScale;
}

export function axisToPixelX(coord: number) {
  return coord * settings.globalScale + CENTER_X;
}

export function axisToPixelY(coord: number) {
  return CENTER_Y - coord * settings.globalScale;
}

export function getMouse() {
  return pixelToAxis(new Coord(p!.mouseX, p!.mouseY));
}

export function getMousePx() {
  return new Coord(p!.mouseX, p!.mouseY);
}
