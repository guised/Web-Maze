const getRandom = (x) => {
  return Math.floor(Math.random() * x);
};

const findInMap = (map, val) => {
  for (let [k, v] of map) {
    if (v === val) {
      return true;
    }
  }
  return false;
};

export class Side {
  // Create new instances of the same class as static attributes
  static Top = new Side("top");
  static Bottom = new Side("bottom");
  static Left = new Side("left");
  static Right = new Side("right");

  constructor(name) {
    this.name = name;
  }

  static getOpposite(side) {
    return side === Side.Top
      ? Side.Bottom
      : side === Side.Bottom
      ? Side.Top
      : side === Side.Left
      ? Side.Right
      : side === Side.Right
      ? Side.Left
      : undefined;
  }

  static getRandomSide = () => {
    let sideNo = getRandom(4);

    return sideNo === 0
      ? this.Top
      : sideNo === 1
      ? this.Bottom
      : sideNo === 2
      ? this.Left
      : this.Right;
  };
}

export class SideType {
  static DoorIn = new SideType("door in");
  static DoorOut = new SideType("door out");
  static Wall = new SideType("wall");

  constructor(name) {
    this.name = name;
  }
}

export class MazeSquare {
  x = 0;
  y = 0;
  sides = new Map();
  onPath = false;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getTop() {
    return this.sides.get(Side.Top);
  }

  getBottom() {
    return this.sides.get(Side.Bottom);
  }

  getLeft() {
    return this.sides.get(Side.Left);
  }

  getRight() {
    return this.sides.get(Side.Right);
  }

  isOnPath() {
    return this.onPath;
  }

  setOnPath(bool) {
    this.onPath = bool;
  }

  setSide(side, type) {
    this.sides.set(side, type);
  }

  hasInDoor() {
    return findInMap(this.sides, SideType.DoorIn);
  }

  hasOutDoor() {
    return findInMap(this.sides, SideType.DoorOut);
  }

  hasDoor() {
    return hasInDoor() || hasOutDoor();
  }
}

export class Maze {
  width = 0;
  height = 0;

  mazeGrid = [];
  startSquare = new MazeSquare();
  endSquare = new MazeSquare();
  currentSquare = new MazeSquare();

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.mazeGrid = this.initialiseSquares();
    this.setStartAndExit();
    this.createMaze();
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getSquare(x, y) {
    return this.mazeGrid[x][y];
  }

  getStartSquare() {
    return this.startSquare;
  }

  getEndSquare() {
    return this.endSquare;
  }

  getCurrentSquare() {
    return this.currentSquare;
  }

  setCurrentSquare(sqr) {
    this.currentSquare = sqr;
  }

  // Two dimensional array to store MazeSquares
  initialiseSquares = function () {
    for (let x = 0; x < this.width; x++) {
      this.mazeGrid[x] = [];
      for (let y = 0; y < this.height; y++) {
        let newSquare = new MazeSquare(x, y);
        newSquare.onPath = false;

        // For the boundary squares set a wall
        if (x === 0) {
          newSquare.sides.set(Side.Left, SideType.Wall);
        }
        if (y === 0) {
          newSquare.sides.set(Side.Top, SideType.Wall);
        }
        if (x === this.width - 1) {
          newSquare.sides.set(Side.Right, SideType.Wall);
        }
        if (y === this.height - 1) {
          newSquare.sides.set(Side.Bottom, SideType.Wall);
        }

        this.mazeGrid[x].push(newSquare);
      }
    }

    return this.mazeGrid;
  };

  setStartAndExit = function () {
    let x = -1;
    let y = -1;

    let startSide = Side.getRandomSide();

    // set start square
    switch (startSide) {
      case Side.Top:
        x = getRandom(this.getWidth());
        y = 0;
        break;
      case Side.Bottom:
        x = getRandom(this.getWidth());
        y = this.getHeight() - 1;
        break;
      case Side.Left:
        x = 0;
        y = getRandom(this.getHeight());
        break;
      case Side.Right:
        x = this.getWidth() - 1;
        y = getRandom(this.getHeight());
        break;
    }

    this.startSquare = this.getSquare(x, y);
    this.startSquare.sides.set(startSide, SideType.DoorIn);

    let endSide = Side.getOpposite(startSide);

    // set end square
    switch (endSide) {
      case Side.Top:
        x = getRandom(this.getWidth());
        y = 0;
        break;
      case Side.Bottom:
        x = getRandom(this.getWidth());
        y = this.getHeight() - 1;
        break;
      case Side.Left:
        x = 0;
        y = getRandom(this.getHeight());
        break;
      case Side.Right:
        x = this.getWidth() - 1;
        y = getRandom(this.getHeight());
        break;
    }

    this.endSquare = this.getSquare(x, y);
    this.endSquare.sides.set(endSide, SideType.DoorOut);
  };

  /**
   * Create a maze layout given the initialised maze
   */
  createMaze = function () {
    //let moveList = [this.getWidth() * this.getHeight()];
    let moveList = [];
    moveList.push(this.getStartSquare());

    let sqnum = 0;

    while (sqnum >= 0) {
      this.setCurrentSquare(moveList[sqnum]);
      this.getCurrentSquare().setOnPath(true);
      let doorSide = this.chooseDoor(this.getCurrentSquare());

      if (doorSide === null) {
        this.getCurrentSquare().setOnPath(false);
        //moveList.remove(sqnum);
        moveList.pop();
        sqnum--;
      } else {
        // mark the out door
        this.getCurrentSquare().setSide(doorSide, SideType.DoorOut);

        // Move through out door to next square
        switch (doorSide) {
          case Side.Top:
            this.setCurrentSquare(
              this.getSquare(
                this.getCurrentSquare().getX(),
                this.getCurrentSquare().getY() - 1
              )
            );
            break;
          case Side.Right:
            this.setCurrentSquare(
              this.getSquare(
                this.getCurrentSquare().getX() + 1,
                this.getCurrentSquare().getY()
              )
            );
            break;
          case Side.Bottom:
            this.setCurrentSquare(
              this.getSquare(
                this.getCurrentSquare().getX(),
                this.getCurrentSquare().getY() + 1
              )
            );
            break;
          case Side.Left:
            this.setCurrentSquare(
              this.getSquare(
                this.getCurrentSquare().getX() - 1,
                this.getCurrentSquare().getY()
              )
            );
            break;
        }

        // mark the in door
        this.getCurrentSquare().setSide(
          Side.getOpposite(doorSide),
          SideType.DoorIn
        );
        moveList.push(this.getCurrentSquare());
        sqnum++;
      }
    }
  };

  chooseDoor = function (sqr) {
    let candidates = [];

    if (sqr.getTop() === undefined || sqr.getTop() === null) {
      let sqrAbove = this.getSquare(sqr.getX(), sqr.getY() - 1);

      if (sqrAbove.hasInDoor()) {
        sqr.setSide(Side.Top, SideType.Wall);
        sqrAbove.setSide(Side.Bottom, SideType.Wall);
      } else {
        candidates.push(Side.Top);
      }
    }

    if (sqr.getRight() === undefined || sqr.getRight() === null) {
      let sqrRight = this.getSquare(sqr.getX() + 1, sqr.getY());

      if (sqrRight.hasInDoor()) {
        sqr.setSide(Side.Right, SideType.Wall);
        sqrRight.setSide(Side.Left, SideType.Wall);
      } else {
        candidates.push(Side.Right);
      }
    }

    if (sqr.getBottom() === undefined || sqr.getBottom() === null) {
      let sqrBelow = this.getSquare(sqr.getX(), sqr.getY() + 1);

      if (sqrBelow.hasInDoor()) {
        sqr.setSide(Side.Bottom, SideType.Wall);
        sqrBelow.setSide(Side.Top, SideType.Wall);
      } else {
        candidates.push(Side.Bottom);
      }
    }

    if (sqr.getLeft() === undefined || sqr.getLeft() === null) {
      let sqrLeft = this.getSquare(sqr.getX() - 1, sqr.getY());

      if (sqrLeft.hasInDoor()) {
        sqr.setSide(Side.Left, SideType.Wall);
        sqrLeft.setSide(Side.Right, SideType.Wall);
      } else {
        candidates.push(Side.Left);
      }
    }

    if (candidates.length === 0) return null;

    return candidates[getRandom(candidates.length)];
  };
}
