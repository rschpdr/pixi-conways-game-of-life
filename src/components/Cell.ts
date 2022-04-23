import * as PIXI from "pixi.js";

export default class Cell {
  x: number;
  y: number;
  width: number;
  height: number;
  status: 0 | 1; // 0 = dead, 1 = alive
  nextStatus: 0 | 1;
  lineWidth: number;
  lineColor: number;
  backgroundColor: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    lineWidth: number,
    lineColor: number,
    backgroundColor: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.backgroundColor = backgroundColor;
    this.status = 0;
    this.nextStatus = 0;
  }
}
