import "../styles/patron.css";
import "../styles/site.css";

export default function Patrocinadores() {
  const logos = [
    {
      image: "freguesia_serta.png",
      url: "https://www.jfserta.pt/"
    },
    {
      image: "palser.png",
      url: "https://www.palser.pt/"
    },
    {
      image: "pinhoser.png",
      url: "https://www.pinhoser.pt/m"
    },
    {
      image: "serta_municipio.png",
      url: "https://cm-serta.pt/"
    },
        {
      image: "stand_frigi.png",
      url: "https://standfrigi.com/"
    },
        {
      image: "opticalia.jpg",
      url: "https://www.opticalia.com/pt"
    },
        {
      image: "focar_momentos.png",
      url: "https://fotoheldercosta.com/Focar-Momentos/"
    },
            {
      image: "ricardo_ribeiro_pinturas.png",
      url: "https://www.ricardoribeiropinturas.pt/"
    }
  ];

  return (
    <section className="partners-page">
      <div className="partners-logo-scroller">
        <div className="partners-logo-track">
          {[0, 1].map((dup) =>
            logos.map((logo, i) => (
              <a
                key={`${dup}-${i}`}
                className="partners-logo-item"
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`/images/patron/${logo.image}`}
                  alt=""
                />
              </a>
            ))
          )}
        </div>
      </div>
      <div className="partners-sticky-text">
        <p>Os que tornam isto possível</p>
      </div>
    </section>
  );
}