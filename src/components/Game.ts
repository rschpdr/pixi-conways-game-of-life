import * as PIXI from "pixi.js";

import World from "./World";
import Cell from "./Cell";

export default class Game {
  world: World;
  pixiApp: PIXI.Application;
  spriteGrid: PIXI.Sprite[][];
  elapsed: number;

  constructor(world: World) {
    this.world = world;
    this.pixiApp = new PIXI.Application({ backgroundColor: 0xffffff });
    this.spriteGrid = [];
    this.elapsed = 0;

    document.body.appendChild(this.pixiApp.view);
    this.createScene();
  }

  createScene() {
    this.world.generateEmptyGrid();

    const texture = this.generateTextureFromGraphics(this.world.grid[0][0]);

    for (let [i, row] of this.world.grid.entries()) {
      this.spriteGrid.push([]);
      for (let [j, cell] of row.entries()) {
        const sprite = new PIXI.Sprite(texture);

        sprite.interactive = true;
        sprite.on("pointerdown", () => this.handleUserInteraction(i, j));

        sprite.alpha = 0;
        sprite.x = cell.x * cell.width;
        sprite.y = cell.y * cell.height;
        this.spriteGrid[i][j] = sprite;
        this.pixiApp.stage.addChild(sprite);
      }
    }

    this.pixiApp.ticker.add((delta) => {
      this.elapsed += delta;

      // Slow animation down a bit
      if (Math.floor(this.elapsed) % 5 === 0) {
        if (this.world.isRunning) {
          this.updateScene();
        }
      }
    });
  }

  startSimulation() {
    this.world.isRunning = true;
  }

  updateScene() {
    const newGeneration: Cell[][] = [];

    for (let [i, row] of this.world.grid.entries()) {
      newGeneration.push([]);
      for (let [j, cell] of row.entries()) {
        const neighborCount = this.world.checkNeighborCount(cell);

        const newCell = this.world.updateCellStatus(cell, neighborCount);

        newGeneration[i][j] = newCell;
      }
    }

    for (let [i, row] of newGeneration.entries()) {
      for (let [j, cell] of row.entries()) {
        this.world.grid[i][j] = { ...cell };

        if (cell.status) {
          this.spriteGrid[i][j].alpha = 1;
        } else {
          if (this.spriteGrid[i][j].alpha > 0) {
            this.spriteGrid[i][j].alpha -= 0.2;
          }
        }
        // this.spriteGrid[i][j].tint = cell.status ? 0x000000 : 0xffffff;
      }
    }

    // for (let [i, row] of this.world.grid.entries()) {
    //   for (let [j, cell] of row.entries()) {
    //     this.world.grid[i][j].status = this.world.grid[i][j].nextStatus;

    //     // make alive cells black and dead cells white
    //     const prevTint = this.spriteGrid[i][j].tint;
    //     this.spriteGrid[i][j].tint = this.world.grid[i][j].status
    //       ? 0x000000
    //       : 0xffffff;

    //     if (prevTint !== this.spriteGrid[i][j].tint) {
    //       console.log("mudou");
    //     }
    //   }
    // }
  }

  randomGrid() {
    this.world.generateRandomLiveCells();

    // Manually render the newly alive cells if the game is not running
    if (!this.world.isRunning) {
      this.updateScene();
    }
  }

  resetGrid() {
    this.stopSimulation();
    this.world.grid = [];

    this.world.generateEmptyGrid();
    this.updateScene();
  }

  stopSimulation() {
    this.world.isRunning = false;
  }

  handleUserInteraction(x: number, y: number) {
    this.world.grid[x][y].status = this.world.grid[x][y].status === 0 ? 1 : 0;

    if (!this.world.isRunning) {
      this.updateScene();
    }
  }

  generateTextureFromGraphics(cell: Cell) {
    const graphic = new PIXI.Graphics();

    graphic.lineStyle(cell.lineWidth, cell.lineColor);
    graphic.beginFill(cell.backgroundColor);
    graphic.drawRect(
      cell.x * cell.width,
      cell.y * cell.height,
      cell.width - 2 * cell.lineWidth,
      cell.height - 2 * cell.lineWidth
    );
    graphic.endFill();

    const texture = this.pixiApp.renderer.generateTexture(graphic);

    return texture;
  }
}
