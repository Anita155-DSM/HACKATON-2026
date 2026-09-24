import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Activación del Mock de Axios si la variable de entorno está en true
if (import.meta.env.VITE_USE_MOCK === "true") {
  import("./mocks/mockBackend.js");
  console.log("Ejecutando con Backend Simulado (Mock)");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
