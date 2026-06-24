import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/jogo.css";

export default function GameHomepage() {
  const [gameId, setGameId] = useState("");
  const [chave, setChave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:3000'

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/game-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId,
            chave,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid game.");
        return;
      }

      localStorage.setItem("gameToken", data.token);

      navigate(`/admin/game/${gameId}`);
    } catch {
      setError("Erro a conectar ao servidor.");
    }
  }

  return (
    <div className="admin-access-page">
      <div className="admin-access-card">
        <h1>Match Access</h1>

        <form onSubmit={handleSubmit} className="admin-access-form">
          <div className="form-group">
            <label>Game ID</label>
            <input
              type="number"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Chave</label>
            <input
              type="text"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Open Match
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}