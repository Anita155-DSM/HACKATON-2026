import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { GearSix, List, SpeakerHigh, StopCircle, X } from '@phosphor-icons/react';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { APP_NAME } from '../lib/config.js';
import { useT } from '../lib/i18n.js';
import { canSpeak, readText, stop } from '../lib/speech.js';
import { getCurso } from '../lib/student.js';
import PreferencesPanel from './PreferencesPanel.jsx';

function Logo() {
  return (
    <Link
      to="/?inicio=1"
      className="flex min-w-0 items-center gap-2.5 rounded-[var(--radius-control)] py-1 font-bold no-underline text-ink"
    >
      <img src="/icon.svg" alt="" width="40" height="40" className="size-10 shrink-0 rounded-[12px]" />
      <span className="truncate text-[1.3rem] tracking-tight">{APP_NAME}</span>
    </Link>
  );
}

function LanguageSelect({ id }) {
  const { prefs, setPref } = usePreferences();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="sr-only">
        Idioma de la página
      </label>
      <select
        id={id}
        value={prefs.uiLang}
        onChange={(e) => setPref('uiLang', e.target.value)}
        className="input !min-h-11 !w-auto !py-1.5 text-[0.95rem] font-bold"
      >
        <option value="es">Castellano</option>
        <option value="wichi">Wichí</option>
      </select>
    </div>
  );
}

export default function Header() {
  const { t } = useT();
  const location = useLocation();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const readerRef = useRef(null);
  const tieneCurso = Boolean(getCurso());

  // Al cambiar de página se corta la lectura y se cierra el menú
  useEffect(() => {
    readerRef.current?.stop();
    setReading(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleListen = () => {
    if (reading) {
      readerRef.current?.stop();
      stop();
      setReading(false);
      return;
    }
    const main = document.getElementById('contenido');
    if (!main) return;
    setReading(true);
    readerRef.current = readText(main.innerText, { onEnd: () => setReading(false) });
  };

  const links = [
    tieneCurso ? { to: '/mis-materiales', label: t('nav.misMateriales') } : null,
    { to: '/biblioteca', label: t('nav.biblioteca') },
    { to: '/traducir', label: t('nav.traducir') },
    { to: '/docente', label: 'Docentes' },
  ].filter(Boolean);

  const navClass = ({ isActive }) =>
    `whitespace-nowrap rounded-[var(--radius-control)] px-2.5 py-2 font-bold no-underline ${
      isActive ? 'bg-soft text-[#0b2540] hc:bg-ink hc:text-bg' : 'text-ink hover:bg-surface-2'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85 hc:bg-bg">
      <div className="wrap flex h-[4.1rem] items-center gap-2">
        <Logo />

        <nav aria-label="Principal" className="ml-5 hidden items-center gap-0.5 lg:flex focus-mode:!hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden xl:block">
            <LanguageSelect id="lang-desktop" />
          </div>
          {canSpeak && (
            <button
              type="button"
              className="btn btn-ghost !px-3 max-sm:hidden"
              onClick={toggleListen}
              aria-pressed={reading}
              aria-label={reading ? t('header.detener') : t('header.escuchar')}
            >
              {reading ? <StopCircle size={26} weight="fill" aria-hidden="true" /> : <SpeakerHigh size={26} aria-hidden="true" />}
              <span className="hidden 2xl:inline">{reading ? t('header.detener') : t('header.escuchar')}</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary !px-3"
            onClick={() => setPrefsOpen(true)}
            aria-haspopup="dialog"
          >
            <GearSix size={26} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{t('header.preferencias')}</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost !px-3 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} aria-hidden="true" /> : <List size={26} aria-hidden="true" />}
            <span className="sr-only">Menú</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="menu-movil" className="border-t border-line bg-surface lg:hidden">
          <nav aria-label="Principal" className="wrap grid gap-1 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                <span className="block py-1.5">{l.label}</span>
              </NavLink>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <LanguageSelect id="lang-mobile" />
              {canSpeak && (
                <button type="button" className="btn btn-secondary sm:hidden" onClick={toggleListen} aria-pressed={reading}>
                  {reading ? <StopCircle size={24} weight="fill" aria-hidden="true" /> : <SpeakerHigh size={24} aria-hidden="true" />}
                  {reading ? t('header.detener') : t('header.escuchar')}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
      <PreferencesPanel open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </header>
  );
}
