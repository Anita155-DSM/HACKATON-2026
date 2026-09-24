import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  // Seguridad: Evita que intentes usar el hook fuera del proveedor
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context; // Devuelve { user, isAuthenticated, loading, login, logout }
};
