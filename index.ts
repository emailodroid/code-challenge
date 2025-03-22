import { pathFinder } from "./src";
import { loadMap } from "./src/utils/map";

const MAP_SRC = "./maps/map1.txt";

const map = await loadMap(MAP_SRC);

pathFinder(map);
