import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TeamGuard } from "./EquipaPages";
import "../styles/dashboard-equipa.css";

export default function DashboardEquipa() {
  const [details, setDetails] = useState({ accommodation: null, contacts: null, documents: [] });
  useEffect(() => {
    const controller = new AbortController();
    const token = sessionStorage.getItem('teamToken');
    const get = (path, headers = {}) => fetch(`http://localhost:3000${path}`, { headers, signal: controller.signal }).then(response => response.ok ? response.json() : null);
    Promise.all([get('/team-accommodation', { Authorization: `Bearer ${token}` }), get('/admin/contacts'), get('/admin/documents')])
      .then(([accommodation, contacts, documents]) => setDetails({ accommodation, contacts, documents: documents || [] }))
      .catch(error => { if (error.name !== 'AbortError') console.error('Erro ao carregar informações da equipa:', error); });
    return () => controller.abort();
  }, []);
  return <TeamGuard><div className="team-hub">
    <header className="hub-hero"><div className="hub-container"><span className="hub-kicker">SERTÃ CUP 2027 · ÁREA DE EQUIPAS</span><h1>O teu torneio<br /><em>começa aqui.</em></h1><p>Tudo o que a tua equipa precisa, dentro e fora das quatro linhas.</p><Link className="hub-primary" to="/torneio?tab=calendario">Acompanhar o torneio <span>↗</span></Link></div></header>
    <div className="hub-container hub-content"><div className="hub-section-title"><div><span className="hub-kicker">PREPARA A TUA EQUIPA</span><h2>O essencial</h2></div><span className="hub-title-note">SERTÃ CUP / 2027</span></div>
      <div className="hub-links">
        <Link className="hub-link" to="/equipa/jogadores"><span className="hub-number">01 / EQUIPA</span><h3>Inscrição de jogadores</h3><p>Adiciona os jogadores da tua equipa.</p><span className="hub-arrow">↗</span></Link>
        <Link className="hub-link" to="/equipa/horario"><span className="hub-number">02 / PROGRAMA</span><h3>Horário do torneio</h3><p>Os quatro dias, numa só vista.</p><span className="hub-arrow">↗</span></Link>
        <Link className="hub-link hub-link-discover" to="/equipa/descobrir-serta"><span className="hub-number">03 / EXPLORAR</span><h3>Descobre a Sertã</h3><p>Conhece a vila para lá do futebol.</p><span className="hub-arrow">↗</span></Link>
      </div>
      <div className="hub-details"><section className="hub-detail"><span className="hub-kicker">A TUA ESTADIA</span><h2>Alojamento</h2>{details.accommodation ? <><p><strong>{details.accommodation.tipo}</strong><br />{details.accommodation.localizacao}</p>{details.accommodation.maps_url && <a className="hub-document" href={details.accommodation.maps_url} target="_blank" rel="noopener noreferrer">Ver no Google Maps <span>↗</span></a>}{details.accommodation.regras && <><strong>Regras do alojamento</strong><p style={{whiteSpace:'pre-line'}}>{details.accommodation.regras}</p></>}</> : <><p>O tipo, a localização e as regras do alojamento serão disponibilizados quando a tua equipa tiver uma atribuição.</p><span className="hub-muted">Informação por confirmar</span></>}</section>
      <section className="hub-detail"><span className="hub-kicker">INFORMAÇÃO ÚTIL</span><h2>Documentação</h2><p>Consulta os documentos do torneio.</p><a className="hub-document" href="/SERT%C3%83CUP%202026%20REGULAMENTO.pdf" download>Regulamento 2026 <span>↓</span></a>{[['regulamento','Regulamento 2027'],['manual','Manual de acolhimento']].map(([code,label])=>details.documents.some(d=>d.codigo===code)?<a className="hub-document" key={code} href={`http://localhost:3000/admin/documents/${code}`} download>{label}<span>↓</span></a>:<div className="hub-document hub-muted" key={code}>{label}<span>Em breve</span></div>)}</section></div>
      <section className="hub-support"><div><span className="hub-kicker">ESTAMOS POR PERTO</span><h2>Precisas de ajuda?</h2>{details.contacts?.email||details.contacts?.telefone||details.contacts?.outros ? <p>{details.contacts.email && <><a className="hub-contact-link" href={`mailto:${details.contacts.email}`}>{details.contacts.email}</a><br /></>}{details.contacts.telefone && <><a className="hub-contact-link" href={`tel:${details.contacts.telefone.replace(/\s/g,'')}`}>{details.contacts.telefone}</a><br /></>}{details.contacts.outros && <span style={{whiteSpace:'pre-line'}}>{details.contacts.outros}</span>}</p> : <p>Os contactos da organização serão disponibilizados aqui.</p>}</div>{details.contacts?.email ? <a className="hub-support-status hub-contact-link" href={`mailto:${details.contacts.email}`}>ENVIAR EMAIL ↗</a> : <span className="hub-support-status">CONTACTOS EM BREVE</span>}</section>
    </div></div></TeamGuard>;
}
