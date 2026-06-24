const partners = [
    "/images/security/gnr.png",
    "/images/security/camara.png",
    "/images/security/fisio.png"
];

export default function SegurancaSection() {
    return (
        <section className="seguranca-section">

            <p>
               A assistência médica no decorrer da competição terá a colaboração da FisioSertã, clínica conceituada de Fisioterapia da Sertã, composta por fisioterapeutas com larga experiência na vertente desportiva. Terá ainda o suporte dos Bombeiros Voluntários da Sertã. A segurança do torneio será supervisionada pela GNR da Sertã
            </p>

            <div className="seguranca-logos">

                {partners.map((logo, index) => (
                    <img
                        key={index}
                        src={logo}
                        alt=""
                    />
                ))}

            </div>

        </section>
    );
}