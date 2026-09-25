import {
  BookOpenText,
  CircleHalfTilt,
  ClosedCaptioning,
  SpeakerHigh,
  Target,
  TextAa,
  Translate,
  WifiSlash,
} from '@phosphor-icons/react';

const FUNCIONES = [
  { icon: SpeakerHigh, titulo: 'Leer en voz alta', desc: 'Escuchá cualquier texto, con la frase resaltada.' },
  { icon: TextAa, titulo: 'Letra más grande', desc: 'Agrandá todo sin que se pierda nada.' },
  { icon: CircleHalfTilt, titulo: 'Alto contraste', desc: 'Colores fáciles de ver y bordes marcados.' },
  { icon: BookOpenText, titulo: 'Lectura fácil', desc: 'Frases cortas y claras del mismo material.' },
  { icon: Target, titulo: 'Modo concentración', desc: 'Sin distracciones en la pantalla.' },
  { icon: ClosedCaptioning, titulo: 'Subtítulos', desc: 'Todo audio llega con su transcripción.' },
  { icon: WifiSlash, titulo: 'Sin internet', desc: 'Guardalo una vez y usalo sin señal.' },
  { icon: Translate, titulo: 'En wichí', desc: 'Traduce o revisa una persona de la comunidad.' },
];

export default function Features() {
  return (
    <section id="accesibilidad" aria-labelledby="acc-t" className="py-16 md:py-24">
      <div className="wrap grid justify-items-center">
        <p className="badge">Accesibilidad</p>
        <h2 id="acc-t" className="display mt-5 text-center text-[1.9rem] md:text-[2.4rem]">
          Pensado para cada persona
        </h2>
        <p className="mt-3 max-w-[48ch] text-center text-[1.15rem] text-ink-2">
          Cada quien activa lo que le sirve desde Ajustes. No hace falta explicar por qué.
        </p>

        <ul className="mt-12 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FUNCIONES.map((f) => (
            <li key={f.titulo} className="box box-hover grid content-start gap-2 p-6">
              <f.icon size={30} aria-hidden="true" className="mb-1" />
              <h3 className="text-[1.15rem] font-bold leading-tight">{f.titulo}</h3>
              <p className="text-ink-2">{f.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
