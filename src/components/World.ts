import Cell from "./Cell";

export default class World {
  rowCount: number;
  colCount: number;
  grid: Cell[][];
  isRunning: boolean;
  cellSize: number;
  cellLineWidth: number;
  cellLineColor: number;
  cellBackgroundColor: number;
  randomAliveChance: number;
  possibleNeighborPositions: number[][];

  constructor(
    rowCount: number,
    colCount: number,
    cellSize: number,
    cellLineWidth: number,
    cellLineColor: number,
    cellBackgroundColor: number,
    randomAliveChance?: number | undefined
  ) {
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.grid = [];
    this.isRunning = false;
    this.cellSize = cellSize;
    this.cellLineWidth = cellLineWidth;
    this.cellLineColor = cellLineColor;
    this.cellBackgroundColor = cellBackgroundColor;
    this.randomAliveChance = randomAliveChance || 0.7;
    this.possibleNeighborPositions = [
      [0, 1],
      [0, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
    ];
  }

  generateEmptyGrid() {
    for (let i = 0; i < this.rowCount; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.colCount; j++) {
        this.grid[i][j] = new Cell(
          i,
          j,
          this.cellSize,
          this.cellSize,
          this.cellLineWidth,
          this.cellLineColor,
          this.cellBackgroundColor
        );
      }
    }
  }

  generateRandomLiveCells() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        this.grid[i][j].status = Math.random() > this.randomAliveChance ? 1 : 0;
      }
    }
  }

  checkNeighborCount(cell: Cell) {
    const { x, y } = cell;
    let neighborCount = 0;

    for (let [row, col] of this.possibleNeighborPositions) {
      const targetRow = x + row;
      const targetCol = y + col;

      // Check if we're not at grid extremities
      if (
        targetRow >= 0 &&
        targetRow < this.grid.length - 1 &&
        targetCol >= 0 &&
        targetCol < this.grid[x].length - 1
      ) {
        neighborCount += this.grid[targetRow][targetCol].status;
      }
    }

    return neighborCount;
  }

  updateCellStatus(cell: Cell, neighborCount: number): Cell {
    const { x, y } = cell;

    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    if (neighborCount < 2 || neighborCount > 3) {
      return { ...cell, status: 0 };
    }

    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    if (this.grid[x][y].status === 0 && neighborCount === 3) {
      return { ...cell, status: 1 };
    }

    // Any live cell with two or three live neighbours lives on to the next generation.
    // this.grid[x][y].nextStatus = this.grid[x][y].status;
    return { ...cell };
  }
}
