import { useState } from "react";

const headerItems = [
    {
        icon: "/images/SVG/teams.svg",
        title: "32 Equipas"
    },
    {
        icon: "/images/SVG/age.svg",
        title: "Sub-13"
    },
    {
        icon: "/images/SVG/field.svg",
        title: "Todos jogam pelo menos 2x em relvado"
    }
];

export default function FormatoSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () =>
        setCurrentSlide(prev => (prev === 1 ? 0 : prev + 1));

    const prevSlide = () =>
        setCurrentSlide(prev => (prev === 0 ? 1 : prev - 1));

    return (
        <section className="info-section formato-section">

            <div className="section-header">
                FORMATO
            </div>

            <div className="formato-container">

                <div className="formato-header">

                    {headerItems.map((item, index) => (
                        <div
                            key={index}
                            className="formato-header-card"
                        >
                            <img
                                src={item.icon}
                                alt=""
                            />

                            <div className="formato-header-title">
                                {item.title}
                            </div>
                        </div>
                    ))}

                </div>

                <div className="formato-carousel">

                    <button
                        className="carousel-arrow left"
                        onClick={prevSlide}
                    >
                        ‹
                    </button>

                    {currentSlide === 0 ? (
                        <div className="formato-slide">

                            <div className="formato-slide-title">
                                Fase de Grupos
                            </div>

                            <div className="formato-features">

                                <div className="formato-feature">
                                    <img
                                        src="/images/SVG/groups.svg"
                                        alt=""
                                    />

                                    <div>
                                        8 Grupos de 4
                                    </div>
                                </div>

                                <div className="formato-feature">
                                    <img
                                        src="/images/SVG/time.svg"
                                        alt=""
                                    />

                                    <div>
                                        20' Por Parte
                                    </div>
                                </div>

                                <div className="formato-feature">
                                    <img
                                        src="/images/SVG/whistle.svg"
                                        alt=""
                                    />

                                    <div>
                                        Desempates*
                                    </div>
                                </div>

                            </div>

                            <img
                                className="grupo-diagram"
                                src="/images/SVG/fase-grupos.svg"
                                alt="Fase de Grupos"
                            />


                            <div className="formato-note">
                                * Consulta o
                                {" "}
                                <a
                                    href="/regulamento.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    regulamento
                                </a>
                                {" "}
                                para mais informações.
                            </div>

                        </div>
                    ) : (
                        <div className="formato-slide">

                            <div className="formato-slide-title">
                                Fases Finais
                            </div>

                            <div className="formato-features">

                                <div className="formato-feature">
                                    <img
                                        src="/images/SVG/trophy.svg"
                                        alt=""
                                    />

                                    <div>
                                        3 Ligas
                                    </div>
                                </div>

                                <div className="formato-feature">
                                    <img
                                        src="/images/SVG/time.svg"
                                        alt=""
                                    />

                                    <div>
                                        25' Por Parte
                                    </div>
                                </div>

                                <div className="formato-feature">
                                    <img
                                        src="/images/SVG/whistle.svg"
                                        alt=""
                                    />

                                    <div>
                                        Penáltis
                                    </div>
                                </div>

                            </div>

                            <img
                                className="finals-diagram"
                                src="/images/SVG/fases-finais.svg"
                                alt="Fases Finais"
                            />

                            <div className="formato-note">
                                Nenhuma equipa é eliminada. Todas continuam a disputar classificação até ao final do torneio.
                            </div>

                        </div>
                    )}

                    <button
                        className="carousel-arrow right"
                        onClick={nextSlide}
                    >
                        ›
                    </button>

                </div>

            </div>

        </section>
    );
}