let cols = 10;
let rows = 20;
let board = [];
let blockSize = 30;
let currentPiece;
let loopSpeed = 30;
let currentLoopSpeed = 30;
let fasterLoopSpeed = 5;
let nextPiece;
let level = 1;
let gamePaused = false;
let gameOver = false;
let heldPiece = null;
let canHold = true;
let score = 0;

function setup() {
    createCanvas(min(cols * blockSize + 250, windowWidth), min(rows * blockSize, windowHeight));
    frameRate(60);
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            board[r][c] = 0;
        }
    }
    nextPiece = new Piece();
    currentPiece = nextPiece;
    nextPiece = new Piece();
}

function drawNextPiece() {
    fill(0);
    stroke(0);
    textSize(16);
    text("Próxima Peça:", cols * blockSize + 15, 10);
    
    let xOffset = cols * blockSize + 15;
    let yOffset = 30;
    for (let i = 0; i < nextPiece.shape.length; i++) {
        for (let j = 0; j < nextPiece.shape[i].length; j++) {
            if (nextPiece.shape[i][j] === 1) {
                fill(nextPiece.color);
                stroke(0);
                rect(xOffset + j * blockSize, yOffset + i * blockSize, blockSize, blockSize);
            }
        }
    }
}

function drawHeldPiece() {
    if (heldPiece !== null) {
        fill(0);
        stroke(0);
        textSize(16);
        text("Peça Guardada:", cols * blockSize + 15, 105);
      
        let xOffset = cols * blockSize + 15;
        let yOffset = 125;
        for (let i = 0; i < heldPiece.shape.length; i++) {
            for (let j = 0; j < heldPiece.shape[i].length; j++) {
                if (heldPiece.shape[i][j] === 1) {
                    fill(heldPiece.color);
                    stroke(0);
                    rect(xOffset + j * blockSize, yOffset + i * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}

function draw() {
    if (gamePaused || gameOver) {
        if (gameOver) {
            fill(0);
            textSize(32);
            text('Game Over', width / 2 - 75, height / 2);
            noLoop();
        }
        if (gamePaused) {
            fill(0);
            textSize(32);
            text('Pause', width / 2 - 50, height / 2);
        }
        return;
    }
    background(255);
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    let scoreColumnWidth = 200
    let scoreX = 10
    text('Score:', cols / blockSize + 10, 10);
    text(score, scoreX, 30)
    translate(100, 0);
    drawBoard();
    currentPiece.show();
    currentPiece.update();
    drawNextPiece();
    drawHeldPiece();
}

function holdPiece() {
    if (!canHold) return;
    if (heldPiece === null) {
        heldPiece = currentPiece;
        currentPiece = new Piece();
    } else {
        [currentPiece, heldPiece] = [heldPiece, currentPiece];
        currentPiece.x = floor(cols / 2) - 1;
        currentPiece.y = 0;
    }
    canHold = false;
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        currentPiece.move(-1);
    } else if (keyCode === RIGHT_ARROW) {
        currentPiece.move(1);
    } else if (keyCode === UP_ARROW) {
        currentPiece.rotate();
    } else if (keyCode === DOWN_ARROW) {
        loopSpeed = fasterLoopSpeed; // Aumenta a velocidade de queda
    } else if (key === "p" || key === "P"){ // 'P' para pausar
        gamePaused = !gamePaused;
    } else if (key === "c" || key === "C"){
        holdPiece();
    }
}

function keyReleased() {
    if (keyCode === DOWN_ARROW) {
        loopSpeed = currentLoopSpeed; // Restaura a velocidade de queda
    }
}

function drawBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 0) {
                fill(240);
            } else {
                fill(board[r][c]);
            }
            stroke(0);
            rect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
    }
}

function setupSpeedQueue() {
    speedQueue.enqueue(30);
    speedQueue.enqueue(25);
    speedQueue.enqueue(20);
    speedQueue.enqueue(15);
    speedQueue.enqueue(10);
    speedQueue.enqueue(5);
}

function updateDifficultyBasedOnScore() {
    if (score >= 500 && currentLoopSpeed > 25) {
        currentLoopSpeed = 25;
    } else if (score >= 1000 && currentLoopSpeed > 20) {
        currentLoopSpeed = 20;
    } else if (score >= 1500 && currentLoopSpeed > 15) {
        currentLoopSpeed = 15;
    } else if (score >= 2000 && currentLoopSpeed > 10) {
        currentLoopSpeed = 10;
    } else if (score >= 2500 && currentLoopSpeed > 5) {
        currentLoopSpeed = 5;
    }
    loopSpeed = currentLoopSpeed;
}

function checkRowComplete() {
    for(let row = rows-1; row >= 0; row--) {
        let isRowFull = true;
        for(let col = 0; col < cols; col++) {
            // console.log(`board[${row}][${col}] = ${board[row][col]}`)
            if (board[row][col] === 0) {
                isRowFull = false;
                break;
            }
        }
        if(isRowFull) {
            console.log(row);
            for(let row2 = row; row2 > 0; row2--) {
                for(let col = 0; col < cols; col++) {
                    console.log(`board[${row2}][${col}] (${board[row2][col]}) = board[${row2-1}][${col}] (${board[row2-1][col]})`)
                    board[row2][col] = board[row2-1][col];
                    
                }
            }
            score += 250;
            updateDifficultyBasedOnScore();
        }
    }

    // for (let row = rows - 1; row >= 0; row--) {
    //     let isRowFull = true;
    //     for (let col = 0; col < cols; col++) {
    //         if (board[row][col] === 0) {
    //             isRowFull = false;
    //             break;
    //         }
    //     }
    //     if (isRowFull) {
    //         for (let y = row - 1; y > 0; y--) {
    //             for (let col = 0; col < cols; col++) {
    //                 board[y][col] = board[y - 1][col];
    //             }
    //         }
    //         for (let col = 0; col < cols; col++) {
    //             board[0][col] = 0;
    //         }
    //         score += 250;
    //         updateDifficultyBasedOnScore();
    //     }
    // }
}

class Piece {
    constructor() {
        this.shapes = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // []
            [[0, 1, 0], [1, 1, 1]], // T
            [[1, 0, 0], [1, 1, 1]], // J
            [[0, 0, 1], [1, 1, 1]], // L
            [[1, 1, 0], [0, 1, 1]], // S
            [[0, 1, 1], [1, 1, 0]]  // Z
        ];
        this.color = [random(255), random(200), random(255)];
        this.shape = random(this.shapes);
        this.x = floor(cols / 2) - 1;
        this.y = -2;''
        this.rotationIndex = 0;
    }
    show() {
        stroke(200);
        strokeWeight(1);
        fill(this.color);
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] === 1) {
                    rect((this.x + j) * blockSize, (this.y + i) * blockSize, blockSize, blockSize);
                }
            }
        }
    }
    update() {
        if (frameCount % loopSpeed === 0) {
            if (!this.collide(0, 1)) {
                this.y++;
            } else {
                this.fixToBoard();
                checkRowComplete();
                currentPiece = nextPiece;
                nextPiece = new Piece();
            }
        }
    }
    move(dir) {
        if (!this.collide(dir, 0)) {
            this.x += dir;
        }
    }
    rotate() {
        let newShape = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            let newRow = [];
            for (let j = this.shape.length - 1; j >= 0; j--) {
                newRow.push(this.shape[j][i]);
            }
            newShape.push(newRow);
        }
      
        if (!this.collide(0, 0, newShape)) {
            this.shape = newShape;
        }
    }
    collide(dx, dy, futureShape) {
        let shape = futureShape || this.shape;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    let newX = this.x + j + dx;
                    let newY = this.y + i + dy;
                    if (newX >= cols || newX < 0 || newY >= rows) {
                        return true;
                    }
                    if (newY >= 0 && board[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
  
    fixToBoard() {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] === 1) {
                  if (this.y + i < 0) {
                    gameOver = true;
                    return;
                  }
                    let x = this.x + j;
                    let y = this.y + i;
                    if (y < rows) {
                        board[y][x] = this.color;
                    }
                    canHold = true;
                }
            }
        }
    }
}
