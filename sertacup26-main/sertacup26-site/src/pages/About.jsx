import { useState } from "react";
import "../styles/site.css";
import "../styles/style.css";

export default function StyleGuide() {
const [mobileMenu, setMobileMenu] = useState(false);
const [mobileSubmenu, setMobileSubmenu] = useState(false);

return ( <main className="style-guide">
  <section className="sg-section">
    <h1 className="sg-page-title">Sertã Cup Style Guide</h1>
    <p>
      Live documentation of the site's design system.
    </p>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Typography</h2>

    <div className="sg-stack">
      <div className="demo-h1">H1</div>
      <div className="demo-h2">H2</div>
      <div className="demo-h3">H3</div>
      <div className="demo-h4">H4</div>
      <div className="demo-h5">H5</div>
      <div className="demo-h6">H6</div>
      <div className="demo-h7">H7</div>
      <div className="demo-h8">H8</div>
      <div className="demo-h9">H9</div>
      <div className="demo-h10">H10</div>

      <div className="demo-body">
        Body text example
      </div>

      <div className="demo-caption">
        Caption example
      </div>
    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Colors</h2>

    <div className="color-grid">
      <div className="color-card color-main-black">main-black</div>
      <div className="color-card color-main-white">main-white</div>
      <div className="color-card color-overlay-black">overlay-black</div>
      <div className="color-card color-overlay-white">overlay-white</div>
      <div className="color-card color-live-red">live-red</div>
      <div className="color-card color-highlight-blue">highlight-blue</div>
    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Grid System</h2>

    <div className="grid-container sg-grid-demo">
      <div className="demo-box col-span-12">12</div>

      <div className="demo-box col-span-6">6</div>
      <div className="demo-box col-span-6">6</div>

      <div className="demo-box col-span-4">4</div>
      <div className="demo-box col-span-4">4</div>
      <div className="demo-box col-span-4">4</div>

      <div className="demo-box col-span-3">3</div>
      <div className="demo-box col-span-3">3</div>
      <div className="demo-box col-span-3">3</div>
      <div className="demo-box col-span-3">3</div>
    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Responsive Grid</h2>

    <div className="grid-container">
      <div className="demo-box col-span-4 md:col-span-4 sm:col-span-4">
        A
      </div>

      <div className="demo-box col-span-4 md:col-span-2 sm:col-span-4">
        B
      </div>

      <div className="demo-box col-span-4 md:col-span-2 sm:col-span-4">
        C
      </div>
    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Column Starts</h2>

    <div className="grid-container">
      <div className="demo-box col-span-4 col-start-5">
        start-5 span-4
      </div>
    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Navigation</h2>

    <div className="sg-dark">

      <div className="nav-demo">
        <a href="#" className="nav-item">Home</a>
        <a href="#" className="nav-item">Teams</a>

        <div className="dropdown">
          <span className="nav-item">Tournament</span>

          <div className="dropdown-content">
            <a href="#">Groups</a>
            <a href="#">Knockout</a>
            <a href="#">Final</a>
          </div>
        </div>

        <a href="#" className="nav-item">Contact</a>
      </div>

    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Mobile Navigation</h2>

    <button
      className="hamburger"
      onClick={() => setMobileMenu(!mobileMenu)}
    >
      ☰
    </button>

    <div className={`mobile-menu ${mobileMenu ? "show" : ""}`}>

      <a href="#">Home</a>

      <div className="dropdown-mobile">

        <span
          onClick={() =>
            setMobileSubmenu(!mobileSubmenu)
          }
        >
          Tournament
        </span>

        <div
          className={`mobile-submenu ${
            mobileSubmenu ? "show" : ""
          }`}
        >
          <a href="#">Groups</a>
          <a href="#">Knockout</a>
          <a href="#">Final</a>
        </div>

      </div>

    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Utilities</h2>

    <div className="utility-row">
      <div className="demo-box">Normal</div>
      <div className="demo-box disabled-link">Disabled</div>
      <div className="demo-box unClick">unClick</div>
    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Animations</h2>

    <div className="animation-row">

      <div className="demo-circle flicker-champs">
        Champs
      </div>

      <div className="demo-circle flicker-eu">
        EU
      </div>

      <div className="demo-circle flicker-conf">
        Conf
      </div>

      <div className="demo-circle flicker-fem">
        Fem
      </div>

      <div className="demo-circle glow-ring">
        Glow
      </div>

    </div>
  </section>

  <section className="sg-section">
    <h2 className="sg-title">Footer</h2>

    <footer className="site-footer">
      Footer Example
    </footer>
  </section>

</main>
);
}

