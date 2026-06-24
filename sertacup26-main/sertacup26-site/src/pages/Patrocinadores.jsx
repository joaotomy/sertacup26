import "../styles/patron.css";
import "../styles/site.css";

export default function Patrocinadores() {
  const logos = [
    {
      image: "freguesia_serta.png",
      url: "https://example.com"
    },
    {
      image: "palser.png",
      url: "https://example.com"
    },
    {
      image: "pinhoser.png",
      url: "https://example.com"
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