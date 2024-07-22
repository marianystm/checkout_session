import React, { useState } from "react";
import axios from "axios";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      setMessage(response.data.message);
      setIsLoggedIn(true); 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Ett fel inträffade!");
      }
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setIsLoggedIn(false);
    setMessage("Du har loggats ut.");
  };

  return (
    <div>
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>E-post:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Lösenord:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Logga in</button>
          <p>{message}</p>
        </form>
      ) : (
        <div>
          <p>Du är inloggad!</p>
          <button onClick={handleLogout}>Logga ut</button>
        </div>
      )}
    </div>
  );
};
