import * as PIXI from "pixi.js";

import "./style.css";

import World from "./components/World";
import Game from "./components/Game";

const world = new World(150, 90, 10, 1, 0xb770db, 0xb770db);
const game = new Game(world);

const startBtn = document.getElementById("startBtn");
const randomBtn = document.getElementById("randomBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

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
