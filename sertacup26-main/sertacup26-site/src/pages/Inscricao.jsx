import { Link } from "react-router-dom";
import "../styles/inscricao.css";

const googleFormsUrl = "https://forms.gle/P9mAf6j4mkQzjjGo8";

export default function Inscricao() {
  const registrationContent = (
    <>
      <span className="choice-label">SERTÃ CUP 2027</span>
      <h1>Garante já a tua participação no SertãCup 2027</h1>
      <p>Faz já a pré-inscrição da tua equipa através do nosso GoogleForms.<br />Um elemento do nosso staff irá entrar em contacto contigo para te pôr a par de tudo!</p>
      <span className="choice-action">{googleFormsUrl ? "Pré-inscrever equipa" : "Pré-inscrição disponível brevemente"} <span aria-hidden="true">↗</span></span>
    </>
  );

  return (
    <main className="registration-choices" aria-label="Inscrição de equipas">
      {googleFormsUrl ? (
        <a className="choice-panel choice-register" href={googleFormsUrl} target="_blank" rel="noopener noreferrer">{registrationContent}</a>
      ) : (
        <section className="choice-panel choice-register choice-unavailable">{registrationContent}</section>
      )}
      <Link className="choice-panel choice-login" to="/login-equipas">
        <span className="choice-label">ÁREA DE EQUIPAS</span>
        <h2>Login</h2>
        <p>Se já tens as tuas credenciais entra aqui!</p>
        <span className="choice-action">Entrar <span aria-hidden="true">↗</span></span>
      </Link>
    </main>
  );
}
