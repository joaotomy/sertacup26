import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/gameadmin.css";

export default function GameAdmin() {
  const { id } = useParams();

  const apiUrl = "http://localhost:3000";

  const [game, setGame] = useState(null);
  const [error, setError] = useState("");

  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  const [homeScorers, setHomeScorers] = useState([]);
  const [awayScorers, setAwayScorers] = useState([]);

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

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

        const [homePlayersResponse, awayPlayersResponse] = await Promise.all([
          fetch(`${apiUrl}/players?idequipa=${jogo.idequipa1}`),
          fetch(`${apiUrl}/players?idequipa=${jogo.idequipa2}`)
        ]);

        const homePlayersData = await homePlayersResponse.json();
        const awayPlayersData = await awayPlayersResponse.json();

        setHomePlayers(homePlayersData);
        setAwayPlayers(awayPlayersData);


        setGame(jogo);

        const homeGoalsValue = jogo.golos_equipa1 || 0;
        const awayGoalsValue = jogo.golos_equipa2 || 0;

        setHomeGoals(homeGoalsValue);
        setAwayGoals(awayGoalsValue);

        const savedHome = localStorage.getItem(
          `game-${jogo.id}-homeScorers`
        );

        const savedAway = localStorage.getItem(
          `game-${jogo.id}-awayScorers`
        );

        setHomeScorers(
          savedHome
            ? JSON.parse(savedHome)
            : Array(homeGoalsValue).fill("")
        );

        setAwayScorers(
          savedAway
            ? JSON.parse(savedAway)
            : Array(awayGoalsValue).fill("")
        );
      } catch {
        setError("Erro ao ligar à API.");
      }
    }

    loadGame();
  }, [id]);

  async function addHomeGoal() {
    setHomeGoals(g => g + 1);
    setHomeScorers(s => [...s, ""]);

    try {
      await fetch(`${apiUrl}/games/${game.id}/home-goal`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function removeHomeGoal() {
    if (homeGoals <= 0) return;

    setHomeGoals(g => g - 1);
    setHomeScorers(s => {
      const updated = s.slice(0, -1);

      localStorage.setItem(
        `game-${game.id}-homeScorers`,
        JSON.stringify(updated)
      );

      return updated;
    });

    try {
      await fetch(`${apiUrl}/games/${game.id}/home-goal-minus`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function addAwayGoal() {
    setAwayGoals(g => g + 1);
    setAwayScorers(s => [...s, ""]);

    try {
      await fetch(`${apiUrl}/games/${game.id}/away-goal`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function removeAwayGoal() {
    if (awayGoals <= 0) return;

    setAwayGoals(g => g - 1);
    setAwayScorers(s => {
      const updated = s.slice(0, -1);

      localStorage.setItem(
        `game-${game.id}-awayScorers`,
        JSON.stringify(updated)
      );

      return updated;
    });

    try {
      await fetch(`${apiUrl}/games/${game.id}/away-goal-minus`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  }

  function updateHomeScorer(index, value) {
    const updated = [...homeScorers];
    updated[index] = value;

    setHomeScorers(updated);

    localStorage.setItem(
      `game-${game.id}-homeScorers`,
      JSON.stringify(updated)
    );
  }

  function updateAwayScorer(index, value) {
    const updated = [...awayScorers];
    updated[index] = value;

    setAwayScorers(updated);

    localStorage.setItem(
      `game-${game.id}-awayScorers`,
      JSON.stringify(updated)
    );
  }

  if (error) return <p>{error}</p>;
  if (!game) return <p>Loading...</p>;
  console.log(game.Estado)

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
        {game.Estado === "Intervalo" && (
          <button
            onClick={async () => {
              try {
                await fetch(
                  `${apiUrl}/games/${game.id}/start-second-half`,
                  {
                    method: "POST"
                  }
                );

                window.location.reload();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Começar 2ª Parte
          </button>
        )}
        {game.Estado === "Agendado" && (
          <button
            onClick={async () => {
              try {
                await fetch(`${apiUrl}/games/${game.id}/start`, {
                  method: "POST"
                });

                window.location.reload();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Start Match
          </button>
        )}
        {(game.Estado === "1ªP" || game.Estado === "2ªP") && (
          <div className="teams-container">
            <div className="team-section">
              <h3>{game.equipa1}</h3>

              <button onClick={addHomeGoal}>
                Golo {game.equipa1}
              </button>

              <button onClick={removeHomeGoal}>
                Remover Golo {game.equipa1}
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

                    {homePlayers.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.numero} - {player.nome}
                      </option>
                    ))}

                  </select>
                </div>
              ))}
            </div>

            <hr />

            <div className="team-section">
              <h3>{game.equipa2}</h3>

              <button onClick={addAwayGoal}>
                Golo {game.equipa2}
              </button>

              <button onClick={removeAwayGoal}>
                Remover Golo {game.equipa2}
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

                    {awayPlayers.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.numero} - {player.nome}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <hr />

            {game.Estado === "1ªP" && (
              <button
                onClick={async () => {
                  try {
                    await fetch(
                      `${apiUrl}/games/${game.id}/end-first-half`,
                      {
                        method: "POST"
                      }
                    );

                    window.location.reload();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Intervalo
              </button>
            )}


            {game.Estado === "2ªP" && (
              <button
                onClick={async () => {
                  try {

                    const scorers = [
                      ...homeScorers,
                      ...awayScorers
                    ].filter(s => s);

                    await Promise.all(
                      scorers.map(idjogador =>
                        fetch(`${apiUrl}/goals`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({
                            idjogo: game.id,
                            idjogador
                          })
                        })
                      )
                    );

                    await fetch(`${apiUrl}/games/${game.id}/end`, {
                      method: "POST"
                    });

                    localStorage.removeItem(
                      `game-${game.id}-homeScorers`
                    );

                    localStorage.removeItem(
                      `game-${game.id}-awayScorers`
                    );

                    window.location.reload();

                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
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