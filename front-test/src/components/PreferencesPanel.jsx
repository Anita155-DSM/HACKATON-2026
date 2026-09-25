import {
  ArrowCounterClockwise,
  BellRinging,
  CircleHalf,
  CircleHalfTilt,
  Monitor,
  Moon,
  Pause,
  SpeakerHigh,
  Sun,
  Target,
  TextAa,
  WifiHigh,
} from '@phosphor-icons/react';
import { TEXT_SCALES, usePreferences } from '../context/PreferencesContext.jsx';
import { canSpeak, say } from '../lib/speech.js';
import { sounds } from '../lib/sounds.js';
import { Dialog, Segmented, Switch } from './ui.jsx';

function Section({ title, children }) {
  return (
    <section className="grid gap-3 border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-[1.1rem] font-bold">{title}</h3>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

export default function PreferencesPanel({ open, onClose }) {
  const { prefs, setPref, reset } = usePreferences();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Preferencias"
      side
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            <ArrowCounterClockwise size={22} aria-hidden="true" />
            Volver a lo de siempre
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Listo
          </button>
        </>
      }
    >
      <p className="mb-6 text-ink-2">
        Elegí cómo querés ver y escuchar. Se guarda solo en este celular y podés cambiarlo cuando quieras.
      </p>

      <div className="grid gap-6">
        <Section title="Ver">
          <Segmented
            legend="Tamaño de todo"
            hint="Agranda la letra, los botones y los espacios."
            name="textScale"
            value={prefs.textScale}
            onChange={(v) => setPref('textScale', v)}
            columns={2}
            options={TEXT_SCALES.map((s) => ({
              value: s.value,
              label: s.label,
              style: { fontSize: `${0.85 + (s.value - 1) * 1.2}rem` },
            }))}
          />
          <div className="mt-3">
            <Segmented
              legend="Colores"
              name="theme"
              value={prefs.theme}
              onChange={(v) => setPref('theme', v)}
              options={[
                { value: 'light', label: 'Claro', icon: Sun },
                { value: 'dark', label: 'Oscuro', icon: Moon },
                { value: 'system', label: 'Como el celular', icon: Monitor },
              ]}
            />
          </div>
          <div className="mt-2 grid gap-1">
            <Switch
              icon={CircleHalfTilt}
              label="Alto contraste"
              description="Colores más fuertes y bordes marcados."
              checked={prefs.contrast}
              onChange={(v) => setPref('contrast', v)}
            />
            <Switch
              icon={TextAa}
              label="Letra más fácil de leer"
              description="Más espacio entre letras, palabras y líneas."
              checked={prefs.readableFont}
              onChange={(v) => setPref('readableFont', v)}
            />
          </div>
        </Section>

        <Section title="Escuchar">
          <Switch
            icon={SpeakerHigh}
            label="Guía de voz"
            description="Una voz dice qué hace cada botón y lee los avisos. Si ya usás un lector de pantalla, no hace falta."
            checked={prefs.voiceGuide}
            onChange={(v) => {
              setPref('voiceGuide', v);
              if (v) say('Guía de voz activada');
            }}
          />
          {!canSpeak && <p className="hint px-3">Este navegador no tiene voz. Probá con Chrome.</p>}
          <div className="px-3">
            <Segmented
              legend="Velocidad de la voz"
              name="voiceRate"
              value={prefs.voiceRate}
              onChange={(v) => {
                setPref('voiceRate', v);
                setTimeout(() => say('Así suena la voz'), 50);
              }}
              columns={3}
              options={[
                { value: 0.8, label: 'Lenta' },
                { value: 1, label: 'Normal' },
                { value: 1.25, label: 'Rápida' },
              ]}
            />
          </div>
          <Switch
            icon={BellRinging}
            label="Sonidos del sistema"
            description="Un sonido corto cuando algo sale bien o mal. El aviso también aparece escrito."
            checked={prefs.sounds}
            onChange={(v) => {
              setPref('sounds', v);
              if (v) setTimeout(sounds.success, 250);
            }}
          />
        </Section>

        <Section title="Concentrarme">
          <Switch
            icon={Target}
            label="Modo concentración"
            description="Oculta todo lo que no es el contenido, muestra el material de a una parte y quita las animaciones."
            checked={prefs.focusMode}
            onChange={(v) => setPref('focusMode', v)}
          />
          <Switch
            icon={Pause}
            label="Menos movimiento"
            description="Quita las animaciones de la pantalla."
            checked={prefs.reduceMotion}
            onChange={(v) => setPref('reduceMotion', v)}
          />
        </Section>

        <Section title="Materiales">
          <Segmented
            legend="Lengua de los materiales"
            hint="Si hay traducción, el material se abre en esa lengua."
            name="materialLang"
            value={prefs.materialLang}
            onChange={(v) => setPref('materialLang', v)}
            columns={2}
            options={[
              { value: 'es', label: 'Castellano' },
              { value: 'wichi', label: 'Wichí' },
            ]}
          />
          <Switch
            icon={WifiHigh}
            label="Descargar solo con wifi"
            description="Los materiales nuevos se bajan cuando haya wifi, para cuidar tus datos."
            checked={prefs.wifiOnly}
            onChange={(v) => setPref('wifiOnly', v)}
          />
        </Section>

        <p className="flex items-start gap-2 text-[0.9rem] text-ink-2">
          <CircleHalf size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
          No te pedimos datos personales ni de salud. Solo guardamos cómo te gusta usar la app.
        </p>
      </div>
    </Dialog>
  );
}
