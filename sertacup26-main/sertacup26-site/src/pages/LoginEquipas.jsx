import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login-equipas.css";

export default function LoginEquipas() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/team-login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Não foi possível iniciar sessão."); return; }
      sessionStorage.setItem("teamToken", data.token);
      navigate("/dashboard-equipa", { replace: true });
    } catch { setError("Não foi possível ligar à API. Tenta novamente."); }
    finally { setLoading(false); }
  }

  return (
    <div className="team-login-page">
      <div className="team-login-card">
        <Link className="team-login-back" to="/inscricao">← Voltar</Link>
        <span className="team-login-eyebrow">SERTÃ CUP · ÁREA DE EQUIPAS</span>
        <h1>Login</h1>
        <p className="team-login-intro">Entra com as credenciais da tua equipa.</p>
        <form className="team-login-form" onSubmit={handleSubmit}>
          <label htmlFor="team-username">Utilizador</label>
          <input id="team-username" name="username" autoComplete="username" maxLength={100} required value={username} onChange={e => setUsername(e.target.value)} />
          <label htmlFor="team-password">Palavra-passe</label>
          <input id="team-password" name="password" type="password" autoComplete="current-password" maxLength={255} required value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="team-login-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "A entrar..." : "Entrar"} <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </div>
  );
}
