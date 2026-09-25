import { Link } from 'react-router-dom';
import { APP_NAME, REPO_URL } from '../lib/config.js';

// Los enlaces a los diccionarios wichí están en el documento base; agregarlos en
// data/glossary.js (GLOSSARY_SOURCES) para que aparezcan en /glosario#fuentes.
const FUENTES = [
  { label: 'Pautas WCAG 2.2', href: 'https://www.w3.org/TR/WCAG22/' },
  { label: 'Diseño Universal para el Aprendizaje', href: 'https://udlguidelines.cast.org/' },
];

export default function Footer() {
  return (
    <footer data-nonessential className="mt-20 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid content-start gap-3">
          <p className="brand text-[1.75rem] font-bold">{APP_NAME}</p>
          <p className="reading text-ink-2">
            Proyecto de la Hackatón 2026 sobre accesibilidad educativa en Formosa. Las traducciones y el glosario pertenecen a la
            comunidad que los produce.
          </p>
          <p>
            <a href={REPO_URL} rel="noreferrer" target="_blank">
              Código y contacto del equipo
            </a>
          </p>
        </div>
        <nav aria-label="Fuentes" className="grid content-start gap-2">
          <h2 className="font-bold">Fuentes</h2>
          <ul className="grid gap-1.5">
            {FUENTES.map((f) => (
              <li key={f.href}>
                <a href={f.href} rel="noreferrer" target="_blank">
                  {f.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/glosario#fuentes">Diccionarios wichí citados</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Más información" className="grid content-start gap-2">
          <h2 className="font-bold">Más información</h2>
          <ul className="grid gap-1.5">
            <li>
              <Link to="/">Volver a la portada</Link>
            </li>
            <li>
              <Link to="/accesibilidad">Declaración de accesibilidad</Link>
            </li>
            <li>
              <Link to="/traducir">Quiero traducir</Link>
            </li>
            <li>
              <Link to="/biblioteca">Biblioteca pública</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
