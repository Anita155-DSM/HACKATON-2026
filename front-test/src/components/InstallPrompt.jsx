import { useEffect, useState } from 'react';
import { DeviceMobile, Export, PlusSquare } from '@phosphor-icons/react';

// "Agregar a pantalla de inicio" (sección 7). En Android con Chrome usamos el aviso del navegador.
// En iPhone no existe ese aviso: mostramos los pasos a mano (Compartir, Agregar a inicio).

let deferred = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
  });
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export default function InstallPrompt() {
  const [canPrompt, setCanPrompt] = useState(Boolean(deferred));
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onPrompt = () => setCanPrompt(true);
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  if (canPrompt && deferred) {
    return (
      <div className="box flex flex-wrap items-center gap-4 p-5" data-nonessential>
        <DeviceMobile size={32} aria-hidden="true" />
        <p className="min-w-[12rem] flex-1">Poné el ícono en la pantalla de inicio para abrir tus materiales con un toque.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            deferred.prompt();
            await deferred.userChoice;
            deferred = null;
            setCanPrompt(false);
          }}
        >
          <PlusSquare size={22} aria-hidden="true" />
          Agregar a inicio
        </button>
      </div>
    );
  }

  if (isIOS()) {
    return (
      <details className="box p-5" data-nonessential>
        <summary className="cursor-pointer font-bold">Poner el ícono en la pantalla de inicio (iPhone)</summary>
        <ol className="mt-3 list-decimal grid gap-2 pl-6">
          <li>
            Abrí esta página en Safari y tocá <Export size={20} className="inline" aria-label="Compartir" />.
          </li>
          <li>Elegí "Agregar a inicio".</li>
          <li>Tocá "Agregar". Si no la usás por mucho tiempo, el iPhone puede borrar lo guardado.</li>
        </ol>
      </details>
    );
  }
  return null;
}
