import React, { useState } from "react";
import axios from "axios";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/", {
        username,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Ett fel inträffade!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Användarnamn:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
  );
};

export default LoginForm;
