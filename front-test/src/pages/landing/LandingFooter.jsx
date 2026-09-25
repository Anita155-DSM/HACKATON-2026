import { Link } from 'react-router-dom';
import { APP_NAME, REPO_URL } from '../../lib/config.js';
import { PLATFORM_LINKS } from './links.js';

export default function LandingFooter() {
  return (
    <footer data-nonessential className="border-t border-line bg-surface pb-8 pt-14">
      <div className="wrap grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="grid content-start gap-3">
          <p className="brand text-[1.9rem] font-bold">{APP_NAME}</p>
          <p className="reading text-ink-2">
            Materiales escolares en versiones accesibles, para aprender en tu forma y en tu lengua. Formosa, Argentina.
          </p>
          <p>
            <a href={REPO_URL} rel="noreferrer" target="_blank">
              Código y contacto del equipo
            </a>
          </p>
        </div>

        <nav aria-label="La plataforma" className="grid content-start gap-2">
          <h2 className="font-bold">La plataforma</h2>
          <ul className="grid gap-1.5">
            <li>
              <Link to="/plataforma">Entrar a la plataforma</Link>
            </li>
            {PLATFORM_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Esta página" className="grid content-start gap-2">
          <h2 className="font-bold">Equipo</h2>
          <ul className="grid gap-1.5">
            <li className="text-ink-2">Drop_Table</li>
            <li>
              <Link to="/glosario#fuentes">Diccionarios wichí citados</Link>
            </li>
            <li>
              <a href="https://www.w3.org/TR/WCAG22/" rel="noreferrer" target="_blank">
                Pautas WCAG 2.2
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="wrap mt-10 grid gap-4 border-t border-line pt-6">
        <p className="text-[0.9rem] text-ink-2">
          Fuentes: INDEC, Censo 2022 · Ley 26.206 de Educación Nacional · Ley 426 de Formosa.
        </p>
        <p className="text-center text-[0.9rem] text-ink-2">
          © {new Date().getFullYear()} {APP_NAME} · Proyecto de la Hackatón 2026
        </p>
      </div>
    </footer>
  );
}
