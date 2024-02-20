/**
 *
 */

import { Maze, MazeSquare, SideType } from "./mazeModel.js";

const getMazeCanvas = () => {
  const canvas = document.getElementById("mazeCanvas");
  return canvas;
};

const getMazeContext = () => {
  const ctx = getMazeCanvas().getContext("2d");
  return ctx;
};

function generateMaze() {
  clearMaze();
  console.log("Generating maze");

  let wallSize = 5; //getSquareSize();

  let width = getMazeCanvas().width;
  let height = getMazeCanvas().height;

  let mazeWidth = Math.floor(width / wallSize) - 2;
  let mazeHeight = Math.floor(height / wallSize) - 2;

  console.log(
    `canvas width, height = ${width}, ${height}.  Maze size is ${mazeWidth}, ${mazeHeight}`
  );

  const maze = new Maze(mazeWidth, mazeHeight);

  //console.log(maze);

  const ctx = getMazeContext();

  let wallBrushWidth = 2;
  let wallColour = "#000000";
  let pathColour = "#FF0000";

  ctx.strokeStyle = wallColour;
  ctx.lineWidth = wallBrushWidth;

  let yOffset = 6;

  for (let y = 0; y < maze.getHeight(); y++) {
    let xOffset = 5;
    for (let x = 0; x < maze.getWidth(); x++) {
      let sqr = maze.getSquare(x, y);

      // Top
      if (sqr.getTop() === SideType.Wall) {
        ctx.beginPath();
        ctx.moveTo(xOffset, yOffset);
        ctx.lineTo(xOffset + wallSize, yOffset);
        ctx.stroke();
      }
      // Right
      if (sqr.getRight() === SideType.Wall) {
        ctx.beginPath();
        ctx.moveTo(xOffset + wallSize, yOffset);
        ctx.lineTo(xOffset + wallSize, yOffset + wallSize);
        ctx.stroke();
      }
      // Bottom
      if (sqr.getBottom() === SideType.Wall) {
        ctx.beginPath();
        ctx.moveTo(xOffset, yOffset + wallSize);
        ctx.lineTo(xOffset + wallSize, yOffset + wallSize);
        ctx.stroke();
      }
      // Left
      if (sqr.getLeft() === SideType.Wall) {
        ctx.beginPath();
        ctx.moveTo(xOffset, yOffset);
        ctx.lineTo(xOffset, yOffset + wallSize);
        ctx.stroke();
      }

      if (sqr.isOnPath()) {
        ctx.strokeStyle = pathColour;

        let pathBrushWidth = Math.max(1, wallSize - 2 * wallBrushWidth);

        ctx.lineWidth = pathBrushWidth;

        // Top
        if (sqr.getTop() === SideType.DoorIn) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize / 2, yOffset);
          ctx.lineTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.stroke();
        }
        // Right
        if (sqr.getRight() === SideType.DoorIn) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize, yOffset + wallSize / 2);
          ctx.lineTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.stroke();
        }
        // Bottom
        if (sqr.getBottom() === SideType.DoorIn) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize / 2, yOffset + wallSize);
          ctx.lineTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.stroke();
        }
        // Left
        if (sqr.getLeft() === SideType.DoorIn) {
          ctx.beginPath();
          ctx.moveTo(xOffset, yOffset + wallSize / 2);
          ctx.lineTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.stroke();
        }
        // Top
        if (sqr.getTop() === SideType.DoorOut) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.lineTo(xOffset + wallSize / 2, yOffset);
          ctx.stroke();
        }
        // Right
        if (sqr.getRight() === SideType.DoorOut) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.lineTo(xOffset + wallSize, yOffset + wallSize / 2);
          ctx.stroke();
        }
        // Bottom
        if (sqr.getBottom() === SideType.DoorOut) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.lineTo(xOffset + wallSize / 2, yOffset + wallSize);
          ctx.stroke();
        }
        // Left
        if (sqr.getLeft() === SideType.DoorOut) {
          ctx.beginPath();
          ctx.moveTo(xOffset + wallSize / 2, yOffset + wallSize / 2);
          ctx.lineTo(xOffset, yOffset + wallSize / 2);
          ctx.stroke();
        }

        ctx.strokeStyle = wallColour;
        ctx.lineWidth = wallBrushWidth;
      }

      xOffset = xOffset + wallSize;
    }
    yOffset = yOffset + wallSize;
  }
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

  // canvas.style.position = "absolute";

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

  // start listening to changes
  canvasDivObserver.observe(canvasDiv);
};
