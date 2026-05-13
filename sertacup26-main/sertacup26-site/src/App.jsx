import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/site.css";
import "./styles/index.css";

import Home from "./pages/Home";
import Info from "./pages/Info";
import Torneio from "./pages/Torneio";
import Historia from "./pages/Historia";
import Patrocinadores from "./pages/Patrocinadores";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="info" element={<Info />} />
        <Route path="torneio" element={<Torneio />} />
        <Route path="historia" element={<Historia />} />
        <Route path="patrocinadores" element={<Patrocinadores />} />
      </Route>
    </Routes>
  );
}