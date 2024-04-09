const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = [];
const size = 6;
let currentPlayer = 'X';

// Initialize the board
for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
        board[i][j] = '-';
    }
}

function printBoard() {
    for (let i = 0; i < size; i++) {
        console.log(board[i].join(' '));
    }
}

function placePiece(x, y, player) {
    if (board[x][y] === '-') {
        board[x][y] = player;
        //currentPlayer = player === 'X' ? 'O' : 'X';
    } else {
        console.log("Invalid move");
    }
}

function checkWin(player) {

    for (let m = 0; m < size; m++) { //horizonal
        for (let n = 0; n < size - 4; n++) {
            if (board[m][n] === player &&
                board[m][n + 1] === player &&
                board[m][n + 2] === player &&
                board[m][n + 3] === player &&
                board[m][n + 4] === player) {
                return true
            }
        }
    }

    for (let n = 0; n < size; n++) {  //vertical
        for (let m = 0; m < size - 4; m++) {
            if (board[m][n] === player &&
                board[m + 1][n] === player &&
                board[m + 2][n] === player &&
                board[m + 3][n] === player &&
                board[m + 4][n] === player) {
                return true
            }
        }
    }

    for (let m = 0; m < size - 4; m++) { //left to right, top to bottom
        for (let n = 0; n < size - 4; n++) {
            if (board[m][n] === player &&
                board[m + 1][n + 1] === player &&
                board[m + 2][n + 2] === player &&
                board[m + 3][n + 3] === player &&
                board[m + 4][n + 4] === player) {
                return true
            }
        }
    }

    for (let m = 0; m < size - 4; m++) {
        for (let n = 0; n > 3; n++) {
            if (board[m][n] === player &&
                board[m - 1][n - 1] === player &&
                board[m - 2][n - 2] === player &&
                board[m - 3][n - 3] === player &&
                board[m - 4][n - 4] === player) {
                return true
            }
        }
    }

    return false
}


function askDifficulty() {
    rl.question("Do you want to play in 'easy' mode or 'hard' mode? Please type 'easy' for easy mode and 'hard' for hard mode.", (answer) => {
        if (answer === 'easy') {
            console.log("You have selected easy mode.");
            nextTurn(easyComputerMove);
        } else if (answer === 'hard') {
            console.log("You have selected hard mode.");
            nextTurn(hardComputerMove);
        } else {
            console.log("Invalid input! Please type 'easy' for easy mode and 'hard' for hard mode.");
            askDifficulty();  // Ask the question again
        }
    });
}


function easyComputerMove() {
    let availableMoves = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === '-') {
                availableMoves.push([i, j]);
            }
        }
    }
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function hardComputerMove() {
    let availableMoves = [];
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]; // right, down, right-down, left-down

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            if(board[i][j] === '-') {
                availableMoves.push([i, j]);
            }
        }
    }

    // Check if the computer has four consecutive pieces and block them
    for(let move of availableMoves) {
        let [x, y] = move;
        // Temporarily place the piece
        board[x][y] = 'O';
        if(checkWin('O')) {
            // If this move can make the player win, block it
            board[x][y] = '-';
            return move;
        }
        // Remove the temporarily placed piece
        board[x][y] = '-';
    }

    // Check if the player has four consecutive pieces and block them
    for(let move of availableMoves) {
        let [x, y] = move;
        // Temporarily place the piece
        board[x][y] = 'X';
        if(checkWin('X')) {
            // If this move can make the player win, block it
            board[x][y] = '-';
            return move;
        }
        // Remove the temporarily placed piece
        board[x][y] = '-';
    }

    // // Check if the player has three consecutive pieces and block them
    // for(let move of availableMoves) {
    //     let [x, y] = move;
    //     // Temporarily place the piece
    //     board[x][y] = 'X';
    //     for (let d = 0; d < directions.length; d++) {
    //         let count = 0;
    //         for (let k = 1; k <= 3; k++) {
    //             let x2 = x + directions[d][0] * k;
    //             let y2 = y + directions[d][1] * k;
    //             if (x2 >= 0 && x2 < size && y2 >= 0 && y2 < size && board[x2][y2] === 'X') {
    //                 count++;
    //             }
    //         }
    //         if (count === 3) {
    //             // If this move results in three consecutive pieces for the player, block it
    //             board[x][y] = '-';
    //             return move;
    //         }
    //     }
    //     // Remove the temporarily placed piece
    //     board[x][y] = '-';
    // }

    // If the player does not have three or four consecutive pieces, make a random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}


function checkDraw() {
    const players = ['X', 'O'];
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]; // right, down, right-down, left-down
    let emptySpaces = 0;

    // Count the number of empty spaces on the board
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === '-') {
                emptySpaces++;
            }
        }
    }

    let roundsLeft = Math.floor(emptySpaces / 2);

    for (let p = 0; p < players.length; p++) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === '-') {
                    for (let d = 0; d < directions.length; d++) {
                        let possibleWin = true;
                        for (let k = 1; k <= 4; k++) {
                            let x = i + directions[d][0] * k;
                            let y = j + directions[d][1] * k;
                            if (x < 0 || x >= size || y < 0 || y >= size || board[x][y] === (players[p] === 'X' ? 'O' : 'X')) {
                                possibleWin = false;
                                break;
                            }
                        }
                        if (possibleWin && roundsLeft >= 4) {
                            return false; // game is not a draw as there is a possibility to win
                        }
                    }
                }
            }
        }
    }
    // If no winning possibility is found for any player or there are not enough rounds left, the game is a draw
    return true;
}


function nextTurn(computerMove) {
    printBoard();
    if (currentPlayer === 'X') {
        rl.question(`Player ${currentPlayer}, enter your move in the format 'x,y': `, (move) => {
            let [x, y] = move.split(',').map(Number);
            if (x >= 0 && x < size && y >= 0 && y < size && board[x][y] === '-') {
                placePiece(x, y, currentPlayer);
                if (checkWin(currentPlayer)) {
                    printBoard();
                    console.log(`Player ${currentPlayer} wins!`);
                    rl.close();
                } else if (checkDraw()) {
                    printBoard();
                    console.log(`The game is a draw!`);
                    rl.close();
                } else {
                    currentPlayer = 'O';
                    nextTurn(computerMove);
                }
            } else {
                console.log("Invalid move, please try again.");
                nextTurn(computerMove);
            }
        });
    } else {
        let [x, y] = computerMove();
        console.log(`Computer places piece at ${x},${y}`);
        placePiece(x, y, currentPlayer);
        if (checkWin(currentPlayer)) {
            printBoard();
            console.log(`Player ${currentPlayer} wins!`);
            rl.close();
        } else if (checkDraw()) {
            printBoard();
            console.log(`The game is a draw!`);
            rl.close();
        } else {
            currentPlayer = 'X';
            nextTurn(computerMove);
        }
    }
}

function nextTurnP2P() {
    printBoard();
        rl.question(`Player ${currentPlayer}, enter your move in the format 'x,y': `, (move) => {
            let [x, y] = move.split(',').map(Number);
            if(x >= 0 && x < size && y >= 0 && y < size && board[x][y] === '-') {
                placePiece(x, y, currentPlayer);
                if (checkWin(currentPlayer)) {
                    printBoard();
                    console.log(`Player ${currentPlayer} wins!`);
                    rl.close();
                } else if (checkDraw()) {
                    printBoard();
                    console.log(`The game is a draw!`);
                    rl.close();
                } else {
                    if (currentPlayer === 'X')
                        currentPlayer = 'O';
                    else
                        currentPlayer = 'X';
                        nextTurnP2P();
                }
            } else {
                console.log("Invalid move, please try again.");
                nextTurnP2P();
            }
        });

}

function playGame() {
    function askQuestion() {
        rl.question("Do you want to play in 'player to player' mode or 'player to computer' mode? Please type 'p2p' for player to player mode and 'p2c' for player to computer mode.", (answer) => {
            if (answer === 'p2p') {
                console.log("You have selected player to player mode.");
                nextTurnP2P();
                                
            } else if (answer === 'p2c') {
                console.log("You have selected player to computer mode.");
                askDifficulty();

            } else {
                console.log("Invalid input! Please type 'p2p' for player to player mode and 'p2c' for player to computer mode.");
                askQuestion();  // Ask the question again
            }
        });
    }
    askQuestion();  // Start the questioning
}

// Start the game
playGame();