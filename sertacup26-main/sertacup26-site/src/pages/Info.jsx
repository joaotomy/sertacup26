import { useEffect, useState } from "react";
import "../styles/info.css";
import "../styles/site.css";

export default function Info() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
  const files = [
    "Alenquer e Benfica logo.png",
    "Amigos Urgeses 1 logo.png",
    "Amigos Urgeses 2 logo.png",
    "Avelarense FEM logo.png",
    "B.E.F.P.G. logo.png",
    "Bragadense U12 logo.png",
    "Bragadense U13 logo.png",
    "C. U. Idanhense FEM logo.png",
    "Desportivo C.B. logo.png",
    "E.F. Tomar logo.png",
    "E.F. Tomar.jpg",
    "Fátima - A logo.png",
    "Fátima - B logo.png",
    "G. D. Ilha FEM logo.png",
    "G.D. Ilha logo.png",
    "logo.png",
    "Moçarriense logo.png",
    "Os Bucelenses logo.png",
    "Os Lagartos logo.png",
    "Ouriquense logo.png",
    "Peniche logo.png",
    "Ponte de Frielas logo.png",
    "S. Abrantes e Benfica logo.png",
    "S. Benfica C.B..png",
    "S. Mascotelos logo.png",
    "Sertanense ICOS logo.png",
    "Sertanense SPC logo.png",
    "U.D. Atalaiense logo.png",
    "U.D. Batalha logo.png",
    "U.D. Belmonte FEM logo.png",
    "U.D. Belmonte logo.png",
    "U.D. Chamusca logo.png",
    "U.F.C.I. logo.png",
    "União Pombal logo.png",
    "União Tomar logo.png",
    "Vieirense logo.png"
];

  setTeams(files);
}, []);

  return (
    <>
      {/* HORÁRIOS */}
      <section className="section horarios">
        <div className="info-title">HORÁRIOS</div>

        <div className="grid-container">
          <div className="horarios-dia">
            <div className="dia-title">Quinta - 25 junho</div>

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
            <div className="dia-title">Sexta - 26 junho</div>

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
            <div className="dia-title">Sábado - 27 junho</div>

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
            <div className="dia-title">Domingo - 28 junho</div>

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


        </div>
      </section>

      {/* CAMPOS */}
      <section className="section campos">
        <div className="info-title">CAMPOS</div>

        <div className="grid-container campos-grid">
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
              <br />• Fase seguinte com ligas diferentes: Liga dos Campeões, Liga Europa e Liga Conferência.
              <br />• O primeiro e segundo classificado de cada grupo avançam para a Liga dos Campeões, o terceiro para a Liga Europa e o quarto para a Liga Conferência.
              <br />• Nenhuma equipa é eliminada, todas têm a oportunidade de jogar até ao fim do torneio.
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