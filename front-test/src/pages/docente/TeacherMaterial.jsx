import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowClockwise, ArrowLeft, Eye, FloppyDisk, Globe, Image, Trash, Translate, Warning } from '@phosphor-icons/react';
import { TranslationStatus } from '../../components/materials.jsx';
import { Badge, ConfirmDialog, ErrorBox, Field, Loading, Switch } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { materials } from '../../lib/api.js';
import { gradeLabel, LEVELS, SUBJECTS } from '../../lib/config.js';
import { useAsync, useDocumentTitle } from '../../lib/hooks.js';

const EASY_STATUS = {
  generado: { tone: 'accent', label: 'Hecha con IA: revisala' },
  respaldo: { tone: 'warn', label: 'Versión de respaldo: revisala' },
  manual: { tone: 'ok', label: 'Revisada por vos' },
  pendiente: { tone: 'danger', label: 'Pendiente' },
};
const SOURCE_LABEL = { extraido: 'Texto del PDF', pegado: 'Texto pegado', transcrito: 'Leído de imágenes' };

function Section({ title, children, id }) {
  return (
    <section aria-labelledby={id} className="box grid gap-5 p-5 md:p-7">
      <h2 id={id} className="text-[1.3rem] font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function TeacherMaterial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useAnnouncer();
  const { loading, error, data: m, reload, setData } = useAsync(() => materials.get(id), [id]);
  useDocumentTitle(m ? `Revisar: ${m.title}` : 'Revisar material');

  const [easy, setEasy] = useState('');
  const [text, setText] = useState('');
  const [meta, setMeta] = useState(null);
  const [busy, setBusy] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (!m) return;
    setEasy(m.easyReadText || '');
    setText(m.accessibleText || '');
    setMeta({
      title: m.title || '',
      level: m.level || '',
      grade: m.grade ? String(m.grade) : '',
      subject: m.subject || '',
      author: m.author || '',
      source: m.source || '',
      license: m.license || '',
      visibility: m.visibility || 'curso',
    });
  }, [m]);

  const run = async (key, fn, okMsg) => {
    setBusy(key);
    try {
      const r = await fn();
      const updated = r?.data && r.data.id ? { ...m, ...r.data, translations: m.translations } : m;
      setData(updated);
      notify(r?.mensaje || okMsg, 'success');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy('');
    }
  };

  if (loading)
    return (
      <div className="wrap py-10">
        <Loading cards={3} />
      </div>
    );
  if (error)
    return (
      <div className="wrap py-10">
        <h1 className="sr-only">Revisar material</h1>
        <ErrorBox onRetry={reload}>{error.message}</ErrorBox>
      </div>
    );
  if (!meta) return null;

  const status = EASY_STATUS[m.easyReadStatus] || EASY_STATUS.pendiente;
  const levelInfo = LEVELS.find((l) => l.value === meta.level);

  return (
    <div className="wrap py-8 md:py-12">
      <button type="button" className="btn btn-ghost -ml-3 mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} aria-hidden="true" />
        Volver
      </button>

      <header className="mb-8 grid gap-4">
        <h1 className="display text-[2rem] leading-tight md:text-[2.4rem]">{m.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge tone={status.tone}>Lectura fácil: {status.label}</Badge>
          <Badge>{SOURCE_LABEL[m.textSource] || 'Texto'}</Badge>
          <Badge tone={m.visibility === 'publico' ? 'ok' : 'neutral'} icon={m.visibility === 'publico' ? Globe : undefined}>
            {m.visibility === 'publico' ? 'Público en la biblioteca' : 'Solo para el curso'}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/material/${m.id}`} className="btn btn-secondary">
            <Eye size={22} aria-hidden="true" />
            Ver como alumno
          </Link>
          <Link to={`/traducir/${m.id}`} className="btn btn-secondary">
            <Translate size={22} aria-hidden="true" />
            Traducir al wichí
          </Link>
          <button type="button" className="btn btn-danger" onClick={() => setConfirm('delete')}>
            <Trash size={22} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </header>

      {m.textSource === 'transcrito' && (
        <div role="note" className="mb-8 flex items-start gap-3 rounded-[var(--radius-box)] border-2 border-warn bg-warn-bg p-5">
          <Warning size={28} className="shrink-0 text-warn" aria-hidden="true" />
          <p>
            <strong>El texto se leyó de imágenes.</strong> Revisalo antes de compartirlo. Las imágenes con información aparecen descritas
            entre corchetes, por ejemplo [Imagen: ...].
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Lectura fácil" id="lf-t">
          <p className="text-ink-2">
            Frases cortas, una idea por línea. Los títulos van en una línea sola y las listas empiezan con "- ".
          </p>
          <Field label="Texto en lectura fácil">
            {(p) => <textarea {...p} className="input min-h-80 font-normal" value={easy} onChange={(e) => setEasy(e.target.value)} />}
          </Field>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy === 'easy' || easy === (m.easyReadText || '')}
              onClick={() => run('easy', () => materials.update(m.id, { easyReadText: easy }), 'Lectura fácil guardada')}
            >
              <FloppyDisk size={22} aria-hidden="true" />
              {busy === 'easy' ? 'Guardando' : 'Guardar cambios'}
            </button>
            <button type="button" className="btn btn-secondary" disabled={Boolean(busy)} onClick={() => setConfirm('regen')}>
              <ArrowClockwise size={22} aria-hidden="true" />
              {busy === 'regen' ? 'Generando' : 'Generar de nuevo'}
            </button>
          </div>
        </Section>

        <Section title="Texto accesible" id="ta-t">
          <p className="text-ink-2">Es el texto que leen los lectores de pantalla y la voz. Podés corregir lo que haga falta.</p>
          <Field label="Texto accesible">
            {(p) => <textarea {...p} className="input min-h-80" value={text} onChange={(e) => setText(e.target.value)} />}
          </Field>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy === 'text' || !text.trim() || text === m.accessibleText}
              onClick={() => run('text', () => materials.update(m.id, { accessibleText: text }), 'Texto guardado')}
            >
              <FloppyDisk size={22} aria-hidden="true" />
              {busy === 'text' ? 'Guardando' : 'Guardar cambios'}
            </button>
            {m.sourceType === 'pdf' && (
              <button type="button" className="btn btn-secondary" disabled={Boolean(busy)} onClick={() => setConfirm('transcribe')}>
                <Image size={22} aria-hidden="true" />
                {busy === 'transcribe' ? 'Leyendo, puede tardar 2 minutos' : 'Leer también las imágenes'}
              </button>
            )}
          </div>
        </Section>

        <Section title="Datos del material" id="dm-t">
          <Field label="Título">
            {(p) => <input {...p} className="input" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nivel">
              {(p) => (
                <select {...p} className="input" value={meta.level} onChange={(e) => setMeta({ ...meta, level: e.target.value, grade: '' })}>
                  <option value="">Sin elegir</option>
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label={meta.level === 'primaria' ? 'Grado' : 'Año'}>
              {(p) => (
                <select {...p} className="input" value={meta.grade} disabled={!levelInfo} onChange={(e) => setMeta({ ...meta, grade: e.target.value })}>
                  <option value="">Sin elegir</option>
                  {levelInfo &&
                    Array.from({ length: levelInfo.grades }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {gradeLabel(meta.level, n)}
                      </option>
                    ))}
                </select>
              )}
            </Field>
          </div>
          <Field label="Materia">
            {(p) => (
              <select {...p} className="input" value={meta.subject} onChange={(e) => setMeta({ ...meta, subject: e.target.value })}>
                <option value="">Sin elegir</option>
                {[...new Set([...SUBJECTS, meta.subject].filter(Boolean))].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Autor">
            {(p) => <input {...p} className="input" value={meta.author} onChange={(e) => setMeta({ ...meta, author: e.target.value })} />}
          </Field>
          <Field label="Fuente">
            {(p) => <input {...p} className="input" value={meta.source} onChange={(e) => setMeta({ ...meta, source: e.target.value })} />}
          </Field>
          <Field label="Licencia">
            {(p) => <input {...p} className="input" value={meta.license} onChange={(e) => setMeta({ ...meta, license: e.target.value })} />}
          </Field>
          <div className="rounded-[var(--radius-control)] border border-line">
            <Switch
              icon={Globe}
              label="Hacer público"
              description="Aparece en la biblioteca para cualquiera. Necesita fuente y licencia."
              checked={meta.visibility === 'publico'}
              onChange={(v) => setMeta({ ...meta, visibility: v ? 'publico' : 'curso' })}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary justify-self-start"
            disabled={busy === 'meta'}
            onClick={() => {
              if (meta.visibility === 'publico' && (!meta.source.trim() || !meta.license.trim())) {
                notify('Para hacerlo público, completá la fuente y la licencia', 'error');
                return;
              }
              const body = { ...meta, grade: meta.grade ? Number(meta.grade) : undefined };
              Object.keys(body).forEach((k) => body[k] === '' && delete body[k]);
              run('meta', () => materials.update(m.id, body), 'Datos guardados');
            }}
          >
            <FloppyDisk size={22} aria-hidden="true" />
            {busy === 'meta' ? 'Guardando' : 'Guardar datos'}
          </button>
        </Section>

        <Section title="Traducciones" id="tr-t">
          {(m.translations || []).length === 0 ? (
            <p className="text-ink-2">Todavía no hay traducciones. Las hace o revisa una persona hablante de la comunidad.</p>
          ) : (
            <ul className="grid gap-4">
              {m.translations.map((t) => (
                <li key={t.id} className="grid gap-2 rounded-[var(--radius-control)] border border-line p-4">
                  <p className="font-bold">{t.language === 'wichi' ? 'Wichí' : t.language}</p>
                  <TranslationStatus tr={t} />
                  {t.author && <p className="text-ink-2">De {t.author}</p>}
                </li>
              ))}
            </ul>
          )}
          <Link to={`/traducir/${m.id}`} className="btn btn-secondary justify-self-start">
            <Translate size={22} aria-hidden="true" />
            Agregar traducción
          </Link>
        </Section>
      </div>

      <ConfirmDialog
        open={confirm === 'regen'}
        onClose={() => setConfirm(null)}
        title="¿Generar de nuevo la lectura fácil?"
        confirmLabel="Sí, generar"
        onConfirm={() => {
          setConfirm(null);
          run('regen', () => materials.regenerateEasyRead(m.id), 'Lectura fácil actualizada');
        }}
      >
        <p>Se reemplaza la versión actual, incluidos los cambios que hayas hecho a mano. Puede tardar hasta un minuto.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm === 'transcribe'}
        onClose={() => setConfirm(null)}
        title="¿Leer también las imágenes?"
        confirmLabel="Sí, leer"
        onConfirm={() => {
          setConfirm(null);
          run('transcribe', () => materials.transcribe(m.id), 'Material releído');
        }}
      >
        <p>
          Se vuelve a leer el PDF original, incluidos esquemas, mapas e infografías. El texto accesible se reemplaza y la lectura fácil
          se genera de nuevo. Puede tardar hasta 2 minutos.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm === 'delete'}
        onClose={() => setConfirm(null)}
        title="¿Eliminar este material?"
        confirmLabel="Sí, eliminar"
        danger
        onConfirm={async () => {
          setConfirm(null);
          try {
            await materials.remove(m.id);
            notify('Material eliminado', 'success');
            navigate('/docente/cursos');
          } catch (err) {
            notify(err.message, 'error');
          }
        }}
      >
        <p>Tus alumnos dejan de verlo. Esta acción no se puede deshacer.</p>
      </ConfirmDialog>
    </div>
  );
}
