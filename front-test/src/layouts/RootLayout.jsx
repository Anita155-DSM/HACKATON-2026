import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";

export default function RootLayout() {
    const [isLupaActive, setIsLupaActive] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const toggleLupa = () => {
        setIsLupaActive(!isLupaActive);
        if (!isLupaActive) {
            setMousePos({ x: 50, y: 50 }); // Centramos al desactivar
        }
    };

    const handleMouseMove = (e) => {
        if (!isLupaActive) return;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
    };

    return (
        <div
            className="relative w-full min-h-screen overflow-x-hidden bg-forma-dark"
            onMouseMove={handleMouseMove}
        >
            {/* BOTÓN FLOTANTE GLOBAL DE LA LUPA */}
            {/* Usamos z-[9999] y fixed para que siempre esté por encima de todo el sitio */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
                <button
                    onClick={toggleLupa}
                    aria-label={isLupaActive ? "Desactivar Lupa" : "Activar Lupa"}
                    title={isLupaActive ? "Desactivar Lupa" : "Activar Lupa"}
                    className={`p-4 rounded-full shadow-2xl transition-all focus:ring-4 focus:outline-none flex items-center justify-center ${isLupaActive
                            ? "bg-forma-teal text-forma-dark hover:bg-forma-tealHover focus:ring-forma-teal/50"
                            : "bg-forma-dark text-white border border-forma-teal/50 hover:bg-forma-card focus:ring-forma-teal/50"
                        }`}
                >
                    {isLupaActive ? <FaSearchMinus aria-hidden="true" className="text-xl" /> : <FaSearchPlus aria-hidden="true" className="text-xl" />}
                </button>
            </div>

            {/* CONTENEDOR DE ZOOM GLOBAL */}
            <div
                className="flex flex-col flex-1 w-full min-h-screen transition-transform ease-out duration-100"
                style={
                    isLupaActive
                        ? {
                            transform: "scale(2.5)",
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                            cursor: "zoom-in"
                        }
                        : {
                            transform: "scale(1)",
                            transformOrigin: "50% 50%"
                        }
                }
            >
                {/* Aquí adentro se renderizarán la Landing, el AuthLayout o el MainLayout */}
                <Outlet />
            </div>

        </div>
    );
}