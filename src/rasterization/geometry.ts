export type Point = [number, number];
export type Line = [Point, Point];

export interface EdgeEntry {
  ymin: number;
  ymax: number;
  x: number;
  islope: number;
}

export interface ActiveEdgeEntry {
  s: number;
  edge: EdgeEntry;
}