import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AirplaneTilt,
  ArrowRight,
  Backpack,
  BookOpenText,
  ClosedCaptioning,
  DeviceMobile,
  GraduationCap,
  House,
  MagnifyingGlass,
  Minus,
  Plus,
  SpeakerHigh,
  Stack,
  Stop,
  Student,
  Target,
  TextAlignLeft,
  UploadSimple,
  UsersThree,
  WifiSlash,
} from '@phosphor-icons/react';
import { VoiceInputButton } from '../components/inputs.jsx';
import { TEXT_SCALES, usePreferences } from '../context/PreferencesContext.jsx';
import { SEED_MATERIALS } from '../data/seedMaterials.js';
import { splitSentences } from '../lib/easyRead.js';
import { useDocumentTitle } from '../lib/hooks.js';
import { useT } from '../lib/i18n.js';
import { canSpeak, readSentences } from '../lib/speech.js';

const EJEMPLO = SEED_MATERIALS.find((m) => m.title === 'La fotosíntesis');

/* Vista previa real: el mismo material de ejemplo, con sus versiones funcionando */
function HeroPreview() {
  const [tab, setTab] = useState('facil');
  const [active, setActive] = useState(-1);
  const readerRef = useRef(null);

  // Los dos primeros párrafos del texto original, frente a las primeras frases de la lectura fácil
  const texto = useMemo(
    () =>
      splitSentences(
        EJEMPLO.accessibleText
          .split('\n\n')
          .filter((p) => p.length > 60)
          .slice(0, 2)
          .join(' '),
      ),
    [],
  );
  const facil = useMemo(
    () =>
      EJEMPLO.easyReadText
        .split('\n')
        .filter((l) => /[.]$/.test(l) && !l.startsWith('- '))
        .slice(0, 3),
    [],
  );
  const lines = tab === 'texto' ? texto : facil;

  useEffect(() => () => readerRef.current?.stop(), []);

  const toggleRead = () => {
    if (active >= 0) {
      readerRef.current?.stop();
      setActive(-1);
      return;
    }
    readerRef.current = readSentences(lines, { onSentence: setActive, onEnd: () => setActive(-1) });
  };

  const tabs = [
    { id: 'facil', label: 'Lectura fácil', icon: BookOpenText },
    { id: 'texto', label: 'Texto', icon: TextAlignLeft },
  ];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-2 translate-y-3 rounded-[calc(var(--radius-box)+4px)] bg-tint-2 md:-inset-5 md:translate-x-6 md:translate-y-6 hc:hidden"
        data-nonessential
      />
      <figure className="box relative grid gap-4 p-5 shadow-[0_8px_30px_rgb(var(--shadow-tint)/0.12)] md:p-6">
        <figcaption className="grid gap-1">
          <span className="text-[0.9rem] font-bold text-ink-2">Secundaria, 1.º año, Biología</span>
          <span className="text-[1.45rem] font-bold leading-tight">{EJEMPLO.title}</span>
        </figcaption>

        <div role="tablist" aria-label="Versión del material de ejemplo" className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls="preview-panel"
              className="chip control"
              onClick={() => {
                readerRef.current?.stop();
                setActive(-1);
                setTab(t.id);
              }}
            >
              <t.icon size={20} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>

        <div id="preview-panel" role="tabpanel" className="min-h-[9.5rem] text-[1.05rem] leading-[1.7]">
          {tab === 'facil' ? (
            <ul className="grid gap-1.5">
              {lines.map((l, i) => (
                <li key={l} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink" />
                  <span className={i === active ? 'sentence-active' : undefined}>{l}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {lines.map((l, i) => (
                <span key={l} className={i === active ? 'sentence-active' : undefined}>
                  {l}{' '}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          {canSpeak && (
            <button type="button" className="btn btn-primary" onClick={toggleRead} aria-pressed={active >= 0}>
              {active >= 0 ? <Stop size={22} weight="fill" aria-hidden="true" /> : <SpeakerHigh size={22} aria-hidden="true" />}
              {active >= 0 ? 'Detener' : 'Escuchar'}
            </button>
          )}
          <Link to={`/material/${EJEMPLO.id}`} className="btn btn-ghost">
            Abrir completo
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </figure>
    </div>
  );
}

function Hero() {
  const { t } = useT();
  return (
    <section aria-labelledby="hero-title" className="wrap pt-10 pb-16 md:pt-14 md:pb-24">
      <p className="badge rise mb-5" data-nonessential>
        <House size={16} weight="bold" aria-hidden="true" />
        Portal educativo · Formosa
      </p>
      <h1
        id="hero-title"
        className="rise display max-w-[26ch] text-[2.15rem] leading-[1.08] md:text-[2.6rem] lg:max-w-none lg:text-[3rem]"
      >
        {t('hero.titulo')}
      </h1>
      <div className="mt-8 grid items-start gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14 lg:mt-10">
        <div className="rise grid gap-7 [animation-delay:80ms]">
          <p className="max-w-[32ch] text-[1.2rem] text-ink-2">{t('hero.bajada')}</p>
          <div className="grid max-w-sm gap-3">
            <Link to="/alumno" className="btn btn-primary btn-lg justify-between">
              <span className="flex items-center gap-3">
                <Student size={28} aria-hidden="true" />
                {t('hero.alumno')}
              </span>
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
            <Link to="/docente" className="btn btn-secondary btn-lg justify-between">
              <span className="flex items-center gap-3">
                <GraduationCap size={28} aria-hidden="true" />
                {t('hero.docente')}
              </span>
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
            <Link to="/biblioteca" className="btn btn-secondary btn-lg justify-between">
              <span className="flex items-center gap-3">
                <MagnifyingGlass size={28} aria-hidden="true" />
                {t('hero.explorar')}
              </span>
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="rise [animation-delay:160ms]" data-nonessential>
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: UploadSimple, title: 'El docente sube', text: 'Un PDF o un texto, como lo tiene hoy.' },
    { icon: Stack, title: 'Se crean las versiones', text: 'Texto claro, audio y lectura fácil. La comunidad suma el wichí.' },
    { icon: DeviceMobile, title: 'El alumno las usa', text: 'En su celular, en su forma, incluso sin internet.' },
  ];
  return (
    <section aria-labelledby="como-title" className="border-y border-line bg-surface py-16 md:py-20">
      <div className="wrap">
        <p className="badge mb-5" data-nonessential>
          Paso a paso
        </p>
        <h2 id="como-title" className="display text-[1.9rem] md:text-[2.2rem]">
          Cómo funciona
        </h2>
        <ol className="relative mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-0.5 bg-line md:inset-x-7 md:top-7 md:bottom-auto md:h-0.5 md:w-auto"
          />
          {steps.map((s) => (
            <li key={s.title} className="relative grid grid-cols-[3.5rem_1fr] gap-4 md:grid-cols-1">
              <span className="relative grid size-14 place-items-center rounded-full border-2 border-ink bg-tint-2 text-ink">
                <s.icon size={28} aria-hidden="true" />
              </span>
              <div className="grid gap-1">
                <h3 className="text-[1.25rem] font-bold">{s.title}</h3>
                <p className="max-w-[30ch] text-ink-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PublicLibrary() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/biblioteca?q=${encodeURIComponent(q.trim())}` : '/biblioteca');
  };
  return (
    <section aria-labelledby="biblio-title" className="wrap py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="grid gap-5">
          <p className="badge justify-self-start" data-nonessential>
            Materiales abiertos
          </p>
          <h2 id="biblio-title" className="display text-[1.9rem] md:text-[2.2rem]">
            Biblioteca pública
          </h2>
          <p className="max-w-[40ch] text-[1.1rem] text-ink-2">
            Materiales de primaria y secundaria, abiertos a cualquiera y sin código. Cada uno con las mismas versiones accesibles.
          </p>
          <form role="search" action="/biblioteca" onSubmit={submit} className="grid gap-2">
            <label htmlFor="landing-q" className="label">
              Buscar un tema
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="landing-q"
                name="q"
                type="search"
                className="input min-w-0 flex-1"
                placeholder="Por ejemplo: fracciones"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <MagnifyingGlass size={22} aria-hidden="true" />
                Buscar
              </button>
            </div>
            <VoiceInputButton
              label="Buscar con la voz"
              className="justify-self-start"
              onResult={(text) => navigate(`/biblioteca?q=${encodeURIComponent(text)}`)}
            />
          </form>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/biblioteca?nivel=primaria"
            className="group control grid min-h-52 content-between gap-6 rounded-[var(--radius-box)] bg-tint-1 p-6 text-ink no-underline transition-transform hover:-translate-y-0.5"
          >
            <Backpack size={44} aria-hidden="true" />
            <span className="grid gap-1">
              <span className="text-[1.6rem] font-bold">Primaria</span>
              <span className="flex items-center gap-2 font-bold">
                1.º a 7.º grado
                <ArrowRight size={20} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
          <Link
            to="/biblioteca?nivel=secundaria"
            className="group control grid min-h-52 content-between gap-6 rounded-[var(--radius-box)] bg-tint-2 p-6 text-ink no-underline transition-transform hover:-translate-y-0.5 sm:mt-10"
          >
            <GraduationCap size={44} aria-hidden="true" />
            <span className="grid gap-1">
              <span className="text-[1.6rem] font-bold">Secundaria</span>
              <span className="flex items-center gap-2 font-bold">
                1.º a 6.º año
                <ArrowRight size={20} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Tarjetas por necesidad, con el nombre de lo que resuelven. Cada una funciona de verdad. */
function ForEveryone() {
  const { prefs, setPref } = usePreferences();
  const scaleIndex = TEXT_SCALES.findIndex((s) => s.value === prefs.textScale);
  const [reading, setReading] = useState(false);
  const readerRef = useRef(null);
  useEffect(() => () => readerRef.current?.stop(), []);

  const demoSentence = 'Así suena un material leído en voz alta. Se resalta cada frase mientras se lee.';
  const [active, setActive] = useState(-1);

  const cell = 'box box-hover grid content-between gap-6 p-6';
  return (
    <section aria-labelledby="cada-title" className="wrap py-16 md:py-24">
      <p className="badge mb-5" data-nonessential>
        Accesibilidad
      </p>
      <h2 id="cada-title" className="display text-[1.9rem] md:text-[2.2rem]">
        Pensado para cada persona
      </h2>
      <p className="mt-3 max-w-[48ch] text-[1.1rem] text-ink-2">
        Cada persona activa lo que le sirve. No hace falta explicar por qué, y cualquiera puede usar cualquier opción.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-6">
        <div className={`${cell} border-transparent! bg-tint-2! md:col-span-3 md:row-span-2`}>
          <SpeakerHigh size={40} aria-hidden="true" />
          <div className="grid gap-3">
            <h3 className="text-[1.5rem] font-bold">Leer en voz alta</h3>
            <p className="text-[1.1rem]">
              {splitSentences(demoSentence).map((s, i) => (
                <span key={s} className={i === active ? 'sentence-active' : undefined}>
                  {s}{' '}
                </span>
              ))}
            </p>
            {canSpeak && (
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-pressed={reading}
                  onClick={() => {
                    if (reading) {
                      readerRef.current?.stop();
                      setReading(false);
                      return;
                    }
                    setReading(true);
                    readerRef.current = readSentences(splitSentences(demoSentence), {
                      onSentence: setActive,
                      onEnd: () => setReading(false),
                    });
                  }}
                >
                  {reading ? <Stop size={22} weight="fill" aria-hidden="true" /> : <SpeakerHigh size={22} aria-hidden="true" />}
                  {reading ? 'Detener' : 'Probar'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={`${cell} md:col-span-3`}>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[1.35rem] font-bold">Letra más grande</h3>
            <span aria-hidden="true" className="text-[2rem] font-bold leading-none">
              Aa
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPref('textScale', TEXT_SCALES[Math.max(0, scaleIndex - 1)].value)}
              disabled={scaleIndex <= 0}
            >
              <Minus size={20} aria-hidden="true" />
              <span className="sr-only">Achicar la letra</span>
            </button>
            <p className="min-w-[7rem] text-center font-bold" aria-live="polite">
              {TEXT_SCALES[scaleIndex]?.label || 'Normal'}
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPref('textScale', TEXT_SCALES[Math.min(TEXT_SCALES.length - 1, scaleIndex + 1)].value)}
              disabled={scaleIndex >= TEXT_SCALES.length - 1}
            >
              <Plus size={20} aria-hidden="true" />
              <span className="sr-only">Agrandar la letra</span>
            </button>
          </div>
        </div>

        <div className={`${cell} border-transparent! bg-tint-1! md:col-span-3`}>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[1.35rem] font-bold">Modo concentración</h3>
            <Target size={34} aria-hidden="true" />
          </div>
          <p>Oculta lo que distrae y muestra el material de a una parte.</p>
          <div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.focusMode}
              className="btn btn-secondary"
              onClick={() => setPref('focusMode', !prefs.focusMode)}
            >
              {prefs.focusMode ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>

        <div className={`${cell} md:col-span-2`}>
          <ClosedCaptioning size={34} aria-hidden="true" />
          <div className="grid gap-1">
            <h3 className="text-[1.35rem] font-bold">Subtítulos</h3>
            <p className="text-ink-2">Todo audio o video llega con subtítulos y su transcripción escrita.</p>
          </div>
        </div>

        <div className={`${cell} md:col-span-4`}>
          <WifiSlash size={34} aria-hidden="true" />
          <div className="grid gap-1">
            <h3 className="text-[1.35rem] font-bold">Sin internet</h3>
            <p className="text-ink-2">Lo que guardás queda en tu celular. Se actualiza solo cuando vuelve la señal.</p>
            <a href="#sin-internet" className="mt-1 font-bold">
              Cómo funciona sin internet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndigenousLanguages() {
  const principles = [
    { title: 'La comunidad traduce', text: 'Toda traducción la hace o la revisa una persona hablante. El sistema no traduce solo.' },
    { title: 'El glosario crece', text: 'Cada término revisado se suma al glosario y ayuda en el próximo material.' },
    { title: 'Los datos son de la comunidad', text: 'El glosario y las traducciones pertenecen a quien los produjo.' },
  ];
  return (
    <section aria-labelledby="lenguas-title" className="border-y border-line bg-surface py-16 md:py-24">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <p className="badge justify-self-start" data-nonessential>
            Wichí
          </p>
          <h2 id="lenguas-title" className="display text-[1.9rem] md:text-[2.2rem]">
            Lenguas originarias
          </h2>
          <p className="max-w-[46ch] text-[1.1rem] text-ink-2">
            Empezamos por el wichí. En muchas comunidades la transmisión es oral, por eso el audio en la lengua vale tanto como el texto.
          </p>
          <dl className="grid gap-5">
            {principles.map((p) => (
              <div key={p.title} className="grid gap-1 border-l-4 border-accent-strong pl-4 hc:border-ink">
                <dt className="text-[1.15rem] font-bold">{p.title}</dt>
                <dd className="text-ink-2">{p.text}</dd>
              </div>
            ))}
          </dl>
          <div>
            <Link to="/traducir" className="btn btn-primary btn-lg">
              <UsersThree size={26} aria-hidden="true" />
              Quiero traducir
            </Link>
          </div>
        </div>

        <figure className="grid content-start gap-4 self-center rounded-[var(--radius-box)] bg-bg p-6 md:p-8">
          <figcaption className="text-[0.95rem] font-bold text-ink-2">Ejemplo con un material</figcaption>
          <div className="grid gap-2">
            <p className="text-[0.9rem] font-bold">Castellano, lectura fácil</p>
            <p className="text-[1.2rem] leading-snug">Las plantas fabrican su propio alimento.</p>
          </div>
          <div className="grid gap-2 rounded-[var(--radius-box)] border-2 border-dashed border-control p-4">
            <p className="text-[0.9rem] font-bold">Wichí</p>
            <p className="text-[1.05rem] text-ink-2">
              Traducción simulada. Acá va la frase en wichí, escrita o revisada por una persona hablante.
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
}

function Offline() {
  return (
    <section id="sin-internet" aria-labelledby="offline-title" className="wrap py-16 md:py-24">
      <div className="mx-auto grid max-w-2xl justify-items-center gap-5 text-center">
        <span className="grid size-24 place-items-center rounded-full bg-tint-1 text-ink hc:border-2 hc:border-ink">
          <AirplaneTilt size={52} aria-hidden="true" />
        </span>
        <p className="badge" data-nonessential>
          Modo avión
        </p>
        <h2 id="offline-title" className="display text-[1.9rem] md:text-[2.2rem]">
          Funciona sin internet
        </h2>
        <p className="max-w-[40ch] text-[1.15rem] text-ink-2">
          Guardá un material con señal, poné el modo avión y seguí leyendo y escuchando.
        </p>
      </div>
    </section>
  );
}

export default function Landing() {
  useDocumentTitle(null);
  return (
    <>
      <Hero />
      <HowItWorks />
      <PublicLibrary />
      <ForEveryone />
      <IndigenousLanguages />
      <Offline />
    </>
  );
}
