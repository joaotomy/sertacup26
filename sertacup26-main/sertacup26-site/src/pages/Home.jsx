import "../styles/site.css";
import "../styles/index.css";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="grid-container">
          <div className="col-span-4 col-start-1 hero-cup-wrapper">
            <img
              src="/images/cup.png"
              alt="Taça Sertã 1  Cup"
              className="hero-cup-img"
            />
          </div>

          <div className="col-span-6 col-start-6 md:col-span-5 md:col-start-4 sm:col-span-4 sm:col-start-1 hero-text">
            <div className="hero-title">II SERTÃ CUP</div>

            <div className="hero-subtitle">20 e 21 JUNHO</div>

            <div className="cta-wrapper">
              <a className="cta" href="/torneio?tab=calendario">
                EM DIRETO
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}