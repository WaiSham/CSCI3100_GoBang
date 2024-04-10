import { useState, useRef, useCallback, useEffect } from "react";
import { findWinner } from "./utils";

const SIZE = 19;

export default function useBoard() {
  const [board, setBoard] = useState(Array(SIZE).fill(Array(SIZE).fill(null)));
  const [wineer, setWineer] = useState();


  const isBlackMoving = useRef(true);
  //last saved row and column
  const lastRow = useRef();
  const lastCol = useRef();

  const updateBoard = useCallback((y, x, newValue) => {
    setBoard((board) =>
      board.map((row, currentY) => {

        if (currentY !== y) return row;

        // if so, find the position of x to be modified
        return row.map((col, currentX) => {
          if (currentX !== x) return col;
          return newValue;
        });
      })
    );
  }, []);




  const hardComputerMove = () => {
    // need to finish 
    //1. first piority is to win eg. when pc have horizontal 4, then place win step
    //2. second piority is to block the the player eg. when player have horizontal 3 or more chess then block him
  };
  
  

  const easyComputerMove = () => {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === null) {
          availableMoves.push([i, j]);
        }
      }
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };




  const handleChessClick = useCallback(
    (row, col, value) => {
      // there exists a chess
      if (value) return;

      lastRow.current = row;
      lastCol.current = col;
      updateBoard(row, col, isBlackMoving.current ? "black" : "white");
      isBlackMoving.current = !isBlackMoving.current;
    },
    [updateBoard]
  );

  const handlePcChessClick = useCallback(
    (row, col, value) => {
      // there exists a chess
      if (value) return;

      lastRow.current = row;
      lastCol.current = col;
      updateBoard(row, col, isBlackMoving.current ? "black" : "white");
      isBlackMoving.current = !isBlackMoving.current;

      // After the player makes a move, get the bot's move
      const [botRow, botCol] = easyComputerMove();
      updateBoard(botRow, botCol, isBlackMoving.current ? "black" : "white");
      isBlackMoving.current = !isBlackMoving.current;
    },
    [updateBoard]
  );




  useEffect(() => {
    if (lastRow.current === undefined || lastCol.current === undefined) return;
    setWineer(findWinner(board, lastRow.current, lastCol.current));
  }, [board]);

  return {
    board,
    wineer,
    handleChessClick,
    handlePcChessClick
  };
}