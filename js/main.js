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
let drawer = null;
let generateMazeIntervalId;
let solveMazeIntervalId;
let interval = 20;

function getMazeDrawer() {
  if (drawer === null) {
    const wallSize = getSquareSize();
    const ctx = getMazeContext();
    drawer = new MazeDrawer(ctx, wallSize);

    const wallColour = document.getElementById("wallColour").value;
    drawer.setWallColour(wallColour);

    const pathColour = document.getElementById("pathColour").value;
    drawer.setPathColour(pathColour);
  }

  return drawer;
}

function generateMaze() {
  clearMaze();
  console.log(`Generating maze, with square size of ${getSquareSize()}`);

  let width = getMazeCanvas().width;
  let height = getMazeCanvas().height;

  const wallSize = getSquareSize();

  let mazeWidth = Math.floor(width / wallSize) - 2;
  let mazeHeight = Math.floor(height / wallSize) - 2;

  console.log(
    `canvas width, height = ${width}, ${height}.  Maze size is ${mazeWidth}, ${mazeHeight}`
  );

  getMazeDrawer().setWallSize(wallSize);
  const wallColour = document.getElementById("wallColour").value;
  getMazeDrawer().setWallColour(wallColour);

  const pathColour = document.getElementById("pathColour").value;
  getMazeDrawer().setPathColour(pathColour);

  maze = new Maze(mazeWidth, mazeHeight);

  maze.initialiseMaze();

  generateMazeIntervalId = setInterval(() => {
    let speed = getSpeedFactor();
    console.debug(`speed = ${speed}`);

    let factor = speed;
    // let factor = Math.floor(
    //   (maze.getWidth() * maze.getHeight() * percent) / 100
    // );

    let sqnum = maze.stepCreate();

    while (factor > 0 && sqnum >= 0) {
      sqnum = maze.stepCreate();
      getMazeDrawer().drawSquare(maze.getCurrentSquare());
      getMazeDrawer().drawSquare(maze.getPreviousSquare());
      factor--;
    }

    getMazeDrawer().drawSquare(maze.getCurrentSquare());
    getMazeDrawer().drawSquare(maze.getPreviousSquare());

    if (sqnum < 0) {
      clearInterval(generateMazeIntervalId);
      getMazeDrawer().draw(maze);
      saveMaze(maze);
      console.log("Maze generated.");
    }
  }, interval);

  return;
}

const solveMaze = () => {
  if (maze !== null) {
    console.log("Solving maze");

    const wallColour = document.getElementById("wallColour").value;
    getMazeDrawer().setWallColour(wallColour);

    const pathColour = document.getElementById("pathColour").value;
    getMazeDrawer().setPathColour(pathColour);

    maze.initialiseSolver();

    getMazeDrawer().draw(maze);

    solveMazeIntervalId = setInterval(() => {
      let speed = getSpeedFactor();
      console.debug(`speed = ${speed}`);

      let factor = speed;
      // let factor = Math.floor(
      //   (maze.getWidth() * maze.getHeight() * percent) / 100
      // );

      if (maze !== null) {
        let isComplete = maze.stepSolve();

        while (factor > 0 && !isComplete) {
          isComplete = maze.stepSolve();
          getMazeDrawer().drawSquare(maze.getCurrentSquare());
          getMazeDrawer().drawSquare(maze.getPreviousSquare());
          factor--;
        }

        getMazeDrawer().drawSquare(maze.getCurrentSquare());
        getMazeDrawer().drawSquare(maze.getPreviousSquare());

        if (isComplete) {
          clearInterval(solveMazeIntervalId);
          getMazeDrawer().draw(maze);
          console.log("Maze solved.");
        }
      }
    }, interval);

    return;
  }
};

const clearMaze = () => {
  console.log("Clearing maze");
  maze = null;
  clearInterval(generateMazeIntervalId);
  clearInterval(solveMazeIntervalId);

  getMazeContext().clearRect(
    0,
    0,
    getMazeCanvas().width,
    getMazeCanvas().height
  );
};

const setBackColour = () => {
  const backColour = document.getElementById("backColour").value;

  console.log(`setBackColour called with value = ${backColour}`);

  const canvas = getMazeCanvas();
  canvas.style.backgroundColor = backColour;

  const ctx = getMazeContext();
  // Add behind elements.
  ctx.globalCompositeOperation = "destination-over";
  // Now draw!
  ctx.fillStyle = backColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "source-over";
};

const setWallColour = () => {
  const wallColour = document.getElementById("wallColour").value;

  console.log(`setWallColour called with value = ${wallColour}`);
};

const setPathColour = () => {
  const pathColour = document.getElementById("pathColour").value;

  console.log(`setPathColour called with value = ${pathColour}`);
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
  document.getElementById("backColour").onchange = setBackColour;
  document.getElementById("wallColour").onchange = setWallColour;
  document.getElementById("pathColour").onchange = setPathColour;

  const canvasDiv = document.querySelector(".canvasDiv");

  // start listening to web page size changes
  canvasDivObserver.observe(canvasDiv);
};
