import {
  CHARACTER_DIRECTIONS,
  OPPOSITE_DIRECTIONS,
  PICKUP_REGEX,
  POSIBLE_MAP_CHARS,
} from "./conf";
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
  if (char === PathChar.END) return true;

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

  // validate current char
  if (
    !POSIBLE_MAP_CHARS.includes(currentChar) &&
    !PICKUP_REGEX.test(currentChar)
  ) {
    throw new Error("unsupported char");
  }

  // save character to crawl history 📝
  character.crawlHistory.push(currentPlayerCoordinates);

  // leave trail of current position 🌳
  character.trail.push(currentChar);

  if (PathChar.END === currentChar) return false;

  // if (PathChar.EMPTY === currentChar || !currentChar)
  //   throw new Error("Missing end character");

  // pickup current 🍎 (char) to bucket
  // check if char already picked up
  if (PICKUP_REGEX.test(currentChar)) {
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
    PICKUP_REGEX.test(currentChar)
  ) {
    const nextPosition = sumCoordinates(
      character.coordinates,
      CHARACTER_DIRECTIONS[character.direction]
    );
    const lookupChar = getCharByXY(character.map, nextPosition);
    if (lookupChar !== PathChar.EMPTY) {
      // move character to next position
      character.coordinates = nextPosition;
      knowWhereToGo = true;
    }
  }

  // Character determines the direction to move
  if (
    [PathChar.START, PathChar.INTERSECTION].includes(currentChar) ||
    PICKUP_REGEX.test(currentChar)
  ) {
    // check for fake turn
    if (currentChar === PathChar.INTERSECTION) {
      const lookupChar = getCharByXY(
        character.map,
        sumCoordinates(
          character.coordinates,
          CHARACTER_DIRECTIONS[character.direction]
        )
      );
      if (makesSenseMove(lookupChar, character.direction))
        throw new Error("Fake turn");
    }

    const posibleNextPositions = [];

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
        return dir !== OPPOSITE_DIRECTIONS[character.direction];
      })
      .forEach((direction) => {
        const nextPosition = sumCoordinates(
          currentPlayerCoordinates,
          CHARACTER_DIRECTIONS[direction]
        );

        const lookupChar = getCharByXY(character.map, nextPosition);

        if (
          makesSenseMove(lookupChar, direction) ||
          PICKUP_REGEX.test(lookupChar)
        ) {
          // if already know where to go, throw error
          posibleNextPositions.push(lookupChar);

          if (!knowWhereToGo) {
            // move character to next posible position
            character.direction = direction;
            character.coordinates = nextPosition;
            knowWhereToGo = true;
          }
        }
      });

    // if you are on intersection or start and have more than one posible next positions, throw error
    if (posibleNextPositions.length > 1) {
      if (currentChar === PathChar.INTERSECTION) throw new Error("Forke path");
      if (currentChar === PathChar.START) throw new Error("Multiple starts");
    }
  }
  if (!knowWhereToGo) throw new Error("Broken path");
  return knowWhereToGo;
};

/**
 * Character heartbeat ❤️
 * Crawls the map and updates the character properties
 * @param character - character to crawl
 */
export const characterHeartBeat = (character: Character) => {
  const nextPosition = crawl(character);
  if (nextPosition) characterHeartBeat(character);
};
