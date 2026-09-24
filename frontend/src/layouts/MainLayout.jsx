import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaExpand, FaCompress } from "react-icons/fa";
import { Navbar, Sidebar, Footer } from "../components/layout";

export default function MainLayout() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Botón flotante para el Modo Foco */}
      <button
        onClick={toggleFocusMode}
        aria-label={isFocusMode ? "Salir del modo foco" : "Entrar al modo foco"}
        title={isFocusMode ? "Salir del modo foco" : "Entrar al modo foco"}
        className="absolute bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        {/* Corregido el prop text-xl a className="text-xl" */}
        {isFocusMode ? <FaCompress aria-hidden="true" className="text-xl" /> : <FaExpand aria-hidden="true" className="text-xl" />}
      </button>

      {/* Menú lateral: Se oculta si isFocusMode es true */}
      <div className={`hidden md:block transition-all duration-300 ${isFocusMode ? '-ml-64' : 'ml-0'}`}>
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300">
        {/* Navbar: Se oculta si isFocusMode es true */}
        <div className={`transition-all duration-300 ${isFocusMode ? '-mt-16 h-0 opacity-0' : 'h-16 opacity-100'}`}>
          <Navbar />
        </div>

        {/* Agregado explícitamente el bg oscuro al main para asegurar que cubra la pantalla */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer: Se oculta si isFocusMode es true */}
        {!isFocusMode && <Footer />}
      </div>

    </div>
  );
}