import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import "../styles/torneio.css";

const apiUrl = "/api"; 

// ─── Placeholder Data ────────────────────────────────────────────────────────

// const jogos = [
//   { Id: "1", equipa1: "Sertanense ICOS", equipa2: "Moçarriense", Estado: "Resultado Final", golos_equipa1: "2", golos_equipa2: "1", horaPrevista: new Date("2026-05-10T10:00:00"), hora_inicio: "10:00", hora_inicio_2parte: "", Fase: "FASE DE GRUPOS", grupo: "A", Campo: "1", situacao_precaria: "", começado: true, MarcadoresEquipa1: ["João Silva 12'", "Pedro Costa 34'"], MarcadoresEquipa2: ["Miguel Lopes 22'"] },
//   { Id: "2", equipa1: "B.E.F.P.G.", equipa2: "U.D. Belmonte", Estado: "Intervalo", golos_equipa1: "1", golos_equipa2: "0", horaPrevista: new Date("2026-05-10T11:00:00"), hora_inicio: "11:00", hora_inicio_2parte: "", Fase: "FASE DE GRUPOS", grupo: "A", Campo: "2", situacao_precaria: "", começado: true, MarcadoresEquipa1: ["Rui Faria 8'"], MarcadoresEquipa2: [] },
//   { Id: "3", equipa1: "Desportivo C.B.", equipa2: "E.F. Tomar", Estado: "2ªP", golos_equipa1: "0", golos_equipa2: "0", horaPrevista: new Date("2026-05-10T12:00:00"), hora_inicio: "12:00", hora_inicio_2parte: "12:25", Fase: "FASE DE GRUPOS", grupo: "B", Campo: "1", situacao_precaria: "", começado: true, MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "4", equipa1: "U.D. Atalaiense", equipa2: "Fátima - A", Estado: "Resultado Final", golos_equipa1: "3", golos_equipa2: "2", horaPrevista: new Date("2026-05-10T13:00:00"), hora_inicio: "13:00", hora_inicio_2parte: "", Fase: "FASE DE GRUPOS", grupo: "B", Campo: "2", situacao_precaria: "", começado: true, MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "5", equipa1: "Vieirense", equipa2: "Moçarriense", Estado: "1ªP", golos_equipa1: "1", golos_equipa2: "1", horaPrevista: new Date("2026-05-10T14:00:00"), hora_inicio: "14:00", hora_inicio_2parte: "", Fase: "FASE DE GRUPOS", grupo: "C", Campo: "1", situacao_precaria: "", começado: true, MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "6", equipa1: "Os Lagartos", equipa2: "Ouriquense", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-10T15:00:00"), hora_inicio: "15:00", hora_inicio_2parte: "", Fase: "FASE DE GRUPOS", grupo: "C", Campo: "2", situacao_precaria: "", começado: false, MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "7", equipa1: "Peniche", equipa2: "Sertanense SPC", Estado: "Resultado Final", golos_equipa1: "1", golos_equipa2: "0", horaPrevista: new Date("2026-05-11T10:00:00"), hora_inicio: "10:00", hora_inicio_2parte: "", Fase: "FASE FINAL", grupo: "0", Campo: "1", situacao_precaria: "1º/2º lugar", começado: true, MarcadoresEquipa1: [], MarcadoresEquipa2: [], Hora: "10:00" },
//   { Id: "8", equipa1: "U.D. Chamusca", equipa2: "G.D. Ilha", Estado: "Resultado Final", golos_equipa1: "2", golos_equipa2: "2", horaPrevista: new Date("2026-05-11T11:00:00"), hora_inicio: "11:00", hora_inicio_2parte: "", Fase: "FASE FINAL", grupo: "0", Campo: "2", situacao_precaria: "3º/4º lugar", começado: true, MarcadoresEquipa1: [], MarcadoresEquipa2: [], Hora: "11:00" },
//   { Id: "9", equipa1: "Os Bucelenses", equipa2: "Vieirense", Estado: "Intervalo", golos_equipa1: "0", golos_equipa2: "1", horaPrevista: new Date("2026-05-11T12:00:00"), hora_inicio: "12:00", hora_inicio_2parte: "", Fase: "FASE FINAL", grupo: "0", Campo: "1", situacao_precaria: "", começado: true, MarcadoresEquipa1: [], MarcadoresEquipa2: [], Hora: "12:00" },

//   { Id: "49", equipa1: "Os Bucelenses", equipa2: "Vieirense", Estado: "Resultado Final", golos_equipa1: "2", golos_equipa2: "1", horaPrevista: new Date("2026-05-12T10:00:00"), Hora: "10:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "50", equipa1: "U.D. Chamusca", equipa2: "Moçarriense", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T11:00:00"), Hora: "11:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "51", equipa1: "G.D. Ilha", equipa2: "Fátima - A", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T12:00:00"), Hora: "12:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "52", equipa1: "Peniche", equipa2: "E.F. Tomar", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T13:00:00"), Hora: "13:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "53", equipa1: "Sertanense SPC", equipa2: "Peniche", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T10:00:00"), Hora: "10:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "54", equipa1: "Ouriquense", equipa2: "Ponte de Frielas", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T11:00:00"), Hora: "11:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "55", equipa1: "Os Lagartos", equipa2: "Vilarregense F.C.", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T12:00:00"), Hora: "12:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "56", equipa1: "Vieirense", equipa2: "U.F.C.I.", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T13:00:00"), Hora: "13:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "105", equipa1: "Moçarriense", equipa2: "U.F.C.I.", Estado: "Resultado Final", golos_equipa1: "1", golos_equipa2: "0", horaPrevista: new Date("2026-05-12T10:00:00"), Hora: "10:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "106", equipa1: "Fátima - A", equipa2: "E.F. Tomar", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T11:00:00"), Hora: "11:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "107", equipa1: "Vilarregense F.C.", equipa2: "U.F.C.I.", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T14:00:00"), Hora: "14:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
//   { Id: "108", equipa1: "Peniche", equipa2: "Ponte de Frielas", Estado: "Agendado", golos_equipa1: "", golos_equipa2: "", horaPrevista: new Date("2026-05-12T15:00:00"), Hora: "15:00", MarcadoresEquipa1: [], MarcadoresEquipa2: [] },
// ];

// const grupos = [
//   {
//     Name: "A",
//     Teams: [
//       { Name: "Sertanense SPC", J: 2, V: 2, E: 0, D: 0, GD: 3, GM: 4, P: 6 },
//       { Name: "Ouriquense",  J: 2, V: 1, E: 0, D: 1, GD: 0, GM: 2, P: 3 },
//       { Name: "Vieirense",    J: 2, V: 1, E: 0, D: 1, GD: -1, GM: 2, P: 3 },
//       { Name: "Vilarregense F.C.",    J: 2, V: 0, E: 0, D: 2, GD: -2, GM: 1, P: 0 },
//     ],
//   },
//   {
//     Name: "B",
//     Teams: [
//       { Name: "Moçarriense",      J: 2, V: 2, E: 0, D: 0, GD: 2, GM: 4, P: 6 },
//       { Name: "Ponte de Frielas",   J: 2, V: 0, E: 1, D: 1, GD: -1, GM: 1, P: 1 },
//       { Name: "Fátima - A",J: 2, V: 0, E: 1, D: 1, GD: -1, GM: 1, P: 1 },
//       { Name: "G.D. Ilha",       J: 2, V: 1, E: 0, D: 1, GD: 0, GM: 3, P: 3 },
//     ],
//   },
//   {
//     Name: "C",
//     Teams: [
//       { Name: "U.D. Chamusca",   J: 1, V: 0, E: 1, D: 0, GD: 0, GM: 1, P: 1 },
//       { Name: "Peniche",   J: 1, V: 0, E: 1, D: 0, GD: 0, GM: 1, P: 1 },
//       { Name: "U.D. Belmonte", J: 0, V: 0, E: 0, D: 0, GD: 0, GM: 0, P: 0 },
//       { Name: "Os Bucelenses",    J: 0, V: 0, E: 0, D: 0, GD: 0, GM: 0, P: 0 },
//     ],
//   },
// ];

// ─── FF Config ───────────────────────────────────────────────────────────────

const teamCounts = { 
  //champs: 16, europa: 8, 
  conference: 4, 
  feminina: 4 };

const leagueRounds = {
  // champs: [
  //   { Title: "1ª Ronda", Side: "left",   BoxCount: 1, GamesPerBox: 4, Jogos: ["57","60","61","64"], GapLevel: 0 },
  //   { Title: "2ª Ronda", Side: "left",   BoxCount: 2, GamesPerBox: 2, Jogos: ["73","79","74","80"], GapLevel: 1 },
  //   { Title: "3ª Ronda", Side: "left",   BoxCount: 4, GamesPerBox: 1, Jogos: ["89","90","93","94"], GapLevel: 2 },
  //   { Title: "Finais",   Side: "center", BoxCount: 8, GamesPerBox: 1, Jogos: ["104","97","98","99","100","101","102","103"], GapLevel: 3 },
  //   { Title: "3ª Ronda", Side: "right",  BoxCount: 4, GamesPerBox: 1, Jogos: ["91","92","95","96"], GapLevel: 2 },
  //   { Title: "2ª Ronda", Side: "right",  BoxCount: 2, GamesPerBox: 2, Jogos: ["75","77","76","78"], GapLevel: 1 },
  //   { Title: "1ª Ronda", Side: "right",  BoxCount: 1, GamesPerBox: 4, Jogos: ["58","62","59","63"], GapLevel: 0 },
  // ],
  // europa: [
  //   { Title: "1ª Ronda", Side: "left",   BoxCount: 1, GamesPerBox: 2, Jogos: ["49","50"], GapLevel: 0 },
  //   { Title: "2ª Ronda", Side: "left",   BoxCount: 2, GamesPerBox: 1, Jogos: ["69","70"], GapLevel: 2 },
  //   { Title: "Finais",   Side: "center", BoxCount: 4, GamesPerBox: 1, Jogos: ["88","81","82","83"], GapLevel: 3 },
  //   { Title: "2ª Ronda", Side: "right",  BoxCount: 2, GamesPerBox: 1, Jogos: ["71","72"], GapLevel: 2 },
  //   { Title: "1ª Ronda", Side: "right",  BoxCount: 1, GamesPerBox: 2, Jogos: ["51","52"], GapLevel: 0 },
  // ],
  conference: [
    { Title: "Meias Finais", Side: "left",   BoxCount: 1, GamesPerBox: 1, Jogos: ["17", "18"], GapLevel: 1 },
    { Title: "Finais",       Side: "center", BoxCount: 2, GamesPerBox: 1, Jogos: ["23","24"], GapLevel: 3 },
    { Title: "Meias Finais", Side: "right",  BoxCount: 1, GamesPerBox: 1, Jogos: ["19", "20"], GapLevel: 1 },
  ],
  feminina: [
    { Title: "Meias Finais", Side: "left",   BoxCount: 1, GamesPerBox: 1, Jogos: ["13", "14"], GapLevel: 1 },
    { Title: "Finais",       Side: "center", BoxCount: 2, GamesPerBox: 1, Jogos: ["21","22"], GapLevel: 3 },
    { Title: "Meias Finais", Side: "right",  BoxCount: 1, GamesPerBox: 1, Jogos: ["15", "16"], GapLevel: 1 },
  ],
};

const allLeagues = [
  // { Key: "champs",     Name: "Liga dos Campeões PALSER" },
  // { Key: "europa",     Name: "Liga Europa PINHOSER" },
  { Key: "conference", Name: "Liga Conferência STAND FRIGI" },
  { Key: "feminina",   Name: "Liga Feminina JOÃO MAIA AUTOMÓVEIS" },
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
   
function CalGame({ j, now }) {
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
    <div className={`cal-game ${estadoClass}${expanded ? " expanded" : ""}`} onClick={() => setExpanded(e => !e)}>
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
}

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

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const jogosOrdenados = jogos
    .filter(j => j.equipa1 && j.equipa2 && j.equipa1 !== "0" && j.equipa2 !== "0")
    .map(j => ({
      ...j,
      Fase: j.Fase ?? (j.grupo === "0" ? "FASE FINAL" : "FASE DE GRUPOS"),
    }))
    .sort((a, b) => {
      if (a.horaPrevista - b.horaPrevista !== 0) return a.horaPrevista - b.horaPrevista;
      return (a.Fase === "FASE FINAL" ? 1 : 0) - (b.Fase === "FASE FINAL" ? 1 : 0);
    });

  // Group by date
  const byDate = {};
  for (const j of jogosOrdenados) {
    const key = j.horaPrevista.toDateString();
    if (!byDate[key]) byDate[key] = { date: j.horaPrevista, games: [] };
    byDate[key].games.push(j);
  }

  return (
    <div id="calendario" className="tab-content active">
      {Object.values(byDate).map(({ date, games }) => {
        // Group by hour then by Fase
        const byHour = {};
        for (const j of games) {
          const h = j.horaPrevista.getHours();
          if (!byHour[h]) byHour[h] = { hora: j.horaPrevista, games: [] };
          byHour[h].games.push(j);
        }

        return (
          <div key={date.toDateString()} className="cal-day" data-date={date.toISOString().split("T")[0]}>
            <div className="cal-fixed-header">{formatDate(date)}</div>

            {Object.values(byHour).map(({ hora, games: hGames }) => {
              // Group by Fase
              const byFase = {};
              for (const j of hGames) {
                if (!byFase[j.Fase]) byFase[j.Fase] = [];
                byFase[j.Fase].push(j);
              }

              return Object.entries(byFase).map(([fase, faseGames]) => (
                <div key={`${hora}-${fase}`} className="cal-time-block">
                  <div className="cal-time-header">
                    <span className="cal-time">{formatTime(hora)}</span>
                    <span className="cal-livetag"><span className="live-dot"></span> AO VIVO</span>
                    <span className="cal-phase">{fase}</span>
                  </div>
                  {faseGames.map(j => <CalGame key={j.Id} j={j} now={now} />)}
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
                          src={`/images/teams/${encodeURIComponent(team.simbolo)}`}
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
        {/* <button onClick={() => scrollTo("champs")}>LIGA DOS CAMPEÕES</button>
        <button onClick={() => scrollTo("europa")}>LIGA EUROPA</button>
        <button onClick={() => scrollTo("conference")}>LIGA CONFERÊNCIA</button> 
        <button onClick={() => scrollTo("feminina")}>LIGA FEMININA</button>*/}
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
        (now - new Date(j.hora_inicio_2parte)) / 60000
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
