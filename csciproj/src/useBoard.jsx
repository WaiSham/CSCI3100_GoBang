import React, { useState, useRef, useCallback, useEffect } from "react";
import { findWinner } from "./utils";

const SIZE = 19;

export default function useBoard() {
  const [board, setBoard] = useState(() => Array(SIZE).fill(Array(SIZE).fill(null)));
  const [winner, setWinner] = useState(null);
  const [gameInfo, setGameInfo] = useState("Player Black's turn");

  const isBlackMoving = useRef(true);
  const lastRow = useRef();
  const lastCol = useRef();

  const updateBoard = useCallback((y, x, newValue) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[y] = [...prevBoard[y]];
      newBoard[y][x] = newValue;
      return newBoard;
    });
  }, []);

  const handleChessClick = useCallback((row, col, value) => {
    if (value) return;

    lastRow.current = row;
    lastCol.current = col;
    updateBoard(row, col, isBlackMoving.current ? "black" : "white");
    isBlackMoving.current = !isBlackMoving.current;

    const hasWinner = findWinner(board, row, col);
    if (hasWinner) {
      setWinner(isBlackMoving.current ? "Player White wins!" : "Player Black wins!");
      setGameInfo("");
    } else {
      setGameInfo(isBlackMoving.current ? "Player Black's turn" : "Player White's turn");
    }
  }, [board, updateBoard]);

  useEffect(() => {
    if (lastRow.current === undefined || lastCol.current === undefined) return;
    const hasWinner = findWinner(board, lastRow.current, lastCol.current);
    if (hasWinner) {
      setWinner(isBlackMoving.current ? "Player White wins!" : "Player Black wins!");
      setGameInfo("");
    }
  }, [board]);

  return {
    board,
    winner,
    gameInfo,
    isBlackMoving,
    lastRow,
    lastCol,
    updateBoard,
    handleChessClick
  };
}