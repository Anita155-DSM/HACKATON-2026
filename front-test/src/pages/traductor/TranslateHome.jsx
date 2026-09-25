import { Link } from 'react-router-dom';
import { ArrowRight, BookBookmark, Microphone, PencilLine, SignIn } from '@phosphor-icons/react';
import { VersionList, materialMeta } from '../../components/materials.jsx';
import { ErrorBox, Loading, PageHeader } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { materials, versionesDe } from '../../lib/api.js';
import { useAsync, useDocumentTitle } from '../../lib/hooks.js';

export default function TranslateHome() {
  useDocumentTitle('Quiero traducir');
  const { user } = useAuth();
  const { loading, error, data, reload } = useAsync(() => materials.listPublic({}), []);

  const steps = [
    { icon: BookBookmark, text: 'Leés el material en lectura fácil, con sugerencias del glosario.' },
    { icon: PencilLine, text: 'Escribís la traducción al wichí.' },
    { icon: Microphone, text: 'Grabás el audio. En muchas comunidades se aprende escuchando.' },
  ];

  return (
    <div className="wrap py-10 md:py-14">
      <PageHeader title="Quiero traducir">
        Buscamos docentes EIB, MEMA y personas hablantes de wichí. La plataforma prepara el texto; la traducción la hace y la revisa la
        comunidad.
      </PageHeader>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
        <div className="grid content-start gap-8">
          <ol className="grid gap-4">
            {steps.map((s) => (
              <li key={s.text} className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-control)] bg-tint-1 text-ink">
                  <s.icon size={26} aria-hidden="true" />
                </span>
                <span className="pt-2.5">{s.text}</span>
              </li>
            ))}
          </ol>

          <div className="grid gap-3 rounded-[var(--radius-box)] border-l-4 border-accent-strong bg-surface p-5 hc:border-ink">
            <h2 className="text-[1.15rem] font-bold">Cómo cuidamos la lengua</h2>
            <ul className="grid list-disc gap-2 pl-5 text-ink-2">
              <li>No usamos traductores automáticos para el wichí.</li>
              <li>Las palabras escolares nuevas las crea o elige la comunidad.</li>
              <li>Cada término guarda su fuente y su variante.</li>
              <li>Las traducciones y el glosario son de la comunidad que los hizo.</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            {!user && (
              <Link to="/docente?volver=/traducir" className="btn btn-primary">
                <SignIn size={22} aria-hidden="true" />
                Ingresar para traducir
              </Link>
            )}
            <Link to="/glosario" className="btn btn-secondary">
              <BookBookmark size={22} aria-hidden="true" />
              Ver el glosario
            </Link>
          </div>
        </div>

        <section aria-labelledby="para-t" className="grid content-start gap-4">
          <h2 id="para-t" className="text-[1.4rem] font-bold">
            Materiales para traducir
          </h2>
          {!user && <p className="text-ink-2">Para guardar una traducción necesitás una cuenta, la misma que usan los docentes.</p>}
          {loading ? (
            <Loading cards={3} />
          ) : error ? (
            <ErrorBox onRetry={reload}>{error.message}</ErrorBox>
          ) : (
            <ul className="grid gap-3">
              {data.map((m) => {
                const tieneWichi = versionesDe(m).includes('wichi');
                return (
                  <li key={m.id}>
                    <Link
                      to={`/traducir/${m.id}`}
                      className="box group grid gap-2 p-5 text-ink no-underline transition-transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[1.2rem] font-bold">{m.title}</span>
                        <ArrowRight size={22} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="text-ink-2">{materialMeta(m)}</span>
                      <span className="text-[0.9rem] font-bold">
                        {tieneWichi ? 'Ya tiene una traducción. Podés sumar otra o revisarla.' : 'Todavía sin traducción al wichí'}
                      </span>
                      <VersionList versiones={versionesDe(m)} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
