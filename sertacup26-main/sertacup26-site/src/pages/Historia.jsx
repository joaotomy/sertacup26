import "../styles/historia.css";

import timelineEvents from "../data/timelineEvents";
import winners from "../data/winners";

export default function Historia() {

const communityImages = [
"/images/community/serta_junta.png",
"/images/community/serta_municipio.pngg",
"/images/community/serta_bombeiros.png",
"/images/community/etps.png",
"/images/community/fisioserta.jpg",
"/images/community/danceclub.jpg"
];

return ( <main className="historia-page">
  {/* HERO */}

  <section className="historia-hero">

    <img
      src="/images/historia-cover.jpg"
      alt=""
      className="historia-cover"
    />

    <div className="grid-container">

      <div
        className="
        historia-title
        col-span-4
        md:col-span-4
        sm:col-span-4
      "
      >
        HISTÓRIA
      </div>

    </div>

  </section>

  {/* STORY */}

  <section className="historia-story">

    <div className="grid-container">

      <div
        className="
        historia-text
        col-span-8
        md:col-span-6
        sm:col-span-4
      "
      >
        <p>
          Mais do que um torneio...
        </p>

        <p>
          Impulsionada pelo compromisso...
        </p>

        <p>
          Ao longo das suas edições...
        </p>

        <p>
          A cada ano...
        </p>

        <p>
          Na sua quinta edição...
        </p>

        <p>
          Com o apoio fundamental...
        </p>

      </div>

    </div>

  </section>

  {/* TIMELINE */}

  <section className="timeline-section">

    <div className="grid-container">

      <div className="timeline-title col-span-12">
        EVOLUÇÃO
      </div>

      <div className="timeline-desktop col-span-12">

        <div className="timeline-line" />

        {timelineEvents.map((event) => (
          <div
            key={event.year}
            className={`timeline-event ${event.position}`}
          >

            <div className="timeline-marker" />

            <div className="timeline-card">

              <h3>{event.year}</h3>

              <h4>{event.title}</h4>

              <p>{event.text}</p>

            </div>

          </div>
        ))}

      </div>

      <div className="timeline-mobile col-span-12">

        {timelineEvents.map((event) => (
          <div
            key={event.year}
            className="timeline-mobile-item"
          >
            <div className="timeline-mobile-dot" />

            <div>

              <h3>{event.year}</h3>

              <h4>{event.title}</h4>

              <p>{event.text}</p>

            </div>

          </div>
        ))}

      </div>

    </div>

  </section>

  {/* WINNERS */}

  <section className="winners-section">

    <div className="winners-overlay" />

    <div className="grid-container">

      <div className="winners-title col-span-12">
        MURAL DOS VENCEDORES
      </div>

      <div className="winners-grid col-span-12">

        {winners.map((winner) => (

          <div
            key={winner.club}
            className="winner-item"
          >

            <img
              src={winner.logo}
              alt=""
              className="winner-logo"
            />

            <p>{winner.club}</p>

          </div>

        ))}

      </div>

      <div className="upcoming-winner col-span-12">

        <img
          src="/images/logo.png"
          alt=""
          className="winner-logo"
        />

        <p>BREVEMENTE</p>

      </div>

    </div>

  </section>

  {/* VISÃO */}

  <section className="vision-section">

    <div className="grid-container">

      <div className="vision-title col-span-12">
        VISÃO
      </div>

      <div className="vision-block col-span-12">

        <h3>IMAGEM</h3>

        <p>
          Ser um torneio de referência a nível Distrital e Nacional.
        </p>

      </div>

      <div className="vision-block col-span-12">

        <h3>UNIVERSO</h3>

        <p>
          Atingir 32 equipas, 450 atletas, num total de 600 participantes.
        </p>

      </div>

      <div className="vision-block col-span-12">

        <div className="vision-layout">

          <div className="vision-copy">

            <h3>COMUNIDADE</h3>

            <p>
              Promover o concelho da Sertã, dando a conhecer todo o seu potencial. Dinamizar o comércio e alojamento local. Envolver o S.F.C. e outras entidades na organização do torneio.
            </p>

          </div>

          <div className="community-gallery">

            {communityImages.map((img) => (
              <img
                key={img}
                src={img}
                alt=""
              />
            ))}

          </div>

        </div>

      </div>

      <div className="vision-block col-span-12">

        <div className="vision-layout">

          <div className="vision-copy">

            <h3>
              RESPONSABILIDADE SOCIAL
            </h3>

            <p>
              Parcerias com identidades locais e regionais, potenciando angariação de fundos.
            </p>

          </div>

          <div className="social-gallery">

            <img
              src="/images/APPACDM.png"
              alt=""
            />

            <img
              src="/images/CERCICAPER.png"
              alt=""
            />

          </div>

        </div>

      </div>

    </div>

  </section>

</main>
);
}
