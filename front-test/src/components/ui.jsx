import { useEffect, useId, useRef } from 'react';
import { X } from '@phosphor-icons/react';

/* Interruptor accesible (role="switch"). Toda la fila es el área táctil. */
export function Switch({ checked, onChange, label, description, icon: Icon }) {
  const id = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={description ? `${id}-d` : undefined}
      onClick={() => onChange(!checked)}
      className="control group flex w-full items-center gap-4 rounded-[var(--radius-control)] px-3 py-3 text-left hover:bg-surface-2"
    >
      {Icon && (
        <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-control)] bg-soft text-[#0b2540] hc:bg-transparent hc:text-ink">
          <Icon size={24} aria-hidden="true" />
        </span>
      )}
      <span className="flex-1">
        <span className="block font-bold">{label}</span>
        {description && (
          <span id={`${id}-d`} className="block text-[0.9rem] text-ink-2">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors ${
          checked ? 'border-ink bg-accent' : 'border-control bg-surface-2'
        }`}
      >
        <span
          className={`absolute top-1/2 size-6 -translate-y-1/2 rounded-full bg-ink transition-transform duration-200 ${
            checked ? 'translate-x-[1.55rem]' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className="sr-only">{checked ? 'Activado' : 'Desactivado'}</span>
    </button>
  );
}

/* Grupo de opciones (radios nativos con aspecto de botón) */
export function Segmented({ legend, name, value, onChange, options, hint, columns = 'auto' }) {
  const id = useId();
  return (
    <fieldset aria-describedby={hint ? `${id}-h` : undefined}>
      <legend className="label mb-2">{legend}</legend>
      {hint && (
        <p id={`${id}-h`} className="hint -mt-1 mb-2">
          {hint}
        </p>
      )}
      <div
        className={columns === 'auto' ? 'flex flex-wrap gap-2' : 'grid gap-2'}
        style={columns !== 'auto' ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {options.map((opt) => (
          <label key={String(opt.value)} className="chip control justify-center">
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.icon && <opt.icon size={22} aria-hidden="true" />}
            <span style={opt.style}>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* Campo con label arriba, ayuda y error abajo */
export function Field({ label, hint, error, children, id: givenId, required }) {
  const autoId = useId();
  const id = givenId || autoId;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-ink-2 font-normal"> (obligatorio)</span>}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? 'true' : undefined })}
      {hint && (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="error-text">
          {error}
        </p>
      )}
    </div>
  );
}

export function PageHeader({ title, children, actions }) {
  return (
    <header className="mb-8 grid gap-3">
      <h1 className="text-[2rem] leading-tight font-bold md:text-[2.4rem]">{title}</h1>
      {children && <div className="reading text-ink-2 text-[1.05rem]">{children}</div>}
      {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function Badge({ tone = 'neutral', children, icon: Icon }) {
  const tones = {
    neutral: 'bg-surface-2 text-ink border-line',
    ok: 'bg-ok-bg text-ok border-ok',
    warn: 'bg-warn-bg text-warn border-warn',
    danger: 'bg-danger-bg text-danger border-danger',
    accent: 'bg-soft text-[#0b2540] border-soft hc:bg-transparent hc:text-ink hc:border-ink',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 text-[0.85rem] font-bold ${tones[tone]}`}>
      {Icon && <Icon size={16} weight="bold" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="box flex flex-col items-start gap-3 p-6 md:p-8">
      {Icon && (
        <span className="grid size-14 place-items-center rounded-[var(--radius-box)] bg-soft text-[#0b2540] hc:bg-transparent hc:text-ink">
          <Icon size={30} aria-hidden="true" />
        </span>
      )}
      <h2 className="text-[1.3rem] font-bold">{title}</h2>
      {children && <div className="reading text-ink-2">{children}</div>}
      {action}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="box grid gap-3 p-5" aria-hidden="true">
      <div className="skeleton h-6 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
      <div className="flex gap-2">
        <div className="skeleton h-8 w-20" />
        <div className="skeleton h-8 w-24" />
      </div>
    </div>
  );
}

export function Loading({ label = 'Cargando', cards = 3 }) {
  return (
    <div role="status" className="grid gap-4">
      <span className="sr-only">{label}</span>
      {Array.from({ length: cards }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ErrorBox({ title = 'No pudimos cargar esto', children, onRetry }) {
  return (
    <div role="alert" className="box grid gap-3 border-danger! p-6">
      <h2 className="text-[1.2rem] font-bold text-danger">{title}</h2>
      {children && <p>{children}</p>}
      {onRetry && (
        <div>
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            Probar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}

/* Diálogo modal nativo: atrapa el foco y se cierra con Escape */
export function Dialog({ open, onClose, title, children, footer, size = 'md', side = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' };
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className={
        side
          ? 'box m-0 ml-auto h-dvh max-h-dvh w-full max-w-lg rounded-none rounded-l-[var(--radius-box)] bg-surface p-0 text-ink backdrop:bg-[#0b2540]/45 md:w-[30rem]'
          : `box m-auto w-[calc(100%-2rem)] ${sizes[size]} bg-surface p-0 text-ink backdrop:bg-[#0b2540]/45`
      }
    >
      {open && (
        <div className={`flex flex-col ${side ? 'h-full' : 'max-h-[85dvh]'}`}>
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 id="dialog-title" className="text-[1.35rem] font-bold">
              {title}
            </h2>
            <button type="button" className="btn btn-ghost !p-2" onClick={onClose}>
              <X size={24} aria-hidden="true" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, children, confirmLabel = 'Confirmar', danger }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}
