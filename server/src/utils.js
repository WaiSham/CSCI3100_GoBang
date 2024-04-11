function countTotal(board, currentY, currentX, directionX, directionY) {
    // check the color of the current chess
    const now = board[currentY][currentX];

    let tempX = currentX;
    let tempY = currentY;
    let total = 0;
    do {
        tempX += directionX; // check the color of the next chess
        tempY += directionY;

        // if the new chess to be checked is the current chess 
        if (board[tempY] && board[tempY][tempX] === now) {
            // consecutive +1
            total++;
        } else {
            break;
        }
    } while (true);

    return total;
}

export function findWinner(board, y, x) {
    if (
        countTotal(board, y, x, 1, 0) + countTotal(board, y, x, -1, 0) >= 4 ||
        countTotal(board, y, x, 0, 1) + countTotal(board, y, x, 0, -1) >= 4 ||
        countTotal(board, y, x, 1, 1) + countTotal(board, y, x, -1, -1) >= 4 ||
        countTotal(board, y, x, 1, -1) + countTotal(board, y, x, -1, 1) >= 4
    ) {
        return board[y][x];
    }

    if (board.every((row) => row.every((col) => col))) {
        return "draw";
    }
}
