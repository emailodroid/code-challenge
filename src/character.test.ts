import { expect, test, describe } from "bun:test";
import {
  createCharacter,
  makesSenseMove,
  crawl,
  characterHeartBeat,
} from "./character";
import { PathChar, type PathFinderMap } from "./model/map";
import { PathFinderDirection } from "./model/character";
import { mapMock } from "./data/mock";

describe("Character", () => {
  describe("createCharacter", () => {
    test("creates character with initial properties", () => {
      const character = createCharacter(mapMock);
      expect(character).toEqual({
        coordinates: [1, 3],
        direction: PathFinderDirection.IDLE,
        bucket: [],
        trail: [],
        crawlHistory: [],
        map: mapMock,
      });
    });
  });

  describe("makesSenseMove", () => {
    test("validates vertical movements", () => {
      expect(makesSenseMove(PathChar.VERTICAL, PathFinderDirection.UP)).toBe(
        true
      );
      expect(makesSenseMove(PathChar.VERTICAL, PathFinderDirection.DOWN)).toBe(
        true
      );
      expect(makesSenseMove(PathChar.VERTICAL, PathFinderDirection.LEFT)).toBe(
        false
      );
      expect(makesSenseMove(PathChar.VERTICAL, PathFinderDirection.RIGHT)).toBe(
        false
      );
    });

    test("validates horizontal movements", () => {
      expect(
        makesSenseMove(PathChar.HORIZONTAL, PathFinderDirection.LEFT)
      ).toBe(true);
      expect(
        makesSenseMove(PathChar.HORIZONTAL, PathFinderDirection.RIGHT)
      ).toBe(true);
      expect(makesSenseMove(PathChar.HORIZONTAL, PathFinderDirection.UP)).toBe(
        false
      );
      expect(
        makesSenseMove(PathChar.HORIZONTAL, PathFinderDirection.DOWN)
      ).toBe(false);
    });

    test("validates intersection movements", () => {
      expect(
        makesSenseMove(PathChar.INTERSECTION, PathFinderDirection.UP)
      ).toBe(true);
      expect(
        makesSenseMove(PathChar.INTERSECTION, PathFinderDirection.DOWN)
      ).toBe(true);
      expect(
        makesSenseMove(PathChar.INTERSECTION, PathFinderDirection.LEFT)
      ).toBe(true);
      expect(
        makesSenseMove(PathChar.INTERSECTION, PathFinderDirection.RIGHT)
      ).toBe(true);
    });
  });

  describe("crawl and characterHeartBeat", () => {
    test("follows complete path and collects all letters", () => {
      const character = createCharacter(mapMock);

      characterHeartBeat(character);

      // Check if all letters were collected in the correct order
      expect(character.bucket).toEqual(["T", "E", "S", "T", "I", "N", "G"]);

      // Verify the path reached the end
      expect(character.coordinates).toEqual([13, 7]); // x position

      expect(character.trail.join("")).toEqual(
        "@-T-E-+|+-+|E||+-S-T-+|I|+-+|+-I-+|NG|x"
      );
    });
  });
});
