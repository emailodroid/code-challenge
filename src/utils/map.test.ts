import { expect, test, describe } from "bun:test";
import { loadMap, getCharByXY, sumCoordinates, findStartPosition } from "./map";
import { PathChar, type PathFinderMap } from "../model/map";
import { mapMock } from "../data/mock";

describe("Map Utils", async () => {
  test("loadMap loads and parses map file correctly", async () => {
    const map = await loadMap("./maps/test.txt");
    expect(Array.isArray(map)).toBe(true);
    expect(Array.isArray(map[0])).toBe(true);
  });

  test("getCharByXY returns correct character", async () => {
    expect(getCharByXY(mapMock, [999, 999])).toBe(PathChar.EMPTY);
    expect(getCharByXY(mapMock, [0, 0])).toBe(PathChar.EMPTY);
    expect(getCharByXY(mapMock, [1, 3])).toBe(PathChar.START);
    expect(getCharByXY(mapMock, [3, 3])).toBe("T");
    expect(getCharByXY(mapMock, [4, 3])).toBe(PathChar.HORIZONTAL);
    expect(getCharByXY(mapMock, [13, 7])).toBe(PathChar.END);
  });

  test("sumCoordinates sums coordinates correctly", () => {
    expect(sumCoordinates([1, 1], [2, 2])).toEqual([3, 3]);
    expect(sumCoordinates([5, 5], [1, -1])).toEqual([6, 4]);
    expect(sumCoordinates([-1, -1], [1, 1])).toEqual([0, 0]);
  });

  describe("findStartPosition", () => {
    test("finds correct start position", () => {
      const mapMock = [
        [" ", " ", " "],
        ["@", "-", "x"],
        [" ", " ", " "],
      ] as PathFinderMap;
      expect(findStartPosition(mapMock)).toEqual([0, 1]);
    });

    test("throws error when no start character", () => {
      const mapMock = [
        [" ", " ", " "],
        [" ", "-", "x"],
        [" ", " ", " "],
      ] as PathFinderMap;
      expect(() => findStartPosition(mapMock)).toThrow(
        "Missing start character"
      );
    });

    test("throws error when multiple start characters", () => {
      const mapMock = [
        [" ", "@", " "],
        ["@", "-", "x"],
        [" ", " ", " "],
      ] as PathFinderMap;
      expect(() => findStartPosition(mapMock)).toThrow("Multiple starts");
    });

    test("throws error when no end character", () => {
      const mapMock = [
        [" ", " ", " "],
        ["@", "-", " "],
        [" ", " ", " "],
      ] as PathFinderMap;
      expect(() => findStartPosition(mapMock)).toThrow("Missing end character");
    });
  });
});
