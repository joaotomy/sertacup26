import "../styles/historia.css";

import timelineEvents from "../data/timelineEvents";
import winners from "../data/winners";

function TimelineCard({ event }) {
  return (
    <article className="timeline-card">
      <div className="timeline-year">
        {event.year}
      </div>

      <p>{event.text}</p>
    </article>
  );
}

export default function Historia() {

const communityImages = [
"/images/community/serta_junta.png",
"/images/community/serta_municipio.png",
"/images/community/serta_bombeiros.png",
"/images/community/etps.png",
"/images/community/fisioserta.jpg",
"/images/community/danceclub.jpeg"
];

return ( <main className="historia-page">
  {/* HERO */}

  <section className="historia-hero">

    <img
      src="/images/storycover.jpg"
      alt=""
      className="historia-cover"
    />

  <div className="historia-title-wrapper">

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
          Mais do que um torneio, a Sertã Cup nasceu de uma vontade clara: criar uma experiência marcante para jovens atletas, famílias e clubes, promovendo o futebol como espaço de crescimento, convívio e paixão pelo desporto.
        </p>

        <p>
          Impulsionada pelo compromisso do Sertanense Futebol Clube com a formação desportiva e cívica dos nossos atletas, a Sertã Cup surgiu também como resposta ao protocolo estabelecido com a Câmara Municipal da Sertã, dando vida a um evento pensado para unir competição, educação e comunidade.
        </p>

        <p>
          Ao longo das suas edições, o torneio tem vindo a crescer de forma sustentada, afirmando-se como um momento de referência no futebol jovem da região. A cada ano, dezenas de equipas chegam à Sertã para viver dias de competição intensa, amizade, partilha e fair-play, criando memórias que ultrapassam as quatro linhas.
        </p>

        <p>
          Na sua quinta edição, a Sertã Cup dá mais um passo em frente. Mantendo a ambição de reunir 32 equipas e cerca de 450 atletas, o torneio expande-se agora para 4 dias de atividade, reforçando a experiência competitiva e social de todos os participantes.
        </p>

        <p>
          Com o apoio fundamental de pais, voluntários, entidades locais e parceiros regionais, a Sertã Cup continua a crescer com ambição, responsabilidade social e identidade própria, acreditando que o desporto pode ser uma ferramenta crucial no desenvolvimento de jovens e da comunidade.
        </p>

      </div>

    </div>

  </section>

 {/* TIMELINE */}

<section className="timeline-section">

  <div className="grid-container">

    <div className="timeline-track col-span-12">

      <img
        src="/images/SVG/timeline-line.svg"
        alt=""
        className="timeline-line"
      />

      {timelineEvents.map((event) => (

        <div
          key={`${event.year}-${event.title}`}
          className={`timeline-node ${event.position}`}
        >

          {event.position === "top" && (
            <TimelineCard event={event} />
          )}

          <img
            src="/images/SVG/timeline-cup.svg"
            alt=""
            className="timeline-cup"
          />

          {event.position === "bottom" && (
            <TimelineCard event={event} />
          )}

        </div>

      ))}

    </div>

    {/* MOBILE */}

    <div className="timeline-mobile col-span-12">

      {timelineEvents.map((event) => (

        <article
          key={`${event.year}-${event.title}-mobile`}
          className="timeline-mobile-card"
        >

          <div className="timeline-mobile-dot" />

          <div>

            <div className="timeline-year">
              {event.year}
            </div>

            <div className="timeline-event-title">
              {event.title}
            </div>

            <p>{event.text}</p>

          </div>

        </article>

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

        <div className="vision-subtitle">IMAGEM</div>

        <p>
          Ser um torneio de referência a nível Distrital e Nacional.
        </p>

      </div>

      <div className="vision-block col-span-12">

        <div className="vision-subtitle">UNIVERSO</div>

        <p>
          Atingir 32 equipas, 450 atletas, num total de 600 participantes.
        </p>

      </div>

      <div className="vision-block col-span-12">

        <div className="vision-layout">

          <div className="vision-copy">

            <div className="vision-subtitle">COMUNIDADE</div>

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

            <div className="vision-subtitle">
              RESPONSABILIDADE SOCIAL
            </div>

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
