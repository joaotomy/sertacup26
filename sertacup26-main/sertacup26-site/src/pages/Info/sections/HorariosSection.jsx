import { useState } from "react";

const menuItems = [
    { id: "day1", label: "Dia 1 - Quinta 25/6", type: "day" },
    { id: "day2", label: "Dia 2 - Sexta 26/6", type: "day" },
    { id: "day3", label: "Dia 3 - Sábado 27/6", type: "day" },
    { id: "day4", label: "Dia 4 - Domingo 28/6", type: "day" },
    { id: "meals", label: "Refeições", type: "special" },
    { id: "activities", label: "Atividades", type: "special" }
];

const mockSchedule = {
    day1: {
        morning: [
            {
                title: "Bloco 1",
                time: "11:00 - 12:00",
                items: [
                    { game: "Jogo 45", field: "Campo R2" }
                ]
            }
        ],
        afternoon: [
            {
                title: "Bloco 1",
                time: "15:00 - 16:00",
                items: [
                    { game: "Jogo 46", field: "Campo R4" },
                    { game: "Jogo 47", field: "Campo R2" }
                ]
            }
        ],
        night: [
            {
                title: "Bloco 1",
                time: "18:00 - 19:00",
                items: []
            }
        ]
    }
};

const meals = [
    {
        title: "Pequeno-Almoço",
        time: "08:00"
    },
    {
        title: "Almoço",
        time: "13:00"
    },
    {
        title: "Jantar",
        time: "20:00"
    }
];

const activities = [
    {
        title: "Check-In",
        time: "09:00"
    },
    {
        title: "Cerimónia de Abertura",
        time: "19:00"
    }
];

export default function HorariosSection() {
    const [selectedItem, setSelectedItem] = useState("day1");

    const currentMenu = menuItems.find(x => x.id === selectedItem);

    const renderDaySchedule = () => {
        const dayData = mockSchedule[selectedItem];

        if (!dayData) {
            return <div className="horarios-empty">Sem informação disponível.</div>;
        }

        return (
            <div className="horarios-columns">
                <ScheduleColumn
                    title="Manhã"
                    blocks={dayData.morning}
                />

                <ScheduleColumn
                    title="Tarde"
                    blocks={dayData.afternoon}
                />

                <ScheduleColumn
                    title="Noite"
                    blocks={dayData.night}
                />
            </div>
        );
    };

    const renderSpecialContent = () => {
        const data =
            selectedItem === "meals"
                ? meals
                : activities;

        return (
            <div className="horarios-special">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="special-card"
                    >
                        <span>{item.time}</span>
                        <h4>{item.title}</h4>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="horarios-section">
            <div className="info-split-layout">

                <aside className="info-side-menu">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`info-side-item ${
                                selectedItem === item.id ? "active" : ""
                            }`}
                            onClick={() => setSelectedItem(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </aside>

                <div className="info-main-content">
                    {currentMenu.type === "day"
                        ? renderDaySchedule()
                        : renderSpecialContent()}
                </div>

            </div>

            <div className="horarios-background-image" />
        </section>
    );
}

function ScheduleColumn({ title, blocks }) {
    return (
        <div className="schedule-column">
            <h3>{title}</h3>

            {blocks.map((block, index) => (
                <div
                    key={index}
                    className="schedule-block"
                >
                    <h4>{block.title}</h4>

                    <div className="schedule-time">
                        {block.time}
                    </div>

                    {block.items.map((item, itemIndex) => (
                        <div
                            key={itemIndex}
                            className="schedule-item"
                        >
                            <strong>{item.game}</strong>

                            <span>{item.field}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}