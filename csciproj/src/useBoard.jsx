import { useState, useRef, useCallback, useEffect } from "react";
import { findWinner } from "./utils";
import StepSound from "./step.mp3";
import WinSound from "./End Game(WIN).mp3";

// const SIZE = 19;

// export default function useBoard() {
//   const [board, setBoard] = useState(Array(SIZE).fill(Array(SIZE).fill(null)));
//   const [wineer, setWineer] = useState();

  
//   const isBlackMoving = useRef(true);
//   //last saved row and column
//   const lastRow = useRef();
//   const lastCol = useRef();

//   const updateBoard = useCallback((y, x, newValue) => {
//     setBoard((board) =>
//       board.map((row, currentY) => {

//         if (currentY !== y) return row;

//         // if so, find the position of x to be modified
//         return row.map((col, currentX) => {
//           if (currentX !== x) return col;
//           return newValue;
//         });
//       })
//     );
//   }, []);

//   const handleChessClick = useCallback(
//     (row, col, value) => {
//       // there exists a chess
//       if (value) return;

//       lastRow.current = row;
//       lastCol.current = col;
//       updateBoard(row, col, isBlackMoving.current ? "black" : "white");
//       isBlackMoving.current = !isBlackMoving.current;
//     },
//     [updateBoard]
//   );

//   useEffect(() => {
//     if (lastRow.current === undefined || lastCol.current === undefined) return;
//     setWineer(findWinner(board, lastRow.current, lastCol.current));
//   }, [board]);

//   return {
//     board,
//     wineer,
//     handleChessClick
//   };
// }

//------------------------------

const SIZE = 19;

export default function useBoard() {
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
  };
}