/**
 *
 */

import { Maze, MazeSquare, SideType } from "./mazeModel.js";
import { MazeDrawer } from "./mazeDraw.js";

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

  const maze = new Maze(mazeWidth, mazeHeight);
  const ctx = getMazeContext();
  const drawer = new MazeDrawer(ctx, wallSize, maze);

  maze.registerDrawer(drawer);
  maze.build();

  //drawer.drawMaze();

  return;
}

const clearMaze = () => {
  console.log("Clearing maze");
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

  // this will get called whenever div dimension changes
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
  document.getElementById("clearMazeBut").onclick = clearMaze;

  const canvasDiv = document.querySelector(".canvasDiv");

  // start listening to web page size changes
  canvasDivObserver.observe(canvasDiv);
};
