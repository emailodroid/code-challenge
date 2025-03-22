import type { PathFinderMap } from "../model/map";

export const mapMock = [
  [" ", " ", " ", " ", " ", "+", "-", "S", "-", "T", "-", "+"],
  [" ", " ", " ", " ", " ", "|", " ", " ", " ", " ", " ", "|"],
  [" ", " ", " ", " ", " ", "|", " ", " ", " ", "+", "-", "I", "-", "+"],
  [" ", "@", "-", "T", "-", "E", "-", "+", " ", "|", " ", "|", " ", "|"],
  [" ", " ", " ", " ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "N"],
  [" ", " ", " ", " ", " ", "+", "-", "+", " ", " ", " ", " ", " ", "G"],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
] as PathFinderMap;

export const mapMockBrokenPath = [
  [" ", " ", " ", " ", " ", "+", "-", "S", "-", "T", "-", "+"],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
  [" ", " ", " ", " ", " ", "|", " ", " ", " ", "+", "-", "I", "-", "+"],
  [" ", "@", "-", "T", "-", "E", "-", "+", " ", "|", " ", "|", " ", "|"],
  [" ", " ", " ", " ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "N"],
  [" ", " ", " ", " ", " ", "+", "-", "+", " ", " ", " ", " ", " ", "G"],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
] as PathFinderMap;
