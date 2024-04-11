import React, { useState } from "react";
import axios from "axios";
import { SignForm, SignupTitle, SignupInput, SignupButton } from "./Style";

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    // Perform form validation here
    if (username.trim() === '') {
      console.log('Please enter a username');
      return;
    }

    if (password.trim() === '') {
      console.log('Please enter a password');
      return;
    }

    // Handle sign up logic here
    // Make API call to register the user, etc.
    registerUser(username, password);
  };

  const registerUser = (username, password) => {
    // Make API call to register the user
    axios.post("/register", {
      username, password
    })
    .then((res) => {
      if (res.data.ok) {
        console.log(res.data.msg);
      }
    });
  };

  return (
    <SignForm>
      <SignupTitle>Sign Up</SignupTitle>
      <SignupInput
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <SignupInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <SignupButton onClick={handleSignup}>Sign Up</SignupButton>
    </SignForm>
  );
}
