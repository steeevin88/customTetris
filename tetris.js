// Things to do
// 1. Make better delay on pieces when they're at the bottom
  // ex) arrow keys adds a bit of time...
// 2. Implement custom pieces
// 3. Hold Window + Next Piece Window
  // right now, holds swap the next piece with the current piece
    // this isn't normal... so figure it out
    // there needs to be a separate hold window on the left, and a queuedPieces window on the right

class Tetris {
  constructor(imageX, imageY, template) {
    this.imageY = imageY;
    this.imageX = imageX;
    this.template = template;
    this.x = squareCountX / 2;
    this.y = 0;
  }

  checkBottom() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realY + 1 >= squareCountY) {
          return false;
        }
        if (gameMap[realY + 1][realX].imageX != -1) {
          return false;
        }
      }
    }
    return true;
  }

  getTruncedPosition() {
    return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
  }
  checkLeft() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX - 1 < 0) {
          return false;
        }

        if (gameMap[realY][realX - 1].imageX != -1) return false;
      }
    }
    return true;
  }

  checkRight() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX + 1 >= squareCountX) {
          return false;
        }

        if (gameMap[realY][realX + 1].imageX != -1) return false;
      }
    }
    return true;
  }

  moveRight() {
    if (this.checkRight()) {
      this.x += 1;
    }
  }

  moveLeft() {
    if (this.checkLeft()) {
      this.x -= 1;
    }
  }

  moveBottom() {
    if (this.checkBottom()) {
      this.y += 1;
      score += 1;
    }
  }

  checkCollision(rotatedTemplate) {
    for (let i = 0; i < rotatedTemplate.length; i++) {
      for (let j = 0; j < rotatedTemplate.length; j++) {
        if (rotatedTemplate[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX < 0 || realX >= squareCountX || realY < 0 || realY >= squareCountY) {
          return true; // Collision with game borders
        }
        if (gameMap[realY][realX].imageX != -1) {
          return true; // Collision with existing piece
        }
      }
    }
    return false;
  }

  changeRotation() {  
    let rotatedTemplate = [];
    for (let i = 0; i < this.template.length; i++) {
      rotatedTemplate[i] = this.template[i].slice();
    }
  
    let n = this.template.length;
    for (let layer = 0; layer < n / 2; layer++) {
      let first = layer;
      let last = n - 1 - layer;
      for (let i = first; i < last; i++) {
        let offset = i - first;
        let top = rotatedTemplate[first][i];
        rotatedTemplate[first][i] = rotatedTemplate[i][last]; // top = right
        rotatedTemplate[i][last] = rotatedTemplate[last][last - offset]; // right = bottom
        rotatedTemplate[last][last - offset] = rotatedTemplate[last - offset][first]; // bottom = left
        rotatedTemplate[last - offset][first] = top; // left = top
      }
    }
  
    for (let i = 0; i < rotatedTemplate.length; i++) {
      for (let j = 0; j < rotatedTemplate.length; j++) {
        if (rotatedTemplate[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX < 0 || realX >= squareCountX || realY < 0 || realY >= squareCountY) {
          return false;
        }
      }
    }
  
    if (!this.checkCollision(rotatedTemplate)) this.template = rotatedTemplate;
  }
  
}

const imageSquareSize = 24;
const size = 40;
const framePerSecond = 24;
const gameSpeed = 2;
const gameBoardCanvas = document.getElementById("gameBoardCanvas");
const holdShapeCanvas = document.getElementById("holdShapeCanvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const image = document.getElementById("image");
const ctx = gameBoardCanvas.getContext("2d");
const hctx = holdShapeCanvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
const squareCountX = gameBoardCanvas.width / size;
const squareCountY = gameBoardCanvas.height / size;

// 0 = purple, 24 = blue, 48 = cyan, 72 = green, 96 = yellow, 120 = red, 144 = pink
const shapes = [
  new Tetris(0, 0, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new Tetris(0, 24, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new Tetris(0, 48, [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  new Tetris(0, 72, [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Tetris(0, 96, [
    [1, 1],
    [1, 1],
  ]),
  new Tetris(0, 120, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(0, 144, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ])
];

let gameMap;
let gameOver;
let currentShape;
let holdShape;
let nextShape;
let score;
let swapped;
let initialTwoDArr;
let gameBoardLineThickness = 3;
let defaultX = (squareCountX / 2) - 2;

let gameLoop = () => {
  setInterval(update, 1000 / gameSpeed);
  setInterval(draw, 1000 / framePerSecond);
};

let deleteCompleteRows = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    let isComplete = true;
    for (let j = 0; j < t.length; j++) {
      if (t[j].imageX == -1) isComplete = false;
    }
    if (isComplete) {
      console.log("complete row");
      score += 1000;
      for (let k = i; k > 0; k--) {
        gameMap[k] = gameMap[k - 1];
      }
      let temp = [];
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ imageX: -1, imageY: -1 });
      }
      gameMap[0] = temp;
    }
  }
};

let swap = () => {
  if (swapped) { // if user already swapped, don't allow another swap
    return;
  }
  swapped = true;
  let placeHolder = currentShape;
  if (holdShape.template.length === 0) { // if holdShape is blank (first swap)
    currentShape = nextShape;
    holdShape.x = defaultX;
    holdShape.y = 0;
    holdShape = placeHolder;
    nextShape = getRandomShape();
    return;
  }
  else { // holdShape is an actual piece...
    currentShape = holdShape;
    currentShape.x = defaultX;
    currentShape.y = 0;
    holdShape.x = defaultX;
    holdShape.y = 0;
    holdShape = placeHolder;
  }
}

let update = () => {
  if (gameOver) return;
  if (currentShape.checkBottom()) {
    currentShape.y += 1;
  } 
  else {
    for (let k = 0; k < currentShape.template.length; k++) {
      for (let l = 0; l < currentShape.template.length; l++) {
        if (currentShape.template[k][l] == 0) continue;
        gameMap[currentShape.getTruncedPosition().y + l][
          currentShape.getTruncedPosition().x + k
        ] = { imageX: currentShape.imageX, imageY: currentShape.imageY };
      }
    }

    swapped = false; // if a swap was previously made, allow for swaps again
    deleteCompleteRows();
    currentShape = nextShape;
    currentShape.x = defaultX;
    currentShape.y = 0;
    nextShape = getRandomShape();
    if (!currentShape.checkBottom()) {
      gameOver = true;
    }
    score += 100;

    if (currentShape.checkBottom()) {
      // Delay before placing the shape
      setTimeout(() => {
        update();
      }, 3000); // Adjust the delay time as needed (in milliseconds)
    }
  }
};

let skip = () => {
  while (currentShape.checkBottom()) {
    currentShape.y += 1;
    score+=10;
  } 
  update();  
};

let drawRect = (x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

let drawBackground = () => {
  drawRect(0, 0, gameBoardCanvas.width, gameBoardCanvas.height, "#bca0dc");
  for (let i = 0; i < squareCountX + 1; i++) {
    drawRect(
      size * i - gameBoardLineThickness,
      0,
      gameBoardLineThickness,
      gameBoardCanvas.height,
      "white"
    );
  }

  for (let i = 0; i < squareCountY + 1; i++) {
    drawRect(
      0,
      size * i - gameBoardLineThickness,
      gameBoardCanvas.width,
      gameBoardLineThickness,
      "white"
    );
  }
};

let drawCurrentTetris = () => {
  for (let i = 0; i < currentShape.template.length; i++) {
    for (let j = 0; j < currentShape.template.length; j++) {
      if (currentShape.template[i][j] == 0) continue;
      ctx.drawImage(
        image,
        currentShape.imageX,
        currentShape.imageY,
        imageSquareSize,
        imageSquareSize,
        Math.trunc(currentShape.x) * size + size * i,
        Math.trunc(currentShape.y) * size + size * j,
        size,
        size
      );
    }
  }
};

let drawSquares = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    for (let j = 0; j < t.length; j++) {
      if (t[j].imageX == -1) continue;
      ctx.drawImage(
        image,
        t[j].imageX,
        t[j].imageY,
        imageSquareSize,
        imageSquareSize,
        j * size,
        i * size,
        size,
        size
      );
    }
  }
};

let drawShape = (shape, ctx, canvas) => {
  ctx.fillStyle = "#bca0dc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < shape.template.length; i++) {
    for (let j = 0; j < shape.template.length; j++) {
      if (shape.template[i][j] == 0) continue;
      ctx.drawImage(
        image,
        shape.imageX,
        shape.imageY,
        imageSquareSize,
        imageSquareSize,
        size * i,
        size * j + size,
        size,
        size
      );
    }
  }
};

let drawScore = () => {
  sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
  sctx.font = "64px Poppins";
  sctx.fillStyle = "black";
  sctx.fillText(score, 10, 50);
};

let drawGameOver = () => {
  ctx.font = "64px Poppins";
  ctx.fillStyle = "black";
  ctx.fillText("Game Over!", 10, gameBoardCanvas.height / 2);
};

let draw = () => {
  ctx.clearRect(0, 0, gameBoardCanvas.width, gameBoardCanvas.height);
  drawBackground();
  drawSquares();
  drawCurrentTetris();
  drawShape(holdShape, hctx, holdShapeCanvas);
  drawShape(nextShape, nctx, nextShapeCanvas);
  drawScore();
  if (gameOver) {
    drawGameOver();
  }
};

let getRandomShape = () => {
  return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

let resetVars = () => {
  initialTwoDArr = [];
  for (let i = 0; i < squareCountY; i++) {
    let temp = [];
    for (let j = 0; j < squareCountX; j++) {
      temp.push({ imageX: -1, imageY: -1 });
    }
    initialTwoDArr.push(temp);
  }
  score = 0;
  swapped = false;
  gameOver = false;
  currentShape = getRandomShape();
  holdShape = Object.create(new Tetris(0,0,[]));
  nextShape = getRandomShape();
  gameMap = initialTwoDArr;
};

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") currentShape.moveLeft();
  else if (event.key === "ArrowUp") currentShape.changeRotation();
  else if (event.key === "ArrowRight") currentShape.moveRight();
  else if (event.key === "ArrowDown") currentShape.moveBottom();
  else if (event.key === "c") swap();
  else if (event.key === " ") skip();
});


resetVars();
gameLoop();