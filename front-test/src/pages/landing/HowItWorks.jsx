import { FilePdf } from '@phosphor-icons/react';
import { APP_NAME } from '../../lib/config.js';

/* Maqueta de celular: es decorativa, la explicación real está en el texto de cada paso */
function Phone({ children }) {
  return (
    <div
      aria-hidden="true"
      data-nonessential
      className="mb-8 flex h-[24rem] w-56 flex-col overflow-hidden rounded-[2.5rem] border-[10px] border-ink bg-surface shadow-[0_16px_40px_rgb(var(--shadow-tint)/0.18)]"
    >
      <p className="mx-auto w-10/12 rounded-b-md bg-accent py-2.5 text-center text-[0.9rem] font-bold text-on-accent">{APP_NAME}</p>
      {children}
    </div>
  );
}

const PASOS = [
  {
    titulo: '1. El docente sube el material',
    texto: 'Un apunte, una foto o un PDF. Una sola vez.',
    maqueta: (
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-5 mt-2 text-[0.95rem] font-bold">Nuevo material</p>
        <div className="flex items-center justify-center gap-2 rounded-[var(--radius-control)] border-2 border-dashed border-control p-3 text-[0.85rem] text-ink-2">
          <FilePdf size={20} aria-hidden="true" />
          apunte.pdf
        </div>
        <p className="mt-auto rounded-[var(--radius-control)] bg-ink py-2.5 text-center text-[0.85rem] font-bold text-bg">Subir material</p>
      </div>
    ),
  },
  {
    titulo: '2. Se crean las versiones accesibles',
    texto: 'Texto claro, audio, lectura fácil y la traducción de la comunidad.',
    maqueta: (
      <div className="grid gap-3 p-4 pt-6">
        {['Texto', 'Audio', 'Lectura fácil', 'Wichí'].map((v) => (
          <p key={v} className="rounded-[var(--radius-control)] bg-tint-1 py-2.5 text-center text-[0.85rem] font-bold text-link">
            {v}
          </p>
        ))}
      </div>
    ),
  },
  {
    titulo: '3. El alumno lo usa sin internet',
    texto: 'Lo guarda una vez y lo lee o lo escucha donde esté.',
    maqueta: (
      <div className="flex flex-1 flex-col gap-4 p-5 pt-6">
        {['w-full', 'w-4/5', 'w-full', 'w-3/4'].map((w, i) => (
          <span key={i} className={`h-3 rounded-full bg-tint-1 ${w}`} />
        ))}
        <p className="mt-auto rounded-[var(--radius-control)] bg-ink py-2.5 text-center text-[0.85rem] font-bold text-bg">Sin internet ✓</p>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-t" className="bg-surface py-16 md:py-24">
      <div className="wrap grid justify-items-center">
        <p className="badge">Cómo funciona</p>
        <h2 id="como-t" className="display mt-5 text-center text-[1.9rem] md:text-[2.4rem]">
          Así funciona {APP_NAME}
        </h2>
        <p className="mt-3 text-[1.15rem] text-ink-2">Tres pasos, sin vueltas.</p>

        <ol className="mt-12 grid w-full max-w-5xl gap-12 md:grid-cols-3 md:gap-10">
          {PASOS.map((p) => (
            <li key={p.titulo} className="flex flex-col items-center text-center">
              <Phone>{p.maqueta}</Phone>
              <h3 className="text-[1.2rem] font-bold">{p.titulo}</h3>
              <p className="mt-2 max-w-[28ch] text-ink-2">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
