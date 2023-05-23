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

export const add = (coord1: Coord, coord2: Coord) => ({
  x: coord1.x + coord2.x,
  y: coord1.y + coord2.y,
});

export const distance = (coord1: Coord, coord2: Coord) => {
  return getR(subtract(coord1, coord2));
};
