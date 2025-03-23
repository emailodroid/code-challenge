import { PathChar, type Coordinates, type PathFinderMap } from "../model/map";

/**
 * Loads a map text file and converts it to a 2D array of characters
 * @param src - Path to the map file
 * @returns Promise<PathFinderMap> - 2D array representing the map
 * @throws Error if file cannot be read
 */
export const loadMap = async (src: string): Promise<PathFinderMap> => {
  try {
    const map = await Bun.file(src).text();
    const mapArray = map.split("\n").map((row) => row.split(""));
    return mapArray as PathFinderMap;
  } catch (error) {
    throw new Error(`Error reading map file: ${src}`);
  }
};

/**
 * Gets a character from a 2D array of characters at a given coordinates
 * @param map - 2D array of characters representing the map
 * @param coordinates - Coordinates of the character to get
 * @returns PathChar - Character at the given coordinates
 */
export const getCharByXY = (
  map: PathFinderMap,
  coordinates: number[]
): PathChar | string => {
  const [x, y] = coordinates;
  if (x === undefined || y === undefined) return PathChar.EMPTY;
  if (!!map[y] && map[y][x]) return map[y][x];
  return PathChar.EMPTY;
};

/**
 * Character coordinates sum used to lookup next position char in map
 * @param a - coordinates
 * @param b - coordinates to sum
 * @returns Coordinates - sum of a and b
 * @example
 * sumCoordinates([5, 5], [1, -1]) // [6, 4]
 */
export const sumCoordinates = (a: Coordinates, b: Coordinates): Coordinates => {
  return [a[0] + b[0], a[1] + b[1]];
};

/**
 * Finds the starting position of the map
 * (basic map validation is done here but it made me more sense to do path validation in crawl function... while drawing trail)
 * @param map - 2D array of characters representing the map
 * @returns CharacterCoordinates {x, y} - starting position of the map
 * @throws Error if no starting/end position is found
 */
export const findStartPosition = (map: PathFinderMap): Coordinates => {
  // find all starting positions
  const startingPositions = map.reduce((acc, row, y) => {
    return row.reduce((acc, char, x) => {
      if (char === PathChar.START) acc.push([x, y]);
      return acc;
    }, acc);
  }, [] as Coordinates[]);

  const hasEndPosition = map.some((row) => row.includes(PathChar.END));
  if (!hasEndPosition) throw new Error("Missing end character");

  // if more than one starting position found, throw error
  if (startingPositions.length > 1) throw new Error("Multiple starts");

  // get the first starting position
  const startingPosition = startingPositions[0];
  if (startingPosition) return startingPosition;

  // if no starting position found, throw error
  throw new Error("Missing start character");
};
