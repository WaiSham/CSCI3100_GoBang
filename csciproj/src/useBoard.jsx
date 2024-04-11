import { useState, useRef, useCallback, useEffect } from "react";
import { findWinner } from "./utils";
import StepSound from "./step.mp3";
import WinSound from "./End Game(WIN).mp3";

const SIZE = 19;

export default function useBoard(userID) {
  const [board, setBoard] = useState(Array(SIZE).fill(Array(SIZE).fill(null)));
  const [winner, setWinner] = useState(null);

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

            // reconstruct 19 x 19 board
            setBoard(Array.from(
              { length: 19 },
              (_, index) => payload.data.board.slice(index * 19, (index + 1) * 19)
                .map((v) => {
                  switch (v) {
                    case -1:
                      return null;
                    case 0:
                      return "white";
                    case 1:
                      return "black";
                  }
                })
            ));

            setIsMMDone(true);
          }
          break;
        case "boardNewGo":
          updateBoard(payload.data.y, payload.data.x, payload.data.side);
          break;
        case "boardRemoveGo":
          setBoard((board) => {
            board[payload.data.y][payload.data.x] = null;
            return board;
          });
          break;
        case "move":
          if (!payload.ok && payload.reason === "notTurn") {
            alert("Not your turn!")
            return;
          }
          break;
        case "retractRequest":
          socket.send(JSON.stringify({
            type: "retractResponse",
            data: {
              accept: window.confirm("Opponent request for a retract, accept?")
            }
          }))
          break;
        case "retract":
          if (payload.ok) {
            alert("Opponent accepted retract request.");
          } else {
            alert("Opponent rejected retract request.");
            return;
          }
          break;
        case "endGame":
          setWinner(payload.data.side);
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

  function retract() {
    ws.current.send(JSON.stringify({
      type: "retract"
    }));
  }

  const handleChessClick = useCallback(
    (row, col, value) => {
      if (value) return;
      lastRow.current = row;
      lastCol.current = col;
      updateBoard(row, col, "black");
      let x, y;
      do {
        x = Math.round(Math.random() * 18);
        y = Math.round(Math.random() * 18);
      } while (board[y][x] !== null);
      updateBoard(y, x, "white");
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
    setBoard,
    winner,
    handleChessClick,
    handlePVPChessClick,
    MM,
    isMMDone,
    wsConnect,
    retract
  };
}