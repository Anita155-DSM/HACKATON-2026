import { useState } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';

export default function PasswordInput({ id, value, onChange, autoComplete = 'current-password', ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="input min-w-0 flex-1"
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        {...rest}
      />
      <button type="button" className="btn btn-secondary !px-3" onClick={() => setShow((v) => !v)} aria-pressed={show}>
        {show ? <EyeSlash size={22} aria-hidden="true" /> : <Eye size={22} aria-hidden="true" />}
        <span className="sr-only">{show ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
      </button>
    </div>
  );
}

// Mismas reglas que backend/middlewares/validator/common.rules.js
export function passwordProblems(pw) {
  const p = [];
  if (pw.length < 8 || pw.length > 64) p.push('entre 8 y 64 caracteres');
  if (!/[a-z]/.test(pw)) p.push('una minúscula');
  if (!/[A-Z]/.test(pw)) p.push('una mayúscula');
  if (!/\d/.test(pw)) p.push('un número');
  if (/\s/.test(pw)) p.push('sin espacios');
  return p;
}
