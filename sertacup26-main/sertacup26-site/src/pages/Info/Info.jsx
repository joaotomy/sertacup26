import { useState } from "react";

import HorariosSection from "./sections/HorariosSection";
import MapaSection from "./sections/MapaSection";
import FormatoSection from "./sections/FormatoSection";
import ParticipantesSection from "./sections/ParticipantesSection";
import SegurancaSection from "./sections/SegurancaSection";

const sections = [
    { id: "horarios", label: "Horários" },
    { id: "mapa", label: "Mapa" },
    { id: "formato", label: "Formato" },
    { id: "participantes", label: "Participantes" },
    { id: "seguranca", label: "Segurança" }
];

export default function InfoPage() {
    const [activeSection, setActiveSection] = useState("horarios");

    const renderSection = () => {
        switch (activeSection) {
            case "horarios":
                return <HorariosSection />;

            case "mapa":
                return <MapaSection />;

            case "formato":
                return <FormatoSection />;

            case "participantes":
                return <ParticipantesSection />;

            case "seguranca":
                return <SegurancaSection />;

            default:
                return null;
        }
    };

    return (
        <div className="info-page">
            <div className="info-nav">
                {sections.map(section => (
                    <button
                        key={section.id}
                        className={`info-nav-item ${
                            activeSection === section.id ? "active" : ""
                        }`}
                        onClick={() => setActiveSection(section.id)}
                    >
                        {section.label}
                    </button>
                ))}
            </div>

            <div className="info-content">
                {renderSection()}
            </div>
        </div>
    );
}