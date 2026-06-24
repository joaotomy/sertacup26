import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import "../styles/site.css";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  return (
    <div className="layout">
      <header className="navbar">
        <div className="nav-wrapper">

          <div className="nav-section">
            <Link to="/info" className="nav-item disabled-link">INFORMAÇÕES</Link>

            <div className="dropdown">
              <Link to="/torneio" className="nav-item">TORNEIO</Link>

              <div className="dropdown-content">
                <Link to="/torneio?tab=calendario">Calendário</Link>
                <Link to="/torneio?tab=grupos">Grupos</Link>
                <Link to="/torneio?tab=fases-finais">Fases Finais</Link>
              </div>
            </div>
          </div>

          <div className="logo-container desktop-logo">
           <Link to="/"> 
              <img src="/images/logo.png" alt="logo" className="logo" />
           </Link>
          </div>

          <div className="nav-section">
            <Link to="/historia" className="nav-item">HISTÓRIA</Link>
            <Link to="/patrocinadores" className="nav-item">PATROCINADORES</Link>
          </div>
        </div>
      </header>

      {/* mobile */}
      <div className="mobile-top">
        {/* <Link to="/"> */}
          <img src="/images/logo.png" className="logo-mobile" />
       {/* </Link> */}
      </div>

      <div className="mobile-bottom">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/info" className="disabled-link">INFORMAÇÕES</Link>

          <div className="dropdown-mobile">
            <span onClick={() => setSubOpen(!subOpen)}>TORNEIO</span>

            {subOpen && (
              <div className="mobile-submenu">
                <Link to="/torneio?tab=calendario">Calendário</Link>
                <Link to="/torneio?tab=grupos">Grupos</Link>
                <Link to="/torneio?tab=fases-finais">Fases Finais</Link>
              </div>
            )}
          </div>

          <Link to="/historia" className="disabled-link">HISTÓRIA</Link>
          <Link to="/patrocinadores" className="disabled-link">PATROCINADORES</Link>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Sertã Cup</p>
      </footer>
    </div>
  );
}