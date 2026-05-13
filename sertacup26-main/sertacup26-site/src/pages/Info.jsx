import { useEffect, useState } from "react";
import "../styles/info.css";
import "../styles/site.css";
import "../styles/index.css";

export default function Info() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/images/teams")
      .then(() => {
        const files = [
          // React can’t read server folders like ASP.NET
          // so you either hardcode or fetch from API
        ];
        setTeams(files);
      });
  }, []);

  return (
    <>
      {/* HORÁRIOS */}
      <section className="section horarios">
        <div className="info-title">HORÁRIOS</div>

        <div className="grid-container">
          <div className="horarios-dia">
            <div className="dia-title">Dia 1</div>

            <div className="hour-block">
              <div className="hour-title">9:00</div>
              <div>Cerimónia de Abertura</div>
            </div>

            <div className="hour-block">
              <div className="hour-title">10:30 - 22:30</div>
              <div>Jogos</div>
            </div>

            <div className="hour-block">
              <div className="hour-title">19:00 - 20:30</div>
              <div>Sunset com DJ Kadiv</div>
            </div>
          </div>

          <div className="horarios-dia">
            <div className="dia-title">Dia 2</div>

            <div className="hour-block">
              <div className="hour-title">9:30 - 19:00</div>
              <div>Jogos</div>
            </div>

            <div className="hour-block">
              <div className="hour-title">15:00 - 18:00</div>
              <div>Finais</div>
            </div>

            <div className="hour-block">
              <div className="hour-title">19:00</div>
              <div>Entrega de prémios</div>
            </div>
          </div>

          <div className="horarios-dia">
            <div className="hour-block">
              <div className="hour-title">Durante todo o fim de semana</div>
              <div>Atividades, comida e bebida</div>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPOS */}
      <section className="section campos">
        <div className="info-title">CAMPOS</div>

        <div className="grid-container campos-grid">
          <div className="campo-principal">
            <img src="/images/campo-principal.jpg" alt="Campo principal" />
          </div>

          <div className="campo-slot">
            <div className="campo-nome">Cernache</div>
            <div className="campo-desc">3 Campos</div>
          </div>

          <div className="campo-slot">
            <div className="campo-nome">Cabeçudo</div>
            <div className="campo-desc">2 Campos</div>
          </div>

          <div className="campo-slot">
            <div className="campo-nome">Sertã</div>
            <div className="campo-desc">2 Campos</div>
            <div className="campo-desc">
              O CAMPO DA FINAL: DR MARQUES DOS SANTOS
            </div>
          </div>

          {[4, 5, 6, 7].map((i) => (
            <div key={i} className="campo-slot">
              Campo {i}
            </div>
          ))}
        </div>
      </section>

      {/* PARTICIPANTES */}
      <section className="section participantes">
        <div className="info-title">PARTICIPANTES</div>

        <div className="grid-container participantes-grid">
          {teams.map((logo, i) => (
            <div className="logo-item" key={i}>
              <img src={`/images/teams/${logo}`} alt="team" />
            </div>
          ))}
        </div>
      </section>

      {/* FORMATO */}
      <section className="section formato">
        <div className="info-title">FORMATO</div>

        <div className="formato-wrapper">
          <div className="formato-bloco">
            <div className="formato-subtitulo">Estrutura</div>
            <div className="formato-texto">
              A competição Sub-13 terá 32 equipas...
              <br />
              <br />• 8 grupos de 4 equipas
              <br />• Fase seguinte com ligas diferentes
            </div>
          </div>

          <div className="formato-bloco">
            <div className="formato-subtitulo">Duração dos Jogos</div>
            <div className="formato-texto">
              • 20 min por parte
              <br />• Final: 25 min por parte
            </div>
          </div>

          <div className="formato-bloco">
            <div className="formato-subtitulo">Desempates</div>
            <div className="formato-texto">
              • Penáltis diretos
              <br />• 5 remates + morte súbita
            </div>
          </div>
        </div>
      </section>
    </>
  );
}