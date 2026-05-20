import { useEffect, useState } from "react";
import "../styles/patron.css";
import "../styles/site.css";
import "../styles/index.css";

export default function Patrocinadores() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {

    const data = [
      "freguesia_serta.png",
      "palser.png",
      "pinhoser.png",
      "stand_frigi.png",
      "joao_maia.png",
      "freguesia_cernache.png",
      "ricardo_ribeiro_pinturas.png",
      "nuno_flor.png",
      "opticalia.png",
      "pronto_vestir_farinha.png",
      "rf_engenharia.png",
      "serta_municipio.png",
      "sma.png",
      "chicos_ferro.png",
      "jimafer.png",
      "focar_momentos.png",
      "laranjeira_lopes.png",
      "auto_acessorios.png",
      "as_consulting.png",
      "confeitaria_artesenal.png"
      
    ];

    setLogos(data);
  }, []);

  return (
    <section className="patron-section">
      <div className="text-header">
        <div>OS QUE TORNAM ISTO POSSÍVEL</div>
      </div>

      <div className="logo-scroller">
        {[0, 1].map((dup) =>
          logos.map((logo, i) => (
            <div className="logo-item" key={`${dup}-${i}`}>
              <img src={`/images/patron/${logo}`} alt="Patrocinador" />
            </div>
          ))
        )}
      </div>

      <div className="text-footer">
        <div>A TODOS O NOSSO OBRIGADO</div>
      </div>
    </section>
  );
}