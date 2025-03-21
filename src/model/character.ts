import type { Coordinates, PathFinderMap } from "./map";

export type Character = {
  coordinates: Coordinates;
  direction: PathFinderDirection;
  bucket: string[];
  trail: string[];
  crawlHistory: Coordinates[];
  map: PathFinderMap;
};

export enum PathFinderDirection {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  IDLE = "IDLE",
}
