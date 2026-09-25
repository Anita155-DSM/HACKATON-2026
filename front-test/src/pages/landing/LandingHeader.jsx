import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GearSix, List, SignIn, SpeakerHigh, StopCircle, X } from '@phosphor-icons/react';
import PreferencesPanel from '../../components/PreferencesPanel.jsx';
import { APP_NAME } from '../../lib/config.js';
import { canSpeak, readText, stop } from '../../lib/speech.js';
import { PLATFORM_LINKS, SECTION_LINKS } from './links.js';

// Barra de la portada: las anclas de la página y, en el menú, todo lo que tiene la plataforma.
export default function LandingHeader() {
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const readerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => () => readerRef.current?.stop(), []);

  // El menú se cierra con Escape o al tocar fuera
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onClick);
    };
  }, [menuOpen]);

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

  return (
    <>
      <header className="site-header sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85 hc:bg-bg">
        <div className="wrap flex h-[4.1rem] items-center gap-2">
          <Link to="/" className="brand flex shrink-0 items-center gap-2.5 py-1 text-[1.35rem] no-underline text-ink">
            <img src="/icon.svg" alt="" width="40" height="40" className="size-10 shrink-0 rounded-[12px]" />
            <span className="max-sm:sr-only">{APP_NAME}</span>
          </Link>

          <nav aria-label="Secciones de esta página" className="ml-4 hidden min-w-0 items-center overflow-hidden xl:flex">
            {SECTION_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="whitespace-nowrap rounded-[var(--radius-pill)] px-2.5 py-2 text-[0.9rem] font-bold no-underline text-ink hover:bg-surface-2"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {canSpeak && (
              <button
                type="button"
                className="btn btn-ghost !px-3"
                onClick={toggleListen}
                aria-pressed={reading}
                aria-label={reading ? 'Detener la lectura' : 'Escuchar esta página'}
              >
                {reading ? <StopCircle size={26} weight="fill" aria-hidden="true" /> : <SpeakerHigh size={26} aria-hidden="true" />}
                <span className="hidden 2xl:inline">{reading ? 'Detener' : 'Escuchar esta página'}</span>
              </button>
            )}
            <button type="button" className="btn btn-ghost !px-3" onClick={() => setPrefsOpen(true)} aria-haspopup="dialog">
              <GearSix size={26} aria-hidden="true" />
              <span className="sr-only 2xl:not-sr-only">Ajustes</span>
            </button>

            <Link to="/plataforma" className="btn btn-primary max-sm:!px-3">
              <SignIn size={22} aria-hidden="true" />
              <span className="max-sm:sr-only">Entrar</span>
              <span className="hidden 2xl:inline">a la plataforma</span>
            </Link>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                className="btn btn-secondary !px-3"
                aria-expanded={menuOpen}
                aria-controls="menu-portada"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={26} aria-hidden="true" /> : <List size={26} aria-hidden="true" />}
                <span className="sr-only">Menú</span>
              </button>

              {menuOpen && (
                <div
                  id="menu-portada"
                  className="box absolute right-0 top-[calc(100%+0.6rem)] z-40 w-[min(22rem,calc(100vw-2rem))] p-3 shadow-[0_18px_50px_rgb(var(--shadow-tint)/0.35)]"
                >
                  <p className="px-3 pb-2 pt-1 text-[0.85rem] font-bold uppercase tracking-wider text-ink-2">La plataforma</p>
                  <ul className="grid gap-0.5">
                    {PLATFORM_LINKS.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 font-bold no-underline text-ink hover:bg-surface-2"
                        >
                          <l.icon size={24} aria-hidden="true" />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 border-t border-line px-3 pb-2 pt-3 text-[0.85rem] font-bold uppercase tracking-wider text-ink-2 xl:hidden">
                    Esta página
                  </p>
                  <ul className="grid gap-0.5 xl:hidden">
                    {SECTION_LINKS.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-[var(--radius-control)] px-3 py-2.5 font-bold no-underline text-ink hover:bg-surface-2"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 border-t border-line pt-3">
                    <Link to="/plataforma" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
                      Entrar a la plataforma
                      <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <PreferencesPanel open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </>
  );
}
