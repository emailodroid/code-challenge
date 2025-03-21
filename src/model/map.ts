export const enum PathChar {
  START = "@",
  INTERSECTION = "+",
  HORIZONTAL = "-",
  VERTICAL = "|",
  END = "x",
  EMPTY = " ",
}

export type PathFinderMap = PathChar[][];

export type Coordinates = [number, number];
