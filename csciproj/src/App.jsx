import React, {useState, useEffect} from "react";
import styled from "styled-components";

import useBoard from "./useBoard";
import Chess from "./Chess";


const Title = styled.h1`
  color: #333;
  text-align: center;
`;
// Left Column --------------------------------
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const UsernameInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

const PasswordInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
`;

const GameModeSelection = styled.div`
  margin-bottom: 20px;
`;

const GameModeButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
`;

const FriendsList = styled.div`
  margin-bottom: 20px;
`;

// Chess board ---------------------
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  height: 100vh; /* Set the height of the container to the full viewport height */
`;

const ChessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Checkerboard = styled.div`
  display: inline-block;
  margin-top: 0;
`;

const Row = styled.div`
  display: flex;
`;

const WinnerModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const ModalInner = styled.div`
  background: white;
  color: black;
  height: 300px;
  width: 300px;
  padding: 24px;
  text-align: center;
`;

// Right Column ------------------------------- 
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
`;

const Timer = styled.div`
  margin-bottom: 20px;
`;

const GameInfo = styled.div`
  margin-bottom: 20px;
`;

const GameControlButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
`;

const ChatBox = styled.div`
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  overflow-y: scroll;
`;

const ChatMessages = styled.div`
  /* Styles for the chat messages container */
`;

const ChatInput = styled.input`
  /* Styles for the chat input box */
`;

const ChatButton = styled.button`
  /* Styles for the chat send button */
`;

export default function App() {
  const { board, wineer, handleChessClick } = useBoard();
  const [selectedMode, setSelectedMode] = useState(null); //for gamemode
  const [friends, setFriends] = useState([]); //for friendlist
  const [timer, setTimer] = useState(0); //for timer
  const [gameInfo, setGameInfo] = useState("");//for gameinfo display

  // login handling thingy
  const handleLogin = () => {
    // Handle login logic here
  };
  //gamemode selection thingy
  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
  };
  // Function to fetch friends data from an API or other data source
  const fetchFriends = () => {
    // Simulating an asynchronous API call
    setTimeout(() => {
      const friendsData = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Alice" },
        { id: 4, name: "Bob" },
      ];
      setFriends(friendsData);
    }, 1000);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // for timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  
    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, []);

  //for game control button
  // Function to handle retracting a move
  const handleRetractMove = () => {
    // Logic to retract a move goes here
  };

  // Function to handle surrendering the game
  const handleSurrender = () => {
    // Logic to surrender the game goes here
  };

  // Function to handle sending a friend request
  const handleFriendRequest = () => {
    // Logic to send a friend request goes here
  };

  // Function to handle game chat (not work)
  // const ChatBox = () => {
    //something to use here
  //}

  return (
    <div>
      <Title>Gobang</Title>
      {wineer && (
        <WinnerModal>
          <ModalInner>
            {wineer === "draw" && "平手"}
            {wineer === "black" && "獲勝的是黑子"}
            {wineer === "white" && "獲勝的是白子"}
            <br />
            <button onClick={() => window.location.reload()}>再玩一次</button>
          </ModalInner>
        </WinnerModal>
      )}
      <Wrapper>
      <LeftColumn>
        <Logo src="/path/to/logo.png" alt="Logo" />
        <LoginSection>
          <UsernameInput type="text" placeholder="Username" />
          <PasswordInput type="password" placeholder="Password" />
          <LoginButton onClick={handleLogin}>Login</LoginButton>
        </LoginSection>
        <GameModeSelection>
          <GameModeButton
            onClick={() => handleModeSelection("singlePlayer")}
            style={{ backgroundColor: selectedMode === "singlePlayer" ? "green" : "" }}
          >
            Single Player
          </GameModeButton>
          <GameModeButton
            onClick={() => handleModeSelection("multiPlayer")}
            style={{ backgroundColor: selectedMode === "multiPlayer" ? "green" : "" }}
          >
            Multiplayer
          </GameModeButton>
        </GameModeSelection>
        <FriendsList>
          <h2>Friends List</h2>
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend) => (
                <li key={friend.id}>{friend.name}</li>
              ))}
            </ul>
          ) : (
            <p>Loading friends...</p>
          )}
        </FriendsList>
      </LeftColumn>

        <Checkerboard>
          {board.map((row, rowIndex) => {
            return (
              <Row key={rowIndex}>
                {row.map((col, colIndex) => {
                  return (
                    <Chess
                      key={colIndex}
                      row={rowIndex}
                      col={colIndex}
                      value={board[rowIndex][colIndex]}
                      onClick={handleChessClick}
                    />
                  );
                })}
              </Row>
            );
          })}
        </Checkerboard>

      <RightColumn>
      <Timer>
      Time: {timer}
      </Timer>
      <GameInfo>
      {gameInfo}
      </GameInfo>
      <GameControlButton onClick={handleRetractMove}>
        Retract Move
      </GameControlButton>
      <GameControlButton onClick={handleSurrender}>
        Surrender
      </GameControlButton>
      <GameControlButton onClick={handleFriendRequest}>
        Send Friend Request
      </GameControlButton>
      <ChatBox>
          There is no chat yet!
      </ChatBox>
      </RightColumn>

      
      </Wrapper>
    </div>
  );
}
