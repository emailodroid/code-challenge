import { PathFinderDirection } from "../model/character";
import type { Coordinates } from "../model/map";

/**
 * All posible character moves
 */
export const characterDirections: Record<PathFinderDirection, Coordinates> = {
  [PathFinderDirection.UP]: [0, -1],
  [PathFinderDirection.DOWN]: [0, 1],
  [PathFinderDirection.LEFT]: [-1, 0],
  [PathFinderDirection.RIGHT]: [1, 0],
  [PathFinderDirection.IDLE]: [0, 0],
};

/**
 * Opposite directions cuz...
 */
export const oppositeDirections = {
  [PathFinderDirection.UP]: PathFinderDirection.DOWN,
  [PathFinderDirection.DOWN]: PathFinderDirection.UP,
  [PathFinderDirection.LEFT]: PathFinderDirection.RIGHT,
  [PathFinderDirection.RIGHT]: PathFinderDirection.LEFT,
  [PathFinderDirection.IDLE]: PathFinderDirection.IDLE,
};

/**
 * Regex to check if a character whant to pick up a char
 */
export const pickupRegex = /[A-Z]/;
