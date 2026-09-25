import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PaperPlaneTilt, Plus, SpeakerHigh, Stop } from '@phosphor-icons/react';
import GlossaryGuide from '../../components/GlossaryGuide.jsx';
import { AudioRecorder } from '../../components/inputs.jsx';
import TermForm from '../../components/TermForm.jsx';
import { Badge, Dialog, ErrorBox, Field, Loading, Switch } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { SEED_IDS } from '../../data/seedMaterials.js';
import { glossary as glossaryApi, materials, translations } from '../../lib/api.js';
import { LANGUAGES, WICHI_LANG_TAG } from '../../lib/config.js';
import { getGlossary, markTerms, mergeRemote, termsInText } from '../../lib/glossary.js';
import { useAsync, useDocumentTitle } from '../../lib/hooks.js';
import { canSpeak, readText } from '../../lib/speech.js';
import { CheckCircle, Flask } from '@phosphor-icons/react';

function MarkedText({ text, terms }) {
  return text.split('\n').map((line, i) =>
    line.trim() ? (
      <p key={i} className="mb-2">
        {markTerms(line, terms).map((piece, j) =>
          piece.term ? (
            <mark key={j} className="term" title={piece.term.wichi ? `Wichí: ${piece.term.wichi}` : 'Sin término en wichí todavía'}>
              {piece.text}
            </mark>
          ) : (
            <span key={j}>{piece.text}</span>
          ),
        )}
      </p>
    ) : (
      <div key={i} className="h-3" aria-hidden="true" />
    ),
  );
}

export default function TranslateMaterial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useAnnouncer();
  const { loading, error, data: m, reload } = useAsync(() => materials.get(id), [id]);
  useDocumentTitle(m ? `Traducir: ${m.title}` : 'Traducir');

  const [glossary, setGlossary] = useState(() => getGlossary('wichi'));
  const [editing, setEditing] = useState(null);

  // Términos del servidor, para subrayarlos también en el texto original
  useEffect(() => {
    let vivo = true;
    glossaryApi
      .list('wichi')
      .then((remotos) => vivo && remotos.length && setGlossary((g) => mergeRemote(g, remotos)))
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);
  const [reading, setReading] = useState(null);
  const [form, setForm] = useState({
    language: 'wichi',
    text: '',
    author: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    validated: false,
    simulated: false,
  });
  const [audio, setAudio] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const source = m?.easyReadText || m?.accessibleText || '';
  const found = useMemo(() => termsInText(source, glossary), [source, glossary]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.text.trim() && !audio) errs.text = 'Escribí la traducción o grabá el audio';
    if (form.validated && form.simulated) errs.simulated = 'Una traducción simulada no puede estar revisada por la comunidad';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const r = await translations.create(m.id, { ...form, text: form.text.trim(), author: form.author.trim() }, audio);
      notify(r.mensaje || 'Traducción guardada', 'success');
      navigate(`/material/${m.id}`);
    } catch (err) {
      setErrors({ ...err.porCampo, general: err.message });
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <div className="wrap py-10">
        <Loading cards={2} />
      </div>
    );
  if (error)
    return (
      <div className="wrap py-10">
        <h1 className="sr-only">Traducir</h1>
        <ErrorBox onRetry={reload}>{error.message}</ErrorBox>
      </div>
    );

  return (
    <div className="wrap py-8 md:py-12">
      <Link to="/traducir" className="btn btn-ghost -ml-3 mb-4">
        <ArrowLeft size={22} aria-hidden="true" />
        Materiales para traducir
      </Link>
      <header className="mb-8 grid gap-2">
        <p className="font-bold text-ink-2">Traducir al wichí</p>
        <h1 className="display text-[2rem] leading-tight md:text-[2.4rem]">{m.title}</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <section aria-labelledby="orig-t" className="grid content-start gap-6">
          <div className="box grid gap-4 p-5 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="orig-t" className="text-[1.25rem] font-bold">
                {m.easyReadText ? 'Texto en lectura fácil' : 'Texto del material'}
              </h2>
              {canSpeak && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-pressed={Boolean(reading)}
                  onClick={() => {
                    if (reading) {
                      reading.stop();
                      setReading(null);
                      return;
                    }
                    setReading(readText(source, { onEnd: () => setReading(null) }));
                  }}
                >
                  {reading ? <Stop size={22} weight="fill" aria-hidden="true" /> : <SpeakerHigh size={22} aria-hidden="true" />}
                  {reading ? 'Detener' : 'Escuchar'}
                </button>
              )}
            </div>
            <p className="hint">Las palabras subrayadas están en el glosario.</p>
            <div className="reading text-[1.1rem] leading-[1.75]">
              <MarkedText text={source} terms={found} />
            </div>
          </div>

          <div className="box grid gap-4 p-5 md:p-7">
            <h2 className="text-[1.25rem] font-bold">Glosario del equipo</h2>
            {found.length === 0 ? (
              <p className="text-ink-2">No encontramos términos del glosario en este texto.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {found.map((t) => (
                  <li key={t.id} className="grid gap-1 rounded-[var(--radius-control)] border border-line p-3">
                    <span className="font-bold">{t.es}</span>
                    {t.wichi ? (
                      <>
                        <span lang={WICHI_LANG_TAG} className="text-[1.1rem]">
                          {t.wichi}
                        </span>
                        <span>
                          {t.estado === 'validado' ? (
                            <Badge tone="ok" icon={CheckCircle}>
                              Revisado
                            </Badge>
                          ) : t.estado === 'citado' ? (
                            <Badge tone="accent">Del diccionario citado</Badge>
                          ) : (
                            <Badge tone="warn">Propuesto</Badge>
                          )}
                        </span>
                      </>
                    ) : (
                      <button type="button" className="btn btn-ghost -ml-2 justify-start !whitespace-normal !px-2 text-left text-[0.95rem]" onClick={() => setEditing(t)}>
                        <Plus size={18} aria-hidden="true" />
                        Sin término todavía. Proponer
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="btn btn-secondary justify-self-start" onClick={() => setEditing({})}>
              <Plus size={20} aria-hidden="true" />
              Agregar otro término
            </button>
          </div>

          <GlossaryGuide materialId={m.id} esEjemplo={SEED_IDS.has(m.id)} onUseTerm={setEditing} />
        </section>

        <form onSubmit={submit} className="box grid content-start gap-6 p-5 md:p-7" noValidate aria-labelledby="trad-t">
          <h2 id="trad-t" className="text-[1.25rem] font-bold">
            Tu traducción
          </h2>
          {errors.general && (
            <p role="alert" className="rounded-[var(--radius-control)] border-2 border-danger bg-danger-bg p-4 font-bold text-danger">
              {errors.general}
            </p>
          )}
          <Field label="Lengua" hint="Por ahora trabajamos con wichí. Qom y pilagá son el próximo paso.">
            {(p) => (
              <select {...p} className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} disabled={!l.available}>
                    {l.label}
                    {!l.available ? ' (próximamente)' : ''}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Traducción escrita" error={errors.text} hint="Podés dejarla vacía si solo grabás el audio.">
            {(p) => (
              <textarea
                {...p}
                lang={WICHI_LANG_TAG}
                className="input min-h-64"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            )}
          </Field>
          <div className="grid gap-2">
            <p className="label">Audio en wichí</p>
            <p className="hint -mt-1">Se graba en calidad de voz para que pese poco.</p>
            <AudioRecorder value={audio} onChange={setAudio} />
          </div>
          <Field label="Quién traduce" error={errors.author} hint="Así se reconoce la autoría de la traducción.">
            {(p) => <input {...p} className="input" maxLength={120} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />}
          </Field>
          <div className="grid gap-1 rounded-[var(--radius-control)] border border-line">
            <Switch
              icon={CheckCircle}
              label="La revisó una persona hablante de la comunidad"
              checked={form.validated}
              onChange={(v) => setForm({ ...form, validated: v, simulated: v ? false : form.simulated })}
            />
            <Switch
              icon={Flask}
              label="Es una traducción simulada para la demo"
              description="Se muestra con un aviso claro de que no es una traducción real."
              checked={form.simulated}
              onChange={(v) => setForm({ ...form, simulated: v, validated: v ? false : form.validated })}
            />
          </div>
          {errors.simulated && <p className="error-text">{errors.simulated}</p>}
          <button type="submit" className="btn btn-primary btn-lg justify-self-start" disabled={busy} aria-busy={busy}>
            <PaperPlaneTilt size={22} aria-hidden="true" />
            {busy ? 'Guardando' : 'Guardar traducción'}
          </button>
        </form>
      </div>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.es ? `Proponer: ${editing.es}` : 'Agregar término'}>
        {editing && (
          <TermForm
            initial={editing.es ? editing : null}
            onCancel={() => setEditing(null)}
            onSaved={(t) => {
              setGlossary(getGlossary('wichi'));
              setEditing(null);
              notify(`"${t.es}" se sumó al glosario`, 'success');
            }}
          />
        )}
      </Dialog>
    </div>
  );
}
