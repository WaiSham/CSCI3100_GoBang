import React, {useState, useEffect} from "react";

import useBoard from "./useBoard";
import Chess from "./Chess";

import {GlobalStyles, Title, LeftColumn, Logo, LoginSection, SignupButton, UsernameInput, PasswordInput, LoginButton, GameModeSelection, GameModeButton, FriendsList, Wrapper, CenterColumn, ChessContainer, Checkerboard, Row, WinnerModal, ModalInner, RightColumn, Timer, GameInfo, GameControlButton, ChatBox, ChatMessages, ChatInput, ChatButton} from "./Style";

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

    // sign up handling thingy
    const handleSignup = () => {
      // Handle sign up logic here
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
      <GlobalStyles />        
      <Title>Gobang</Title>
      {/* {wineer && (
        <WinnerModal>
          <ModalInner>
            {wineer === "draw" && "平手"}
            {wineer === "black" && "獲勝的是黑子"}
            {wineer === "white" && "獲勝的是白子"}
            <br />
            <button onClick={() => window.location.reload()}>再玩一次</button>
          </ModalInner>
        </WinnerModal>
      )} */}
      <Wrapper>
      <LeftColumn>
        <Logo src="/path/to/logo.png" alt="Logo" />
        <LoginSection>
          <UsernameInput type="text" placeholder="Username" />
          <PasswordInput type="password" placeholder="Password" />
          <LoginButton onClick={handleLogin}>Login</LoginButton>
          <SignupButton onClick={handleSignup}>Sign Up</SignupButton>
        </LoginSection>
        <GameModeSelection>
          <GameModeButton
            onClick={() => handleModeSelection("PvC")}
            style={{ backgroundColor: selectedMode === "singlePlayer" ? "green" : "" }}
          >
            Player vs Computer
          </GameModeButton>
          <GameModeButton
            onClick={() => handleModeSelection("PvP")}
            style={{ backgroundColor: selectedMode === "multiPlayer" ? "green" : "" }}
          >
            Player vs Player
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

      <CenterColumn>
        <ChessContainer>
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
        </ChessContainer>
      </CenterColumn>

      <RightColumn>
      <Timer>
      Time: {timer}
      </Timer>
      <GameInfo>
          The game isn't started yet!
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
