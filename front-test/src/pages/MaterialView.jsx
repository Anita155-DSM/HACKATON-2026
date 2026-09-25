import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpenText,
  DownloadSimple,
  Info,
  SpeakerHigh,
  TextAlignLeft,
  Translate,
  UsersThree,
} from '@phosphor-icons/react';
import { materialMeta, OfflineButton, RecordedAudio, TranslationStatus } from '../components/materials.jsx';
import ReadingView from '../components/ReadingView.jsx';
import { EmptyState, ErrorBox, Loading, Segmented } from '../components/ui.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { audioSrc, materials as materialsApi } from '../lib/api.js';
import { WICHI_LANG_TAG } from '../lib/config.js';
import { useDocumentTitle } from '../lib/hooks.js';
import { estadoMaterial, guardarMaterial, obtenerMaterial } from '../lib/offline/index.js';
import { canSpeak } from '../lib/speech.js';
import { load, save } from '../lib/storage.js';
import { getCurso } from '../lib/student.js';

async function cargar(id) {
  // Sin señal: directo a lo guardado. Con señal: el servidor, y si falla, lo guardado.
  if (!navigator.onLine) {
    const local = await obtenerMaterial(id);
    if (local) return { material: local, desde: 'celular' };
  }
  try {
    const material = await materialsApi.get(id);
    // Si ya estaba guardado, lo actualizamos en silencio (la app se actualiza sola)
    estadoMaterial(id).then(({ estado }) => estado === 'guardado' && guardarMaterial(material).catch(() => {}));
    return { material, desde: 'servidor' };
  } catch (err) {
    const local = await obtenerMaterial(id).catch(() => null);
    if (local) return { material: local, desde: 'celular' };
    throw err;
  }
}

function downloadTxt(material, easy) {
  const body = easy ? material.easyReadText : material.accessibleText;
  const blob = new Blob([`${material.title}\n\n${body}\n`], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${material.title}${easy ? ' (lectura fácil)' : ''}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function MaterialView() {
  const { id } = useParams();
  const { prefs } = usePreferences();
  const [state, setState] = useState({ loading: true, error: null, material: null, desde: null });
  const [format, setFormat] = useState(null);
  const [listenWhat, setListenWhat] = useState('facil');

  useDocumentTitle(state.material?.title || 'Material');

  const load_ = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    cargar(id)
      .then(({ material, desde }) => setState({ loading: false, error: null, material, desde }))
      .catch((error) => setState({ loading: false, error, material: null, desde: null }));
  };
  useEffect(load_, [id]);

  const m = state.material;
  const wichi = (m?.translations || []).filter((t) => t.language === 'wichi');

  // Formato inicial: la lengua preferida si hay traducción; si no, el último formato elegido.
  useEffect(() => {
    if (!m) return;
    if (prefs.materialLang === 'wichi' && wichi.length) setFormat('wichi');
    else {
      const last = load('ultimo-formato', 'texto');
      setFormat(last === 'facil' && !m.easyReadText ? 'texto' : last === 'wichi' && !wichi.length ? 'texto' : last);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m?.id]);

  const choose = (f) => {
    setFormat(f);
    save('ultimo-formato', f);
  };

  const back = getCurso() ? { to: '/mis-materiales', label: 'Mis materiales' } : { to: '/biblioteca', label: 'Biblioteca' };

  if (state.loading)
    return (
      <div className="wrap py-10">
        <Loading label="Abriendo el material" cards={2} />
      </div>
    );

  if (state.error)
    return (
      <div className="wrap py-10">
        <h1 className="sr-only">Material</h1>
        <ErrorBox
          title={state.error.status === 404 ? 'No encontramos este material' : 'No pudimos abrir el material'}
          onRetry={state.error.status === 404 ? undefined : load_}
        >
          {state.error.network
            ? 'Estás sin conexión y este material no está guardado en tu celular. Abrilo cuando haya señal y tocá "Guardar para usar sin internet".'
            : state.error.message}
        </ErrorBox>
      </div>
    );

  const formats = [
    { value: 'texto', label: 'Texto', icon: TextAlignLeft },
    m.easyReadText && { value: 'facil', label: 'Lectura fácil', icon: BookOpenText },
    canSpeak && { value: 'escuchar', label: 'Escuchar', icon: SpeakerHigh },
    { value: 'wichi', label: 'Wichí', icon: Translate },
  ].filter(Boolean);

  const meta = materialMeta(m);

  return (
    <div className="wrap py-8 md:py-12">
      <Link to={back.to} className="btn btn-ghost -ml-3 mb-4" data-nonessential>
        <ArrowLeft size={22} aria-hidden="true" />
        {back.label}
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <article className="grid content-start gap-7">
          <header className="grid gap-2">
            {meta && <p className="font-bold text-ink-2">{meta}</p>}
            <h1 className="text-[2rem] leading-tight font-bold md:text-[2.5rem]">{m.title}</h1>
            {state.desde === 'celular' && (
              <p className="flex items-center gap-2 font-bold text-ok">
                <Info size={20} aria-hidden="true" />
                Lo estás viendo desde tu celular, sin internet.
              </p>
            )}
          </header>

          <Segmented legend="¿Cómo lo querés?" name="formato" value={format} onChange={choose} options={formats} />

          <div className="box p-5 md:p-8">
            {format === 'texto' && (
              <>
                {m.textSource === 'transcrito' && (
                  <p className="mb-5 rounded-[var(--radius-control)] bg-surface-2 p-3 text-[0.95rem]">
                    Este texto se leyó de imágenes. Las imágenes con información aparecen descritas entre corchetes.
                  </p>
                )}
                <ReadingView text={m.accessibleText} idPrefix="texto" />
              </>
            )}

            {format === 'facil' && <ReadingView text={m.easyReadText} idPrefix="facil" />}

            {format === 'escuchar' && (
              <div className="grid gap-6">
                <Segmented
                  legend="¿Qué querés escuchar?"
                  name="escuchar"
                  value={listenWhat}
                  onChange={setListenWhat}
                  options={[
                    m.easyReadText && { value: 'facil', label: 'Lectura fácil' },
                    { value: 'texto', label: 'Texto completo' },
                  ].filter(Boolean)}
                />
                <p className="hint">La voz es la de tu celular, así que también funciona sin internet.</p>
                <ReadingView
                  key={listenWhat}
                  text={listenWhat === 'facil' && m.easyReadText ? m.easyReadText : m.accessibleText}
                  idPrefix="escuchar"
                />
                {wichi.some((t) => t.audioUrl || t.audioBlob) && (
                  <div className="grid gap-4 border-t border-line pt-5">
                    {wichi.map((t) => (
                      <RecordedAudio key={t.id} label="Audio en wichí" src={audioSrc(t.audioUrl)} blob={t.audioBlob} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {format === 'wichi' &&
              (wichi.length === 0 ? (
                <EmptyState
                  icon={Translate}
                  title="Todavía no hay traducción al wichí"
                  action={
                    <Link to={`/traducir/${m.id}`} className="btn btn-secondary">
                      <UsersThree size={22} aria-hidden="true" />
                      Quiero traducir
                    </Link>
                  }
                >
                  Las traducciones las hacen personas de la comunidad. Mientras tanto, podés usar la lectura fácil o escucharlo.
                </EmptyState>
              ) : (
                <div className="grid gap-8">
                  {wichi.map((t) => (
                    <section key={t.id} className="grid gap-4" aria-label="Traducción al wichí">
                      <div className="flex flex-wrap gap-2">
                        <TranslationStatus tr={t} />
                      </div>
                      {t.text && (
                        <div lang={t.simulated ? 'es' : WICHI_LANG_TAG} className="reading text-[1.15rem] leading-[1.8] whitespace-pre-line">
                          {t.text}
                        </div>
                      )}
                      <RecordedAudio label="Escuchar en wichí" src={audioSrc(t.audioUrl)} blob={t.audioBlob} />
                      {t.author && <p className="text-[0.9rem] text-ink-2">Traducción de {t.author}.</p>}
                    </section>
                  ))}
                </div>
              ))}
          </div>
        </article>

        <aside className="grid content-start gap-6" aria-label="Sobre este material">
          <div className="box grid gap-4 p-5">
            <h2 className="text-[1.15rem] font-bold">Usar sin internet</h2>
            <OfflineButton material={m} />
          </div>

          <div className="box grid gap-3 p-5" data-nonessential>
            <h2 className="text-[1.15rem] font-bold">Descargar como archivo</h2>
            <button type="button" className="btn btn-secondary justify-start" onClick={() => downloadTxt(m, false)}>
              <DownloadSimple size={22} aria-hidden="true" />
              Texto (.txt)
            </button>
            {m.easyReadText && (
              <button type="button" className="btn btn-secondary justify-start" onClick={() => downloadTxt(m, true)}>
                <DownloadSimple size={22} aria-hidden="true" />
                Lectura fácil (.txt)
              </button>
            )}
          </div>

          <dl className="grid gap-3 px-1 text-[0.95rem]" data-nonessential>
            {m.author && (
              <div>
                <dt className="font-bold">Autor</dt>
                <dd className="text-ink-2">{m.author}</dd>
              </div>
            )}
            {m.source && (
              <div>
                <dt className="font-bold">Fuente</dt>
                <dd className="text-ink-2">{m.source}</dd>
              </div>
            )}
            {m.license && (
              <div>
                <dt className="font-bold">Licencia</dt>
                <dd className="text-ink-2">{m.license}</dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
}
