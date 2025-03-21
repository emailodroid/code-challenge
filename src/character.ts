import { characterDirections, oppositeDirections, pickupRegex } from "./conf";
import { PathChar, type PathFinderMap } from "./model/map";
import { PathFinderDirection, type Character } from "./model/character";
import { findStartPosition, getCharByXY, sumCoordinates } from "./utils/map";

/**
 * Creates a character with initial properties
 * @param map - 2D array of characters representing the map
 * @returns Character - character with initial properties
 */
export const createCharacter = (map: PathFinderMap): Character => {
  return {
    coordinates: findStartPosition(map),
    direction: PathFinderDirection.IDLE,
    bucket: [],
    trail: [],
    crawlHistory: [],
    map,
  };
};

/**
 * Checks if a character can move in a given direction (pipe or dash)
 * @param char - character to check
 * @param direction - direction to check
 * @returns boolean - true if character can move in direction, false otherwise
 */
const makesSenseMove = (
  char: PathChar,
  direction: PathFinderDirection
): boolean => {
  if ([PathFinderDirection.UP, PathFinderDirection.DOWN].includes(direction))
    return char === PathChar.VERTICAL || char === PathChar.INTERSECTION;

  if ([PathFinderDirection.LEFT, PathFinderDirection.RIGHT].includes(direction))
    return char === PathChar.HORIZONTAL || char === PathChar.INTERSECTION;

  return false;
};

/**
 * Crawls the map collecting letters and leaving trail
 * @param character - character to crawl
 * @returns boolean - true if character has found a next position, false otherwise (throws error)
 */
const crawl = (character: Character): boolean => {
  let knowWhereToGo = false;

  const currentPlayerCoordinates = character.coordinates;
  const currentChar = getCharByXY(character.map, currentPlayerCoordinates);

  // save character to crawl history 📝
  character.crawlHistory.push(currentPlayerCoordinates);

  // leave trail of current position 🌳
  character.trail.push(currentChar);

  if (PathChar.END === currentChar) return false;

  if (PathChar.EMPTY === currentChar) throw new Error("Broken path");

  // pickup current 🍎 (char) to bucket
  // check if char already picked up
  if (pickupRegex.test(currentChar)) {
    const checkHistory = character.crawlHistory.filter((historyLog) => {
      return (
        historyLog[0] === currentPlayerCoordinates[0] &&
        historyLog[1] === currentPlayerCoordinates[1]
      );
    });

    // if there more results from history its already in bucket
    if (checkHistory.length === 1) character.bucket.push(currentChar);
  }

  // Character is on the path
  if (
    [PathChar.HORIZONTAL, PathChar.VERTICAL].includes(currentChar) ||
    pickupRegex.test(currentChar)
  ) {
    const seekNextPosition = sumCoordinates(
      character.coordinates,
      characterDirections[character.direction]
    );
    const lookupChar = getCharByXY(character.map, seekNextPosition);

    character.coordinates = seekNextPosition;
    knowWhereToGo = true;
  }

  // Character determines the direction to move
  if ([PathChar.START, PathChar.INTERSECTION].includes(currentChar)) {
    [
      PathFinderDirection.UP,
      PathFinderDirection.RIGHT,
      PathFinderDirection.DOWN,
      PathFinderDirection.LEFT,
    ]
      .filter((dir) => {
        // At START, allow all directions
        if (currentChar === PathChar.START) return true;

        // At INTERSECTION, don't allow going back the way we came
        return dir !== oppositeDirections[character.direction];
      })
      .forEach((direction) => {
        const seekNextPosition = sumCoordinates(
          currentPlayerCoordinates,
          characterDirections[direction]
        );

        const lookupChar = getCharByXY(character.map, seekNextPosition);

        if (makesSenseMove(lookupChar, direction)) {
          if (!knowWhereToGo) {
            character.direction = direction;
            character.coordinates = seekNextPosition;
            knowWhereToGo = true;
          }
        }
      });
  }

  return knowWhereToGo;
};

/**
 * Pathfinder heartbeat ❤️
 * Crawls the map and updates the character properties
 * @param character - character to crawl
 */
export const characterHeartBeat = (character: Character) => {
  const nextPosition = crawl(character);
  if (nextPosition) characterHeartBeat(character);
};
