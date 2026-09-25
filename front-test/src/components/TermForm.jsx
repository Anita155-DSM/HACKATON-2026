import { useState } from 'react';
import { GLOSSARY_SOURCES } from '../data/glossary.js';
import { WICHI_LANG_TAG } from '../lib/config.js';
import { saveTerm } from '../lib/glossary.js';
import { Field, Switch } from './ui.jsx';
import { CheckCircle } from '@phosphor-icons/react';

// Proponer o completar un término del glosario. "Revisado" lo marca una persona hablante.
export default function TermForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState({
    es: initial?.es || '',
    wichi: initial?.wichi || '',
    variante: initial?.variante || '',
    fuente: initial?.fuente || '',
    tema: initial?.tema || '',
    revisado: initial?.estado === 'validado',
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.es.trim()) errs.es = 'Escribí el término en castellano';
    if (!form.wichi.trim()) errs.wichi = 'Escribí el término en wichí';
    if (!form.fuente.trim()) errs.fuente = 'Indicá de dónde sale (un diccionario o la persona que lo propone)';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const saved = saveTerm({
      id: initial?.id,
      es: form.es,
      wichi: form.wichi.trim(),
      variante: form.variante.trim(),
      fuente: form.fuente.trim(),
      tema: form.tema.trim(),
      lengua: 'wichi',
      estado: form.revisado ? 'validado' : 'propuesto',
    });
    onSaved(saved);
  };

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      <Field label="En castellano" required error={errors.es}>
        {(p) => <input {...p} className="input" value={form.es} onChange={set('es')} readOnly={Boolean(initial?.es)} />}
      </Field>
      <Field label="En wichí" required error={errors.wichi}>
        {(p) => <input {...p} lang={WICHI_LANG_TAG} className="input" value={form.wichi} onChange={set('wichi')} />}
      </Field>
      <Field label="Variante o forma de escritura" hint="El wichí tiene variantes. Anotá cuál es.">
        {(p) => <input {...p} className="input" value={form.variante} onChange={set('variante')} />}
      </Field>
      <Field label="Fuente" required hint="Un diccionario citado o el nombre de quien lo propone." error={errors.fuente}>
        {(p) => (
          <>
            <input {...p} className="input" list="fuentes-glosario" value={form.fuente} onChange={set('fuente')} />
            <datalist id="fuentes-glosario">
              {GLOSSARY_SOURCES.map((s) => (
                <option key={s.id} value={s.label} />
              ))}
            </datalist>
          </>
        )}
      </Field>
      <div className="rounded-[var(--radius-control)] border border-line">
        <Switch
          icon={CheckCircle}
          label="Lo revisó una persona hablante"
          description="Solo los términos revisados se sugieren como seguros."
          checked={form.revisado}
          onChange={(v) => setForm({ ...form, revisado: v })}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Guardar término
        </button>
      </div>
    </form>
  );
}
