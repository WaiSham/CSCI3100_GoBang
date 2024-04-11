import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Record, Admin } from "./Style";

export function UserPage({ userinfo }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    handleUserPage();
  }, []);

  const handleUserPage = async () => {
    try {
      const response = await fetchGamesData();
      setGames(response.data.games);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGamesData = async () => {
    if (userinfo !== undefined) {
      const response = await axios.get("/api/games", {
        params: {
          userId: userinfo.id,
        },
      });
      return response.data;
    }
  };

  return (
    <User>
      <h3>Previous Games:</h3>
      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.playerBlack.username} {game.playerWhite.username}{" "}
              {game.startTime} {game.elapsedTime} {game.result}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading previous games...</p>
      )}
    </User>
  );
}