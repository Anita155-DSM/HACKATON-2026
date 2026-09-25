import { APP_NAME } from '../../lib/config.js';

const GRUPOS = [
  {
    titulo: 'Comunidades indígenas',
    barrera: 'Barrera: el idioma',
    puntos: ['Los materiales llegan solo en castellano.', 'Hay pocos recursos en su lengua.', 'Cuesta seguir la clase sin apoyo.'],
    respuesta: 'Suma traducciones hechas por una persona de la comunidad y audio para escuchar el material.',
  },
  {
    titulo: 'Estudiantes del interior',
    barrera: 'Barrera: la conectividad',
    puntos: ['Poca señal o nada de internet.', 'Archivos pesados que no bajan.', 'Videos que no cargan.'],
    respuesta: 'Arma versiones livianas. Se descargan una vez y se usan sin internet.',
  },
  {
    titulo: 'Docentes del interior',
    barrera: 'Barrera: el tiempo',
    puntos: ['Cuesta subir y compartir materiales.', 'Poco tiempo para adaptar cada uno.', 'Falta una herramienta simple.'],
    respuesta: `El docente sube el material una vez. ${APP_NAME} crea las versiones accesibles.`,
  },
];

export default function Problem() {
  return (
    <section id="problematica" aria-labelledby="problema-t" className="border-y border-line py-16 md:py-24">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="grid justify-items-start gap-5">
            <p className="badge">Nuestra problemática</p>
            <h2 id="problema-t" className="display max-w-[20ch] text-[1.9rem] leading-tight md:text-[2.4rem]">
              Barreras de accesibilidad en contenidos y recursos digitales
            </h2>
          </div>
          <p className="max-w-[52ch] text-[1.15rem] text-ink-2 lg:self-end">
            Las personas tienen distintas capacidades, contextos y formas de usar la tecnología. La mayoría de los contenidos escolares no
            contempla esas diferencias, y quien queda afuera pierde el acceso a la clase.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {GRUPOS.map((g) => (
            <li key={g.titulo} className="grid content-start gap-4 rounded-[var(--radius-box)] bg-tint-1 p-6 md:p-8 hc:border-2 hc:border-ink">
              <div className="grid gap-1">
                <h3 className="text-[1.4rem] font-bold">{g.titulo}</h3>
                <p className="font-bold text-link">{g.barrera}</p>
              </div>
              <ul className="grid gap-2 text-ink-2">
                {g.puntos.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="box mt-2 grid gap-2 p-5">
                <h4 className="font-bold">Qué hace {APP_NAME}</h4>
                <p className="text-ink-2">{g.respuesta}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
