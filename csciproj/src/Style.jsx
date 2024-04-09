import styled from "styled-components";
//style script


export const Title = styled.h1`
  color: #333;
  text-align: center;
`;

// Left Column --------------------------------
export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

export const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

export const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
`;

export const SignupButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
`;

export const GameModeSelection = styled.div`
  margin-bottom: 20px;
`;

export const GameModeButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
`;

export const FriendsList = styled.div`
  margin-bottom: 20px;
`;

// Chess board ---------------------
export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  height: 100vh; /* Set the height of the container to the full viewport height */
`;

export const ChessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Checkerboard = styled.div`
  display: inline-block;
  margin-top: 0;
`;

export const Row = styled.div`
  display: flex;
`;

export const WinnerModal = styled.div`
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

export const ModalInner = styled.div`
  background: white;
  color: black;
  height: 300px;
  width: 300px;
  padding: 24px;
  text-align: center;
`;

// Right Column ------------------------------- 
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
`;

export const Timer = styled.div`
  margin-bottom: 20px;
`;

export const GameInfo = styled.div`
  margin-bottom: 20px;
`;

export const GameControlButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
`;

export const ChatBox = styled.div`
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  overflow-y: scroll;
`;

export const ChatMessages = styled.div`
  /* Styles for the chat messages container */
`;

export const ChatInput = styled.input`
  /* Styles for the chat input box */
`;

export const ChatButton = styled.button`
  /* Styles for the chat send button */
`;