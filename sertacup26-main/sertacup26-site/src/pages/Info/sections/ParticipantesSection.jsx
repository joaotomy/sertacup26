const teams = [
    "/images/teams/team1.png",
    "/images/teams/team2.png",
    "/images/teams/team3.png",
    "/images/teams/team4.png"
];

export default function ParticipantesSection() {
    return (
        <section className="participantes-section">

            <div className="participantes-overlay">

                <h2>Participantes</h2>

                <div className="participantes-grid">

                    {teams.map((logo, index) => (
                        <div
                            key={index}
                            className="team-logo"
                        >
                            <img
                                src={logo}
                                alt=""
                            />
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}