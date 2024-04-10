//import styled components from react js
import styled, { createGlobalStyle } from "styled-components";

//style script

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: #121a25;
    color: #ffffff;
  }
`;

// Nav Bar -----------------------------------
export const NavigationContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const NavigationButton = styled.button`
  /* Add your button styles here */
  padding: 10px 20px;
  background-color: #f8f8f8;
  border: none;
  border-radius: 5px;
  color: #333;
  font-size: 16px;

  &:hover {
    background-color: #eaeaea;
  }
`;

// Title section ------------------------------
export const Title = styled.h1`
  color: #fff;
  text-align: center;
  Background-color: #cccccc;
  padding: 20px;
  border-radius: 30px;
  border: solid #fff 2px;
`;

// Left Column --------------------------------
export const LeftColumn = styled.div`
  background-color: #0a1425;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //padding-left: 20px;
  flex: 1;
`;

export const Logo = styled.img`
  // top: 2%;
  // left: 3.5%;
  // position: relative; 
  width: 20vw;
  height: 25vh;
  margin-bottom: 20px;
`;

export const LoginSection = styled.div`
  background-color: #ccffcc;
  color: black;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 20px;
  width: 20vw;
`;

export const UsernameInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

export const PasswordInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-bottom: 10px;
`;

// export const SignupButton = styled.button` //have a re-rendered sign up section
//   width: 100%;
//   height: 40px;
//   font-size: 16px;
//   margin-bottom: 10px;
// `;

export const GameModeSelection = styled.div`
  background-color: #ccffcc;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  width: 20vw;
`;

export const GameModeButton = styled.button`
  width: 200px;
  height: 50px;
  margin-bottom: 10px;
`;

export const FriendsList = styled.div`
  background-color: #ccffcc;
  color: black;
  margin-bottom: 0px;
  padding: 20px;
  width: 20vw;
  overflow-y: scroll;
`;

// Center Column (Signup Page) ---------------------
export const SignupBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0px 0px 0px;
  flex: 1;
`;

export const SignForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SignupTitle = styled.h2`
  margin-bottom: 1rem;
`;

export const SignupInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const SignupButton = styled.button`
  padding: 0.5rem 1rem;
`;

// Center Column (Chess board) ---------------------
export const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0px 0px 0px;
  flex: 1;
`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  height: 100vh; /* Set the height of the container to the full viewport height */
`;

export const ChessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
`;

export const Checkerboard = styled.div`
  display: inline-block;
  justify-content: center;
  align-items: center;
`;

export const Row = styled.div`
  display: flex;
`;

//For the pop up banner and such
export const WinnerModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: RGBA(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const ModalInner = styled.div`
  background: #ccffcc;
  border-radius: 2%;
  color: black;
  height: 300px;
  width: 300px;
  padding: 24px;
  text-align: center;
`;

export const ModalText =styled.div`
  padding: 50px 0px 50px 0px;
  border-radius: 10%;
  border: solid #000 1px;
  background: #eee;
  color: Black;
  width: 300px;
  text-align: center;
  color: black;
`;

//to contain button
export const ModalInnerInner =styled.div`
  width: 19vw;
`;

//to contain text
export const ModalInnerInner2 =styled.div`
  height: 50%;
  width: 300px;
  text-align: center;
  color: black;
`;

export const ModalButton = styled.button`
  /* Styles for the chat send button */
  // flex-direction: column;

  text-align: center;
  border-radius: 10%;
  background-color: #ccc;
  width: 150px;
  height: 70px;
  color: black;
  border: solid #000 1px;
  cursor: pointer;
  margin-bottom: 20px;
`;

// Right Column -------------------------------
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 20px 0px 0px;
  flex: 1;
`;

export const Timer = styled.div`
  background-color: #ccffcc;
  color: black;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  width: 20vw;
`;

export const GameInfo = styled.div`
  background-color: #ccffcc;
  color: black;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  width: 20vw;
`;

export const GameControl = styled.div`
  background-color: #ccffcc;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  width: 20vw;
`;

export const GameControlButton = styled.button`
  padding: 10px 20px;
  background-color: #ccc;
  width: 200px;
  height: 50px;
  color: black;
  border: solid #000 1px;
  cursor: pointer;
  margin-bottom: 20px;
`;

export const ChatBox = styled.div`
  background-color: #ccffcc;
  color: black;
  width: 20vw;
  height: 200px;
  border: 1px solid #ccc;
  padding: 20px;
  overflow-y: scroll;
  // display: flex;
  flex-direction: column;
`;

export const ChatMessages = styled.div`
  /* Styles for the chat messages container */
  height: 95%;
  text-align: left;
`;

export const ChatInput = styled.input`
  /* Styles for the chat input box */
  width: 200px;
  
  // horizontal-align: center;
  align-self: flex-end;
`;

export const ChatButton = styled.button`
  /* Styles for the chat send button */
  // flex-direction: column;
  align-self: flex-end;
`;