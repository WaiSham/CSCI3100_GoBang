import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Record, Admin } from "./Style";

export function UserPage({ userinfo }) {
  const [games, setGames] = useState();

  useEffect(() => {
    setGames(userinfo.current.games);
  }, []);

  return (
    <User>
      <h3>Previous Games:</h3>
      {games !== undefined ? (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              Black: {game.playerBlack.username}, white: {game.playerWhite.username},
              start: {game.startTime}, time elapsed: {game.elapsedTime}{game.result ? ", winner: " + game.result: ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading previous games...</p>
      )}
    </User>
  );
}