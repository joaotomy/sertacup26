import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/site.css";
import "./styles/hero.css";

import Home from "./pages/Home";
import Info from "./pages/Info/Info";
import Torneio from "./pages/Torneio";
import Historia from "./pages/Historia";
import Patrocinadores from "./pages/Patrocinadores";
import GameHomepage from "./pages/GameHomepage";
import About from "./pages/About";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="info" element={<Info />} />
        <Route path="torneio" element={<Torneio />} />
        <Route path="historia" element={<Historia />} />
        <Route path="patrocinadores" element={<Patrocinadores />} />
        <Route path="jogo" element={<GameHomepage />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}