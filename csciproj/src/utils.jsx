function countTotal(board, currentY, currentX, directionX, directionY) {
    // 現在要檢查的棋子是什麼顏色
    const now = board[currentY][currentX];
  
    let tempX = currentX;
    let tempY = currentY;
    let total = 0;
    do {
      tempX += directionX; // 檢查下一顆棋子
      tempY += directionY;
  
      // 如果新的棋子等於我現在要檢查的（意思就是連續啦）
      if (board[tempY] && board[tempY][tempX] === now) {
        // 連續的棋子數 + 1
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
  