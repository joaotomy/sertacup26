import "../styles/historia.css";
import "../styles/site.css";
import "../styles/index.css";

export default function Historia() {
  return (
    <main>
      {/* HISTÓRIA */}
      <section className="stacked-section historia-section">
        <div className="stacked-image historia-bg-img"></div>

        <div className="stacked-overlay">
          <div className="grid-container">
            <div className="stacked-title">História</div>
          </div>
        </div>

        <div className="stacked-content">
          <div className="grid-container">
            <div className="historia-text">
              <p>
                Existia a vontade de criar um torneio de referência a nível
                Distrital e Nacional, promovendo o concelho da Sertã e dando a
                conhecer todo o seu potencial. Para tal, o S.F.C. decidiu
                organizar o Sertã Cup. Este evento visa proporcionar aos jovens
                atletas a prática de futebol, promovendo o convívio entre
                equipas, contribuindo para a sua formação desportiva e pessoal e
                também a criação de parecerias com entidades locais e regionais,
                potenciando angariação de fundos tal como a APPACDM e
                CERCICAPER. Esta será a quarta edição, onde o objetivo de crescer
                e aumentar o números de equipas participantes para 32 foi
                alcançado!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSABILIDADE SOCIAL */}
      <section className="social-section">
        <div className="grid-container">
          <div className="social-title">Responsabilidade Social</div>

          <div className="social-logos">
            <img src="/images/APPACDM.png" alt="APPACDM" />
            <img src="/images/CERCICAPER.png" alt="CERCICAPER" />
          </div>
        </div>
      </section>

      {/* VENCEDORES */}
      <section className="vencedores-section">
        <div className="grid-container">
          <div className="vencedores-title">Vencedores</div>

          <div className="vencedores-content">
            <div className="vencedor-box">
              <div className="edicao">Iª</div>
              <p>ESCOLA PEDRO ROMA</p>
            </div>

            <div className="vencedor-box">
              <div className="edicao">IIª</div>
              <p>SERTANENSE FC</p>
            </div>

            <div className="vencedor-box">
              <div className="edicao">IIIª</div>
              <p>ESCOLA BENFICA P.G</p>
            </div>

            <div className="vencedor-box">
              <div className="edicao">IVª</div>
              <p>???</p>
            </div>
          </div>

          <img
            src="/images/cup test.png"
            alt="Troféu"
            className="vencedores-image"
          />
        </div>
      </section>
    </main>
  );
}