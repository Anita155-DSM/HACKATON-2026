import { Link } from "react-router-dom";
import { FaHome, FaBook } from "react-icons/fa";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-forma-dark/95 backdrop-blur-md border-b border-forma-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16 w-full">

          {/* LOGO */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-8 flex items-center justify-center text-forma-teal">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C10.34 2 9 3.34 9 5C9 6.66 10.34 8 12 8C13.66 8 15 6.66 15 5C15 3.34 13.66 2 12 2ZM16 10H8C5.79 10 4 11.79 4 14V22H6V16H18V22H20V14C20 11.79 18.21 10 16 10Z" />
              </svg>
            </div>
            <span className="text-xl font-serif tracking-wide text-white hidden sm:block">
              FormA
            </span>
          </div>

          {/* NAVEGACIÓN — solo dos botones */}
          <nav className="flex items-center gap-3" aria-label="Navegación principal">

            {/* Inicio → Landing "/" */}
            <Link
              to="/"
              aria-label="Ir al inicio"
              className="flex items-center gap-2 h-10 px-5 rounded-full border border-forma-teal/40 hover:bg-forma-card transition-colors text-sm font-medium text-white"
            >
              <FaHome className="text-forma-teal text-base" aria-hidden="true" />
              <span>Inicio</span>
            </Link>

            {/* Materiales Escolares → front-test "/app" */}
            <Link
              to="/app"
              aria-label="Ir a Materiales Escolares"
              className="flex items-center gap-2 h-10 px-5 rounded-full bg-forma-teal hover:bg-forma-tealHover transition-colors text-sm font-bold text-forma-dark"
            >
              <FaBook className="text-base" aria-hidden="true" />
              <span>Materiales Escolares</span>
            </Link>

          </nav>

        </div>

      </div>
    </header>
  );
}