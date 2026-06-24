import "../styles/site.css";
import "../styles/hero.css";

export default function HomePage() {
  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{
          backgroundImage: "url('/images/hero/herobg1.jpg')",
        }}
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-title">V SERTÃ CUP</div>

        <div className="hero-bottom">
          <div className="hero-subtitle">25 A 28 JUNHO</div>

          <a className="cta" href="/torneio?tab=calendario">
            EM DIRETO
          </a>
        </div>
      </div>

      {/*
        CAROUSEL VERSION

        const slides = [
          "/images/hero/herobg1.png",
          "/images/hero/herobg2.png",
          "/images/hero/herobg3.png",
        ];

        const [currentSlide, setCurrentSlide] = useState(0);

        useEffect(() => {
          const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
          }, 6000);

          return () => clearInterval(interval);
        }, []);

        Then replace:

        backgroundImage: "url('/images/hero/herobg1.png')"

        with:

        backgroundImage: `url(${slides[currentSlide]})`
      */}
    </section>
  );
}