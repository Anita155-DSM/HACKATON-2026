import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {Loading} from "../components/layout"; // Importamos tu componente

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras verifica el token en localStorage / backend
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
