import React, { useState } from "react";
import "./Login.css";

const Login = ({ setLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For registration
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage(""); // Clear previous messages

    if (!username || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const endpoint = isLogin ? "login" : "register";
    const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
      alert(isLogin ? "Login Successful" : "Registration Successful");
      if (isLogin) setLoggedIn(true);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <input
          type="text"
          placeholder="Ethereum Address"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</button>
        {message && <p className="error-message">{message}</p>}
        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
          {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
        </p>
      </div>
    </div>
  );
};

export default Login;
