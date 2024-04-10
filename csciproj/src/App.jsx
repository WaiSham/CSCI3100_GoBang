import React, { useState, useEffect } from "react";

//import internal files
import logo from './icon.png';
import useBoard from "./useBoard";
import Chess from "./Chess";
import SignupForm from "./SignupForm";

//import styled-components
import { GlobalStyles, Title, LeftColumn, Logo, LoginSection, SignForm, SignupButton, SignupTitle, SignupInput, UsernameInput, PasswordInput, LoginButton, GameModeSelection, GameModeButton, FriendsList, Wrapper, CenterColumn, ChessContainer, Checkerboard, Row, WinnerModal, ModalInner, RightColumn, Timer, GameInfo, GameControl, GameControlButton, ChatBox, ChatMessages, ChatInput, ChatButton, ModalButton, ModalInnerInner, ModalInnerInner2, ModalText } from "./Style";

export default function App() {
  const { board, wineer, handleChessClick, handlePcChessClick } = useBoard();
  const [showSignupPage, setShowSignupPage] = useState(true);
  const [selectedMode, setSelectedMode] = useState('');
  const [friends, setFriends] = useState([]);
  const [timer, setTimer] = useState(300);//assume 5 minutes match by default
  const [gameInfo, setGameInfo] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");




  const handleLogin = async () => {
    try {
      // Send a request to your server with the username and password
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If the login was successful, update your state here
        alert("Login successful!");
      } else {
        // If there was an error, you can handle it here
        alert("Error logging in");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      // Similar to the login function, but this time we're creating a new account
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If the signup was successful, update your state here
        alert("Signup successful!");
      } else {
        // If there was an error, you can handle it here
        alert("Error signing up");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleModeSelection = (mode) => {
    setShowSignupPage(false);
    setSelectedMode(mode);
    setIsGameStarted(true); // Start the game
  };

  const fetchFriends = () => {
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

  // for time (Downcounting)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameStarted) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameStarted]);

  // // for timer (Upcounting)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prevTimer) => prevTimer + 1);
  //   }, 1000);

  //   return () => clearInterval(interval); // Clean up the interval when the component unmounts
  // }, []);

  //for game control button
  // Function to handle retracting a move
  const handleRetractMove = () => {
    // Logic to retract a move goes here
    alert("no one write yet!!!")
  };

  // Function to handle surrendering the game
  const handleSurrender = () => {
    // Logic to surrender the game goes here
    alert("no two write yet!!!")
  };

  // Function to handle sending a friend request
  const handleFriendRequest = () => {
    // Logic to send a friend request goes here
    alert("no three write yet!!!")
  };

  const handleChatBox = () => {
    //fetchChat();  //to send data out
    alert("no four write yet!!!")
  };
  // //Function to handle game chat (not work)
  // const ChatBox = () => {
  //   // something to use here get data every sometimes
  // }

  return (
    <div>
      <GlobalStyles />
      {/* <Title>Gobang</Title> */}
      {wineer && (
        <WinnerModal>
          <ModalInner>
            <ModalInnerInner2>
              {wineer === "draw" ? (
                <ModalText>WE CALL IT A TIE</ModalText>
              ) : wineer === "black" ? (
                <ModalText>BLACK WINS</ModalText>
              ) : wineer === "white" ? (
                <ModalText>WHITE WINS</ModalText>
              ) : null}
            </ModalInnerInner2>
            <ModalInnerInner>
              <ModalButton onClick={() => window.location.reload()}>Once More</ModalButton>
            </ModalInnerInner>
          </ModalInner>
        </WinnerModal>
      )}
      <Wrapper>
        <LeftColumn>
          <Logo src={logo} alt="Logo" />
          <LoginSection>

            <UsernameInput type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <PasswordInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <LoginButton onClick={handleLogin}>Login</LoginButton>
            {/* have a re-redenered sign up  section so this is not needed */}
            {/* <SignupButton onClick={handleSignup}>Sign Up</SignupButton> */}
          </LoginSection>
          <GameModeSelection>
            <GameModeButton
              onClick={() => handleModeSelection("PvC")}
              style={{ backgroundColor: selectedMode === "PvC" ? "green" : "" }}
            >
              Player vs Computer
            </GameModeButton>
            <GameModeButton
              onClick={() => handleModeSelection("PvP")}
              style={{ backgroundColor: selectedMode === "PvP" ? "green" : "" }}
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
          <Title>Gobang</Title>
          {/* When I choose anything other than default state there is a bug. */}
          {
            //faulty signup rendering logic
            // showSignupPage ? (
            //     SignupForm()
            //   ) : 
            selectedMode === 'PvP' ? (
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
            ) : selectedMode === 'PvC' ? (
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
                              onClick={handlePcChessClick}
                            />
                          );
                        })}
                      </Row>
                    );
                  })}
                </Checkerboard>
              </ChessContainer>
            ) : null}
        </CenterColumn>

        <RightColumn>
          <Timer>
            Time: {timer}
          </Timer>
          <GameInfo>
            The game isn't started yet!
          </GameInfo>
          <GameControl>
            <GameControlButton onClick={handleRetractMove}>
              Retract Move
            </GameControlButton>
            <GameControlButton onClick={handleSurrender}>
              Surrender
            </GameControlButton>
            <GameControlButton onClick={handleFriendRequest}>
              Send Friend Request
            </GameControlButton>
          </GameControl>

          <ChatBox>
            <ChatMessages>
              There is no chat yet!
            </ChatMessages>
            <ChatInput type="text" placeholder="Type your text here."></ChatInput>
            <ChatButton onClick={handleChatBox}>Send</ChatButton>
          </ChatBox>
        </RightColumn>


      </Wrapper>
    </div>
  );
}

//----------------------------------------------------------
