import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  
  // Adaptamos el nombre al formato de tu base de datos
  const nombreMostrar = user?.nombre || user?.firstName || "Usuario";

  return (
    <header className="h-16 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300 border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white md:hidden transition-colors">
          <FaBars className="text-xl" />
        </button>
        <span className="text-gray-800 dark:text-white font-semibold hidden sm:block transition-colors">
          Sistema de Gestión
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/profile"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <FaUserCircle className="text-2xl text-gray-300 dark:text-gray-600 hover:text-blue-500 transition-colors" />
          <span className="font-medium text-sm">{nombreMostrar}</span>
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors text-sm font-medium border-l border-gray-200 dark:border-gray-700 pl-6"
        >
          <FaSignOutAlt /> Salir
        </button>
      </div>
    </header>
  );
}