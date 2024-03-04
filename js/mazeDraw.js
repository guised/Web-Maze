import { SideType } from "./mazeModel.js";

export default class MazeDrawer {
  ctx;
  wallSize = 10;

  offset = 5;
  wallBrushWidth = 2;
  wallColour = "#000000";
  pathColour = "#FF0000";

  constructor(ctx, wallSize) {
    this.ctx = ctx;
    this.wallSize = wallSize;
  }

  setWallColour(colour) {
    this.wallColour = colour;
  }

  setPathColour(colour) {
    this.pathColour = colour;
  }

  drawSquare = function (sqr) {
    let yOffset = this.offset + sqr.y * this.wallSize;
    let xOffset = this.offset + sqr.x * this.wallSize;

    // Clear the path, before drawing
    if (!sqr.isOnPath()) {
      if (
        sqr.getTop() === SideType.DoorIn ||
        sqr.getTop() === SideType.DoorOut
      ) {
        this.ctx.clearRect(
          xOffset + 1,
          yOffset,

          Math.max(1, this.wallSize - 2),
          Math.max(1, this.wallSize - 2)
        );
      }
      if (
        sqr.getRight() === SideType.DoorIn ||
        sqr.getRight() === SideType.DoorOut
      ) {
        this.ctx.clearRect(
          xOffset + 1,
          yOffset + 1,

          Math.max(1, this.wallSize),
          Math.max(1, this.wallSize - 2)
        );
      }

      if (
        sqr.getBottom() === SideType.DoorIn ||
        sqr.getBottom() === SideType.DoorOut
      ) {
        this.ctx.clearRect(
          xOffset + 1,
          yOffset + 1,

          Math.max(1, this.wallSize - 2),
          Math.max(1, this.wallSize)
        );
      }
      if (
        sqr.getLeft() === SideType.DoorIn ||
        sqr.getLeft() === SideType.DoorOut
      ) {
        this.ctx.clearRect(
          xOffset,
          yOffset,

          Math.max(1, this.wallSize - 2),
          Math.max(1, this.wallSize - 2)
        );
      }
    }

    // Top
    if (sqr.getTop() === SideType.Wall) {
      this.ctx.beginPath();
      this.ctx.moveTo(xOffset, yOffset);
      this.ctx.lineTo(xOffset + this.wallSize, yOffset);
      this.ctx.stroke();
    }
    // Right
    if (sqr.getRight() === SideType.Wall) {
      this.ctx.beginPath();
      this.ctx.moveTo(xOffset + this.wallSize, yOffset);
      this.ctx.lineTo(xOffset + this.wallSize, yOffset + this.wallSize);
      this.ctx.stroke();
    }
    // Bottom
    if (sqr.getBottom() === SideType.Wall) {
      this.ctx.beginPath();
      this.ctx.moveTo(xOffset, yOffset + this.wallSize);
      this.ctx.lineTo(xOffset + this.wallSize, yOffset + this.wallSize);
      this.ctx.stroke();
    }
    // Left
    if (sqr.getLeft() === SideType.Wall) {
      this.ctx.beginPath();
      this.ctx.moveTo(xOffset, yOffset);
      this.ctx.lineTo(xOffset, yOffset + this.wallSize);
      this.ctx.stroke();
    }

    if (sqr.isOnPath()) {
      this.ctx.strokeStyle = this.pathColour;

      let pathBrushWidth = Math.max(1, this.wallSize - 2 * this.wallBrushWidth);

      this.ctx.lineWidth = pathBrushWidth;

      // Top
      if (sqr.getTop() === SideType.DoorIn) {
        this.ctx.beginPath();
        this.ctx.moveTo(xOffset + this.wallSize / 2, yOffset);
        this.ctx.lineTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.stroke();
      }
      // Right
      if (sqr.getRight() === SideType.DoorIn) {
        this.ctx.beginPath();
        this.ctx.moveTo(xOffset + this.wallSize, yOffset + this.wallSize / 2);
        this.ctx.lineTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.stroke();
      }
      // Bottom
      if (sqr.getBottom() === SideType.DoorIn) {
        this.ctx.beginPath();
        this.ctx.moveTo(xOffset + this.wallSize / 2, yOffset + this.wallSize);
        this.ctx.lineTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.stroke();
      }
      // Left
      if (sqr.getLeft() === SideType.DoorIn) {
        this.ctx.beginPath();
        this.ctx.moveTo(xOffset, yOffset + this.wallSize / 2);
        this.ctx.lineTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.stroke();
      }
      // Top
      if (sqr.getTop() === SideType.DoorOut) {
        this.ctx.beginPath();
        this.ctx.moveTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.lineTo(xOffset + this.wallSize / 2, yOffset);
        this.ctx.stroke();
      }
      // Right
      if (sqr.getRight() === SideType.DoorOut) {
        this.ctx.beginPath();
        this.ctx.moveTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.lineTo(xOffset + this.wallSize, yOffset + this.wallSize / 2);
        this.ctx.stroke();
      }
      // Bottom
      if (sqr.getBottom() === SideType.DoorOut) {
        this.ctx.beginPath();
        this.ctx.moveTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.lineTo(xOffset + this.wallSize / 2, yOffset + this.wallSize);
        this.ctx.stroke();
      }
      // Left
      if (sqr.getLeft() === SideType.DoorOut) {
        this.ctx.beginPath();
        this.ctx.moveTo(
          xOffset + this.wallSize / 2,
          yOffset + this.wallSize / 2
        );
        this.ctx.lineTo(xOffset, yOffset + this.wallSize / 2);
        this.ctx.stroke();
      }

      this.ctx.strokeStyle = this.wallColour;
      this.ctx.lineWidth = this.wallBrushWidth;
    }
  };

  draw = function (maze) {
    for (let y = 0; y < maze.getHeight(); y++) {
      for (let x = 0; x < maze.getWidth(); x++) {
        let sqr = maze.getSquare(x, y);
        this.drawSquare(sqr);
      }
    }
  };
}
