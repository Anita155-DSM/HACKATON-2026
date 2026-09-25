import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PasswordInput, { passwordProblems } from '../../components/PasswordInput.jsx';
import { Field, PageHeader } from '../../components/ui.jsx';
import { auth } from '../../lib/api.js';
import { useDocumentTitle } from '../../lib/hooks.js';

// Pantallas a las que llegan los enlaces de los emails del backend:
// EMAIL_VERIFY_URL=/verify-email?token=...  y  RESET_PASSWORD_URL=/reset-password?token=...

function Verify() {
  useDocumentTitle('Confirmar email');
  const [params] = useSearchParams();
  const [state, setState] = useState({ status: 'loading', msg: '' });
  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setState({ status: 'error', msg: 'El enlace no tiene el código de verificación.' });
      return;
    }
    auth
      .verifyEmail(token)
      .then((r) => setState({ status: 'ok', msg: r.mensaje }))
      .catch((err) => setState({ status: 'error', msg: err.message }));
  }, [params]);
  return (
    <>
      <PageHeader title="Confirmar email" />
      <div role="status" className="box grid gap-4 p-6">
        <p className={state.status === 'error' ? 'font-bold text-danger' : 'font-bold'}>
          {state.status === 'loading' ? 'Confirmando' : state.msg}
        </p>
        {state.status === 'ok' && (
          <Link to="/docente" className="btn btn-primary justify-self-start">
            Ingresar
          </Link>
        )}
      </div>
    </>
  );
}

function Forgot() {
  useDocumentTitle('Recuperar contraseña');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeader title="Recuperar contraseña">Te mandamos un enlace para crear una contraseña nueva.</PageHeader>
      {msg ? (
        <p role="status" className="box p-6 font-bold">
          {msg}
        </p>
      ) : (
        <form
          className="box grid gap-5 p-6"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            try {
              setMsg((await auth.forgotPassword(email.trim())).mensaje);
            } catch (err) {
              setError(err.porCampo?.email || err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Email" error={error}>
            {(p) => <input {...p} type="email" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          </Field>
          <button type="submit" className="btn btn-primary justify-self-start" disabled={busy}>
            Enviar enlace
          </button>
        </form>
      )}
    </>
  );
}

function Reset() {
  useDocumentTitle('Nueva contraseña');
  const [params] = useSearchParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeader title="Nueva contraseña" />
      {done ? (
        <div role="status" className="box grid gap-4 p-6">
          <p className="font-bold">{done}</p>
          <Link to="/docente" className="btn btn-primary justify-self-start">
            Ingresar
          </Link>
        </div>
      ) : (
        <form
          className="box grid gap-5 p-6"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const errs = {};
            const probs = passwordProblems(form.password);
            if (probs.length) errs.password = `Le falta: ${probs.join(', ')}`;
            if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
            setErrors(errs);
            if (Object.keys(errs).length) return;
            setBusy(true);
            try {
              setDone((await auth.resetPassword({ token: params.get('token'), ...form })).mensaje);
            } catch (err) {
              setErrors({ ...err.porCampo, general: err.message });
            } finally {
              setBusy(false);
            }
          }}
        >
          {errors.general && (
            <p role="alert" className="error-text">
              {errors.general}
            </p>
          )}
          <Field label="Contraseña nueva" hint="Entre 8 y 64 caracteres, con una mayúscula, una minúscula y un número." error={errors.password}>
            {(p) => (
              <PasswordInput {...p} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            )}
          </Field>
          <Field label="Repetí la contraseña" error={errors.confirmPassword}>
            {(p) => (
              <PasswordInput
                {...p}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            )}
          </Field>
          <button type="submit" className="btn btn-primary justify-self-start" disabled={busy}>
            Guardar contraseña
          </button>
        </form>
      )}
    </>
  );
}

export default function AccountPages({ page }) {
  return (
    <div className="wrap py-10 md:py-14">
      <div className="mx-auto max-w-lg">
        {page === 'verify' && <Verify />}
        {page === 'forgot' && <Forgot />}
        {page === 'reset' && <Reset />}
      </div>
    </div>
  );
}
