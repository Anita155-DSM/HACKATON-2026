import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Importamos los Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Descomentamos e importamos las páginas que ya creamos
import Settings from "../pages/settings/Settings";
import Profile from "../pages/profile/Profile";
import Home from "../pages/home/Home";
import Login from "../features/auth/pages/Login";
import Users from "../pages/users/Users";

export default function AppRouter() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route element={<AuthLayout />}>
        {/* Descomentamos la ruta de login */}
        <Route path="/login" element={<Login />} />
      </Route>

      {/* RUTAS PRIVADAS */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Ruta comodín (Error 404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
