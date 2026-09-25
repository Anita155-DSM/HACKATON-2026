import { useState } from 'react';
import { BookOpenText, Info, Plus, Sparkle, WarningCircle } from '@phosphor-icons/react';
import { materials } from '../lib/api.js';
import { WICHI_LANG_TAG } from '../lib/config.js';
import { Badge } from './ui.jsx';

/* Guía del glosario (GET /materials/:id/glosario).
 *
 * El servidor NO traduce: Claude solo elige las palabras importantes del texto en castellano
 * y el backend las busca en el "Glosario wichí lhämtes". Todo lo que se muestra en wichí sale
 * del libro y se cita con su página. Las palabras sin entrada las crea o elige la comunidad.
 *
 * Se pide a mano (no al abrir la página) porque tarda unos segundos y el servidor limita
 * cuántas consultas seguidas se pueden hacer. */
export default function GlossaryGuide({ materialId, esEjemplo, onUseTerm }) {
  const [state, setState] = useState({ estado: 'inicial', data: null, error: null });
  const { estado, data, error } = state;

  const pedir = async () => {
    setState({ estado: 'cargando', data: null, error: null });
    try {
      const guia = await materials.glossaryGuide(materialId);
      setState({ estado: 'listo', data: guia, error: null });
    } catch (err) {
      setState({ estado: 'error', data: null, error: err });
    }
  };

  const fuente = data?.fuente;
  const citaFuente = fuente
    ? `Fuente: ${fuente.titulo}, ${fuente.autor} (${fuente.anio}). Descarga gratuita en ${fuente.disponible_en}.`
    : null;

  return (
    <section aria-labelledby="guia-t" className="box grid content-start gap-4 p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id="guia-t" className="text-[1.25rem] font-bold">
          Guía del glosario wichí lhämtes
        </h2>
        {data?.metodo && (
          <Badge tone={data.metodo === 'claude' ? 'accent' : 'neutral'}>
            {data.metodo === 'claude' ? 'Análisis completo' : 'Modo básico'}
          </Badge>
        )}
      </div>

      <p className="text-ink-2">
        Busca las palabras de este material en el glosario publicado y muestra cómo figuran en wichí, con la página del libro. No es una
        traducción: la traducción la escribís vos.
      </p>

      {estado !== 'listo' && (
        <button
          type="button"
          className="btn btn-primary justify-self-start"
          onClick={pedir}
          disabled={estado === 'cargando'}
          aria-busy={estado === 'cargando'}
        >
          <Sparkle size={22} aria-hidden="true" />
          {estado === 'cargando' ? 'Buscando en el glosario' : estado === 'error' ? 'Probar de nuevo' : 'Pedir la guía'}
        </button>
      )}

      {estado === 'cargando' && (
        <p role="status" className="text-ink-2">
          Puede tardar unos segundos.
        </p>
      )}

      {estado === 'error' && (
        <div role="alert" className="grid gap-2 rounded-[var(--radius-control)] border-2 border-danger bg-danger-bg p-4">
          <p className="flex items-start gap-2 font-bold text-danger">
            <WarningCircle size={22} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
            {error?.message || 'No pudimos pedir la guía'}
          </p>
          <p className="text-ink-2">
            {esEjemplo
              ? 'Este es un material de ejemplo y vive en tu dispositivo. La guía se arma en el servidor, así que funciona con los materiales que suben los docentes.'
              : 'La guía se arma en el servidor: hace falta conexión y tener la sesión de docente abierta. Podés seguir traduciendo igual.'}
          </p>
        </div>
      )}

      {estado === 'listo' && data && (
        <div className="grid gap-6">
          <p role="note" className="flex items-start gap-2 rounded-[var(--radius-control)] bg-tint-1 p-4 text-ink-2 hc:border-2 hc:border-ink">
            <Info size={22} aria-hidden="true" className="mt-0.5 shrink-0" />
            {data.aviso}
          </p>

          <div className="grid gap-3">
            <h3 className="font-bold">En el glosario ({data.sugerencias?.length || 0})</h3>
            {!data.sugerencias?.length ? (
              <p className="text-ink-2">Ninguna palabra de este material figura en el libro.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.sugerencias.map((s) => (
                  <li key={s.palabra} className="grid content-start gap-1.5 rounded-[var(--radius-control)] border border-line p-3">
                    <p className="font-bold">
                      {s.palabra}
                      {s.lema && s.lema !== s.palabra && <span className="font-normal text-ink-2"> ({s.lema})</span>}
                    </p>
                    <ul className="grid gap-2">
                      {s.entradas.map((e, i) => (
                        <li key={`${e.wichi}-${i}`} className="grid gap-0.5">
                          <span lang={WICHI_LANG_TAG} className="text-[1.1rem]">
                            {e.wichi}
                          </span>
                          <span className="text-[0.85rem] text-ink-2">
                            {e.es}
                            {e.pagina ? ` · p. ${e.pagina}` : ''}
                            {e.nota ? ` · ${e.nota}` : ''}
                          </span>
                          {onUseTerm && (
                            <button
                              type="button"
                              className="btn btn-ghost -ml-2 !min-h-11 justify-start !px-2 text-left text-[0.9rem] !whitespace-normal"
                              onClick={() =>
                                onUseTerm({
                                  es: s.lema || s.palabra,
                                  wichi: e.wichi,
                                  fuente: `${fuente?.titulo || 'Glosario wichí lhämtes'}${e.pagina ? `, p. ${e.pagina}` : ''}`,
                                })
                              }
                            >
                              <Plus size={18} aria-hidden="true" />
                              Sumar al glosario del equipo
                              <span className="sr-only"> la palabra {s.palabra}</span>
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {Boolean(data.sinEntrada?.length) && (
            <div className="grid gap-3">
              <h3 className="font-bold">Palabras para que la comunidad cree o elija ({data.sinEntrada.length})</h3>
              <ul className="flex flex-wrap gap-2">
                {data.sinEntrada.map((p) => (
                  <li key={p.palabra}>
                    <button type="button" className="chip control" onClick={() => onUseTerm?.({ es: p.lema || p.palabra })}>
                      <Plus size={18} aria-hidden="true" />
                      {p.palabra}
                      <span className="sr-only">. Proponer un término</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {citaFuente && (
            <p className="flex items-start gap-2 border-t border-line pt-4 text-[0.9rem] text-ink-2">
              <BookOpenText size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                {citaFuente} {data.textoAnalizado === 'lectura-facil' ? 'Se analizó la lectura fácil.' : 'Se analizó el texto del material.'}
              </span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
