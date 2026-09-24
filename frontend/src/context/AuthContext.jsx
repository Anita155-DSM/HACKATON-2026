import { createContext, useState, useEffect } from "react";
import { validarTokenService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const revisarSesion = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Llamada limpia al servicio (que será interceptada por el mock)
        const datosuser = await validarTokenService();
        setUser(datosuser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Fallo al validar la sesión:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    revisarSesion();
  }, []);

  const login = (datosuser, tokenRecibido) => {
    localStorage.setItem("token", tokenRecibido);
    setUser(datosuser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
