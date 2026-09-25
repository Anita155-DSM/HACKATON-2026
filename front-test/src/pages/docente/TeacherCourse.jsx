import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, FileText, PencilSimple, UploadSimple } from '@phosphor-icons/react';
import { VersionList } from '../../components/materials.jsx';
import { EmptyState, ErrorBox, Loading } from '../../components/ui.jsx';
import { courses } from '../../lib/api.js';
import { gradeLabel, levelLabel } from '../../lib/config.js';
import { useAsync, useDocumentTitle } from '../../lib/hooks.js';
import { BigCode, CodeActions } from './TeacherCourses.jsx';

export default function TeacherCourse() {
  const { code } = useParams();
  const { loading, error, data, reload } = useAsync(() => courses.byCode(code), [code]);
  useDocumentTitle(data?.curso?.name || 'Curso');

  return (
    <div className="wrap py-8 md:py-12">
      <Link to="/docente/cursos" className="btn btn-ghost -ml-3 mb-4">
        <ArrowLeft size={22} aria-hidden="true" />
        Tus cursos
      </Link>

      {loading ? (
        <Loading cards={2} />
      ) : error ? (
        <>
          <h1 className="sr-only">Curso</h1>
          <ErrorBox onRetry={reload}>{error.message}</ErrorBox>
        </>
      ) : (
        <div className="grid gap-10">
          <header className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="grid gap-2">
              <p className="font-bold text-ink-2">
                {[levelLabel(data.curso.level), gradeLabel(data.curso.level, data.curso.year), data.curso.subject]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <h1 className="display text-[2rem] leading-tight md:text-[2.4rem]">{data.curso.name}</h1>
              <div className="mt-3">
                <Link to={`/docente/subir?curso=${data.curso.id}`} className="btn btn-primary">
                  <UploadSimple size={22} aria-hidden="true" />
                  Subir material
                </Link>
              </div>
            </div>
            <div className="box grid justify-items-start gap-3 p-5">
              <p className="font-bold">Código para tus alumnos</p>
              <BigCode code={data.curso.code} />
              <CodeActions code={data.curso.code} />
            </div>
          </header>

          <section aria-labelledby="mats-t" className="grid gap-4">
            <h2 id="mats-t" className="text-[1.4rem] font-bold">
              Materiales del curso
            </h2>
            {data.materiales.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Todavía no subiste materiales"
                action={
                  <Link to={`/docente/subir?curso=${data.curso.id}`} className="btn btn-secondary">
                    Subir el primero
                  </Link>
                }
              >
                Apenas lo subas, tus alumnos lo ven en "Mis materiales".
              </EmptyState>
            ) : (
              <ul className="grid gap-3">
                {data.materiales.map((m) => (
                  <li key={m.id} className="box grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="grid gap-2">
                      <h3 className="text-[1.2rem] font-bold">{m.title}</h3>
                      <VersionList versiones={m.versiones} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/docente/material/${m.id}`} className="btn btn-secondary">
                        <PencilSimple size={20} aria-hidden="true" />
                        Revisar
                      </Link>
                      <Link to={`/material/${m.id}`} className="btn btn-ghost">
                        <Eye size={20} aria-hidden="true" />
                        Ver como alumno
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
