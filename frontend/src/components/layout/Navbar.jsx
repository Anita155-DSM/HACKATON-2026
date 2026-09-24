import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 md:hidden">
          <FaBars className="text-xl" />
        </button>
        <span className="text-gray-800 font-semibold hidden sm:block">
          Sistema de Gestión
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/profile"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <FaUserCircle className="text-2xl text-gray-300 hover:text-blue-500 transition-colors" />
          <span className="font-medium text-sm">{user?.nombre}</span>
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors text-sm font-medium border-l border-gray-200 pl-6"
        >
          <FaSignOutAlt /> Salir
        </button>
      </div>
    </header>
  );
}
