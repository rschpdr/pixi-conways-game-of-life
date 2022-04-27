import "./style.css";
import config from "../config.json";

import World from "./components/World";
import Game from "./components/Game";

const {
  rowCount,
  colCount,
  containerBackgroundColor,
  cellSize,
  cellLineWidth,
  cellLineColor,
  cellBackgroundColor,
  randomAliveChance,
  simulationSpeed,
} = config;

const world = new World({
  rowCount,
  colCount,
  containerBackgroundColor: parseInt(
    containerBackgroundColor.replace("#", ""),
    16
  ),
  cellSize,
  cellLineWidth,
  cellLineColor: parseInt(cellLineColor.replace("#", ""), 16),
  cellBackgroundColor: parseInt(cellBackgroundColor.replace("#", ""), 16),
  randomAliveChance,
  simulationSpeed,
});
const game = new Game(world);

const startBtn = document.getElementById("startBtn");
const randomBtn = document.getElementById("randomBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const rowCountInput = <HTMLInputElement>(
  document.getElementById("rowCountInput")
);
const colCountInput = <HTMLInputElement>(
  document.getElementById("colCountInput")
);
const bgColorInput = <HTMLInputElement>document.getElementById("bgColorInput");
const cellSizeInput = <HTMLInputElement>(
  document.getElementById("cellSizeInput")
);
const cellColorInput = <HTMLInputElement>(
  document.getElementById("cellColorInput")
);
const simulationSpeedInput = <HTMLInputElement>(
  document.getElementById("simulationSpeedInput")
);
const applyBtn = document.getElementById("applyBtn");

window.addEventListener("load", () => {
  rowCountInput.value = `${rowCount}`;
  colCountInput.value = `${colCount}`;
  bgColorInput.value = `${containerBackgroundColor}`;
  cellSizeInput.value = `${cellSize}`;
  cellColorInput.value = `${cellBackgroundColor}`;
  simulationSpeedInput.value = `${simulationSpeed}`;
});

startBtn?.addEventListener("click", () => {
  game.startSimulation();
});

randomBtn?.addEventListener("click", () => {
  game.randomGrid();
});

stopBtn?.addEventListener("click", () => {
  game.stopSimulation();
});

resetBtn?.addEventListener("click", () => {
  game.resetGrid();
});

applyBtn?.addEventListener("click", () => {
  game.destroyCurrentScene();

  game.world.rowCount = rowCountInput?.valueAsNumber || rowCount;

  game.world.colCount = colCountInput.valueAsNumber || colCount;

  game.world.containerBackgroundColor = parseInt(
    bgColorInput.value.replace("#", "") ||
      containerBackgroundColor.replace("#", ""),
    16
  );

  game.world.cellSize = cellSizeInput.valueAsNumber || cellSize;

  game.world.cellLineColor = parseInt(
    cellColorInput.value.replace("#", "") ||
      cellBackgroundColor.replace("#", ""),
    16
  );

  game.world.cellBackgroundColor = parseInt(
    cellColorInput.value.replace("#", "") || cellLineColor.replace("#", ""),
    16
  );

  game.world.simulationSpeed = simulationSpeedInput.valueAsNumber;

  game.createScene();
});
