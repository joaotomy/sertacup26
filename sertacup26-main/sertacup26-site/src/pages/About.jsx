export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="grid-container">
          <div className="col-span-4 col-start-1 hero-cup-wrapper">
            <img
              src="/images/cup test.png"
              alt="Taça Sertã Cup"
              className="hero-cup-img"
            />
          </div>

          <div className="col-span-6 col-start-6 md:col-span-5 md:col-start-4 sm:col-span-4 sm:col-start-1 hero-text">
            <div className="hero-title">V SERTÃ CUP</div>

            <div className="hero-subtitle">25, 26, 27 e 28 JUNHO</div>

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