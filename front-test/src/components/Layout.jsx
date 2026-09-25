import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CloudSlash, Flask, X } from '@phosphor-icons/react';
import { useAnnouncer } from '../context/AnnouncerContext.jsx';
import { useApiMode, useOnline } from '../lib/hooks.js';
import { useT } from '../lib/i18n.js';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import { Loading } from './ui.jsx';

function StatusBars() {
  const online = useOnline();
  const mode = useApiMode();
  const { missing } = useT();
  const [demoHidden, setDemoHidden] = useState(false);

  return (
    <div className="grid">
      {!online && (
        <div role="status" className="border-b border-warn bg-warn-bg text-warn">
          <p className="wrap flex items-center gap-2 py-2 font-bold">
            <CloudSlash size={22} weight="bold" aria-hidden="true" />
            <span className="text-ink">Sin conexión. Podés seguir usando lo que está guardado en tu celular.</span>
          </p>
        </div>
      )}
      {mode === 'demo' && !demoHidden && (
        <div role="status" className="border-b border-line bg-surface-2" data-nonessential>
          <div className="wrap flex items-center gap-2 py-1.5 text-[0.9rem]">
            <Flask size={20} aria-hidden="true" className="shrink-0" />
            <p className="flex-1">
              <strong>Modo demostración.</strong> El servidor no respondió, así que usamos datos de ejemplo guardados en este dispositivo.
            </p>
            <button type="button" className="btn btn-ghost !min-h-10 !p-2" onClick={() => setDemoHidden(true)}>
              <X size={18} aria-hidden="true" />
              <span className="sr-only">Ocultar aviso de modo demostración</span>
            </button>
          </div>
        </div>
      )}
      {missing && (
        <div role="status" className="border-b border-line bg-soft text-[#0b2540] hc:bg-bg hc:text-ink">
          <p className="wrap py-2 text-[0.95rem]">
            <strong>Esta página todavía no está en wichí.</strong> La traducción la tiene que hacer o revisar una persona hablante de la
            comunidad. Por ahora se muestra en castellano.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const first = useRef(true);
  const { announce } = useAnnouncer();

  // Al cambiar de página: foco al contenido y anuncio del título (lectores de pantalla y guía de voz)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (location.hash) return;
    window.scrollTo(0, 0);
    const id = setTimeout(() => {
      mainRef.current?.focus({ preventScroll: true });
      const h1 = mainRef.current?.querySelector('h1');
      if (h1) announce(h1.innerText);
    }, 80);
    return () => clearTimeout(id);
  }, [location.pathname, location.hash, announce]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#contenido"
        className="sr-only-focusable fixed left-4 top-3 z-50 rounded-[var(--radius-control)] bg-accent px-4 py-3 font-bold text-on-accent"
      >
        Ir al contenido
      </a>
      <Header />
      <StatusBars />
      <main id="contenido" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Suspense
          fallback={
            <div className="wrap py-10">
              <Loading />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
