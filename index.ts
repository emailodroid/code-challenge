import { pathFinder } from "./src";
import { loadMap } from "./src/utils/map";

const MAPS = [
  "./maps/map1.txt",
  "./maps/map2.txt",
  "./maps/map3.txt",
  "./maps/map4.txt",
  "./maps/map5.txt",
  "./maps/map6.txt",
  "./maps/map7.txt",
];

for (const MAP_SRC of MAPS) {
  const map = await loadMap(MAP_SRC);
  console.log(`\n\n 🗺️ \x1b[33m ${MAP_SRC} \x1b[0m \n`);
  pathFinder(map);
}

process.exit(0);
