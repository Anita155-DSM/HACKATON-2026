import { Card } from "../../components/ui/index.js";
import { ToggleSwitch } from "../../components/ui/ToggleSwitch.jsx";
import { useSettings } from "../../hooks/useSettings.js";
import { playSound } from "../../helpers/sounds/audio.js";
import {
  FaSun, FaMoon, FaBell, FaShieldAlt,
  FaAdjust, FaVolumeUp, FaVolumeMute, FaBookReader, FaEnvelope, FaTextHeight
} from "react-icons/fa";
import Header from "../public/components/Header.jsx";

export default function Settings() {
  const {
    theme, handleThemeChange,
    contrast, toggleContrast,
    sounds, toggleSounds,
    volume, setVolume,
    readingMode, toggleReading,
    readingVolume, setReadingVolume,
    notifications, setNotifications,
    uiSize, setUiSize,
    speak
  } = useSettings();

  return (<>
    <Header />
    <div className="space-y-6 animate-fade-in mt-16 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Ajustes de Accesibilidad y Sistema</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Configura la plataforma para adaptarla a tus necesidades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* --- APARIENCIA --- */}
        <Card title="Apariencia">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 rounded-full transition-colors" aria-hidden="true">
                {theme === 'dark' ? <FaMoon /> : <FaSun />}
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Tema de la Interfaz</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Elige el esquema de colores.</p>
              </div>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <button
                onClick={() => handleThemeChange("light")}
                aria-pressed={theme === "light"}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === "light"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                <FaSun aria-hidden="true" /> Claro
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                aria-pressed={theme === "dark"}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === "dark"
                  ? "bg-gray-800 dark:bg-gray-700 shadow-sm text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                <FaMoon aria-hidden="true" /> Oscuro
              </button>
            </div>
          </div>
        </Card>

        {/* --- CONTRASTE Y TAMAÑO --- */}
        <Card title="Visibilidad">
          <div className="flex flex-col gap-4 py-2">
            {/* Alto Contraste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full transition-colors" aria-hidden="true">
                  <FaAdjust />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Alto Contraste</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Mejora la legibilidad de los textos.</p>
                </div>
              </div>
              <ToggleSwitch checked={contrast} onChange={toggleContrast} label="Alternar modo de alto contraste" />
            </div>

            {/* Tamaño de la Interfaz */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full transition-colors" aria-hidden="true">
                  <FaTextHeight />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Tamaño de la Interfaz</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Escala los textos y botones (0 al 3).</p>
                </div>
              </div>

              <div className="flex flex-col px-2">
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={uiSize}
                  onChange={(e) => setUiSize(parseInt(e.target.value))}
                  onMouseUp={() => speak(`Tamaño de interfaz ajustado al nivel ${uiSize}`)}
                  onTouchEnd={() => speak(`Tamaño de interfaz ajustado al nivel ${uiSize}`)}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                  aria-label="Ajustar tamaño de la interfaz"
                />
                <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 px-1">
                  <span className={uiSize === 0 ? "text-indigo-600 dark:text-indigo-400" : ""}>0</span>
                  <span className={uiSize === 1 ? "text-indigo-600 dark:text-indigo-400" : ""}>1</span>
                  <span className={uiSize === 2 ? "text-indigo-600 dark:text-indigo-400" : ""}>2</span>
                  <span className={uiSize === 3 ? "text-indigo-600 dark:text-indigo-400" : ""}>3</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* --- LECTURA --- */}
        <Card title="Asistencia">
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full transition-colors" aria-hidden="true">
                  <FaBookReader />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Lectura en Voz Alta</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">El sistema narrará las acciones.</p>
                </div>
              </div>
              <ToggleSwitch checked={readingMode} onChange={toggleReading} label="Alternar lectura en voz alta" />
            </div>

            {readingMode && (
              <div className="flex items-center gap-4 pl-[3.25rem] pr-2 animate-fade-in">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">0%</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={readingVolume}
                  onChange={(e) => setReadingVolume(parseFloat(e.target.value))}
                  onMouseUp={() => speak("Volumen ajustado", readingVolume)}
                  onTouchEnd={() => speak("Volumen ajustado", readingVolume)}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                  aria-label="Control de volumen de lectura"
                />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">
                  {Math.round(readingVolume * 100)}%
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* --- SONIDOS CON VOLUMEN --- */}
        <Card title="Audio">
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full transition-colors" aria-hidden="true">
                  {sounds ? <FaVolumeUp /> : <FaVolumeMute />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Efectos de Sonido</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Feedback sonoro en botones.</p>
                </div>
              </div>
              <ToggleSwitch checked={sounds} onChange={toggleSounds} label="Alternar efectos de sonido" />
            </div>

            {sounds && (
              <div className="flex items-center gap-4 pl-[3.25rem] pr-2 animate-fade-in">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">0%</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  onMouseUp={() => playSound('success')}
                  onTouchEnd={() => playSound('success')}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
                  aria-label="Control de volumen del sistema"
                />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* --- NOTIFICACIONES --- */}
        <Card title="Notificaciones">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full transition-colors" aria-hidden="true">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Alertas por Correo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Recibir resúmenes y novedades.</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notifications}
              onChange={() => {
                setNotifications(!notifications);
                speak(!notifications ? "Notificaciones activadas" : "Notificaciones desactivadas");
              }}
              label="Alternar notificaciones por correo"
            />
          </div>
        </Card>

        {/* --- SEGURIDAD --- */}
        <Card title="Seguridad">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-colors" aria-hidden="true">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Autenticación en 2 Pasos</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Protección adicional.</p>
              </div>
            </div>
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              onClick={() => speak("Configuración de seguridad no disponible.")}
            >
              Configurar
            </button>
          </div>
        </Card>

      </div>
    </div>
  </>);
}