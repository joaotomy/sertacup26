const teams = [
    "/images/teams/A.D. Mação A.png",
    "/images/teams/A.D. Mação B.png",
    "/images/teams/Acad. Alcoitão A.png",
    "/images/teams/Acad. Alcoitão B.png",
    "/images/teams/Acad. Alcoitão C.png",
    "/images/teams/Amigos Urgeses.png",
    "/images/teams/Biblioteca I.R..png",
    "/images/teams/C.F. Os Bucelenses.png",
    "/images/teams/C.U. Idanhense.png",
    "/images/teams/Catujalense.png",
    "/images/teams/E.F. Benfica Pedrógão.png",
    "/images/teams/F.C. Madalena A.png",
    "/images/teams/F.C. Madalena B.png",
    "/images/teams/Fazendense.png",
    "/images/teams/G.D. Ilha.png",
    "/images/teams/G.D. Peniche.png",
    "/images/teams/G.D.R. Os Lagartos.png",
    "/images/teams/G.D.V. Sernache.png",
    "/images/teams/G.R.D. Bragadense.png",
    "/images/teams/I.D. Vieirense.png",
    "/images/teams/Juventus Academy.png",
    "/images/teams/Paio Pires FC.png",
    "/images/teams/Ponte Frielas.png",
    "/images/teams/S.L. Cartaxo.png",
    "/images/teams/Sertanense F.C. A.png",
    "/images/teams/Sertanense F.C. B.png",
    "/images/teams/U. Pombal.png",
    "/images/teams/U.D. Atalaiense.png",
    "/images/teams/U.F. Comércio Indústria A.png",
    "/images/teams/U.F. Comércio Indústria B.png",
    "/images/teams/Vilarregense F.C..png",
    "/images/teams/Warm Team.png"
];

export default function ParticipantesSection() {
    return (
        <section className="participantes-section">

            <div className="participantes-overlay">

                <div className="section-header">Participantes</div>

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