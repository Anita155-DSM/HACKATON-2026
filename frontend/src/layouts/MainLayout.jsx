import { Outlet } from "react-router-dom";
import { Navbar, Sidebar, Footer } from "../components/layout";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Menú lateral fijo a la izquierda */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Contenedor derecho (Navbar + Contenido + Footer) */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar />
        
        {/* El área principal donde se inyecta Home.jsx o Usuarios.jsx */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
      
    </div>
  );
}