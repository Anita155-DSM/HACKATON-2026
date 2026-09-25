import { useState, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

export const useSettings = () => {
  const { theme, setTheme } = useThemeStore();

  const [contrast, setContrast] = useState(() => localStorage.getItem("contrast") === "true");
  const [sounds, setSounds] = useState(() => localStorage.getItem("sounds") !== "false");
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem("readingMode") === "true");
  
  const [readingVolume, setReadingVolume] = useState(() => {
    const saved = localStorage.getItem("readingVolume");
    return saved !== null ? parseFloat(saved) : 1;
  });

  const [notifications, setNotifications] = useState(() => localStorage.getItem("notifications") !== "false");

  useEffect(() => {
    localStorage.setItem("contrast", contrast);
    if (contrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [contrast]);

  useEffect(() => { localStorage.setItem("sounds", sounds); }, [sounds]);
  useEffect(() => { localStorage.setItem("volume", volume); }, [volume]);
  useEffect(() => { localStorage.setItem("readingMode", readingMode); }, [readingMode]);
  useEffect(() => { localStorage.setItem("readingVolume", readingVolume); }, [readingVolume]);
  useEffect(() => { localStorage.setItem("notifications", notifications); }, [notifications]);

  const speak = (text, forceVolume = null) => {
    if (readingMode && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.volume = forceVolume !== null ? forceVolume : readingVolume;
      utterance.pitch = 1.3;
      utterance.rate = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const vozClara = voices.find(v => v.name.includes("Google") && v.lang.includes("es"));
      if (vozClara) utterance.voice = vozClara;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    speak(newTheme === "dark" ? "Modo oscuro activado" : "Modo claro activado");
  };

  const toggleContrast = () => {
    setContrast(!contrast);
    speak(!contrast ? "Alto contraste activado" : "Alto contraste desactivado");
  };

  const toggleSounds = () => {
    setSounds(!sounds);
    speak(!sounds ? "Sonidos del sistema activados" : "Sonidos del sistema desactivados");
  };

  const toggleReading = () => {
    const newState = !readingMode;
    setReadingMode(newState);
    if (newState && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Modo de lectura en voz alta activado");
      utterance.lang = "es-ES";
      utterance.volume = readingVolume;
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    theme, handleThemeChange,
    contrast, toggleContrast,
    sounds, toggleSounds,
    volume, setVolume,
    readingMode, toggleReading,
    readingVolume, setReadingVolume,
    notifications, setNotifications,
    speak
  };
};