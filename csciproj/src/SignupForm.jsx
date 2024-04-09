import React, { useState } from "react";

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
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          // User successfully registered
          console.log('User registered successfully');
          // Reset form fields
          setUsername('');
          setPassword('');
        } else {
          // Error occurred during registration
          console.log('Error registering user');
        }
      })
      .catch((error) => {
        console.log('Error occurred during registration:', error);
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
