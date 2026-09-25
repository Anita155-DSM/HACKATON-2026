import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignIn, SpeakerHigh } from '@phosphor-icons/react';
import { NumericKeypad, VoiceInputButton } from '../../components/inputs.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { usePreferences } from '../../context/PreferencesContext.jsx';
import { courses } from '../../lib/api.js';
import { useDocumentTitle } from '../../lib/hooks.js';
import { canSpeak, digitsFromSpeech, say } from '../../lib/speech.js';
import { onboardingHecho, setCurso, setMaterialesCurso } from '../../lib/student.js';

const PREGUNTA = 'Hola. ¿Cuál es el código de tu curso? Son cuatro números. Te los da tu docente.';

export default function StudentJoin() {
  useDocumentTitle('Entrar con el código');
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const { notify } = useAnnouncer();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  // La voz saluda y pregunta el código (sección 7). Automático solo con la guía de voz activa,
  // para no superponerse con un lector de pantalla. Siempre está el botón para escucharlo.
  useEffect(() => {
    if (prefs.voiceGuide) setTimeout(() => say(PREGUNTA), 400);
  }, [prefs.voiceGuide]);

  const setDigits = (v) => {
    setError('');
    setCode(v.replace(/\D/g, '').slice(0, 4));
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (code.length !== 4) {
      setError('El código tiene 4 números.');
      inputRef.current?.focus();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { curso, materiales } = await courses.byCode(code);
      setCurso(curso);
      setMaterialesCurso(materiales);
      notify(`Entraste a ${curso.name}`, 'success');
      navigate(onboardingHecho() ? '/mis-materiales' : '/alumno/bienvenida');
    } catch (err) {
      const msg =
        err.status === 404
          ? 'No encontramos un curso con ese código. Revisalo con tu docente.'
          : err.network && !navigator.onLine
            ? 'Para entrar la primera vez hace falta conexión. Probá con el wifi de la escuela.'
            : err.network
              ? 'No pudimos conectar con el servidor. Probá de nuevo en un rato.'
              : err.message;
      setError(msg);
      notify(msg, 'error');
      inputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap py-10 md:py-14">
      <div className="mx-auto grid max-w-md gap-7">
        <header className="grid gap-3">
          <h1 className="text-[2rem] leading-tight font-bold">¿Cuál es el código de tu curso?</h1>
          <p className="text-[1.1rem] text-ink-2">Son 4 números. Te los da tu docente. Lo escribís una sola vez.</p>
          {canSpeak && (
            <div>
              <button type="button" className="btn btn-ghost -ml-3" onClick={() => say(PREGUNTA)}>
                <SpeakerHigh size={24} aria-hidden="true" />
                Escuchar la pregunta
              </button>
            </div>
          )}
        </header>

        <form onSubmit={submit} className="grid gap-5" noValidate>
          <div className="field">
            <label htmlFor="codigo" className="label">
              Código del curso
            </label>
            <input
              ref={inputRef}
              id="codigo"
              className="input text-center font-bold tracking-[0.5em] !text-[2.4rem] !min-h-20"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]*"
              maxLength={4}
              value={code}
              onChange={(e) => setDigits(e.target.value)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'codigo-error' : 'codigo-ayuda'}
            />
            {error ? (
              <p id="codigo-error" className="error-text" role="alert">
                {error}
              </p>
            ) : (
              <p id="codigo-ayuda" className="hint">
                Podés tocar los números de abajo, escribirlos o decirlos en voz alta.
              </p>
            )}
          </div>

          <NumericKeypad
            disabled={busy}
            onDigit={(d) => code.length < 4 && setDigits(code + d)}
            onDelete={() => setDigits(code.slice(0, -1))}
          />

          <VoiceInputButton
            label="Decir el código"
            className="btn-lg"
            onResult={(text) => {
              const digits = digitsFromSpeech(text);
              setDigits(digits);
              if (digits.length === 4) say(`Escuché ${digits.split('').join(' ')}`);
              else setError(`Escuché "${text}". Probá de nuevo o tocá los números.`);
            }}
            onError={setError}
          />

          <button type="submit" className="btn btn-primary btn-lg" disabled={busy} aria-busy={busy}>
            <SignIn size={24} aria-hidden="true" />
            {busy ? 'Buscando tu curso' : 'Entrar'}
          </button>
        </form>

        <div className="grid gap-2 border-t border-line pt-6 text-ink-2" data-nonessential>
          <p>
            ¿No tenés código? Podés <Link to="/biblioteca">explorar la biblioteca pública</Link> sin código.
          </p>
          <p className="text-[0.9rem]">Para probar la demo, usá el código 4827.</p>
        </div>
      </div>
    </div>
  );
}
