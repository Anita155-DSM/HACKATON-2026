import { useNavigate } from 'react-router-dom';
import { ArrowRight, CircleHalfTilt, SpeakerHigh, Target, TextAa } from '@phosphor-icons/react';
import { Segmented, Switch } from '../../components/ui.jsx';
import { usePreferences } from '../../context/PreferencesContext.jsx';
import { useDocumentTitle } from '../../lib/hooks.js';
import { say } from '../../lib/speech.js';
import { getCurso, marcarOnboarding } from '../../lib/student.js';

// Primera vez: lengua y preferencias con botones grandes (sección 7, paso 4).
export default function StudentSetup() {
  useDocumentTitle('Tu forma de leer');
  const navigate = useNavigate();
  const { prefs, setPref } = usePreferences();
  const curso = getCurso();

  const done = () => {
    marcarOnboarding();
    navigate('/mis-materiales');
  };

  return (
    <div className="wrap py-10 md:py-14">
      <div className="mx-auto grid max-w-xl gap-10">
        <header className="grid gap-2">
          <h1 className="display text-[2rem] leading-tight">¡Te damos la bienvenida!</h1>
          {curso && <p className="text-[1.1rem] text-ink-2">Ya estás en {curso.name}. Elegí cómo querés tus materiales.</p>}
        </header>

        <section aria-labelledby="lengua-t" className="grid gap-4">
          <h2 id="lengua-t" className="text-[1.4rem] font-bold">
            ¿En qué lengua?
          </h2>
          <Segmented
            legend="Lengua de los materiales"
            name="lengua"
            value={prefs.materialLang}
            onChange={(v) => setPref('materialLang', v)}
            columns={2}
            hint="Si todavía no hay traducción de un material, lo vas a ver en castellano."
            options={[
              { value: 'es', label: 'Castellano' },
              { value: 'wichi', label: 'Wichí' },
            ]}
          />
        </section>

        <section aria-labelledby="leer-t" className="grid gap-3">
          <h2 id="leer-t" className="text-[1.4rem] font-bold">
            ¿Cómo te gusta leer?
          </h2>
          <div className="box grid gap-1 p-2">
            <Switch
              icon={TextAa}
              label="Letra más grande"
              checked={prefs.textScale > 1}
              onChange={(v) => setPref('textScale', v ? 1.3 : 1)}
            />
            <Switch
              icon={CircleHalfTilt}
              label="Alto contraste"
              checked={prefs.contrast}
              onChange={(v) => setPref('contrast', v)}
            />
            <Switch
              icon={SpeakerHigh}
              label="Guía de voz"
              description="Una voz te dice qué hace cada botón."
              checked={prefs.voiceGuide}
              onChange={(v) => {
                setPref('voiceGuide', v);
                if (v) say('Guía de voz activada');
              }}
            />
            <Switch
              icon={Target}
              label="Modo concentración"
              description="Menos cosas en pantalla, de a una parte."
              checked={prefs.focusMode}
              onChange={(v) => setPref('focusMode', v)}
            />
          </div>
          <p className="hint">Podés cambiar esto cuando quieras desde Preferencias, arriba a la derecha.</p>
        </section>

        <button type="button" className="btn btn-primary btn-lg" onClick={done}>
          Ver mis materiales
          <ArrowRight size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
