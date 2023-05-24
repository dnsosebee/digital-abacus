import { z } from "zod";

export const coordSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Coord = z.infer<typeof coordSchema>;

export const getR = (coord: Coord) => Math.sqrt(coord.x * coord.x + coord.y * coord.y);

export const subtract = (coord1: Coord, coord2: Coord) => ({
  x: coord1.x - coord2.x,
  y: coord1.y - coord2.y,
});

export const translate = (coord1: Coord, coord2: Coord) => ({
  x: coord1.x + coord2.x,
  y: coord1.y + coord2.y,
});

export const distance = (coord1: Coord, coord2: Coord) => {
  return getR(subtract(coord1, coord2));
};

export const polar = (r: number, theta: number) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
});

export const isNear = (coord1: Coord, coord2: Coord, threshold = 25) => {
  const d = distance(coord1, coord2);
  return d < threshold;
};

export const getTh = (coord: Coord) => {
  return Math.atan2(coord.y, coord.x);
};

export const multiply = (coord1: Coord, coord2: Coord) => {
  const r = getR(coord1) * getR(coord2);
  const th = getTh(coord1) + getTh(coord2);
  return polar(r, th);
};

export const divide = (coord1: Coord, coord2: Coord) => {
  const r = getR(coord1) / getR(coord2);
  const th = getTh(coord1) - getTh(coord2);
  return polar(r, th);
};

export const isOrigin = (coord: Coord) => {
  return coord.x == 0 && coord.y == 0;
};

export const log = (coord: Coord, n = 0) => {
  const x = Math.log(getR(coord));
  const y = getTh(coord) + 2 * Math.PI * n;
  return { x, y };
};

export const exp = (coord: Coord) => {
  const r = Math.exp(coord.x);
  const th = coord.y;
  return polar(r, th);
};

export const nearestN = (principal: Coord, guess: Coord) => {
  let ySol = principal.y;
  let yGuess = guess.y;
  let circles = 0;
  let diff = ySol - yGuess;
  while (Math.abs(diff) > Math.PI) {
    let yPos = ySol + 2 * Math.PI;
    let yNeg = ySol - 2 * Math.PI;
    if (Math.abs(yGuess - yPos) < Math.abs(yGuess - yNeg)) {
      circles++;
      ySol = yPos;
    } else {
      circles--;
      ySol = yNeg;
    }
    diff = ySol - yGuess;
  }
  return circles;
};
