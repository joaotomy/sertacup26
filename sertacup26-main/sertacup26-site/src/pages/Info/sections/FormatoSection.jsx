import { useState } from "react";

const slides = [
    {
        id: 1,
        title: "Fase de Grupos",
        image: "/images/formato/grupos.png"
    },
    {
        id: 2,
        title: "Fases Finais",
        image: "/images/formato/finais.png"
    }
];

const headerItems = [
    {
        icon: "/images/icons/teams.svg",
        title: "32 Equipas"
    },
    {
        icon: "/images/icons/age.svg",
        title: "Sub-13"
    },
    {
        icon: "/images/icons/field.svg",
        title: "Todos jogam pelo menos 2x em relvado"
    }
];

export default function FormatoSection() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () =>
        setCurrent((current + 1) % slides.length);

    const prevSlide = () =>
        setCurrent((current - 1 + slides.length) % slides.length);

    return (
        <section className="formato-section">

            <div className="formato-header">

                {headerItems.map((item, index) => (
                    <div
                        key={index}
                        className="formato-header-card"
                    >
                        <img src={item.icon} alt="" />
                        <span>{item.title}</span>
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

                <div className="formato-slide">

                    <h2>{slides[current].title}</h2>

                    <img
                        src={slides[current].image}
                        alt={slides[current].title}
                    />

                </div>

                <button
                    className="carousel-arrow right"
                    onClick={nextSlide}
                >
                    ›
                </button>

            </div>

        </section>
    );
}