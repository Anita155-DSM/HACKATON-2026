import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpenText, ChalkboardTeacher, Translate, UploadSimple } from '@phosphor-icons/react';
import PasswordInput, { passwordProblems } from '../../components/PasswordInput.jsx';
import { Field } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { auth } from '../../lib/api.js';
import { useDocumentTitle } from '../../lib/hooks.js';

function LoginForm({ onDone }) {
  const { login } = useAuth();
  const { notify } = useAnnouncer();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [general, setGeneral] = useState('');
  const [needsVerify, setNeedsVerify] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = 'Escribí tu email';
    if (!form.password) errs.password = 'Escribí tu contraseña';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setGeneral('');
    setNeedsVerify(false);
    try {
      const r = await login(form.email.trim(), form.password);
      notify(r.mensaje || 'Ingresaste', 'success');
      onDone();
    } catch (err) {
      setErrors(err.porCampo || {});
      setGeneral(err.message);
      if (err.status === 403 && /verificar/i.test(err.message)) setNeedsVerify(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {general && (
        <div role="alert" className="rounded-[var(--radius-control)] border-2 border-danger bg-danger-bg p-4 font-bold text-danger">
          {general}
          {needsVerify && (
            <button
              type="button"
              className="btn btn-secondary mt-3 w-full"
              onClick={async () => {
                const r = await auth.resendVerification(form.email.trim()).catch((err) => ({ mensaje: err.message }));
                notify(r.mensaje, 'info');
              }}
            >
              Enviarme el email de nuevo
            </button>
          )}
        </div>
      )}
      <Field label="Email" error={errors.email}>
        {(p) => (
          <input
            {...p}
            type="email"
            className="input"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        )}
      </Field>
      <Field label="Contraseña" error={errors.password}>
        {(p) => <PasswordInput {...p} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
      </Field>
      <button type="submit" className="btn btn-primary btn-lg" disabled={busy} aria-busy={busy}>
        {busy ? 'Ingresando' : 'Ingresar'}
      </button>
      <Link to="/recuperar-clave" className="justify-self-start">
        Me olvidé la contraseña
      </Link>
    </form>
  );
}

function RegisterForm({ onDone }) {
  const { register } = useAuth();
  const { notify } = useAnnouncer();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [general, setGeneral] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.firstName.trim().length < 2) errs.firstName = 'Escribí tu nombre';
    if (form.lastName.trim().length < 2) errs.lastName = 'Escribí tu apellido';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Revisá el email';
    const probs = passwordProblems(form.password);
    if (probs.length) errs.password = `Le falta: ${probs.join(', ')}`;
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setGeneral('');
    try {
      const r = await register({ ...form, email: form.email.trim() });
      notify(r.mensaje, 'success');
      if (r.necesitaVerificar) setSent(true);
      else onDone();
    } catch (err) {
      setErrors(err.porCampo || {});
      setGeneral(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (sent)
    return (
      <div role="status" className="grid gap-3">
        <h2 className="text-[1.3rem] font-bold">Revisá tu email</h2>
        <p>Te mandamos un enlace a {form.email} para confirmar la cuenta. Después podés ingresar.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {general && (
        <p role="alert" className="rounded-[var(--radius-control)] border-2 border-danger bg-danger-bg p-4 font-bold text-danger">
          {general}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" error={errors.firstName}>
          {(p) => <input {...p} className="input" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} />}
        </Field>
        <Field label="Apellido" error={errors.lastName}>
          {(p) => <input {...p} className="input" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} />}
        </Field>
      </div>
      <Field label="Email" error={errors.email}>
        {(p) => <input {...p} type="email" className="input" autoComplete="email" value={form.email} onChange={set('email')} />}
      </Field>
      <Field
        label="Contraseña"
        hint="Entre 8 y 64 caracteres, con una mayúscula, una minúscula y un número."
        error={errors.password}
      >
        {(p) => <PasswordInput {...p} autoComplete="new-password" value={form.password} onChange={set('password')} />}
      </Field>
      <Field label="Repetí la contraseña" error={errors.confirmPassword}>
        {(p) => <PasswordInput {...p} autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} />}
      </Field>
      <button type="submit" className="btn btn-primary btn-lg" disabled={busy} aria-busy={busy}>
        {busy ? 'Creando la cuenta' : 'Crear cuenta'}
      </button>
    </form>
  );
}

export default function TeacherAuth() {
  useDocumentTitle('Docentes y traductores');
  const { user } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const volver = params.get('volver') || '/docente/cursos';

  if (user) return <Navigate to={volver} replace />;

  const perks = [
    { icon: ChalkboardTeacher, text: 'Creá un curso y compartí un código de 4 números.' },
    { icon: UploadSimple, text: 'Subí un PDF o un texto, como lo tenés hoy.' },
    { icon: BookOpenText, text: 'Se crean el texto accesible, el audio y la lectura fácil.' },
    { icon: Translate, text: 'Si hablás wichí, podés traducir y grabar audio.' },
  ];

  return (
    <div className="wrap py-10 md:py-14">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="grid content-start gap-6">
          <h1 className="text-[2rem] leading-tight font-bold md:text-[2.4rem]">Para docentes y traductores</h1>
          <p className="max-w-[42ch] text-[1.1rem] text-ink-2">
            No hace falta saber de accesibilidad. Vos subís el material y la plataforma prepara las versiones.
          </p>
          <ul className="grid gap-4" data-nonessential>
            {perks.map((p) => (
              <li key={p.text} className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-control)] bg-tint-1 text-ink">
                  <p.icon size={24} aria-hidden="true" />
                </span>
                <span className="pt-2">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="box p-5 md:p-8">
          <div role="tablist" aria-label="Ingresar o crear cuenta" className="mb-7 grid grid-cols-2 gap-2">
            {[
              { id: 'login', label: 'Ingresar' },
              { id: 'register', label: 'Crear cuenta' },
            ].map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                className="chip control justify-center"
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'login' ? (
              <LoginForm onDone={() => navigate(volver)} />
            ) : (
              <RegisterForm onDone={() => navigate(volver)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
