import { useState } from "react";

const menuItems = [
    { id: "day1", label: "Dia 1" },
    { id: "day2", label: "Dia 2" },
    { id: "day3", label: "Dia 3" },
    { id: "day4", label: "Dia 4" },
    { id: "meals", label: "Refeições" },
    { id: "activities", label: "Atividades" }
];

const scheduleData = {
    day1: {
        morning: [
            {
                title: "Bloco 1",
                time: "09:00 - 10:30",
                items: [
                    {
                        title: "Jogo 1",
                        location: "Campo 1"
                    },
                    {
                        title: "Jogo 2",
                        location: "Campo 2"
                    }
                ]
            }
        ],
        afternoon: [
            {
                title: "Bloco 2",
                time: "14:00 - 15:30",
                items: [
                    {
                        title: "Jogo 3",
                        location: "Campo 1"
                    }
                ]
            }
        ],
        night: []
    },

    day2: {
        morning: [],
        afternoon: [],
        night: []
    },

    day3: {
        morning: [],
        afternoon: [],
        night: []
    },

    day4: {
        morning: [],
        afternoon: [],
        night: []
    },

    meals: [
        {
            time: "08:00",
            title: "Pequeno-almoço"
        },
        {
            time: "13:00",
            title: "Almoço"
        },
        {
            time: "20:00",
            title: "Jantar"
        }
    ],

    activities: [
        {
            time: "20:00",
            title: "Cerimónia de abertura"
        },
        {
            time: "22:00",
            title: "Atividade de convívio"
        }
    ]
};

export default function HorariosSection() {
    const [selected, setSelected] = useState("day1");

    const currentData = scheduleData[selected];

    const isDay =
        selected === "day1" ||
        selected === "day2" ||
        selected === "day3" ||
        selected === "day4";

    return (
        <section className="info-section horarios-section">

            <div className="section-header">
                Horários
            </div>

            <div className="info-split-layout">

                <aside className="info-side-menu">

                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`info-side-item ${
                                selected === item.id ? "active" : ""
                            }`}
                            onClick={() => setSelected(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}

                </aside>

                <div className="info-main-content">

                    {isDay ? (
                        <div className="horarios-columns">

                            <div className="schedule-column">

                                <div className="schedule-column-title">
                                    Manhã
                                </div>

                                {currentData.morning.map((block, index) => (
                                    <ScheduleBlock
                                        key={index}
                                        block={block}
                                    />
                                ))}

                            </div>

                            <div className="schedule-column">

                                <div className="schedule-column-title">
                                    Tarde
                                </div>

                                {currentData.afternoon.map((block, index) => (
                                    <ScheduleBlock
                                        key={index}
                                        block={block}
                                    />
                                ))}

                            </div>

                            <div className="schedule-column">

                                <div className="schedule-column-title">
                                    Noite
                                </div>

                                {currentData.night.map((block, index) => (
                                    <ScheduleBlock
                                        key={index}
                                        block={block}
                                    />
                                ))}

                            </div>

                        </div>
                    ) : (
                        <div className="horarios-special">

                            {currentData.map((item, index) => (
                                <div
                                    key={index}
                                    className="special-card"
                                >
                                    <span>{item.time}</span>

                                    <strong>
                                        {item.title}
                                    </strong>
                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

            <div className="horarios-image"></div>

        </section>
    );
}

function ScheduleBlock({ block }) {
    return (
        <div className="schedule-block">

            <div className="schedule-block-title">{block.title}</div>

            <div className="schedule-time">
                {block.time}
            </div>

            {block.items.map((item, index) => (
                <div
                    key={index}
                    className="schedule-item"
                >
                    <strong>
                        {item.title}
                    </strong>

                    <span>
                        {item.location}
                    </span>
                </div>
            ))}

        </div>
    );
}