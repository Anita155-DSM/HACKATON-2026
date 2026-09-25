import { Link } from 'react-router-dom';
import { Compass } from '@phosphor-icons/react';
import { EmptyState } from '../components/ui.jsx';
import { useDocumentTitle } from '../lib/hooks.js';

export default function NotFound() {
  useDocumentTitle('Página no encontrada');
  return (
    <div className="wrap py-14">
      <h1 className="sr-only">Página no encontrada</h1>
      <EmptyState
        icon={Compass}
        title="No encontramos esta página"
        action={
          <Link to="/" className="btn btn-primary">
            Ir al inicio
          </Link>
        }
      >
        Puede que el enlace esté mal escrito o que la página ya no exista.
      </EmptyState>
    </div>
  );
}
