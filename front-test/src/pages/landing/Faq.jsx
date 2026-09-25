import { APP_NAME } from '../../lib/config.js';

const PREGUNTAS = [
  { q: '¿Tengo que registrarme?', a: 'El alumno no. Entra con el código del curso y usa los materiales. La cuenta es solo para docentes y traductores.' },
  { q: '¿Funciona sin internet?', a: 'Sí. Guardás el material una vez y lo leés o escuchás sin conexión.' },
  { q: '¿Quién traduce al wichí?', a: 'Una persona de la comunidad. El sistema no traduce solo: solo ayuda con el glosario citado.' },
  { q: '¿Me piden datos de salud?', a: `No. ${APP_NAME} nunca pide datos de salud ni un diagnóstico para activar una función.` },
];

export default function Faq() {
  return (
    <section id="preguntas" aria-labelledby="faq-t" className="py-16 md:py-24">
      <div className="wrap grid justify-items-center">
        <p className="badge">Preguntas</p>
        <h2 id="faq-t" className="display mt-5 text-center text-[1.9rem] md:text-[2.4rem]">
          Preguntas frecuentes
        </h2>

        <dl className="mt-12 grid w-full max-w-4xl gap-5 md:grid-cols-2">
          {PREGUNTAS.map((p) => (
            <div key={p.q} className="box grid content-start gap-2 p-6 md:p-7">
              <dt className="text-[1.15rem] font-bold">{p.q}</dt>
              <dd className="text-ink-2">{p.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
