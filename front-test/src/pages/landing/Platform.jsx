import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { PLATFORM_LINKS } from './links.js';

// La puerta de entrada: desde acá se llega a todo lo que tiene la plataforma.
export default function Platform() {
  return (
    <section id="plataforma" aria-labelledby="plat-t" className="border-y border-line bg-surface py-16 md:py-24">
      <div className="wrap">
        <div className="grid justify-items-start gap-5">
          <p className="badge">La plataforma</p>
          <h2 id="plat-t" className="display text-[1.9rem] md:text-[2.4rem]">
            Entrar a la plataforma
          </h2>
          <p className="max-w-[52ch] text-[1.15rem] text-ink-2">
            Elegí por dónde empezar. El alumno no necesita cuenta: entra con el código de su curso.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="box box-hover group grid h-full content-start gap-2 p-6 no-underline text-ink transition-transform hover:-translate-y-0.5"
              >
                <l.icon size={34} aria-hidden="true" className="mb-1" />
                <span className="flex items-center gap-2 text-[1.25rem] font-bold">
                  {l.label}
                  <ArrowRight size={20} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-ink-2">{l.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
