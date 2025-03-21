import type { PathFinderMap } from "./model/map";
import { createCharacter, characterHeartBeat } from "./character";

export const pathFinder = (map: PathFinderMap) => {
  const character = createCharacter(map);
  characterHeartBeat(character);

  console.log(
    "Letters:",
    character.bucket.join(""),
    "\nPath as characters:",
    character.trail.join("")
  );
};
