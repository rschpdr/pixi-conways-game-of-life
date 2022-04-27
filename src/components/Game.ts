import * as PIXI from "pixi.js";

import World from "./World";
import Cell from "./Cell";

const generationCount = document.getElementById("generationCount");

export default class Game {
  world: World;
  pixiApp: null | PIXI.Application;
  spriteGrid: PIXI.Sprite[][];
  elapsed: number;
  generations: number;
  isPointerPressed: boolean;

  constructor(world: World) {
    this.world = world;
    this.pixiApp = null;
    this.spriteGrid = [];
    this.elapsed = 0;
    this.generations = 0;
    this.isPointerPressed = false;

    this.createScene();
  }

  createScene() {
    this.pixiApp = new PIXI.Application({
      backgroundColor: this.world.containerBackgroundColor,
    });

    document.getElementById("canvasContainer")?.appendChild(this.pixiApp.view);

    // Resize canvas to fit content
    this.pixiApp.renderer.resize(
      this.world.rowCount * this.world.cellSize,
      this.world.colCount * this.world.cellSize
    );

    this.world.generateEmptyGrid();

    const texture = this.generateTextureFromGraphics(this.world.grid[0][0]);
    // ParticleContainer doesnt support interaction ):p
    // const container = new PIXI.ParticleContainer(
    //   this.world.rowCount * this.world.colCount,
    //   { position: true, tint: true }
    // );
    const container = new PIXI.Container();
    this.spriteGrid = [];

    for (let [i, row] of this.world.grid.entries()) {
      this.spriteGrid.push([]);
      for (let [j, cell] of row.entries()) {
        const sprite = new PIXI.Sprite(texture);

        sprite.interactive = true;
        sprite.on("pointerdown", () => {
          this.isPointerPressed = true;
          this.handleUserInteraction(i, j);
        });

        sprite.on("pointerup", () => {
          this.isPointerPressed = false;
        });

        sprite.on("pointerover", () => {
          if (this.isPointerPressed) {
            this.handleUserInteraction(i, j);
          }
        });

        sprite.alpha = 1;
        sprite.x = cell.x * cell.width;
        sprite.y = cell.y * cell.height;
        this.spriteGrid[i][j] = sprite;
        container.addChild(sprite);
      }
    }

    this.pixiApp.stage.addChild(container);

    this.pixiApp.ticker.add((delta) => {
      this.elapsed += delta;

      // Slow animation down a bit
      if (
        Math.floor(this.elapsed) %
          Math.floor(10 / this.world.simulationSpeed) ===
        0
      ) {
        if (this.world.isRunning) {
          this.updateScene();
        }
      }
    });

    this.generations = 0;
  }

  destroyCurrentScene() {
    this.resetGrid();

    if (this.pixiApp) {
      this.pixiApp.destroy(true, true);
    }
  }

  startSimulation() {
    this.world.isRunning = true;
  }

  updateScene(disableFade = false) {
    const newGeneration: Cell[][] = [];

    for (let [i, row] of this.world.grid.entries()) {
      newGeneration.push([]);
      for (let [j, cell] of row.entries()) {
        const neighborCount = this.world.checkNeighborCount(cell);

        const newCell = this.world.updateCellStatus(cell, neighborCount);

        newGeneration[i][j] = newCell;
        this.generations++;
      }
    }

    for (let [i, row] of newGeneration.entries()) {
      for (let [j, cell] of row.entries()) {
        this.world.grid[i][j] = { ...cell };

        if (cell.status) {
          this.spriteGrid[i][j].alpha = 0;
        } else {
          if (disableFade) {
            this.spriteGrid[i][j].alpha = 1;
            continue;
          }

          if (this.spriteGrid[i][j].alpha < 1) {
            this.spriteGrid[i][j].alpha += 0.2;
          }
        }

        // this.spriteGrid[i][j].tint = cell.status ? 0x000000 : 0xffffff;
      }
    }
  }

  randomGrid() {
    this.world.generateRandomLiveCells();

    // Manually render the newly alive cells if the game is not running
    if (!this.world.isRunning) {
      this.updateScene();
      // Because updateScene() will run for every cell to show the new random alive ones we have to manually reset generations again
      this.generations = 0;
    }
  }

  resetGrid() {
    this.stopSimulation();

    this.world.generateEmptyGrid();
    this.updateScene(true);
    this.generations = 0;
  }

  stopSimulation() {
    this.world.isRunning = false;
  }

  handleUserInteraction(x: number, y: number) {
    this.world.grid[x][y].status = this.world.grid[x][y].status === 0 ? 1 : 0;

    // Bypass update loop to prevent updateScene() from killing cells that the user just made alive
    this.spriteGrid[x][y].alpha =
      Math.floor(this.spriteGrid[x][y].alpha) === 0 ? 1 : 0;
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

    const texture = this.pixiApp?.renderer.generateTexture(graphic);

    return texture;
  }
}
