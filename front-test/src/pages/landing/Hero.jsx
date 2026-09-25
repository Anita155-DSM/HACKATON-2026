import { Link } from 'react-router-dom';
import { ArrowRight, Bank, House, Student, UsersThree } from '@phosphor-icons/react';
import { APP_NAME } from '../../lib/config.js';
import { getCurso } from '../../lib/student.js';

const DATOS = [
  { icon: UsersThree, valor: '7,8 %', texto: 'se reconoce indígena (INDEC, Censo 2022)' },
  { icon: Bank, valor: '4', texto: 'pueblos originarios' },
  { icon: House, valor: '+320', texto: 'instituciones interculturales' },
  { icon: Student, valor: '34', texto: 'escuelas de Educación Especial' },
];

export default function Hero() {
  const curso = getCurso();

  return (
    <section id="inicio" aria-labelledby="hero-title" className="bg-surface py-14 md:py-20">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <div className="grid justify-items-start gap-6">
          <p className="badge rise">
            <House size={16} weight="bold" aria-hidden="true" />
            Portal educativo · Formosa
          </p>

          <h1 id="hero-title" className="rise display text-[2.3rem] leading-[1.08] md:text-[2.9rem] lg:text-[3.2rem] [animation-delay:60ms]">
            La educación formoseña,{' '}
            <em className="not-italic text-accent-strong hc:text-ink">sin barreras</em>
          </h1>

          <p className="rise max-w-[46ch] text-[1.15rem] text-ink-2 md:text-[1.25rem] [animation-delay:120ms]">
            {APP_NAME} convierte los materiales escolares en versiones accesibles: texto claro, audio, lectura fácil y wichí. Sirve para
            que cualquier estudiante de Formosa pueda aprender en su forma y en su lengua, también sin internet.
          </p>

          <div className="rise flex flex-wrap items-center gap-3 [animation-delay:180ms]">
            <Link to="/plataforma" className="btn btn-primary btn-lg">
              Entrar a la plataforma
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
            <a href="#problematica" className="btn btn-secondary btn-lg">
              Conocer la problemática
            </a>
          </div>

          {curso && (
            <p className="rise text-ink-2">
              Ya tenés guardado el curso <strong>{curso.name || curso.code}</strong>.{' '}
              <Link to="/mis-materiales" className="font-bold">
                Ir a mis materiales
              </Link>
            </p>
          )}
        </div>

        <div className="rise w-full [animation-delay:240ms]" data-nonessential>
          <div className="box grid gap-6 p-6 shadow-[0_8px_30px_rgb(var(--shadow-tint)/0.12)] md:p-8">
            <h2 className="display text-[1.6rem]">Formosa en números</h2>
            <dl className="grid grid-cols-2 gap-4">
              {DATOS.map((d) => (
                <div key={d.valor} className="grid content-start gap-1 rounded-[var(--radius-box)] bg-tint-1 p-5 hc:border-2 hc:border-ink">
                  <d.icon size={28} aria-hidden="true" className="mb-2 text-ink-2 hc:text-ink" />
                  <dt className="sr-only">{d.texto}</dt>
                  <dd className="grid gap-1">
                    <span className="text-[1.6rem] font-bold leading-none">{d.valor}</span>
                    <span className="text-[0.9rem] leading-tight text-ink-2">{d.texto}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-line pt-5 text-[0.95rem] text-ink-2">
              Fuentes: INDEC, Censo 2022 · Ley 26.206 de Educación Nacional · Ley 426 de Formosa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
