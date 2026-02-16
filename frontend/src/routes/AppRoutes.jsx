import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import RiskAnalysis from "../pages/RiskAnalysis";
import Forecast from "../pages/Forecast";
import AIRecommendations from "../pages/AIRecommendations";
import Reports from "../pages/Reports";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES — NO LAYOUT */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PRIVATE ROUTES — WITH LAYOUT */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/risk" element={<RiskAnalysis />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/ai" element={<AIRecommendations />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
