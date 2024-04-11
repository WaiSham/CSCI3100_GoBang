import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

//import internal files
import logo from './icon.png';
import useBoard from "./useBoard";
import Chess from "./Chess";
import SignupForm from "./SignupForm";

//import internal sound files
import BGM from "./BGM.mp3"

//import styled-components
import { GlobalStyles, Title, LeftColumn, Logo, LoginSection, SignForm, SignupButton, SignupTitle, SignupInput, NavigationButton, NavigationContainer, UsernameInput, PasswordInput, LoginButton, GameModeSelection, GameModeButton, FriendsList, Wrapper, CenterColumn, ChessContainer, Checkerboard, Row, WinnerModal, ModalInner, RightColumn, Timer, GameInfo, GameControl, GameControlButton, ChatBox, ChatMessages, ChatInput, ChatButton, ModalButton, ModalInnerInner, ModalInnerInner2, ModalText } from "./Style";

export default function App() {
  const { board, setBoard, winner, handleChessClick, handlePVPChessClick, MM, isMMDone, wsConnect, retract } = useBoard();
  const [showSignupPage, setShowSignupPage] = useState(true);
  const [selectedMode, setSelectedMode] = useState('');
  const [friends, setFriends] = useState([]);
  const [timer, setTimer] = useState(300);//assume 5 minutes match by default
  const [gameInfo, setGameInfo] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isBgmEnabled, setIsBgmEnabled] = useState(false);
  const userID = useRef();

  const handleLogin = () => {
    // Handle login logic here
    axios.post("/login", {
      username: document.getElementsByTagName("input")[0].value.toString(),
      password: document.getElementsByTagName("input")[1].value.toString()
    })
    .then((res) => {
      const payload = res.data;
      if (payload.ok) {
        userID.current = payload.data.userID;
        wsConnect(userID.current);
      } else {
        alert("no such user");
      }
    });
  };

  const handleSignup = () => {
    // Handle sign up logic here
    axios.post("/register", {
      username: document.getElementsByTagName("input")[2].value.toString(),
      password: document.getElementsByTagName("input")[3].value.toString()
    }).then((res) => {
      if (res.data.ok) {
        console.log(res.data.msg);
        setSelectedMode("PVP");
        console.log(selectedMode);
        handleLogin();
      }
      else {
        alert("user not created");
      }
    });
  };

  const handleModeSelection = (mode) => {
    setShowSignupPage(false);
    setSelectedMode(mode);
    setIsGameStarted(true); // Start the game
  };

  const fetchFriends = () => {
    const username = "test3";
    axios.get(("/user?username=test3"), {withCredentials : false})
    .then( (res) => {
      console.log(res.data);
    })
  };

  // const fetchChat = () => {
  //   const username = "test3";
  //   axios.get(("")+)
  //   .then((res) => {
  //     con
  //   })
  // };

  const toggleBgm = () => {
    setIsBgmEnabled((prevIsBgmEnabled) => !prevIsBgmEnabled);
  };

  useEffect(() => {
    const audio = new Audio(BGM); // Replace with the path to your background music file

    if (isBgmEnabled) {
      audio.loop = true;
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isBgmEnabled]);

  const boardBackup = useRef();
  useEffect(() => {
    if (selectedMode === "PvP") {
      boardBackup.current = board;
      MM();
    } else if (selectedMode === "PvC" && boardBackup.current !== undefined) {
      setBoard(boardBackup.current);
    }
  }, [selectedMode]);

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
    retract();
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
      {winner && (
        <WinnerModal>
          <ModalInner>
            <ModalInnerInner2>
              {winner === "draw"?(
                <ModalText>WE CALL IT A TIE</ModalText>
              ):winner === "black"?(
                <ModalText>BLACK WINS</ModalText>
              ):winner === "white"?(
                <ModalText>WHITE WINS</ModalText>
              ):null}
            </ModalInnerInner2>
            <ModalInnerInner>
              <ModalButton onClick={() => window.location.reload()}>Once More</ModalButton>
            </ModalInnerInner>
          </ModalInner>
        </WinnerModal>
      )}
      <NavigationContainer>
        <NavigationButton>Home</NavigationButton>
        <NavigationButton>User</NavigationButton>
        <NavigationButton>Record</NavigationButton>
        <NavigationButton>Admin</NavigationButton>
      </NavigationContainer>
      <Wrapper>
      <LeftColumn>
        <Logo src={logo} alt="Logo" />
        <LoginSection>
          <UsernameInput type="text" placeholder="Username" />
          <PasswordInput type="password" placeholder="Password" />
          <LoginButton onClick={handleLogin}>Login</LoginButton>
          {/* have a re-redenered sign up  section so this is not needed */}
          {/* <SignupButton onClick={handleSignup}>Sign Up</SignupButton> */}
        </LoginSection>
        <GameModeSelection>
          <GameModeButton
              onClick={() => { if (selectedMode !== "PvC") handleModeSelection("PvC") }}
            style={{ backgroundColor: selectedMode === "PvC" ? "green" : "" }}
          >
            Player vs Computer
          </GameModeButton>
          <GameModeButton
              onClick={() => { if (selectedMode !== "PvP") handleModeSelection("PvP") }}
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
      {/* //faulty signup rendering logic */}
      {selectedMode === '' && <SignupForm />}
      {selectedMode === "PvP" && isMMDone && (
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
                          onClick={handlePVPChessClick}
                        />
                      );
                    })}
                  </Row>
                );
              })}
          </Checkerboard>
        </ChessContainer>
      )}
      {selectedMode === 'PvC' && (
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
      )}
      
      {/* {selectedMode === 'User' && ( )}
      {selectedMode === 'Record' && ( )}
      {selectedMode === 'Admin' && ( )} */}

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
        <button onClick={toggleBgm}>
        {isBgmEnabled ? "Disable Music" : "Enable Music"}
      </button>
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