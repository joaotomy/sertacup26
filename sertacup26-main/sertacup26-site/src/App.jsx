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
import AdminJogo from "./pages/AdminJogo";
import AdminDashboard from "./pages/AdminDashboard";
import Inscricao from "./pages/Inscricao";
import LoginEquipas from "./pages/LoginEquipas";
import DashboardEquipa from "./pages/DashboardEquipa";
import { TeamGuard, JogadoresEquipa, DescobrirSerta, HorarioEquipa } from "./pages/EquipaPages";

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
        <Route path="inscricao" element={<Inscricao />} />
        <Route path="login-equipas" element={<LoginEquipas />} />
        <Route path="dashboard-equipa" element={<DashboardEquipa />} />
        <Route path="equipa/jogadores" element={<TeamGuard><JogadoresEquipa /></TeamGuard>} />
        <Route path="equipa/descobrir-serta" element={<TeamGuard><DescobrirSerta /></TeamGuard>} />
        <Route path="equipa/horario" element={<TeamGuard><HorarioEquipa /></TeamGuard>} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/game/:id" element={<AdminJogo />} />
      </Route>
    </Routes>
  );
}
