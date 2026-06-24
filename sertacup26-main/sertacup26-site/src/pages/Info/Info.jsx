import HorariosSection from "./sections/HorariosSection";
import MapaSection from "./sections/MapaSection";
import FormatoSection from "./sections/FormatoSection";
import ParticipantesSection from "./sections/ParticipantesSection";
import SegurancaSection from "./sections/SegurancaSection";

import "../../styles/info.css";

export default function InfoPage() {
    return (
        <div className="info-page">

            <section id="horarios">
                <HorariosSection />
            </section>

            <section id="mapa">
                <MapaSection />
            </section>

            <section id="formato">
                <FormatoSection />
            </section>

            <section id="participantes">
                <ParticipantesSection />
            </section>

            <section id="seguranca">
                <SegurancaSection />
            </section>

        </div>
    );
}