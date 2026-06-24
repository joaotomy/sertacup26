import { useState } from "react";

const maps = [
    {
        id: "campos",
        label: "Campos",
        image: "/images/maps/campos.png"
    },
    {
        id: "balnearios",
        label: "Balneários",
        image: "/images/maps/balnearios.png"
    },
    {
        id: "secretariado",
        label: "Secretariado",
        image: "/images/maps/secretariado.png"
    }
];

export default function MapaSection() {
    const [selectedMap, setSelectedMap] = useState("campos");

    const currentMap = maps.find(
        m => m.id === selectedMap
    );

    return (
        <section className="mapa-section">
            <div className="info-split-layout">

                <aside className="info-side-menu">
                    {maps.map(map => (
                        <button
                            key={map.id}
                            className={`info-side-item ${
                                selectedMap === map.id ? "active" : ""
                            }`}
                            onClick={() => setSelectedMap(map.id)}
                        >
                            {map.label}
                        </button>
                    ))}
                </aside>

                <div className="info-main-content">
                    <div className="map-container">
                        <img
                            src={currentMap.image}
                            alt={currentMap.label}
                            className="map-image"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}