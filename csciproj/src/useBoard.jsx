import { useState, useRef, useCallback, useEffect } from "react";
import { findWinner } from "./utils";
import StepSound from "./step.mp3";
import WinSound from "./End Game(WIN).mp3";

const SIZE = 19;

export default function useBoard(userID) {
  const [board, setBoard] = useState(Array(SIZE).fill(Array(SIZE).fill(null)));
  const [winner, setWinner] = useState(null);

  const isBlackMoving = useRef(true);
  const lastRow = useRef();
  const lastCol = useRef();

  const updateBoard = useCallback((y, x, newValue) => {
    setBoard((prevBoard) =>
      prevBoard.map((row, currentY) => {
        if (currentY !== y) return row;
        return row.map((col, currentX) => {
          if (currentX !== x) return col;
          return newValue;
        });
      })
    );
  }, []);

  const [isMMDone, setIsMMDone] = useState(false);
  const gameID = useRef();

  const ws = useRef();
  function wsConnect(userID) {
    const socket = new WebSocket("ws://localhost/ws");

    socket.addEventListener("open", (ev) => {
      socket.send(JSON.stringify({
        type: "auth",
        data: {
          userID: userID
        }
      }))
    });

    socket.addEventListener("message", (ev) => {
      const payload = JSON.parse(ev.data);

      switch (payload.type) {
        case "MM":
          if (payload.ok) {
            gameID.current = payload.data.gameID;
            
            //reconstruct 19 x 19 board
            const twoDBoard = Array.from({ length: 19 }, (_, index) =>
              payload.data.board.slice(index * 19, (index + 1) * 19)
            );

            

            setIsMMDone(true);
          }
          break;
        case "boardNewGo":
          updateBoard(payload.data.y, payload.data.x, payload.data.side);
          break;
      }
    });

    ws.current = socket;
  }
  useEffect(() => { if (ws.current !== undefined) return () => ws.current.close(); }, []);

  function MM() {
    ws.current.send(JSON.stringify({
      type: "MM"
    }))
  }

  const handleChessClick = useCallback(
    (row, col, value) => {
      if (value) return;
      lastRow.current = row;
      lastCol.current = col;
      updateBoard(row, col, isBlackMoving.current ? "black" : "white");
      isBlackMoving.current = !isBlackMoving.current;
    },
    [updateBoard]
  );

  const handlePVPChessClick = useCallback(
    (row, col, value) => {
      if (value) return;

      ws.current.send(JSON.stringify({
        type: "move",
        data: {
          gameID: gameID.current,
          x: col,
          y: row,
          timeUsed: 0
        }
      }))
    },
    [updateBoard]
  )

  useEffect(() => {
    if (lastRow.current !== undefined && lastCol.current !== undefined) {
      const audio = new Audio(StepSound);
      audio.play();
    }
  }, [lastRow.current, lastCol.current]);

  useEffect(() => {
    if (lastRow.current === undefined || lastCol.current === undefined) return;

    const newWinner = findWinner(board, lastRow.current, lastCol.current);
    setWinner(newWinner);

    if (newWinner) {
      const audio = new Audio(WinSound);
      audio.play();
    }
  }, [lastRow.current, lastCol.current, board]);

  return {
    board,
    winner,
    handleChessClick,
    handlePVPChessClick,
    MM,
    isMMDone,
    wsConnect
  };
}