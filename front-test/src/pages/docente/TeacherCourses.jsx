import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chalkboard, Copy, Plus, SignOut, SpeakerHigh, UploadSimple } from '@phosphor-icons/react';
import { Dialog, EmptyState, ErrorBox, Field, Loading, PageHeader } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { courses } from '../../lib/api.js';
import { gradeLabel, LEVELS, levelLabel, SUBJECTS } from '../../lib/config.js';
import { useAsync, useDocumentTitle } from '../../lib/hooks.js';
import { canSpeak, say } from '../../lib/speech.js';

export function BigCode({ code, size = 'lg' }) {
  return (
    <span
      className={`inline-flex gap-1.5 font-bold tabular-nums ${size === 'lg' ? 'text-[2.6rem]' : 'text-[1.5rem]'}`}
      aria-label={`Código ${code.split('').join(' ')}`}
    >
      {code.split('').map((d, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`grid place-items-center rounded-[var(--radius-control)] border-2 border-ink bg-surface ${
            size === 'lg' ? 'h-20 w-16' : 'h-11 w-9'
          }`}
        >
          {d}
        </span>
      ))}
    </span>
  );
}

export function CodeActions({ code }) {
  const { notify } = useAnnouncer();
  return (
    <div className="flex flex-wrap gap-2">
      {canSpeak && (
        <button type="button" className="btn btn-secondary" onClick={() => say(`El código es ${code.split('').join(', ')}`)}>
          <SpeakerHigh size={22} aria-hidden="true" />
          Decirlo en voz alta
        </button>
      )}
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() =>
          navigator.clipboard
            ?.writeText(code)
            .then(() => notify('Código copiado', 'success'))
            .catch(() => notify('No se pudo copiar', 'error'))
        }
      >
        <Copy size={22} aria-hidden="true" />
        Copiar
      </button>
    </div>
  );
}

function CreateCourse({ onCreated }) {
  const { notify } = useAnnouncer();
  const [form, setForm] = useState({ name: '', level: 'secundaria', year: '', subject: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const maxYear = LEVELS.find((l) => l.value === form.level)?.grades || 7;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Poné un nombre, por ejemplo "3.er año Biología"' });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const body = { name: form.name.trim(), level: form.level };
      if (form.year) body.year = Number(form.year);
      if (form.subject) body.subject = form.subject;
      const curso = await courses.create(body);
      setForm({ name: '', level: form.level, year: '', subject: '' });
      onCreated(curso);
    } catch (err) {
      setErrors(err.porCampo || {});
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="box grid gap-5 p-5 md:p-7" noValidate>
      <h2 className="text-[1.35rem] font-bold">Crear un curso</h2>
      <Field label="Nombre del curso" required error={errors.name} hint='Por ejemplo: "3.er año Biología"'>
        {(p) => <input {...p} className="input" value={form.name} onChange={set('name')} maxLength={120} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nivel" error={errors.level}>
          {(p) => (
            <select {...p} className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value, year: '' })}>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={form.level === 'primaria' ? 'Grado' : 'Año'} error={errors.year}>
          {(p) => (
            <select {...p} className="input" value={form.year} onChange={set('year')}>
              <option value="">Sin elegir</option>
              {Array.from({ length: maxYear }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {gradeLabel(form.level, n)}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <Field label="Materia" error={errors.subject}>
        {(p) => (
          <select {...p} className="input" value={form.subject} onChange={set('subject')}>
            <option value="">Sin elegir</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </Field>
      <button type="submit" className="btn btn-primary justify-self-start" disabled={busy} aria-busy={busy}>
        <Plus size={22} aria-hidden="true" />
        {busy ? 'Creando' : 'Crear curso'}
      </button>
    </form>
  );
}

export default function TeacherCourses() {
  useDocumentTitle('Tus cursos');
  const { user, logout, isDemo } = useAuth();
  const { loading, error, data, reload } = useAsync(() => courses.mine(), []);
  const [created, setCreated] = useState(null);

  return (
    <div className="wrap py-10 md:py-14">
      <PageHeader
        title="Tus cursos"
        actions={
          <>
            <Link to="/docente/subir" className="btn btn-primary">
              <UploadSimple size={22} aria-hidden="true" />
              Subir material
            </Link>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              <SignOut size={22} aria-hidden="true" />
              Salir
            </button>
          </>
        }
      >
        Hola{user?.firstName ? `, ${user.firstName}` : ''}. Cada curso tiene un código de 4 números: escribilo en el pizarrón y tus alumnos
        lo ingresan una sola vez.
        {isDemo && <span className="mt-2 block font-bold">Estás en modo demostración: todo se guarda en este dispositivo.</span>}
      </PageHeader>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12">
        <section aria-labelledby="lista-t" className="grid content-start gap-4">
          <h2 id="lista-t" className="sr-only">
            Lista de cursos
          </h2>
          {loading ? (
            <Loading label="Cargando tus cursos" cards={2} />
          ) : error ? (
            <ErrorBox onRetry={reload}>{error.message}</ErrorBox>
          ) : data.length === 0 ? (
            <EmptyState icon={Chalkboard} title="Todavía no tenés cursos">
              Creá el primero con el formulario. El código aparece enseguida.
            </EmptyState>
          ) : (
            <ul className="grid gap-4">
              {data.map((c) => (
                <li key={c.id} className="box grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="grid gap-1">
                    <h3 className="text-[1.25rem] font-bold">
                      <Link to={`/docente/cursos/${c.code}`} className="text-ink">
                        {c.name}
                      </Link>
                    </h3>
                    <p className="text-ink-2">{[levelLabel(c.level), gradeLabel(c.level, c.year), c.subject].filter(Boolean).join(', ')}</p>
                  </div>
                  <BigCode code={c.code} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </section>

        <CreateCourse
          onCreated={(curso) => {
            setCreated(curso);
            reload();
          }}
        />
      </div>

      <Dialog
        open={Boolean(created)}
        onClose={() => setCreated(null)}
        title="Curso creado"
        footer={
          created && (
            <Link to={`/docente/subir?curso=${created.id}`} className="btn btn-primary">
              <UploadSimple size={22} aria-hidden="true" />
              Subir el primer material
            </Link>
          )
        }
      >
        {created && (
          <div className="grid justify-items-start gap-5">
            <p className="text-[1.1rem]">
              El código de <strong>{created.name}</strong> es:
            </p>
            <BigCode code={created.code} />
            <p className="text-ink-2">Escribilo en el pizarrón o en el cuaderno. Funciona como la clave del wifi: se comparte en persona.</p>
            <CodeActions code={created.code} />
          </div>
        )}
      </Dialog>
    </div>
  );
}
