import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';
import { say } from '../lib/speech.js';
import { sounds } from '../lib/sounds.js';
import { usePreferences } from './PreferencesContext.jsx';

// Avisos: siempre visuales, con sonido si está activado y con voz si la guía de voz está activa.
// Sin tiempo límite para los errores: se quedan hasta que la persona los cierra (WCAG 2.2.1).

const AnnouncerContext = createContext(null);

const ICONS = { success: CheckCircle, error: WarningCircle, info: Info };
const STYLES = {
  success: 'border-ok bg-ok-bg text-ok',
  error: 'border-danger bg-danger-bg text-danger',
  info: 'border-control bg-surface text-ink',
};

export function AnnouncerProvider({ children }) {
  const { prefs } = usePreferences();
  const [toasts, setToasts] = useState([]);
  const [politeMsg, setPoliteMsg] = useState('');
  const idRef = useRef(0);
  const voiceRef = useRef(prefs.voiceGuide);
  voiceRef.current = prefs.voiceGuide;

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback(
    (message, type = 'info') => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-2), { id, message, type }]);
      (sounds[type] || sounds.info)();
      if (voiceRef.current) say(message);
      if (type !== 'error') setTimeout(() => dismiss(id), 7000);
    },
    [dismiss],
  );

  // Anuncio solo para lectores de pantalla y guía de voz (sin caja visual)
  const announce = useCallback((message, { speak = true } = {}) => {
    setPoliteMsg('');
    requestAnimationFrame(() => setPoliteMsg(message));
    if (speak && voiceRef.current) say(message);
  }, []);

  const value = useMemo(() => ({ notify, announce, dismiss }), [notify, announce, dismiss]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMsg}
      </div>
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 p-4 pointer-events-none"
        role="region"
        aria-label="Avisos"
      >
        <div aria-live="polite" className="w-full max-w-md flex flex-col gap-2">
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <div
                key={t.id}
                role={t.type === 'error' ? 'alert' : 'status'}
                className={`rise pointer-events-auto flex items-start gap-3 rounded-[var(--radius-box)] border-2 p-4 shadow-[0_12px_32px_rgb(var(--shadow-tint)/0.18)] ${STYLES[t.type]}`}
              >
                <Icon size={28} weight="fill" aria-hidden="true" className="shrink-0" />
                <p className="flex-1 font-bold text-ink">{t.message}</p>
                <button type="button" className="btn btn-ghost -m-2 !min-h-11 !min-w-11 !p-2" onClick={() => dismiss(t.id)}>
                  <X size={22} aria-hidden="true" />
                  <span className="sr-only">Cerrar aviso</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AnnouncerContext.Provider>
  );
}

export const useAnnouncer = () => useContext(AnnouncerContext);

// Guía de voz: al moverse con teclado o tocar un control, dice qué es.
export function VoiceGuide() {
  const { prefs } = usePreferences();
  useEffect(() => {
    if (!prefs.voiceGuide) return undefined;
    let last = null;
    const onFocus = (e) => {
      const el = e.target;
      if (!(el instanceof HTMLElement) || el === last) return;
      last = el;
      const text = describe(el);
      if (text) say(text);
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, [prefs.voiceGuide]);
  return null;
}

function describe(el) {
  if (el.id === 'contenido') return '';
  const labelledby = el.getAttribute('aria-labelledby');
  let name =
    el.getAttribute('aria-label') ||
    (labelledby && labelledby.split(' ').map((id) => document.getElementById(id)?.innerText || '').join(' ')) ||
    (el.labels?.[0]?.innerText ?? '') ||
    el.innerText ||
    el.getAttribute('title') ||
    el.getAttribute('placeholder') ||
    '';
  name = name.replace(/\s+/g, ' ').trim().slice(0, 140);
  const role = el.getAttribute('role');
  const tag = el.tagName.toLowerCase();
  let kind = '';
  if (role === 'switch') kind = el.getAttribute('aria-checked') === 'true' ? 'interruptor, activado' : 'interruptor, desactivado';
  else if (role === 'tab') kind = el.getAttribute('aria-selected') === 'true' ? 'pestaña, elegida' : 'pestaña';
  else if (tag === 'a') kind = 'enlace';
  else if (tag === 'button') kind = el.getAttribute('aria-pressed') === 'true' ? 'botón, activado' : 'botón';
  else if (tag === 'select') kind = 'lista para elegir';
  else if (tag === 'textarea') kind = 'campo para escribir';
  else if (tag === 'input') {
    const type = el.getAttribute('type');
    if (type === 'radio') kind = el.checked ? 'opción, elegida' : 'opción';
    else if (type === 'checkbox') kind = el.checked ? 'casilla, marcada' : 'casilla, sin marcar';
    else if (type === 'file') kind = 'botón para elegir archivo';
    else kind = 'campo para escribir';
  }
  if (!name) return kind;
  return kind ? `${name}. ${kind}` : name;
}
