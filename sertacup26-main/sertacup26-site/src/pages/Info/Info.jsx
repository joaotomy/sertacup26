import HorariosSection from "./sections/HorariosSection";
import MapaSection from "./sections/MapaSection";
import FormatoSection from "./sections/FormatoSection";
import ParticipantesSection from "./sections/ParticipantesSection";

import "../../styles/info.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function InfoPage() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash);

            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    }, [location]);

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
        </div>
    );
}