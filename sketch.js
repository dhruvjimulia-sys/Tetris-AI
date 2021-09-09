let grid, tetri, test;

const classicBlocks = [
  [
    // T-block
    [false, false, false, false],
    [false, true, true, true],
    [false, false, true, false],
    [false, false, false, false],
  ],

  [
    // O-block
    [false, false, false, false],
    [false, true, true, false],
    [false, true, true, false],
    [false, false, false, false],
  ],

  [
    // I-block
    [false, false, false, false],
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
  ],

  [
    // Z-block
    [false, false, false, false],
    [false, true, true, false],
    [false, false, true, true],
    [false, false, false, false],
  ],

  [
    // J-block
    [false, false, false, false],
    [false, true, true, true],
    [false, false, false, true],
    [false, false, false, false],
  ],

  [
    // L-block
    [false, false, false, false],
    [false, true, true, true],
    [false, true, false, false],
    [false, false, false, false],
  ],

  [
    // S-block
    [false, false, false, false],
    [false, false, true, true],
    [false, true, true, false],
    [false, false, false, false],
  ],
];

const colours = [
  [255, 100, 255],
  [255, 255, 0],
  [0, 255, 255],
  [255, 0, 0],
  [0, 100, 255],
  [255, 165, 0],
  [0, 255, 0],
];

// Array to contain unique rotations of blocks
// HEIGHT MUST BE 2*WIDTH
let rotatedBlocks;
const numCols = 10;
const numRows = 20;

// Size of container settings
let vertOffset, blockSpacing, start, end;

let tetTypes, blockWidth, blockHeight;
let table, tempGridCalculator, addedTempGrid;

let highScore;
let weights = [-22, -18, 10, -5, 1, 1, 1];

// Speed variables
let dropSpeed, dropCount, dropThreshold;

// Game variables
let endGame, score, level, totalLinesCleared, startCheck;

// Genetic Algorithm values
let maxHeightThreshold, currGeneration, currPlayer, mutationRate, maxGen, populat, populationSize, scoreMin, scoreMax;

const font;
let fastMode;

let trials;
let canvasWidth, canvasHeight;

// Slow mode variables
let target, bestMoveDecided, testTetri, testTetriType;

// Widget values
let widgetSpace,
  touchResponse,
  backButton,
  pauseResumeButton,
  speedButton,
  helpButton,
  pause;

// Mainmenu Configuration
let mainMenu, gamePlay, custom, about, help, aboutContent, helpContent;

function preload() {
  font = loadFont("consola.otf");
}

function setup() {
  if (windowHeight < windowWidth) {
    canvasHeight = windowHeight - 50;
    canvasWidth = (windowHeight - 50) / 1.21;
  } else {
    canvasWidth = windowWidth;
    canvasHeight = windowWidth * 1.21;
  }
  var canvas = createCanvas(canvasWidth, canvasHeight);

  canvas.parent("sketch-holder");
  widgetSpace = canvasWidth * (8.25 / 100);

  background(51);
  grid = new Grid();
  tetTypes = new Array(classicBlocks.length);
  fillRotatedBlocks(classicBlocks);

  vertOffset = height / 120;
  blockSpacing = width / 600;
  start = width / 4 - width * (1 / 5);
  end = width * (3 / 4) - width * (1 / 5);

  blockWidth = (end - start) / numCols;
  blockHeight = (height - 2 * vertOffset - widgetSpace) / numRows;
  tempGridCalculator = new TempGridCalculator();

  // In-game variables
  endGame = false;
  score = 0;
  level = 0;
  totalLinesCleared = 0;
  highScore = 0;
  trials = 0;

  // Genetic Algorithm values
  maxHeightThreshold = 3;
  mutationRate = 0.01;
  maxGen = 20;
  populationSize = 20;
  scoreMin = -10;
  scoreMax = 10;
  populat = new Population();
  maxChange = 1;
  learningSensitivity = 1.5;

  // Current State of Genetic Algorithm
  currGeneration = 1;
  currPlayer = 0;

  // Speed Variables
  dropSpeed = 1;
  dropCount = 0;
  dropThreshold = 2;

  // Slow mode variables
  target = new Array(2);
  bestMoveDecided = false;
  fastMode = false;

  table = new p5.Table();
  table.addColumn("index");
  for (let i = 0; i < 7; i++) {
    table.addColumn("weight " + i);
  }
  table.addColumn("fitness");

  testTetriType = int(random() * 7);
  testTetri = new Tetrimino(testTetriType);

  // Widget button initialization
  touchResponse = 10;
  pause = true;
  infoDisplayWidgetSpacing = height / 15;
  backButton = new Widget(
    width / 20,
    height - widgetSpace + vertOffset,
    width / 6,
    widgetSpace - 2 * vertOffset,
    "Back"
  );
  pauseResumeButton = new Widget(
    width / 15 + width / 6,
    height - widgetSpace + vertOffset,
    width / 4,
    widgetSpace - 2 * vertOffset,
    "Start"
  );
  speedButton = new Widget(
    width * (1 / 2),
    height - widgetSpace + vertOffset,
    width / 3,
    widgetSpace - 2 * vertOffset,
    "Increase Speed"
  );
  helpButton = new Widget(
    width * (85 / 100),
    height - widgetSpace + vertOffset,
    width / 8,
    widgetSpace - 2 * vertOffset,
    "?"
  );

  classicButton = new MenuWidget(
    width / 6,
    height * (62 / 100),
    width * (33 / 100),
    height * (11 / 100),
    "Classic",
    "Original Tetris pieces",
    height / 50
  );
  customButton = new MenuWidget(
    width * (55 / 100),
    height * (62 / 100),
    width * (33 / 100),
    height * (11 / 100),
    "Custom",
    "Custom Tetris pieces",
    height / 50
  );
  aboutButton = new MenuWidget(
    width * (33.5 / 100),
    height * (76 / 100),
    width * (33 / 100),
    height * (11 / 100),
    "About",
    "",
    0
  );

  customBackButton = new Widget(
    width / 15,
    height - height / 5,
    width / 4.5,
    height / 15,
    "Back"
  );
  startCustomButton = new Widget(
    width * (32 / 100),
    height - height / 5,
    width * (62 / 100),
    height / 15,
    "Start Custom Game"
  );

  classicPreset = new PresetWidget(
    width / 15,
    height / 6,
    width * 0.218,
    height / 15,
    "Classic",
    true,
    "(For comparison)",
    height / 70
  );
  preset1 = new PresetWidget(
    width * 0.284,
    height / 6,
    width * 0.218,
    height / 15,
    "Custom 1",
    false,
    "",
    0
  );
  preset2 = new PresetWidget(
    width * 0.502,
    height / 6,
    width * 0.218,
    height / 15,
    "Custom 2",
    false,
    "",
    0
  );
  preset3 = new PresetWidget(
    width * 0.7207,
    height / 6,
    width * 0.218,
    height / 15,
    "Custom 3",
    false,
    "",
    0
  );

  aboutBackButton = new Widget(
    width / 15,
    height * (7 / 8),
    width * (13 / 15),
    infoDisplayWidgetSpacing,
    "Back"
  );
  helpBackButton = new Widget(
    width / 15,
    height * (7 / 8),
    width * (13 / 15),
    infoDisplayWidgetSpacing,
    "Back"
  );

  // Custom blockDisplays
  let blockDisplayX = [
    width * (3 / 15),
    width * (18 / 45),
    width * (27 / 45),
    width * (3 / 15),
    width * (18 / 45),
    width * (27 / 45),
    width * (18 / 45),
  ];
  let blockDisplayY = [
    height * (7 / 24),
    height * (7 / 24),
    height * (7 / 24),
    height * 0.45,
    height * 0.45,
    height * 0.45,
    height * 0.61,
  ];
  blockDisplays = new Array(7);
  for (let i = 0; i < blockDisplays.length; i++) {
    blockDisplays[i] = new BlockDisplay(
      blockDisplayX[i],
      blockDisplayY[i],
      width * 0.17,
      classicBlocks[i]
    );
  }

  // Mainmenu
  [mainMenu, gamePlay, startCheck, about, help] = [true, false, false, false, false];

  // Info content
  aboutContent =
    "Hey! I am Dhruv Jimulia and I am 16 years old. This site was created in order to demonstrate the power of AI, displaying its ability to exhibit strategy and creativity in an engaging manner. The applications of such AI extend beyond games: similar reinforcement learning strategies have been used in applications like self-driving cars and automated manufacturing. This AI was created using something called the genetic algorithm, an algorithm inspired by human evolution and natural selection. This AI was made unique by the use of custom pieces, which demonstrate the ability of AI to adapt to different situations.";
  let spaces = floor(60000 / (windowHeight + 200));
  for (let i = 0; i < spaces; i++) {
    helpContent = helpContent + " ";
  }
  helpContent =
    helpContent +
    "This AI will run (nearly) indefinitely so the interested user can see it learn for as long as possible.";
}

function draw() {
  if (mainMenu) {
    displayMainMenu();
    classicButton.touchTime++;
    customButton.touchTime++;
    aboutButton.touchTime++;
  } else if (gamePlay) {
    if (!pause) {
      startCheck = true;
      let columnThreshold;

      if (fastMode) {
        columnThreshold = 2;
        dropThreshold = 2;
      } else {
        columnThreshold = 3;
        dropThreshold = 3;
      }

      // Checking whether game has ended
      for (let i = 0; i < numCols; i++) {
        if (grid.grid[i][numRows - columnThreshold] != -1) {
          endGame = true;
        }
      }

      dropCount += dropSpeed;

      if (fastMode) {
        if (dropCount % dropThreshold == 0) {

          // Falling blocks
          let testTetriType = int(random() * 7);
          let bMove = bestMove(testTetriType);
          let testTetri = new Tetrimino(testTetriType);
          testTetri.setDirection(bMove[0]);
          testTetri.setLocation(bMove[1]);
          testTetri.completeDrop();
          grid.add(testTetri.coordinates, testTetriType);

          // Clearing lines mechanic
          let numLinesClear = 0;
          let clearLineArray = clearLine(grid.grid);
          for (let i = 0; i < clearLineArray.length; i++) {
            if (clearLineArray[i]) {
              grid.removeRow(i);
              numLinesClear++;
            }
          }

          // Score and level mechanic
          addToScoreOnLinesClear(numLinesClear);
          totalLinesCleared += numLinesClear;
          level = floor(totalLinesCleared / 10);
          score += 1;
          if (score > highScore) {
            highScore = score;
          }
        }
      } else {
        if (dropCount % dropThreshold == 0) {
          if (!bestMoveDecided) {
            testTetriType = int(random() * 7);
            testTetri = new Tetrimino(testTetriType);
            target = bestMove(testTetriType);
            bestMoveDecided = true;
          } else {
            moveToTarget(
              [testTetri.getCurrentDirection(), testTetri.getXlocation()],
              target,
              testTetri
            );
          }

          let numLinesClear = 0;
          let clearLineArray = clearLine(grid.grid);
          for (let i = 0; i < clearLineArray.length; i++) {
            if (clearLineArray[i]) {
              grid.removeRow(i);
              numLinesClear++;
            }
          }

          // Score and level mechanic
          addToScoreOnLinesClear(numLinesClear);
          totalLinesCleared += numLinesClear;
          level = floor(totalLinesCleared / 10);
          score += 1;
          if (score > highScore) {
            highScore = score;
          }
        }
      }
    }

    // Display grid
    background(51);
    grid.display();
    if (!fastMode && startCheck) {
      testTetri.display();
    }
    fill(255);
    textFont(font);
    noStroke();
    textSize(floor(canvasWidth / 20));
    trials = (currGeneration - 1) * populationSize + currPlayer;
    let offsetHeight = height - widgetSpace;
    text("Trials:", end + width / 20, offsetHeight / 6);
    text(trials, end + width / 20, offsetHeight / 6 + offsetHeight / 20);
    text(
      "High Score:",
      end + width / 20,
      offsetHeight * (3 / 8) + offsetHeight / 50
    );
    text(
      highScore,
      end + width / 20,
      offsetHeight * (3 / 8) + offsetHeight / 50 + offsetHeight / 20
    );
    text(
      "Score:",
      end + width / 20,
      offsetHeight * (2 / 3) - offsetHeight / 25
    );
    text(
      score,
      end + width / 20,
      offsetHeight * (2 / 3) + offsetHeight / 20 - offsetHeight / 25
    );
    // text("Level:" + level, end + width/30, offsetHeight * (2/3) + offsetHeight * (1/30));
    text("Lines", end + width / 20, offsetHeight * (5 / 6));
    text(
      "Cleared:",
      end + width / 20,
      offsetHeight * (5 / 6) + offsetHeight / 20
    );
    text(
      totalLinesCleared,
      end + width / 20,
      offsetHeight * (5 / 6) + offsetHeight / 10
    );

    // Define
    if (endGame) {
      populat.getPopulation()[currPlayer].setFitness(score);

      for (let i = 0; i < numCols; i++) {
        grid.grid[i].fill(-1);
      }
      // If last player
      if (currPlayer == populationSize - 1) {
        //populat.recordData();
        newPopulation = populat.reproduce();
        populat.setPopulation(newPopulation);
        populat.mutatePopulation();
        currPlayer = 0;
        if (currGeneration < maxGen) {
          currGeneration++;
        } else {
          noLoop();
        }
      } else {
        currPlayer++;
      }
      score = 0;
      totalLinesCleared = 0;
      endGame = false;
    }

    backButton.touchTime++;
    pauseResumeButton.touchTime++;
    speedButton.touchTime++;
    helpButton.touchTime++;

    backButton.display();
    pauseResumeButton.display();
    speedButton.display();
    helpButton.display();
  } else if (custom) {
    customDisplay();
    startCustomButton.touchTime++;
    customBackButton.touchTime++;
    classicPreset.touchTime++;
    preset1.touchTime++;
    preset2.touchTime++;
    preset3.touchTime++;
  } else if (about) {
    infoDisplay("About", aboutContent);
    aboutBackButton.touchTime++;
    aboutBackButton.display();
  } else if (help) {
    helpDisplay();
    helpBackButton.touchTime++;
    helpBackButton.display();
  }
}

function Grid() {
  this.grid = new Array(numCols);

  for (let i = 0; i < numCols; i++) {
    this.grid[i] = new Array(numRows);
    this.grid[i].fill(-1);
  }

  this.display = () => {
    stroke(255);
    fill(255);
    strokeWeight(canvasHeight / 500);

    line(start, vertOffset, start, height - vertOffset - widgetSpace);
    line(end, vertOffset, end, height - vertOffset - widgetSpace);
    line(
      start,
      height - vertOffset - widgetSpace,
      end,
      height - vertOffset - widgetSpace
    );

    for (let i = 0; i < numCols; i++) {
      for (let j = 0; j < numRows; j++) {
        if (this.grid[i][j] != -1) {
          colour = colours[this.grid[i][j]];
          fill(colour);
          drawBlock(i, j);
        }
      }
    }
  };

  this.add = (coordinates, type) => {
    for (let i = 0; i < coordinates.length; i++) {
      let x = coordinates[i][0];
      let y = coordinates[i][1];
      this.grid[x][y] = type;
    }
  };

  this.getGridValue = (i, j) => this.grid[i][j];

  this.removeRow = rowNum => {
    newGrid = this.grid.map(val => {
      val2 = val.slice(0, rowNum);
      val3 = val.slice(rowNum + 1);
      return val2.concat(val3);
    });
    for (let i = 0; i < numCols; i++) {
      newGrid[i].push(-1);
    }
    this.grid = newGrid;
  };
}


function Tetrimino(type) {

  this.type = type;
  this.rotations = rotatedBlocks[type];
  this.coordinates = [];
  this.currentDirection = 0;
  this.directions = this.rotations.length;

  this.locX = int(
    random() * (numCols - this.rotations[this.currentDirection][0].length + 1)
  );
  this.locY = numRows - 3;

  this.display = () => {
    let color = colours[this.type];
    fill(color);
    this.calculateCoordinates();

    for (let i = 0; i < this.coordinates.length; i++) {
      drawBlock(this.coordinates[i][0], this.coordinates[i][1]);
    }
  };

  this.drop = () => this.locY--;

  // Verically reflecting for some reason
  this.calculateCoordinates = () => {
    this.coordinates = [];
    for (let i = 0; i < this.rotations[this.currentDirection].length; i++) {
      for (
        let j = 0;
        j < this.rotations[this.currentDirection][0].length;
        j++
      ) {
        if (
          this.rotations[this.currentDirection][
            this.rotations[this.currentDirection].length - 1 - i
          ][j]
        ) {
          this.coordinates.push([j + this.locX, i + this.locY]);
        }
      }
    }
  };

  this.rotate = () => {
    this.currentDirection++;
    this.currentDirection = this.currentDirection % this.directions;

    this.calculateCoordinates();
  };

  this.checkHit = () => {
    let maxgrids = calcMaxHeight(grid.grid);
    let stop = false;
    for (
      let i = this.locX;
      i < this.locX + this.rotations[this.currentDirection][0].length;
      i++
    ) {
      let mincoord = numRows + 5;
      for (let j = 0; j < this.coordinates.length; j++) {
        if (this.coordinates[j][0] == i) {
          if (this.coordinates[j][1] < mincoord) {
            mincoord = this.coordinates[j][1];
          }
        }
      }
      let maxheight = maxgrids[i];

      if (mincoord - maxheight == 1) {
        stop = true;
        break;
      }
    }
    return stop;
  };

  this.moveRight = () => {
    this.locX = min(
      numCols - this.rotations[this.currentDirection][0].length,
      this.locX + 1
    );

    this.calculateCoordinates();
  };
  this.moveLeft = () => {
    this.locX = max(0, this.locX - 1);

    this.calculateCoordinates();
  };

  this.isMovementPossible = () => {
    let movementPossible = true;
    for (let i = 0; i < this.coordinates.length; i++) {
      let x = this.coordinates[i][0];
      let y = this.coordinates[i][1];
      if (grid.getGridValue(x, y) != -1) {
        movementPossible = false;
      }
    }
    return movementPossible;
  };

  this.completeDrop = () => {
    this.calculateCoordinates();
    while (!this.checkHit()) {
      this.drop();
      this.calculateCoordinates();
    }
  };

  this.setLocation = locX => this.locX = locX;

  this.setDirection = direct => {
    this.currentDirection = direct;
    this.locY = numRows - 2;
  };

  this.getXlocation = () => this.locX

  this.getCurrentDirection = () => this.currentDirection
}

// Assumes a lot of things specific to this program
function are2DArrayEqual(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  if (arr1[0].length != arr2[0].length) {
    return false;
  }
  let equ = true;
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[0].length; j++) {
      if (arr1[i][j] != arr2[i][j]) {
        equ = false;
        break;
      }
    }
  }
  return equ;
}


function TypeTetrimino(cells) {
  this.cells = cells;
  this.numDirections = 0;

  this.getDirections = () => {
    directions = [];
    let matrix = this.squareSnip(this.cells);
    for (let i = 0; i < this.numDirections; i++) {
      directions.push(this.rectSnip(matrix));
      matrix = this.rotate(matrix);
    }
    return directions;
  };

  this.getNumDirections = () => this.numDirections;

  this.calculateNumDirections = () => this.numDirections = this.numDirect(this.cells);

  this.rotate = matrix => {
    let squareSnipped = this.squareSnip(matrix);
    let size = squareSnipped.length;

    rotated = new Array(size);
    for (let i = 0; i < size; i++) {
      rotated[i] = new Array(size);
      rotated[i].fill(false);
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (squareSnipped[i][j]) {
          let j_ = j + (size - 1 - 2 * j);
          let i_ = i;
          rotated[j_][i_] = true;
        }
      }
    }
    return rotated;
  };

  this.rectSnip = matrix => {
    let rectSnipBlock = matrix;
    let colSnipped = this.colSnipLeft(this.colSnipRight(rectSnipBlock));
    return this.rowSnipUp(this.rowSnipDown(colSnipped));
  };

  this.colSnipRight = rectSnip => {
    let colSnip = true;

    for (let i = 0; i < rectSnip.length; i++) {
      if (rectSnip[i][rectSnip[0].length - 1]) {
        colSnip = false;
      }
    }

    if (colSnip) {
      newRectSnip = rectSnip.map(function (val) {
        return val.slice(0, -1);
      });
      return this.colSnipRight(newRectSnip);
    } else {
      return rectSnip;
    }
  };

  this.colSnipLeft = rectSnip => {
    let colSnip = true;
    for (let i = 0; i < rectSnip.length; i++) {
      if (rectSnip[i][0]) {
        colSnip = false;
      }
    }
    if (colSnip) {
      newRectSnip = rectSnip.map(function (val) {
        return val.slice(1);
      });
      return this.colSnipLeft(newRectSnip);
    } else {
      return rectSnip;
    }
  };

  this.rowSnipDown = rectSnip => {
    let colSnip = true;
    for (let i = 0; i < rectSnip[0].length; i++) {
      if (rectSnip[rectSnip.length - 1][i]) {
        colSnip = false;
      }
    }
    if (colSnip) {
      let newRectSnip = rectSnip.slice(0, -1);
      return this.rowSnipDown(newRectSnip);
    } else {
      return rectSnip;
    }
  };

  this.rowSnipUp = rectSnip => {
    let colSnip = true;
    for (let i = 0; i < rectSnip[0].length; i++) {
      if (rectSnip[0][i]) {
        colSnip = false;
      }
    }
    if (colSnip) {
      let newRectSnip = rectSnip.slice(1);
      return this.rowSnipUp(newRectSnip);
    } else {
      return rectSnip;
    }
  };

  this.squareSnip = matrix => {
    let rectSnipped = this.rectSnip(matrix);
    if (rectSnipped.length > rectSnipped[0].length) {
      let increment = rectSnipped.length - rectSnipped[0].length;
      for (let inc = 0; inc < increment; inc++) {
        for (let i = 0; i < rectSnipped.length; i++) {
          rectSnipped[i].push(false);
        }
      }
    } else if (rectSnipped[0].length > rectSnipped.length) {
      let increment = rectSnipped[0].length - rectSnipped.length;
      for (let inc = 0; inc < increment; inc++) {
        let temp = new Array(rectSnipped[0].length);
        temp.fill(false);
        rectSnipped.push(temp);
      }
    }
    return rectSnipped;
  };

  this.numDirect = (matrix) => {
    let rotated = matrix;
    for (let i = 1; i < 5; i++) {
      rotated = this.rotate(rotated);
      if (are2DArrayEqual(this.rectSnip(rotated), this.rectSnip(matrix))) {
        return i;
      }
    }
  };
}

function drawBlock(i, j) {
  noStroke();
  let startX = blockWidth * i + start;
  let startY = height - vertOffset - widgetSpace - blockHeight * (j + 1);
  rect(
    startX + blockSpacing,
    startY + blockSpacing,
    blockWidth - 2 * blockSpacing,
    blockHeight - 2 * blockSpacing
  );
}

function bestMove(typ) {
  let tetrimino = new Tetrimino(typ);
  let numDirections = tetTypes[tetrimino.type].getNumDirections();
  let maxScoreValues = new Array(2);
  let maxScore = -10000;

  for (let i = 0; i < numDirections; i++) {
    let numTranslations = numCols - tetrimino.rotations[i][0].length + 1;
    for (let j = 0; j < numTranslations; j++) {
      tetrimino.setLocation(j);
      tetrimino.setDirection(i);
      tetrimino.calculateCoordinates();
      tetrimino.completeDrop();
      let newTGrid = JSON.parse(JSON.stringify(grid.grid));
      let newTAddedGrid = tempGridCalculator.add(
        newTGrid,
        tetrimino.coordinates,
        tetrimino.type
      );
      let score = moveScore(newTAddedGrid, tetrimino.coordinates);

      if (score > maxScore) {
        maxScoreValues[0] = i;
        maxScoreValues[1] = j;
        maxScore = score;
      }
    }
  }

  return maxScoreValues;
}

function moveScore(newTempGrid, coord) {
  let colRange = colR(coord);
  let prevNumHoles = 0;
  let newNumHoles = 0;
  for (let i = 0; i < colRange.length; i++) {
    let index = colRange[i];
    prevNumHoles += tempGridCalculator.numberOfHoles(grid.grid, index);
    newNumHoles += tempGridCalculator.numberOfHoles(newTempGrid, index);
  }

  let increaseInHoles = newNumHoles - prevNumHoles;
  let numClearedLines = tempGridCalculator.numberOfClearedLines(newTempGrid);
  let newMaxHeight = tempGridCalculator.maxHeight(newTempGrid);
  let changeInMaxHeight = 0;
  if (newMaxHeight >= maxHeightThreshold) {
    changeInMaxHeight =
      tempGridCalculator.maxHeight(newTempGrid) -
      tempGridCalculator.maxHeight(grid.grid) -
      numClearedLines;
  }
  let changeInBumpiness =
    tempGridCalculator.bumpiness(newTempGrid, colRange) -
    tempGridCalculator.bumpiness(grid.grid, colRange);
  let numEdgesWall = tempGridCalculator.numberOfEdgesTouchingWall(coord);
  let numEdgesAnotherBlock =
    tempGridCalculator.numberOfEdgesTouchingAnotherBlock(coord);
  let numEdgesFloor = tempGridCalculator.numberOfEdgesTouchingFloor(coord);

  let sum = 0;
  let inputs = [
    increaseInHoles,
    changeInMaxHeight,
    numClearedLines,
    changeInBumpiness,
    numEdgesWall,
    numEdgesAnotherBlock,
    numEdgesFloor,
  ];

  for (let i = 0; i < inputs.length; i++) {
    sum += inputs[i] * populat.getPopulation()[currPlayer].getWeights()[i];
  }
  return sum;
}

function TempGridCalculator() {
  // Returns new temporary grid with the coordinates added
  this.add = (cellGrid, coordinates, type) => {
    for (let i = 0; i < coordinates.length; i++) {
      let x = coordinates[i][0];
      let y = coordinates[i][1];
      cellGrid[x][y] = type;
    }
    return cellGrid;
  };

  // In specific column, INCREASE
  this.numberOfHoles = (cellGrid, columnNum) => {
    let holeCounter = 0;
    let holeCounting = false;

    for (let i = numCols - 1; i >= 0; i--) {
      let val = cellGrid[columnNum][i];
      if (val != -1) {
        holeCounting = true;
      }
      if (holeCounting && val == -1) {
        holeCounter++;
      }
    }

    return holeCounter;
  };

  this.maxHeight = cellGrid => max(calcMaxHeight(cellGrid));

  this.numberOfClearedLines = cellGrid => {
    let counter = 0;
    let arr = clearLine(cellGrid);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        counter++;
      }
    }
    return counter;
  };

  // In specific array of column indices
  this.bumpiness = (cellGrid, colNums) => {
    let maxheights = calcMaxHeight(cellGrid);
    let avgChange = 0;
    let sum = 0;

    for (let i = 0; i < colNums.length - 1; i++) {
      let index = colNums[i];
      let change = abs(maxheights[index + 1] - maxheights[index]);
      sum += change;
    }

    if (colNums.length != 1) {
      avgChange = sum / (colNums.length - 1);
    }

    return avgChange;
  };

  this.numberOfEdgesTouchingWall = coordinates => {
    let counter = 0;
    for (let i = 0; i < coordinates.length; i++) {
      if (coordinates[i][0] == 0 || coordinates[i][0] == numCols - 1) {
        counter++;
      }
    }
    return counter;
  };

  this.numberOfEdgesTouchingAnotherBlock = (coordinates) => {
    let counter = 0;

    for (let i = 0; i < coordinates.length; i++) {
      let x = coordinates[i][0];
      let y = coordinates[i][1];
      let neighbours = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];

      for (let j = 0; j < neighbours.length; j++) {
        if (this.isInGrid(neighbours[j]) && grid.grid[neighbours[j][0]][neighbours[j][1]] != -1) {
          counter++;
        }
      }
    }
    return counter;
  };

  this.numberOfEdgesTouchingFloor = (coordinates) => {
    let counter = 0;
    for (let i = 0; i < coordinates.length; i++) {
      if (coordinates[i][1] == 0) {
        counter++;
      }
    }
    return counter;
  };

  this.isInGrid = arr => arr[0] >= 0 && arr[0] < numCols && arr[1] >= 0 && arr[1] < numRows;
}

function calcMaxHeight(cellGrid) {
  let maxheights = new Array(numCols);
  for (let i = 0; i < numCols; i++) {
    let maxheight = -1;
    for (let j = 0; j < numRows; j++) {
      if (cellGrid[i][j] != -1 && j > maxheight) {
        maxheight = j;
      }
    }
    maxheights[i] = maxheight;
  }
  return maxheights;
}

function arange(min, max) {
  let length = max - min + 1;
  // console.log(length);
  let arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = i + min;
  }
  return arr;
}

function colR(coordinates) {
  let maxCoord = -1;
  let minCoord = numCols + 1;
  for (let i = 0; i < coordinates.length; i++) {
    let x = coordinates[i][0];
    if (x > maxCoord) {
      maxCoord = x;
    }
    if (x < minCoord) {
      minCoord = x;
    }
  }
  return this.arange(minCoord, maxCoord);
}

function clearLine(cellGrid) {
  let clearLine = new Array(numRows);
  clearLine.fill(true);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (cellGrid[j][i] == -1) {
        clearLine[i] = false;
        break;
      }
    }
  }
  return clearLine;
}

function addToScoreOnLinesClear(numLines) {
  switch (numLines) {
    case 1:
      score += 40 * (level + 1); break;
    case 2:
      score += 100 * (level + 1); break;
    case 3:
      score += 300 * (level + 1); break;
    case 4:
      score += 1200 * (level + 1);
  }
}

function Player() {
  this.weights = new Array(7);
  this.fitnessScore = 0;

  for (let i = 0; i < this.weights.length; i++) {
    this.weights[i] = random() * (scoreMax - scoreMin) + scoreMin;
  }

  this.crossover = function (partner) {
    let newWeights = new Array(this.weights.length);
    for (let i = 0; i < newWeights.length; i++) {
      newWeights[i] = (this.weights[i] + partner.weights[i]) / 2;
    }
    return newWeights;
  };

  this.mutate = function () {
    for (let i = 0; i < weights.length; i++) {
      if (random() < mutationRate) {
        this.weights[i] = random() * (scoreMax - scoreMin) + scoreMin;
      }
    }
  };

  this.getWeights = function () {
    return this.weights;
  };

  this.setWeights = function (weigh) {
    this.weights = weigh;
  };

  this.setFitness = function (fit) {
    this.fitnessScore = fit;
  };

  this.getFitness = function () {
    return this.fitnessScore;
  };
}

function Population() {
  this.population = new Array(populationSize);
  for (let i = 0; i < populationSize; i++) {
    this.population[i] = new Player();
  }

  this.reproduce = () => {
    let newPop = new Array(populationSize);
    for (let i = 0; i < populationSize; i++) {
      let parentA = this.pick();
      let parentB = this.pick();
      let newW = parentA.crossover(parentB);
      let child = new Player();
      child.setWeights(newW);
      newPop[i] = child;
    }
    return newPop;
  };

  this.pick = () => {
    let select = 0;
    let selector = random();
    let scores = this.calculateScores();
    while (selector > 0) {
      selector -= scores[select];
      select += 1;
    }
    select -= 1;
    return this.population[select];
  };

  this.calculateScores = () => {
    let sco = new Array(populationSize);
    let total = this.totalFitness();
    for (let i = 0; i < populationSize; i++) {
      let currFit = this.population[i].getFitness();
      sco[i] = currFit / total;
    }
    return sco;
  };

  this.totalFitness = () => {
    let sum = 0;
    for (let i = 0; i < populationSize; i++) {
      let fit = this.population[i].getFitness();
      sum += fit;
    }
    return sum;
  };

  this.mutatePopulation = () => {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].mutate();
    }
  };

  this.recordData = () => {
    for (let i = 0; i < populationSize; i++) {
      let newRow = table.addRow();
      newRow.setNum("index", i);
      let weigh = this.population[i].getWeights();
      for (let j = 0; j < weigh.length; j++) {
        newRow.setNum("weight " + j, weigh[j]);
      }
      newRow.setNum("fitness", this.population[i].getFitness());
    }
    saveTable(table, "dataGen" + currGeneration + ".csv");
  };

  this.getPopulation = () => this.population;

  this.setPopulation = pop => this.population = pop;
}

function moveToTarget(curr, tar, tetrimino) {
  if (curr[0] != tar[0]) {
    tetrimino.rotate();
    return;
  }
  if (curr[1] != tar[1]) {
    if (curr[1] < tar[1]) {
      tetrimino.moveRight();
    }
    if (curr[1] > tar[1]) {
      tetrimino.moveLeft();
    }
    return;
  } else {
    tetrimino.completeDrop();
    grid.add(tetrimino.coordinates, tetrimino.type);
    bestMoveDecided = false;
    return;
  }
}

function touchStarted() {
  if (
    backButton.mousePresent() &&
    backButton.touchTime > touchResponse &&
    gamePlay
  ) {
    mainMenu = true;
    gamePlay = false;
    backButton.touchTime = 0;
  }

  if (
    pauseResumeButton.mousePresent() &&
    pauseResumeButton.touchTime > touchResponse &&
    gamePlay
  ) {
    pause = !pause;

    if (pauseResumeButton.text == "Pause") {
      pauseResumeButton.text = "Resume";
    } else {
      pauseResumeButton.text = "Pause";
    }

    pauseResumeButton.touchTime = 0;
  }

  if (
    speedButton.mousePresent() &&
    speedButton.touchTime > touchResponse &&
    gamePlay
  ) {
    fastMode = !fastMode;
    if (speedButton.text == "Increase Speed") {
      speedButton.text = "Decrease Speed";
    } else {
      speedButton.text = "Increase Speed";
    }
    speedButton.touchTime = 0;
  }

  if (
    helpButton.mousePresent() &&
    helpButton.touchTime > touchResponse &&
    gamePlay
  ) {
    help = true;
    gamePlay = false;

    helpButton.touchTime = 0;
  }

  if (
    classicButton.mousePresent() &&
    classicButton.touchTime > touchResponse &&
    mainMenu
  ) {
    gamePlay = true;
    mainMenu = false;
    fillRotatedBlocks(classicBlocks);

    initializeGame();

    classicButton.touchTime = 0;
  }

  if (
    customButton.mousePresent() &&
    customButton.touchTime > touchResponse &&
    mainMenu
  ) {
    mainMenu = false;
    custom = true;

    customButton.touchTime = 0;
  }

  if (
    customBackButton.mousePresent() &&
    customBackButton.touchTime > touchResponse &&
    custom
  ) {
    mainMenu = true;
    custom = false;

    customBackButton.touchTime = 0;
  }

  if (preset1.mousePresent() && preset1.touchTime > touchResponse && custom) {
    classicPreset.setSelected(false);
    preset1.setSelected(true);
    preset2.setSelected(false);
    preset3.setSelected(false);

    for (let i = 0; i < blockDisplays.length; i++) {
      blockDisplays[i].setBlockSet(customBlockSet1[i]);
    }

    preset1.touchTime = 0;
  }

  if (preset2.mousePresent() && preset2.touchTime > touchResponse && custom) {
    classicPreset.setSelected(false);
    preset2.setSelected(true);
    preset1.setSelected(false);
    preset3.setSelected(false);

    for (let i = 0; i < blockDisplays.length; i++) {
      blockDisplays[i].setBlockSet(customBlockSet2[i]);
    }

    preset2.touchTime = 0;
  }

  if (preset3.mousePresent() && preset3.touchTime > touchResponse && custom) {
    classicPreset.setSelected(false);
    preset3.setSelected(true);
    preset1.setSelected(false);
    preset2.setSelected(false);

    for (let i = 0; i < blockDisplays.length; i++) {
      blockDisplays[i].setBlockSet(customBlockSet3[i]);
    }

    preset3.touchTime = 0;
  }

  if (
    classicPreset.mousePresent() &&
    classicPreset.touchTime > touchResponse &&
    custom
  ) {
    classicPreset.setSelected(true);
    preset3.setSelected(false);
    preset1.setSelected(false);
    preset2.setSelected(false);

    for (let i = 0; i < blockDisplays.length; i++) {
      blockDisplays[i].setBlockSet(classicBlocks[i]);
    }

    classicPreset.touchTime = 0;
  }

  if (
    startCustomButton.mousePresent() &&
    startCustomButton.touchTime > touchResponse &&
    custom
  ) {
    gamePlay = true;
    custom = false;

    if (preset1.selected) {
      fillRotatedBlocks(customBlockSet1);
    } else if (preset2.selected) {
      fillRotatedBlocks(customBlockSet2);
    } else if (preset3.selected) {
      fillRotatedBlocks(customBlockSet3);
    } else {
      fillRotatedBlocks(classicBlocks);
    }

    initializeGame();

    startCustomButton.touchTime = 0;
  }

  if (
    aboutButton.mousePresent() &&
    aboutButton.touchTime > touchResponse &&
    mainMenu
  ) {
    mainMenu = false;
    about = true;

    aboutButton.touchTime = 0;
  }

  if (
    aboutBackButton.mousePresent() &&
    aboutBackButton.touchTime > touchResponse &&
    about
  ) {
    mainMenu = true;
    about = false;

    aboutBackButton.touchTime = 0;
  }

  if (
    helpBackButton.mousePresent() &&
    helpBackButton.touchTime > touchResponse &&
    help
  ) {
    help = false;
    gamePlay = true;

    helpBackButton.touchTime = 0;
  }
}

function fillRotatedBlocks(blocks) {
  rotatedBlocks = [];
  for (let i = 0; i < tetTypes.length; i++) {
    tetTypes[i] = new TypeTetrimino(blocks[i]);
    tetTypes[i].calculateNumDirections();
    rotatedBlocks.push(tetTypes[i].getDirections());
  }
}

function initializeGame() {

  // Initialize game variables
  [score, level, totalLinesCleared, highScore, trials, currGeneration, currPlayer] = [0, 0, 0, 0, 0, 1, 0];
  populat = new Population();

  // Boolean variables initialization
  [bestMoveDecided, fastMode, pause, startCheck] = [false, false, true, false];

  // Widget text initialization
  [speedButton.text, pauseResumeButton.text] = ["Increase Speed", "Start"];

  for (let i = 0; i < numCols; i++) {
    grid.grid[i].fill(-1);
  }
}