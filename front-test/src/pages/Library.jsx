import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Backpack, GraduationCap, MagnifyingGlass, X } from '@phosphor-icons/react';
import { VoiceInputButton } from '../components/inputs.jsx';
import { MaterialCard } from '../components/materials.jsx';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui.jsx';
import { useAnnouncer } from '../context/AnnouncerContext.jsx';
import { materials } from '../lib/api.js';
import { gradeLabel, LEVELS, SUBJECTS } from '../lib/config.js';
import { useAsync, useDocumentTitle } from '../lib/hooks.js';

function Step({ n, title, children }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 flex items-center gap-3 text-[1.15rem] font-bold">
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-full border-2 border-ink text-[0.95rem]"
        >
          {n}
        </span>
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export default function Library() {
  useDocumentTitle('Biblioteca pública');
  const [params, setParams] = useSearchParams();
  const { announce } = useAnnouncer();
  const level = params.get('nivel') || '';
  const grade = params.get('grado') || '';
  const subject = params.get('materia') || '';
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  useEffect(() => setQuery(q), [q]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: false });
  };

  const { loading, error, data, reload } = useAsync(
    () => materials.listPublic({ level, grade, subject, q }),
    [level, grade, subject, q],
  );

  useEffect(() => {
    if (data) announce(`${data.length} ${data.length === 1 ? 'material encontrado' : 'materiales encontrados'}`, { speak: false });
  }, [data, announce]);

  const levelInfo = LEVELS.find((l) => l.value === level);
  const hasFilters = level || grade || subject || q;

  return (
    <div className="wrap py-10 md:py-14">
      <PageHeader title="Biblioteca pública">
        Materiales de primaria y secundaria, abiertos a cualquiera y sin código. Elegí en tres toques o buscá un tema.
      </PageHeader>

      <div className="grid gap-12 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
        <div className="grid content-start gap-8">
          <form
            role="search"
            className="grid gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: query.trim() });
            }}
          >
            <label htmlFor="buscar" className="label">
              Buscar un tema
            </label>
            <div className="flex gap-2">
              <input
                id="buscar"
                type="search"
                className="input min-w-0 flex-1"
                placeholder="Por ejemplo: fotosíntesis"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary !px-3.5">
                <MagnifyingGlass size={22} aria-hidden="true" />
                <span className="sr-only">Buscar</span>
              </button>
            </div>
            <VoiceInputButton
              label="Buscar con la voz"
              className="justify-self-start"
              onResult={(text) => {
                setQuery(text);
                update({ q: text });
              }}
            />
          </form>

          <Step n={1} title="Nivel">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                className="chip control btn-lg flex-1"
                aria-pressed={level === l.value}
                onClick={() => update({ nivel: level === l.value ? '' : l.value, grado: '' })}
              >
                {l.value === 'primaria' ? <Backpack size={24} aria-hidden="true" /> : <GraduationCap size={24} aria-hidden="true" />}
                {l.label}
              </button>
            ))}
          </Step>

          {levelInfo && (
            <Step n={2} title={level === 'primaria' ? 'Grado' : 'Año'}>
              {Array.from({ length: levelInfo.grades }, (_, i) => String(i + 1)).map((g) => (
                <button
                  key={g}
                  type="button"
                  className="chip control min-w-[4.5rem] justify-center"
                  aria-pressed={grade === g}
                  onClick={() => update({ grado: grade === g ? '' : g })}
                >
                  {gradeLabel(level, g)}
                </button>
              ))}
            </Step>
          )}

          {levelInfo && (
            <Step n={3} title="Materia">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip control"
                  aria-pressed={subject === s}
                  onClick={() => update({ materia: subject === s ? '' : s })}
                >
                  {s}
                </button>
              ))}
            </Step>
          )}

          {hasFilters && (
            <div>
              <button type="button" className="btn btn-ghost -ml-3" onClick={() => setParams(new URLSearchParams())}>
                <X size={20} aria-hidden="true" />
                Borrar la búsqueda
              </button>
            </div>
          )}
        </div>

        <section aria-labelledby="resultados-t" aria-busy={loading} className="grid content-start gap-5">
          <h2 id="resultados-t" className="text-[1.4rem] font-bold">
            {loading ? 'Buscando' : data ? `${data.length} ${data.length === 1 ? 'material' : 'materiales'}` : 'Materiales'}
            {q && !loading && <span className="font-normal text-ink-2"> para "{q}"</span>}
          </h2>
          {loading ? (
            <Loading label="Buscando materiales" />
          ) : error ? (
            <ErrorBox onRetry={reload}>{error.message}</ErrorBox>
          ) : data.length === 0 ? (
            <EmptyState icon={MagnifyingGlass} title="No encontramos materiales con esa búsqueda">
              Probá con otra palabra o sacá algún filtro. El catálogo completo es un próximo paso del proyecto.
            </EmptyState>
          ) : (
            <ul className="grid gap-4 xl:grid-cols-2">
              {data.map((m) => (
                <li key={m.id}>
                  <MaterialCard material={m} headingLevel={3} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
