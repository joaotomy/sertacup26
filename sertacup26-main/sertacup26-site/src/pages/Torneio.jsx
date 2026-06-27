import { useSearchParams } from "react-router-dom";
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import "../styles/torneio.css";

const apiUrl = "https://sertacup.pt/api";
let countGetPlacement = 0;

// ─── FF Config ───────────────────────────────────────────────────────────────

const teamCounts = {
  champs: 16, 
  europa: 8, 
  conference: 8,
};

const leagueRounds = {
  champs: [
    { Title: "1ª Ronda", Side: "left", BoxCount: 1, GamesPerBox: 4, Jogos: ["74", "75", "76", "77"], GapLevel: 0 },
    { Title: "2ª Ronda", Side: "left", BoxCount: 2, GamesPerBox: 2, Jogos: ["92", "93", "94", "95"], GapLevel: 1 },
    { Title: "3ª Ronda", Side: "left", BoxCount: 4, GamesPerBox: 1, Jogos: ["113", "114", "115", "116"], GapLevel: 2 },
    { Title: "Finais", Side: "center", BoxCount: 8, GamesPerBox: 1, Jogos: ["", "", "", "", "", "", "", ""], GapLevel: 3 },
    { Title: "3ª Ronda", Side: "right", BoxCount: 4, GamesPerBox: 1, Jogos: ["117", "118", "119", "120"], GapLevel: 2 },
    { Title: "2ª Ronda", Side: "right", BoxCount: 2, GamesPerBox: 2, Jogos: ["96", "97", "98", "99"], GapLevel: 1 },
    { Title: "1ª Ronda", Side: "right", BoxCount: 1, GamesPerBox: 4, Jogos: ["78", "79", "80", "81"], GapLevel: 0 },
  ],
  europa: [
    { Title: "1ª Ronda", Side: "left", BoxCount: 1, GamesPerBox: 2, Jogos: ["82", "83"], GapLevel: 0 },
    { Title: "2ª Ronda", Side: "left", BoxCount: 2, GamesPerBox: 1, Jogos: ["109", "110"], GapLevel: 2 },
    { Title: "Finais", Side: "center", BoxCount: 4, GamesPerBox: 1, Jogos: ["127", "124", "125", "126"], GapLevel: 3 },
    { Title: "2ª Ronda", Side: "right", BoxCount: 2, GamesPerBox: 1, Jogos: ["111", "112"], GapLevel: 2 },
    { Title: "1ª Ronda", Side: "right", BoxCount: 1, GamesPerBox: 2, Jogos: ["84", "85"], GapLevel: 0 },
  ],
  conference: [
    { Title: "1ª Ronda", Side: "left", BoxCount: 1, GamesPerBox: 2, Jogos: ["91", "87"], GapLevel: 0 },
    { Title: "2ª Ronda", Side: "left", BoxCount: 2, GamesPerBox: 1, Jogos: ["105", "106"], GapLevel: 2 },
    { Title: "Finais", Side: "center", BoxCount: 4, GamesPerBox: 1, Jogos: ["121", "122", "123", "128"], GapLevel: 3 },
    { Title: "2ª Ronda", Side: "right", BoxCount: 2, GamesPerBox: 1, Jogos: ["107", "108"], GapLevel: 2 },
    { Title: "1ª Ronda", Side: "right", BoxCount: 1, GamesPerBox: 2, Jogos: ["88", "89"], GapLevel: 0 },
  ],
};

const allLeagues = [
  { Key: "champs", Name: "Liga dos Campeões PALSER" },
  { Key: "europa", Name: "Liga Revelação STANDFRIGI" },
  { Key: "conference", Name: "Liga Promessa PINHOSER" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// function getClockDisplay(startTime, now) {
//   if (!startTime) return "";
//   const start = new Date(`1970-01-01T${startTime}`);
//   const nowTime = new Date(`1970-01-01T${now.toTimeString().slice(0,5)}`);
//   const mins = Math.floor((nowTime - start) / 60000);
//   return `${mins}'`;
// }

function getPlacementRange(totalPlacements, boxCount, boxIndex) {
  countGetPlacement++;

  if (countGetPlacement == 13)
    return `5º–8º LUGAR`;

  if (countGetPlacement == 14)
    return `5º–6º LUGAR`;

  if (countGetPlacement == 15)
    return `7º–8º LUGAR`;

  if (countGetPlacement == 16)
    return `5º–8º LUGAR`;

  const rangeSize = Math.floor(totalPlacements / boxCount);
  const start = boxIndex * rangeSize + 1;
  const end = (boxIndex + 1) * rangeSize;
  return `${start}º–${end}º LUGAR`;
}
function formatDate(date) {
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })
    .replace(".", "").toUpperCase();
}

function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}


// ─── Sub-components ───────────────────────────────────────────────────────────

const CalGame = forwardRef(({ j, now }, ref) => {
  const [expanded, setExpanded] = useState(false);

  const estadoDisplay = getEstado(j, now);

  const terminado = estadoDisplay === "Resultado Final";
  const intervalo = estadoDisplay === "Intervalo";
  const aoVivo = j.começado && !terminado && !intervalo;
  const comecou = j.começado ?? false;

  const isAtrasado =
    !terminado &&
    !intervalo &&
    !aoVivo &&
    j.horaPrevista < now &&
    !comecou;

  const estadoClass =
    terminado
      ? "finished"
      : (aoVivo || intervalo)
        ? "live"
        : (isAtrasado ? "atrasado" : "");

  const showScore = terminado || comecou;
  const g1 = j.golos_equipa1 || "0";
  const g2 = j.golos_equipa2 || "0";
  const scoreDisplay = showScore ? `${g1} - ${g2}` : "VS";
  const class1 = terminado ? (parseInt(g1) > parseInt(g2) ? "winner" : parseInt(g1) < parseInt(g2) ? "loser" : "") : "";
  const class2 = terminado ? (parseInt(g2) > parseInt(g1) ? "winner" : parseInt(g2) < parseInt(g1) ? "loser" : "") : "";
  const marcadores1 = j.MarcadoresEquipa1 || [];
  const marcadores2 = j.MarcadoresEquipa2 || [];
  const hasGoals = parseInt(g1) > 0 || parseInt(g2) > 0;

  return (
    <div
      ref={ref}
      className={`cal-game ${estadoClass}${expanded ? " expanded" : ""}`}
    >
      <div className="cal-teams">
        <div className={`cal-team-block ${class1}`}>
          <img src={`/images/teams/${encodeURIComponent(j.equipa1)}.png`} alt={j.equipa1} className="cal-team-logo" />
          <span className="cal-team-name">{j.equipa1}</span>
        </div>
        <div className="cal-display">
          <div className="cal-game-info">
            <span className="cal-game-status">
              {!isAtrasado && aoVivo && (
                <span className="live-dot"></span>
              )}

              {isAtrasado
                ? `EM ATRASO (${formatTime(j.horaPrevista)})`
                : estadoDisplay}
            </span>
          </div>
          <div className="cal-score">{scoreDisplay}</div>
        </div>
        <div className={`cal-team-block ${class2}`}>
          <img src={`/images/teams/${encodeURIComponent(j.equipa2)}.png`} alt={j.equipa2} className="cal-team-logo" />
          <span className="cal-team-name">{j.equipa2}</span>
        </div>
      </div>

      {hasGoals && expanded && (
        <div className="cal-scorers">
          <div className="scorer-left">
            {marcadores1.length > 0 ? marcadores1.map((m, i) => <div key={i}>{m}</div>) : <div>&nbsp;</div>}
          </div>
          <div className="scorer-right">
            {marcadores2.length > 0 ? marcadores2.map((m, i) => <div key={i}>{m}</div>) : <div>&nbsp;</div>}
          </div>
        </div>
      )}

      <div className="cal-details">
        <span className="cal-group">{j.situacao_precaria}</span>
        <span className="cal-field remove">Campo {j.Campo}</span>
      </div>
    </div>
  );
});

function FFGame({ jogo }) {
  if (!jogo) return null;

  const g1 = parseInt(jogo.golos_equipa1) || 0;
  const g2 = parseInt(jogo.golos_equipa2) || 0;

  const isFinished = jogo.terminado;
  const isOngoing = jogo.começado && !jogo.terminado;

  const class1 = isFinished
    ? (g1 > g2 ? "ff-winner" : g1 < g2 ? "ff-loser" : "")
    : "";

  const class2 = isFinished
    ? (g2 > g1 ? "ff-winner" : g2 < g1 ? "ff-loser" : "")
    : "";

  return (
    <div className="ff-game">
      <div className="ff-game-status">
        {isOngoing
          ? <div className="ff-game-live"><span className="ff-live-dot"></span> AO VIVO</div>
          : isFinished
            ? <div className="ff-game-caption">TERMINADO</div>
            : <div className="ff-game-caption">{jogo.Hora}</div>
        }
      </div>
      <div className="ff-game-box-inner">
        <div className={`ff-team-block ${class1}`}>
          <img src={`/images/teams/${encodeURIComponent(jogo.equipa1 || "")}.png`} alt={jogo.equipa1} onError={e => e.target.style.display = "none"} className="ff-team-logo" />
          <span className="ff-team-name"><span>{jogo.equipa1}</span></span>
          <div className="ff-separator"></div>
          <span className="ff-team-score">{g1}</span>
        </div>
        <div className={`ff-team-block ${class2}`}>
          <img src={`/images/teams/${encodeURIComponent(jogo.equipa2 || "")}.png`} alt={jogo.equipa2} onError={e => e.target.style.display = "none"} className="ff-team-logo" />
          <span className="ff-team-name"><span>{jogo.equipa2}</span></span>
          <div className="ff-separator"></div>
          <span className="ff-team-score">{g2}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function CalendarioTab({ jogos }) {
  const [now, setNow] = useState(new Date());

  const liveGameRef = useRef(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!hasScrolled.current && liveGameRef.current) {
      hasScrolled.current = true;

      liveGameRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [jogos, now]);

  const jogosOrdenados = jogos
    .filter(j => j.equipa1 && j.equipa2 && j.equipa1 !== "0" && j.equipa2 !== "0")
    .map(j => ({
      ...j,
      Fase: j.Fase ?? (j.grupo === "0" ? "FASE FINAL" : "FASE DE GRUPOS"),
    }))
    .sort((a, b) => {
      if (a.horaPrevista - b.horaPrevista !== 0)
        return a.horaPrevista - b.horaPrevista;
      return (a.Fase === "FASE FINAL" ? 1 : 0) - (b.Fase === "FASE FINAL" ? 1 : 0);
    });

  const byDate = {};
  for (const j of jogosOrdenados) {
    const key = j.horaPrevista.toDateString();
    if (!byDate[key]) byDate[key] = { date: j.horaPrevista, games: [] };
    byDate[key].games.push(j);
  }

  let assignedLiveRef = false;

  return (
    <div id="calendario" className="tab-content active">
      {Object.values(byDate).map(({ date, games }) => {
        const byHour = {};

        for (const j of games) {
          const h = j.horaPrevista.getHours();
          if (!byHour[h]) byHour[h] = { hora: j.horaPrevista, games: [] };
          byHour[h].games.push(j);
        }

        return (
          <div
            key={date.toDateString()}
            className="cal-day"
            data-date={date.toISOString().split("T")[0]}
          >
            <div className="cal-fixed-header">{formatDate(date)}</div>

            {Object.values(byHour).map(({ hora, games: hGames }) => {
              const byFase = {};

              for (const j of hGames) {
                if (!byFase[j.Fase]) byFase[j.Fase] = [];
                byFase[j.Fase].push(j);
              }

              return Object.entries(byFase).map(([fase, faseGames]) => (
                <div key={`${hora}-${fase}`} className="cal-time-block">
                  <div className="cal-time-header">
                    <span className="cal-time">{formatTime(hora)}</span>
                    <span className="cal-livetag">
                      <span className="live-dot"></span> AO VIVO
                    </span>
                    <span className="cal-phase">{fase}</span>
                  </div>

                  {faseGames.map(j => {
                    const estado = getEstado(j, now);
                    const isLive =
                      j.começado &&
                      estado !== "Resultado Final" &&
                      estado !== "Intervalo";

                    let ref = null;
                    if (isLive && !assignedLiveRef) {
                      ref = liveGameRef;
                      assignedLiveRef = true;
                    }

                    return (
                      <CalGame
                        key={j.Id}
                        ref={ref}
                        j={j}
                        now={now}
                      />
                    );
                  })}
                </div>
              ));
            })}
          </div>
        );
      })}
    </div>
  );
}
function GruposTab() {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await fetch(`${apiUrl}/groups`);
        const data = await response.json();

        const grouped = {};

        data.forEach(team => {
          const groupName = team.grupo;

          if (!grouped[groupName]) {
            grouped[groupName] = {
              Name: groupName,
              Teams: [],
            };
          }

          grouped[groupName].Teams.push({
            Name: team.nome_equipa,
            J: team.numero_jogos,
            V: team.vitorias,
            E: team.empates,
            D: team.derrotas,
            GD: team.diferenca_golos,
            GM: team.golos_marcados,
            P: team.pontos,
          });
        });

        setGrupos(Object.values(grouped));

      } catch (err) {
        console.error(err);
      }
    }

    fetchGroups();
  }, []);

  return (
    <div id="grupos" className="tab-content active">
      <div className="grid-container group-section">
        {[...grupos].sort((a, b) => a.Name.localeCompare(b.Name)).map(group => (
          <div key={group.Name} className="col-span-6 md:col-span-4 sm:col-span-4 group-block">
            <table className="group-table">
              <colgroup>
                <col className="col-position" />
                <col className="col-team" />
                <col className="col-stat" />
                <col className="col-stat" />
                <col className="col-stat" />
                <col className="col-stat" />
                <col className="col-stat" />
                <col className="col-stat" />
              </colgroup>

              <thead>
                <tr>
                  <th colSpan={2} className="group-title">
                    Grupo {group.Name}
                  </th>
                  <th className="group-stat-head">J</th>
                  <th className="group-stat-head">V</th>
                  <th className="group-stat-head">E</th>
                  <th className="group-stat-head">D</th>
                  <th className="group-stat-head">DG</th>
                  <th className="group-stat-head">Pts</th>
                </tr>
              </thead>

              <tbody>
                {[...group.Teams]
                  .sort((a, b) => b.P - a.P || b.GD - a.GD || b.GM - a.GM)
                  .map((team, i) => (
                    <tr key={team.Name}>
                      <td className={`group-team-position place-${i + 1}`}>
                        {i + 1}<sup>º</sup>
                      </td>

                      <td className="group-team-cell">
                        <img
                          src={`/images/teams/${encodeURIComponent(team.Name)}.png`}
                          alt={team.Name}
                          className="group-team-logo"
                        />

                        <span className="group-team-name">
                          {team.Name}
                        </span>
                      </td>

                      <td className="group-team-stat">{team.J}</td>
                      <td className="group-team-stat">{team.V}</td>
                      <td className="group-team-stat">{team.E}</td>
                      <td className="group-team-stat">{team.D}</td>
                      <td className="group-team-stat">{team.GD}</td>
                      <td className="group-team-points">{team.P}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

function FasesFinaisTab({ jogos }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const getJogoById = (id) =>
    jogos.find(j => j.Id === id) || null;

  return (
    <div id="fases-finais" className="tab-content active">
      <div className="ff-section-title">
        <button onClick={() => scrollTo("champs")}>LIGA DOS CAMPEÕES</button>
        <button onClick={() => scrollTo("europa")}>LIGA REVELAÇÃO</button>
        <button onClick={() => scrollTo("conference")}>LIGA PROMESSA</button> 
      </div>

      {allLeagues.map(league => (
        <div key={league.Key}>
          <div className="ff-league-seperator"></div>
          <div className="ff-league-section" id={league.Key}>
            <div className="ff-league-title">{league.Name}</div>
            <div className="ff-title-seperator"></div>
            <div className="ff-league-scroll-wrapper">
              <div className="ff-league-scroll">
                {leagueRounds[league.Key].map((round, r) => (
                  <div key={r} className={`ff-round-wrapper gap-level-${round.GapLevel}`}>
                    <div className="ff-round-column">
                      <div className={`ff-round-title${round.Title === "Finais" ? " ff-final-round" : ""}`}>
                        {round.Title}
                      </div>
                      <div className="ff-game-stack">
                        {Array.from({ length: round.BoxCount }, (_, i) => (
                          <div key={i}>
                            <div className="ff-game-box">
                              <div className="ff-placement-range">
                                {getPlacementRange(teamCounts[league.Key], round.BoxCount, i)}
                              </div>
                              {Array.from({ length: round.GamesPerBox }, (_, j) => {
                                const index = i * round.GamesPerBox + j;
                                if (index >= round.Jogos.length) return null;
                                const jogo = getJogoById(round.Jogos[index]);
                                return <FFGame key={j} jogo={jogo} />;
                              })}
                            </div>
                            {i < round.BoxCount - 1 && <div className="ff-horizontal-separator"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEstado(j, now) {
  if (j.terminado) return "Resultado Final";

  if (j.segunda_parte_comecada) {
    if (j.hora_inicio_2parte) {

      const mins = Math.floor(
        (now - new Date(j.hora_inicio)) / 60000
      );
      return `${mins}'`;
    }

    return "2ªP";
  }

  if (j.primeira_parte_terminada) {
    return "Intervalo";
  }

  if (j.começado) {
    if (j.hora_inicio) {
      const mins = Math.floor(
        (now - new Date(j.hora_inicio)) / 60000
      );
      return `${mins}'`;
    }

    return "1ªP";
  }

  return "Agendado";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Torneio() {
  const [params] = useSearchParams();
  const tab = params.get("tab") ?? "calendario";

  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(`${apiUrl}/games`);
        const data = await response.json();

        setJogos(
          data.map(j => ({
            ...j,
            Id: String(j.id),
            horaPrevista: new Date(j.hora_prevista),
            Hora: new Date(j.hora_prevista).toTimeString().slice(0, 5),
            Campo: j.campo
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchGames();
  }, []);

  return (
    <div className="grid-container torneio">
      {tab === "calendario" && <div className="cal-sticky-buffer"></div>}

      <div className="col-span-12 md:col-span-8 sm:col-span-4 content-section">
        {tab === "calendario" && <CalendarioTab jogos={jogos} />}
        {tab === "grupos" && <GruposTab />}
        {tab === "fases-finais" && <FasesFinaisTab jogos={jogos} />}
      </div>
    </div>
  );
}