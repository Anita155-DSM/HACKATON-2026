import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../lib/storage.js';
import { setRate, stop as stopSpeech } from '../lib/speech.js';
import { setSoundsEnabled, sounds } from '../lib/sounds.js';

// Preferencias de uso. Nunca pedimos diagnósticos: cada opción se llama por lo que hace
// y se guarda solo en este dispositivo (requisito funcional 5).
export const DEFAULT_PREFS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  textScale: 1, // 1 | 1.15 | 1.3 | 1.5
  contrast: false,
  voiceGuide: false,
  voiceRate: 1,
  sounds: true,
  focusMode: false,
  readableFont: false,
  reduceMotion: false,
  wifiOnly: false,
  uiLang: 'es', // idioma de la interfaz: 'es' | 'wichi'
  materialLang: 'es', // lengua preferida para los materiales
};

export const TEXT_SCALES = [
  { value: 1, label: 'Normal' },
  { value: 1.15, label: 'Grande' },
  { value: 1.3, label: 'Más grande' },
  { value: 1.5, label: 'Muy grande' },
];

const PreferencesContext = createContext(null);

const systemDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(() => ({ ...DEFAULT_PREFS, ...load('prefs', {}) }));
  const [systemIsDark, setSystemIsDark] = useState(systemDark);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const fn = (e) => setSystemIsDark(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const resolvedTheme = prefs.theme === 'system' ? (systemIsDark ? 'dark' : 'light') : prefs.theme;

  useEffect(() => {
    const d = document.documentElement;
    d.dataset.theme = resolvedTheme;
    const set = (key, on, value = 'on') => (on ? (d.dataset[key] = value) : delete d.dataset[key]);
    set('contrast', prefs.contrast, 'high');
    set('focus', prefs.focusMode);
    set('readable', prefs.readableFont);
    set('motion', prefs.reduceMotion, 'reduce');
    d.style.setProperty('--text-scale', prefs.textScale);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      m.setAttribute('content', resolvedTheme === 'dark' ? (prefs.contrast ? '#000000' : '#0B1B2B') : '#EEF5FF');
    });
    setRate(prefs.voiceRate);
    setSoundsEnabled(prefs.sounds);
    if (!prefs.voiceGuide) stopSpeech();
    save('prefs', prefs);
  }, [prefs, resolvedTheme]);

  const soundsRef = useRef(prefs.sounds);
  soundsRef.current = prefs.sounds;

  const setPref = useCallback((key, value) => {
    // Sonido de confirmación al prender o apagar una opción (si los sonidos están activos)
    if (typeof value === 'boolean') {
      const willSound = key === 'sounds' ? value : soundsRef.current;
      if (willSound) {
        setSoundsEnabled(true);
        (value ? sounds.toggleOn : sounds.toggleOff)();
      }
    }
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const reset = useCallback(() => setPrefs({ ...DEFAULT_PREFS }), []);

  const value = useMemo(() => ({ prefs, setPref, reset, resolvedTheme }), [prefs, setPref, reset, resolvedTheme]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export const usePreferences = () => useContext(PreferencesContext);
