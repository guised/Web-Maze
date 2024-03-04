/**
 *
 */

import Maze from "./mazeModel.js";
import MazeDrawer from "./mazeDraw.js";

const getMazeCanvas = () => {
  const canvas = document.getElementById("mazeCanvas");
  return canvas;
};

const getMazeContext = () => {
  const ctx = getMazeCanvas().getContext("2d");
  return ctx;
};

const getSquareSize = () => {
  const squareSizeInput = document.getElementById("squareSize");

  const dfltValue = parseInt(squareSizeInput.getAttribute("value"));
  const minValue = parseInt(squareSizeInput.getAttribute("min"));
  const maxValue = parseInt(squareSizeInput.getAttribute("max"));

  let squareSize = parseInt(squareSizeInput.value);

  if (isNaN(squareSize) || squareSize < minValue || squareSize > maxValue) {
    alert(
      `Incorrect square size value.\nShould be a px value between ${minValue} and ${maxValue}\nResetting back to ${dfltValue}`
    );
    squareSizeInput.value = dfltValue;
    squareSize = dfltValue;
  }

  return squareSize;
};

const getSpeedFactor = () => {
  const mazeSpeedInput = document.getElementById("mazeSpeed");
  const value = parseInt(mazeSpeedInput.value);
  return value;
};

const saveMaze = (maze) => {
  localStorage.setItem("lastMaze", JSON.stringify(maze));
};

// Variable shared between generate and clear actions
let maze = null;
let drawMazeIntervalId;
let solveMazeIntervalId;

function generateMaze() {
  clearMaze();
  console.log(`Generating maze, with square size of ${getSquareSize()}`);

  const wallSize = getSquareSize();

  let width = getMazeCanvas().width;
  let height = getMazeCanvas().height;

  let mazeWidth = Math.floor(width / wallSize) - 2;
  let mazeHeight = Math.floor(height / wallSize) - 2;

  console.log(
    `canvas width, height = ${width}, ${height}.  Maze size is ${mazeWidth}, ${mazeHeight}`
  );

  maze = new Maze(mazeWidth, mazeHeight);
  const ctx = getMazeContext();
  const drawer = new MazeDrawer(ctx, wallSize);

  maze.initialiseMaze();

  drawMazeIntervalId = setInterval(() => {
    let percent = getSpeedFactor() / 100;
    let factor = Math.floor(maze.getWidth() * maze.getHeight() * percent);

    let sqnum = maze.stepCreate();

    while (factor > 0 && sqnum >= 0) {
      sqnum = maze.stepCreate();
      factor--;
    }

    drawer.draw(maze);

    if (sqnum < 0) {
      clearInterval(drawMazeIntervalId);
      saveMaze(maze);
    }
  }, 20);

  return;
}

const solveMaze = () => {
  if (maze !== null) {
    console.log("Solving maze");

    const wallSize = getSquareSize();
    const ctx = getMazeContext();
    const drawer = new MazeDrawer(ctx, wallSize);
    drawer.setPathColour("#00FF00");

    maze.initialiseSolver();
    // maze.solve();
    // drawer.draw(maze);
    // return;

    solveMazeIntervalId = setInterval(() => {
      let percent = getSpeedFactor() / 100;
      let factor = Math.floor(maze.getWidth() * maze.getHeight() * percent);

      let isComplete = maze.stepSolve();

      while (factor > 0 && !isComplete) {
        isComplete = maze.stepSolve();
        factor--;
      }

      drawer.draw(maze);

      if (isComplete) {
        clearInterval(solveMazeIntervalId);
      }
    }, 20);

    return;
  }
};

const clearMaze = () => {
  console.log("Clearing maze");
  maze = null;
  clearInterval(drawMazeIntervalId);
  clearInterval(solveMazeIntervalId);

  getMazeContext().clearRect(
    0,
    0,
    getMazeCanvas().width,
    getMazeCanvas().height
  );
};

const canvasDivObserver = new ResizeObserver((entries) => {
  const canvas = document.getElementById("mazeCanvas");

  console.log(
    `window.innerWidth = ${window.innerWidth}, window.innerHeight = ${window.innerHeight}`
  );

  // this will get called whenever canvasdiv dimension changes
  entries.forEach((entry) => {
    console.log("width", Math.max(1, Math.floor(entry.contentRect.width)));
    console.log("height", Math.max(1, Math.floor(entry.contentRect.height)));
    canvas.width = Math.max(1, Math.floor(entry.contentRect.width));
    canvas.height = Math.max(1, Math.floor(entry.contentRect.height));
  });
});

// App Starts here
window.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOMContent is loaded.  App ready to start!");
  initApp();
});

const initApp = () => {
  //- Mapp javascript functions to buttons.  Using a function pointer:
  document.getElementById("genMazeBut").onclick = generateMaze;
  document.getElementById("solveMazeBut").onclick = solveMaze;
  document.getElementById("clearMazeBut").onclick = clearMaze;

  const canvasDiv = document.querySelector(".canvasDiv");

  // start listening to web page size changes
  canvasDivObserver.observe(canvasDiv);
};
