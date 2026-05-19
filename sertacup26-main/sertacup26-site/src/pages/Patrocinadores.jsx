import { useEffect, useState } from "react";
import "../styles/patron.css";
import "../styles/site.css";
import "../styles/index.css";

export default function Patrocinadores() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {

    const data = [
      "Sertanense ICOS logo.png",
      "S. Benfica C.B..png",
      "União Pombal logo.png",
      "U.D. Batalha logo.png",
      "Desportivo C.B. logo.png",
      "Alenquer e Benfica logo.png"      
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