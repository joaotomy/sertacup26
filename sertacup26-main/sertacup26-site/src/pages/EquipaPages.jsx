import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/dashboard-equipa.css";

const api = "http://localhost:3000";

export function TeamGuard({ children }) {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const token = sessionStorage.getItem("teamToken");
    if (!token) { setStatus("unauthorized"); return; }
    const controller = new AbortController();
    fetch(`${api}/team-session`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(response => {
        if (response.status === 401) { sessionStorage.removeItem("teamToken"); setStatus("unauthorized"); }
        else setStatus(response.ok ? "authorized" : "error");
      }).catch(error => { if (error.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, []);
  if (status === "unauthorized") return <Navigate to="/login-equipas" replace />;
  if (status === "error") return <div className="team-dashboard-message" role="alert">Não foi possível verificar a sessão. Confirma que a API está ligada e volta a tentar.</div>;
  if (status === "loading") return <div className="team-dashboard-message">A verificar sessão...</div>;
  return children;
}

function SubPage({ eyebrow, title, description, children }) {
  return <div className="team-subpage"><div className="hub-container"><Link className="hub-back" to="/dashboard-equipa">← Voltar ao dashboard</Link><span className="hub-kicker">{eyebrow}</span><h1>{title}</h1><p className="hub-subtitle">{description}</p>{children}</div></div>;
}

export function JogadoresEquipa() {
  const [players, setPlayers] = useState([]);
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [datanascimento, setDatanascimento] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [inscricoesAbertas, setInscricoesAbertas] = useState(false);
  const [editing, setEditing] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${api}/team-players`, { headers: { Authorization: `Bearer ${sessionStorage.getItem("teamToken")}` }, signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Não foi possível carregar os jogadores."); setPlayers(data.jogadores); setInscricoesAbertas(data.inscricoesAbertas); setLoaded(true); })
      .catch(error => { if (error.name !== "AbortError") setMessage(error.message || "Não foi possível ligar à API."); });
    return () => controller.abort();
  }, []);
  async function submit(event) {
    event.preventDefault(); setMessage(""); setLoading(true);
    try {
      const response = await fetch(`${api}/team-players${editing === 'new' ? '' : `/${editing}`}`, { method: editing === 'new' ? "POST" : "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("teamToken")}` }, body: JSON.stringify({ nome, numero: Number(numero), datanascimento }) });
      const data = await response.json();
      if (response.status === 403) { setInscricoesAbertas(false); setEditing(null); }
      if (!response.ok) throw new Error(data.error || "Não foi possível adicionar o jogador.");
      setPlayers(current => (editing === 'new' ? [...current, data] : current.map(player => player.id === data.id ? data : player)).sort((a, b) => a.nome.localeCompare(b.nome))); setNome(""); setNumero(""); setDatanascimento(""); setMessage(editing === 'new' ? "Jogador adicionado." : "Jogador atualizado."); setEditing(null);
    } catch (error) { setMessage(error.message || "Não foi possível ligar à API."); } finally { setLoading(false); }
  }
  return <SubPage eyebrow="A TUA EQUIPA" title="Jogadores" description="Acompanha os jogadores inscritos pela tua equipa.">
    {message && <p className="hub-notice" role="status">{message}</p>}
    {loaded && <section className="hub-player-list"><div className="hub-player-header"><div><span className={`hub-registration-status ${inscricoesAbertas ? 'is-open' : ''}`}>{inscricoesAbertas ? 'Inscrições abertas' : 'Inscrições encerradas'}</span><h2>Jogadores inscritos <span>{players.length}</span></h2></div>{inscricoesAbertas && editing === null && <button className="hub-player-add" type="button" onClick={() => { setNome(''); setNumero(''); setDatanascimento(''); setMessage(''); setEditing('new'); }}>+ Adicionar jogador</button>}</div>
      {!inscricoesAbertas && <p className="hub-registration-note">Podes consultar a lista; a inscrição e a edição estão encerradas.</p>}
      {players.length ? players.map(player => <div className="hub-player" key={player.id}><span>{player.nome}<small className="hub-player-birth">Nascimento: {player.datanascimento.split('-').reverse().join('/')}</small></span><div className="hub-player-actions"><strong>#{player.numero}</strong>{inscricoesAbertas && <button type="button" onClick={() => { setNome(player.nome); setNumero(String(player.numero)); setDatanascimento(player.datanascimento); setMessage(''); setEditing(player.id); }}>Editar</button>}</div></div>) : <p>Ainda não há jogadores adicionados.</p>}
    </section>}
    {loaded && inscricoesAbertas && editing !== null && <form className="hub-player-form" onSubmit={submit}><h2>{editing === 'new' ? 'Adicionar jogador' : 'Editar jogador'}</h2><label>Nome do jogador<input value={nome} onChange={e => setNome(e.target.value)} maxLength={100} required /></label><label className="hub-shirt-number">N.º da camisola<input type="number" min="0" max="99" step="1" value={numero} onChange={e => setNumero(e.target.value)} required /></label><label>Data de nascimento<input type="date" min="2014-01-01" max="2018-01-01" value={datanascimento} onChange={e => setDatanascimento(e.target.value)} required /></label><div className="hub-form-actions"><button disabled={loading}>{loading ? 'A guardar...' : 'Guardar jogador'} ↗</button><button type="button" className="hub-cancel" disabled={loading} onClick={() => setEditing(null)}>Cancelar</button></div></form>}
  </SubPage>;
}

export function HorarioEquipa() {
  const [program, setProgram] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { const controller=new AbortController(); fetch(`${api}/admin/program`, {signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('Não foi possível carregar o programa.');return response.json();}).then(setProgram).catch(err=>{if(err.name!=='AbortError')setError(err.message);});return()=>controller.abort(); }, []);
  return <SubPage eyebrow="PROGRAMA" title="Quatro dias de torneio" description="Uma visão geral de tudo o que está a ser preparado para o Sertã Cup 2027.">{error&&<p className="hub-notice" role="alert">{error}</p>}<div className="hub-days">{[1, 2, 3, 4].map(day => <section className="hub-day" key={day}><span className="hub-number">SERTÃ CUP 2027</span><h2>Dia {day}</h2>{program === null ? <p>A carregar...</p> : program.some(item=>item.dia===day) ? program.filter(item=>item.dia===day).map(item=><p className="hub-program-item" key={item.id}><strong>{item.hora}</strong><br />{item.descricao}</p>) : <p>Programa a anunciar.</p>}</section>)}</div></SubPage>;
}

export function DescobrirSerta() {
  const places = [
    { name: "Alameda da Carvalha", text: "Um espaço junto à Ribeira da Sertã para passear e aproveitar a vila.", query: "Alameda da Carvalha Sertã" },
    { name: "Ponte da Carvalha", text: "Uma ponte de pedra sobre a Ribeira da Sertã, junto à alameda.", query: "Ponte da Carvalha Sertã" },
    { name: "Castelo da Sertã", text: "Conhece um dos lugares históricos da vila.", query: "Castelo da Sertã" },
  ];
  return <SubPage eyebrow="PARA LÁ DAS QUATRO LINHAS" title="Descobre a Sertã" description="Entre jogos, aproveita para conhecer alguns lugares da nossa terra."><div className="hub-places">{places.map((place, i) => <a className="hub-place" key={place.name} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`} target="_blank" rel="noreferrer"><span className="hub-number">0{i + 1} / VISITAR</span><h2>{place.name}</h2><p>{place.text}</p><span className="hub-place-action">Ver no mapa ↗</span></a>)}</div><p className="hub-notice">Descobre mais no <a href="https://cm-serta.pt/turismo" target="_blank" rel="noreferrer">portal de turismo do Município da Sertã ↗</a>.</p></SubPage>;
}
