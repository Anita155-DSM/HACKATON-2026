import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, DownloadSimple, MagnifyingGlass, PencilSimple, Plus } from '@phosphor-icons/react';
import TermForm from '../../components/TermForm.jsx';
import { Badge, Dialog, EmptyState, PageHeader } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { GLOSSARY_SOURCES } from '../../data/glossary.js';
import { WICHI_LANG_TAG } from '../../lib/config.js';
import { exportGlossary, getGlossary, syncGlossary } from '../../lib/glossary.js';
import { useDocumentTitle } from '../../lib/hooks.js';

const ESTADOS = {
  validado: { tone: 'ok', label: 'Revisado', icon: CheckCircle },
  propuesto: { tone: 'warn', label: 'Propuesto' },
  'por-completar': { tone: 'neutral', label: 'Por completar' },
};

export default function Glossary() {
  useDocumentTitle('Glosario wichí');
  const { notify } = useAnnouncer();
  const [terms, setTerms] = useState(() => getGlossary('wichi'));
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    syncGlossary('wichi').then(setTerms);
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? terms.filter((t) => t.es.toLowerCase().includes(n) || t.wichi.toLowerCase().includes(n)) : terms;
  }, [terms, q]);

  // Agrupado por tema para no hacer una lista larga sin estructura
  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach((t) => {
      const k = t.tema || 'Otros';
      map.set(k, [...(map.get(k) || []), t]);
    });
    return [...map.entries()];
  }, [filtered]);

  const completos = terms.filter((t) => t.wichi).length;

  return (
    <div className="wrap py-10 md:py-14">
      <PageHeader
        title="Glosario wichí"
        actions={
          <>
            <button type="button" className="btn btn-primary" onClick={() => setEditing({})}>
              <Plus size={22} aria-hidden="true" />
              Agregar término
            </button>
            <button type="button" className="btn btn-secondary" onClick={exportGlossary}>
              <DownloadSimple size={22} aria-hidden="true" />
              Descargar el glosario
            </button>
          </>
        }
      >
        Crece con cada material. Cada término guarda su fuente y su variante. {completos} de {terms.length} términos tienen su forma en
        wichí. El glosario es de la comunidad que lo produce.
      </PageHeader>

      <div className="mb-8 max-w-md">
        <label htmlFor="buscar-termino" className="label">
          Buscar un término
        </label>
        <div className="relative mt-2">
          <MagnifyingGlass size={22} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
          <input id="buscar-termino" type="search" className="input !pl-11" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={MagnifyingGlass} title="No hay términos con esa búsqueda" />
      ) : (
        <div className="grid gap-10">
          {groups.map(([tema, list]) => (
            <section key={tema} aria-labelledby={`tema-${tema}`} className="grid gap-4">
              <h2 id={`tema-${tema}`} className="text-[1.3rem] font-bold">
                {tema}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => {
                  const est = ESTADOS[t.estado] || ESTADOS['por-completar'];
                  return (
                    <li key={t.id} className="box grid content-between gap-3 p-4">
                      <div className="grid gap-1">
                        <p className="text-[1.15rem] font-bold">{t.es}</p>
                        {t.wichi ? (
                          <p lang={WICHI_LANG_TAG} className="text-[1.15rem]">
                            {t.wichi}
                          </p>
                        ) : (
                          <p className="text-ink-2">Sin término todavía</p>
                        )}
                        {(t.variante || t.fuente) && (
                          <p className="text-[0.85rem] text-ink-2">
                            {[t.variante && `Variante: ${t.variante}`, t.fuente && `Fuente: ${t.fuente}`].filter(Boolean).join('. ')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge tone={est.tone} icon={est.icon}>
                          {est.label}
                        </Badge>
                        <button type="button" className="btn btn-ghost !min-h-11 !px-2 text-[0.95rem]" onClick={() => setEditing(t)}>
                          <PencilSimple size={18} aria-hidden="true" />
                          {t.wichi ? 'Editar' : 'Completar'}
                          <span className="sr-only"> {t.es}</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <section id="fuentes" aria-labelledby="fuentes-t" className="mt-16 grid gap-4 border-t border-line pt-10">
        <h2 id="fuentes-t" className="text-[1.3rem] font-bold">
          Fuentes
        </h2>
        <p className="reading text-ink-2">
          Los diccionarios existentes tienen autoría. En la demo los citamos; en un producto real pediríamos autorización.
        </p>
        <ul className="grid gap-2">
          {GLOSSARY_SOURCES.map((s) => (
            <li key={s.id}>
              {s.href ? (
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ) : (
                <strong>{s.label}</strong>
              )}
              {s.note && <span className="text-ink-2">. {s.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.es ? editing.es : 'Agregar término'}>
        {editing && (
          <TermForm
            initial={editing.es ? editing : null}
            onCancel={() => setEditing(null)}
            onSaved={(t) => {
              setTerms(getGlossary('wichi'));
              setEditing(null);
              notify(`"${t.es}" quedó guardado en el glosario`, 'success');
            }}
          />
        )}
      </Dialog>
    </div>
  );
}
