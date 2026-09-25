import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Importamos los Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// Importación corregida apuntando a la carpeta SRC
import Landing from "../pages/public/Landing.jsx";
import { Login, Register } from "../features/auth/pages/index.js";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings.jsx";
import RootLayout from "../layouts/RootLayout.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>


        {/* RUTA DE INICIO (Completamente libre de Layouts para que ocupe el 100% de la pantalla) */}
        <Route path="/" element={<Landing />} />

        {/* RUTAS PÚBLICAS DE AUTENTICACIÓN (Envueltas en AuthLayout) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* RUTAS PRIVADAS */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Ruta comodín (Error 404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}