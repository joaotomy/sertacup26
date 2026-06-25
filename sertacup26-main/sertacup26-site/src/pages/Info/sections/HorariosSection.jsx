import { useState } from "react";

const menuItems = [
    { id: "day1", label: "Dia 1" },
    { id: "day2", label: "Dia 2" },
    { id: "day3", label: "Dia 3" },
    { id: "day4", label: "Dia 4" },
];

const scheduleData = {
    day1: {
        morning: [
            {
                title: "JOGO DE ABERTURA",
                time: "11:00",
            }
        ],
        afternoon: [
            {
                title: "JOGOS",
                time: "15:00 - 19:00",
            }
        ],
        night: [
            {
                title: "JOGOS",
                time: "20:00 - 23:00",
            }
        ]
    },

    day2: {
        morning: [
            {
                title: "JOGOS",
                time: "10:00 - 12:00",
            }
        ],
        afternoon: [
            {
                title: "JOGOS",
                time: "15:00 - 17:00",
            }
        ],
        night: [
            {
                title: "JOGOS",
                time: "20:00 - 22:00",
            }
        ]
    },

    day3: {
        morning: [
            {
                title: "JOGOS",
                time: "10:00 - 12:00",
            }
        ],
        afternoon: [
            {
                title: "JOGOS",
                time: "15:00 - 17:00",
            }
        ],
        night: [
            {
                title: "JOGOS",
                time: "20:00 - 22:00",
            },
                              {
                title: "DJ KADIV",
                time: "22:30 - 00:30",
            },
                                        {
                title: "TRANSMISSÃO PORTUGAL",
                time: "00:30",
            }
        ]
    },

    day4: {
        morning: [
            {
                title: "JOGOS",
                time: "10:00 - 13:00",
            }
        ],
        afternoon: [
            {
                title: "FINAIS",
                time: "15:00 - 18:00",
            },
                        {
                title: "ENTREGA DE PRÉMIOS",
                time: "18:00",
            }
        ],
        night: [
        ]
    }
};

export default function HorariosSection() {
    const [selected, setSelected] = useState("day1");

    const currentData = scheduleData[selected];

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
                            className={`info-side-item ${selected === item.id ? "active" : ""
                                }`}
                            onClick={() => setSelected(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}

                </aside>

                <div className="info-main-content">

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

                </div>

            </div>

        </section>
    );
}

function ScheduleBlock({ block }) {
    return (
        <div className="schedule-block">
            <div className="schedule-block-title">
                {block.title}
            </div>

            <div className="schedule-time">
                {block.time}
            </div>
        </div>
    );
}