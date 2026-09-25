import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, SpeakerHigh, Stop } from '@phosphor-icons/react';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { parseBlocks, splitParts, splitSentences } from '../lib/easyRead.js';
import { canSpeak, readSentences } from '../lib/speech.js';

/* Muestra un texto dividido en partes cortas con progreso visible,
   y lo lee en voz alta resaltando la frase que se está leyendo.
   En modo concentración muestra de a una parte. */

function buildStructure(text) {
  const parts = splitParts(parseBlocks(text));
  const sentences = [];
  const partStart = [];
  const structured = parts.map((blocks, p) => {
    partStart.push(sentences.length);
    return blocks.map((b) => {
      const add = (t) => {
        const segs = b.type === 'heading' ? [t] : splitSentences(t);
        return segs.map((s) => {
          sentences.push({ text: s, part: p });
          return { text: s, index: sentences.length - 1 };
        });
      };
      if (b.type === 'list') return { type: 'list', items: b.items.map(add) };
      return { type: b.type, segs: add(b.text) };
    });
  });
  return { parts: structured, sentences, partStart };
}

function Segs({ segs, active }) {
  return segs.map((s, i) => (
    <span key={s.index} data-sentence={s.index} className={s.index === active ? 'sentence-active' : undefined}>
      {s.text}
      {i < segs.length - 1 ? ' ' : ''}
    </span>
  ));
}

export default function ReadingView({ text, lang, idPrefix = 'lectura', allowAudio = true }) {
  const { prefs } = usePreferences();
  const { parts, sentences, partStart } = useMemo(() => buildStructure(text || ''), [text]);
  const [paged, setPaged] = useState(prefs.focusMode);
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState('stopped'); // stopped | playing | paused
  const readerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => setPaged(prefs.focusMode), [prefs.focusMode]);
  useEffect(() => {
    setCurrent(0);
    readerRef.current?.stop();
  }, [text]);
  useEffect(() => () => readerRef.current?.stop(), []);

  // Mantener visible la frase que se está leyendo
  useEffect(() => {
    if (active < 0) return;
    const el = containerRef.current?.querySelector(`[data-sentence="${active}"]`);
    const reduce = document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [active]);

  const play = () => {
    if (playing === 'paused') {
      readerRef.current?.resume();
      setPlaying('playing');
      return;
    }
    const start = paged ? partStart[current] : 0;
    setPlaying('playing');
    readerRef.current = readSentences(
      sentences.map((s) => s.text),
      {
        start,
        onSentence: (i) => {
          setActive(i);
          if (i >= 0 && paged) setCurrent(sentences[i].part);
        },
        onEnd: () => setPlaying('stopped'),
      },
    );
  };
  const pause = () => {
    readerRef.current?.pause();
    setPlaying('paused');
  };
  const stopIt = () => {
    readerRef.current?.stop();
    setPlaying('stopped');
    setActive(-1);
  };

  const go = (p) => {
    stopIt();
    setCurrent(p);
    containerRef.current?.focus();
  };

  const visibleParts = paged ? [current] : parts.map((_, i) => i);
  const total = parts.length;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-2" data-nonessential-controls>
        {allowAudio && canSpeak && (
          <>
            {playing === 'playing' ? (
              <button type="button" className="btn btn-primary" onClick={pause}>
                <Pause size={22} weight="fill" aria-hidden="true" />
                Pausar
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={play}>
                {playing === 'paused' ? (
                  <Play size={22} weight="fill" aria-hidden="true" />
                ) : (
                  <SpeakerHigh size={22} aria-hidden="true" />
                )}
                {playing === 'paused' ? 'Seguir leyendo' : 'Leer en voz alta'}
              </button>
            )}
            {playing !== 'stopped' && (
              <button type="button" className="btn btn-secondary" onClick={stopIt}>
                <Stop size={22} weight="fill" aria-hidden="true" />
                Detener
              </button>
            )}
          </>
        )}
        {total > 1 && (
          <button type="button" className="btn btn-ghost" aria-pressed={paged} onClick={() => setPaged((v) => !v)}>
            {paged ? 'Ver todo junto' : 'Ver de a una parte'}
          </button>
        )}
      </div>

      {total > 1 && paged && (
        <div className="grid gap-2">
          <p className="font-bold" aria-live="polite" id={`${idPrefix}-progreso`}>
            Parte {current + 1} de {total}
          </p>
          <ol className="flex gap-1.5" aria-hidden="true">
            {parts.map((_, i) => (
              <li
                key={i}
                className={`h-2 flex-1 rounded-full ${i <= current ? 'bg-accent-strong hc:bg-ink' : 'border border-line bg-transparent'}`}
              />
            ))}
          </ol>
        </div>
      )}

      <div
        ref={containerRef}
        tabIndex={-1}
        lang={lang}
        className="reading reading-text text-[1.1rem] leading-[1.75] outline-none"
        aria-describedby={paged && total > 1 ? `${idPrefix}-progreso` : undefined}
      >
        {visibleParts.map((p) => (
          <section key={p} aria-label={total > 1 ? `Parte ${p + 1} de ${total}` : undefined} className="mb-2">
            {parts[p].map((b, bi) => {
              if (b.type === 'heading')
                return (
                  <h2 key={bi}>
                    <Segs segs={b.segs} active={active} />
                  </h2>
                );
              if (b.type === 'list')
                return (
                  <ul key={bi}>
                    {b.items.map((segs, ii) => (
                      <li key={ii}>
                        <Segs segs={segs} active={active} />
                      </li>
                    ))}
                  </ul>
                );
              return (
                <p key={bi}>
                  <Segs segs={b.segs} active={active} />
                </p>
              );
            })}
            {!paged && total > 1 && p < total - 1 && <hr className="my-6 border-line" aria-hidden="true" />}
          </section>
        ))}
      </div>

      {total > 1 && paged && (
        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => go(current - 1)} disabled={current === 0}>
            <ArrowLeft size={22} aria-hidden="true" />
            Anterior
          </button>
          {current < total - 1 ? (
            <button type="button" className="btn btn-primary btn-lg" onClick={() => go(current + 1)}>
              Siguiente
              <ArrowRight size={22} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => go(0)}>
              Terminaste. Volver al principio
            </button>
          )}
        </div>
      )}
    </div>
  );
}
