import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/gameadmin.css";

export default function GameAdmin() {
  const { id } = useParams();
  console.log("id  " , id)
  const apiUrl = "http://localhost:3000";

  const [game, setGame] = useState(null);
  const [error, setError] = useState("");

  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  const [homeScorers, setHomeScorers] = useState([]);
  const [awayScorers, setAwayScorers] = useState([]);

  useEffect(() => {
    async function loadGame() {
      try {
        const response = await fetch(
          `${apiUrl}/games?id=${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError("Erro ao carregar jogo.");
          return;
        }

        const jogo = data[0];

        setGame(jogo);

        const homeGoalsValue = jogo.golos_equipa1 || 0;
        const awayGoalsValue = jogo.golos_equipa2 || 0;

        setHomeGoals(homeGoalsValue);
        setAwayGoals(awayGoalsValue);

        setHomeScorers(Array(homeGoalsValue).fill(""));
        setAwayScorers(Array(awayGoalsValue).fill(""));
      } catch {
        setError("Erro ao ligar à API.");
      }
    }

    loadGame();
  }, [id]);

  function addHomeGoal() {
    setHomeGoals(g => g + 1);
    setHomeScorers(s => [...s, ""]);
  }

  function addAwayGoal() {
    setAwayGoals(g => g + 1);
    setAwayScorers(s => [...s, ""]);
  }

  function updateHomeScorer(index, value) {
    const updated = [...homeScorers];
    updated[index] = value;
    setHomeScorers(updated);
  }

  function updateAwayScorer(index, value) {
    const updated = [...awayScorers];
    updated[index] = value;
    setAwayScorers(updated);
  }

  if (error) return <p>{error}</p>;
  if (!game) return <p>Loading...</p>;

  return (
    <div className="game-admin">
      <div className="game-admin-card">
        <h1>
          {game.equipa1} vs {game.equipa2}
        </h1>

        <h2>
          {homeGoals} - {awayGoals}
        </h2>

        <p>{game.Estado}</p>

        {game.Estado === "Agendado" && (
          <button>
            Start Match
          </button>
        )}

        {(game.Estado === "1ªP" || game.Estado === "2ªP") && (
          <div className="teams-container">
            <div className="team-section">
              <h3>{game.equipa1}</h3>

              <button onClick={addHomeGoal}>
                Goal {game.equipa1}
              </button>

              {homeScorers.map((scorer, index) => (
                <div key={index}>
                  <select
                    value={scorer}
                    onChange={(e) =>
                      updateHomeScorer(index, e.target.value)
                    }
                  >
                    <option value="">
                      Select scorer
                    </option>
                  </select>
                </div>
              ))}
            </div>

            <hr />

            <div className="team-section">
              <h3>{game.equipa2}</h3>

              <button onClick={addAwayGoal}>
                Goal {game.equipa2}
              </button>

              {awayScorers.map((scorer, index) => (
                <div key={index}>
                  <select
                    value={scorer}
                    onChange={(e) =>
                      updateAwayScorer(index, e.target.value)
                    }
                  >
                    <option value="">
                      Select scorer
                    </option>
                  </select>
                </div>
              ))}
            </div>

            <hr />

            {game.Estado === "1ªP" && (
              <button>
                Intervalo
              </button>
            )}

            {game.Estado === "2ªP" && (
              <button>
                Terminar Jogo
              </button>
            )}
          </div>
        )}

        {game.Estado === "Resultado Final" && (
          <button>
            Corrigir
          </button>
        )}
      </div>
    </div>
  );
}