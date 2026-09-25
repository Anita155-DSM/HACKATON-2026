import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, UploadSimple } from '@phosphor-icons/react';
import { Field, PageHeader, Segmented, Switch } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { courses, materials } from '../../lib/api.js';
import { gradeLabel, LEVELS, SUBJECTS } from '../../lib/config.js';
import { useDocumentTitle } from '../../lib/hooks.js';

const MAX_MB = 10;
const LICENCIAS = [
  'CC BY 4.0',
  'CC BY-SA 4.0',
  'CC BY-NC-SA 4.0',
  'Dominio público',
  'Con autorización expresa del autor',
  'Material propio del docente',
];

// Mientras el backend prepara las versiones (hasta 1 minuto, 2 si el PDF es escaneado)
function Preparing({ isPdf }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const steps = [
    'Leyendo el texto del material',
    'Armando la versión en lectura fácil',
    'Guardando las versiones',
  ];
  return (
    <div role="status" aria-live="polite" className="box grid gap-6 p-6 md:p-8">
      <h2 className="text-[1.5rem] font-bold">Estamos preparando las versiones accesibles</h2>
      <p className="text-ink-2">
        Puede tardar hasta un minuto{isPdf ? ', o dos si el PDF es escaneado' : ''}. No cierres esta página.
      </p>
      <ol className="grid gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`size-4 shrink-0 rounded-full border-2 border-ink ${seconds >= i * 12 ? 'bg-accent' : ''}`}
            />
            <span className={seconds >= i * 12 ? 'font-bold' : 'text-ink-2'}>{s}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-2" aria-hidden="true">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  );
}

export default function UploadMaterial() {
  useDocumentTitle('Subir material');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useAnnouncer();
  const fileRef = useRef(null);
  const [misCursos, setMisCursos] = useState([]);
  const [mode, setMode] = useState('archivo');
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    text: '',
    courseId: params.get('curso') || '',
    level: '',
    grade: '',
    subject: '',
    author: '',
    source: '',
    license: '',
    visibility: 'curso',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    courses
      .mine()
      .then((list) => {
        setMisCursos(list);
        const c = list.find((x) => x.id === form.courseId);
        if (c) setForm((f) => ({ ...f, level: f.level || c.level || '', grade: f.grade || String(c.year || ''), subject: f.subject || c.subject || '' }));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelInfo = LEVELS.find((l) => l.value === form.level);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Poné un título';
    if (mode === 'archivo') {
      if (!file) e.archivo = 'Elegí un PDF o un archivo de texto';
      else if (file.size > MAX_MB * 1024 * 1024) e.archivo = `El archivo supera los ${MAX_MB} MB`;
      else if (!['application/pdf', 'text/plain'].includes(file.type)) e.archivo = 'Solo PDF o archivo de texto (.txt)';
    } else if (!form.text.trim()) e.text = 'Pegá el texto del material';
    if (form.visibility === 'publico') {
      if (!form.source.trim()) e.source = 'Para hacerlo público, indicá la fuente';
      if (!form.license) e.license = 'Para hacerlo público, elegí la licencia';
    }
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      notify('Revisá los campos marcados', 'error');
      return;
    }
    setBusy(true);
    try {
      const fields = {
        title: form.title.trim(),
        courseId: form.courseId,
        level: form.level,
        grade: form.grade,
        subject: form.subject,
        author: form.author.trim(),
        source: form.source.trim(),
        license: form.license,
        visibility: form.visibility,
      };
      if (mode === 'texto') fields.text = form.text;
      const r = await materials.create(fields, mode === 'archivo' ? file : null);
      notify(r.mensaje || 'Material creado', 'success');
      navigate(`/docente/material/${r.data.id}`);
    } catch (err) {
      setErrors({ ...err.porCampo, general: err.message });
      notify(err.message, 'error');
      setBusy(false);
    }
  };

  if (busy)
    return (
      <div className="wrap py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="sr-only">Subiendo material</h1>
          <Preparing isPdf={file?.type === 'application/pdf'} />
        </div>
      </div>
    );

  return (
    <div className="wrap py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Subir material">
          Subí el material como lo tenés. Se crean solas la versión en texto accesible, el audio y la lectura fácil.
        </PageHeader>

        <form onSubmit={submit} className="grid gap-8" noValidate>
          {errors.general && (
            <p role="alert" className="rounded-[var(--radius-control)] border-2 border-danger bg-danger-bg p-4 font-bold text-danger">
              {errors.general}
            </p>
          )}

          <section className="box grid gap-6 p-5 md:p-7">
            <Field label="Título" required error={errors.title}>
              {(p) => <input {...p} className="input" maxLength={200} value={form.title} onChange={set('title')} />}
            </Field>

            <Field label="Curso" hint="Si no elegís curso, el material queda sin curso (por ejemplo, para la biblioteca)." error={errors.courseId}>
              {(p) => (
                <select {...p} className="input" value={form.courseId} onChange={set('courseId')}>
                  <option value="">Sin curso</option>
                  {misCursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (código {c.code})
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Segmented
              legend="¿Cómo lo querés subir?"
              name="modo"
              value={mode}
              onChange={setMode}
              columns={2}
              options={[
                { value: 'archivo', label: 'Subir un archivo' },
                { value: 'texto', label: 'Pegar el texto' },
              ]}
            />

            {mode === 'archivo' ? (
              <Field
                label="Archivo"
                required
                hint={`PDF o texto (.txt), hasta ${MAX_MB} MB. Si el PDF es escaneado, se lee igual.`}
                error={errors.archivo}
              >
                {(p) => (
                  <input
                    {...p}
                    ref={fileRef}
                    type="file"
                    accept="application/pdf,text/plain,.pdf,.txt"
                    className="input file:mr-4 file:rounded-[10px] file:border-0 file:bg-soft file:px-4 file:py-2 file:font-bold file:text-[#0b2540]"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                )}
              </Field>
            ) : (
              <Field label="Texto del material" required hint="Hasta 50.000 caracteres." error={errors.text}>
                {(p) => <textarea {...p} className="input min-h-60" maxLength={50000} value={form.text} onChange={set('text')} />}
              </Field>
            )}
          </section>

          <section className="box grid gap-6 p-5 md:p-7" aria-labelledby="datos-t">
            <div className="grid gap-1">
              <h2 id="datos-t" className="text-[1.25rem] font-bold">
                Datos del material
              </h2>
              <p className="hint">Ayudan a encontrarlo en la biblioteca. Son opcionales si queda solo para tu curso.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nivel">
                {(p) => (
                  <select {...p} className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value, grade: '' })}>
                    <option value="">Sin elegir</option>
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label={form.level === 'primaria' ? 'Grado' : 'Año'}>
                {(p) => (
                  <select {...p} className="input" value={form.grade} onChange={set('grade')} disabled={!levelInfo}>
                    <option value="">Sin elegir</option>
                    {levelInfo &&
                      Array.from({ length: levelInfo.grades }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {gradeLabel(form.level, n)}
                        </option>
                      ))}
                  </select>
                )}
              </Field>
            </div>
            <Field label="Materia">
              {(p) => (
                <select {...p} className="input" value={form.subject} onChange={set('subject')}>
                  <option value="">Sin elegir</option>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Autor" error={errors.author}>
              {(p) => <input {...p} className="input" maxLength={160} value={form.author} onChange={set('author')} />}
            </Field>
            <Field label="Fuente" hint="De dónde sale el material. Por ejemplo, un cuadernillo del Ministerio de Educación." error={errors.source}>
              {(p) => <input {...p} className="input" maxLength={300} value={form.source} onChange={set('source')} />}
            </Field>
            <Field label="Licencia" error={errors.license}>
              {(p) => (
                <select {...p} className="input" value={form.license} onChange={set('license')}>
                  <option value="">Sin elegir</option>
                  {LICENCIAS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              )}
            </Field>

            <div className="rounded-[var(--radius-control)] border border-line">
              <Switch
                icon={Globe}
                label="Hacer público"
                description="Aparece en la biblioteca para cualquiera. Solo con licencia abierta o autorización, y citando la fuente."
                checked={form.visibility === 'publico'}
                onChange={(v) => setForm({ ...form, visibility: v ? 'publico' : 'curso' })}
              />
            </div>
          </section>

          <button type="submit" className="btn btn-primary btn-lg justify-self-start">
            <UploadSimple size={24} aria-hidden="true" />
            Subir y preparar versiones
          </button>
        </form>
      </div>
    </div>
  );
}
