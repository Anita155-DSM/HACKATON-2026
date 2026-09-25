import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowsClockwise, BookOpen, SignOut } from '@phosphor-icons/react';
import InstallPrompt from '../../components/InstallPrompt.jsx';
import { MaterialCard } from '../../components/materials.jsx';
import { ConfirmDialog, EmptyState, Loading } from '../../components/ui.jsx';
import { useAnnouncer } from '../../context/AnnouncerContext.jsx';
import { usePreferences } from '../../context/PreferencesContext.jsx';
import { courses, materials as materialsApi } from '../../lib/api.js';
import { gradeLabel, levelLabel } from '../../lib/config.js';
import { useDocumentTitle, useOnline } from '../../lib/hooks.js';
import { estadoMaterial, guardarMaterial, listarGuardados, marcarParaDescargar } from '../../lib/offline/index.js';
import { clearCurso, getCurso, getMaterialesCurso, setCurso, setMaterialesCurso } from '../../lib/student.js';

// Descarga automática al abrir con conexión: primero lo liviano (el material), el audio después.
async function descargarNuevos(lista, soloWifi) {
  const datosMoviles = navigator.connection?.type === 'cellular' || navigator.connection?.saveData;
  for (const m of lista) {
    const { estado } = await estadoMaterial(m.id);
    if (estado === 'guardado') continue;
    if (!navigator.onLine || (soloWifi && datosMoviles)) {
      await marcarParaDescargar(m.id);
      continue;
    }
    try {
      await guardarMaterial(await materialsApi.get(m.id));
    } catch {
      await marcarParaDescargar(m.id);
    }
  }
}

export default function MyMaterials() {
  const curso = getCurso();
  useDocumentTitle('Mis materiales');
  const online = useOnline();
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const { notify } = useAnnouncer();
  const [lista, setLista] = useState(getMaterialesCurso);
  const [loading, setLoading] = useState(online && getMaterialesCurso().length === 0);
  const [otros, setOtros] = useState([]);
  const [confirmOut, setConfirmOut] = useState(false);

  const refresh = async () => {
    if (!curso || !navigator.onLine) return;
    try {
      const r = await courses.byCode(curso.code);
      setCurso({ ...curso, ...r.curso });
      setLista(r.materiales);
      setMaterialesCurso(r.materiales);
      descargarNuevos(r.materiales, prefs.wifiOnly);
    } catch (err) {
      if (err.status === 404) notify('Tu curso ya no existe. Pedile el código nuevo a tu docente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  useEffect(() => {
    listarGuardados().then((all) => setOtros(all.filter((m) => !lista.some((x) => x.id === m.id))));
  }, [lista]);

  if (!curso) return <Navigate to="/alumno" replace />;

  const meta = [levelLabel(curso.level), gradeLabel(curso.level, curso.year), curso.subject].filter(Boolean).join(', ');

  return (
    <div className="wrap py-10 md:py-14">
      <header className="mb-8 grid gap-2">
        <p className="font-bold text-ink-2">Mis materiales</p>
        <h1 className="text-[2rem] leading-tight font-bold md:text-[2.4rem]">{curso.name}</h1>
        {meta && <p className="text-ink-2">{meta}</p>}
        <div className="mt-3 flex flex-wrap gap-2" data-nonessential>
          <button type="button" className="btn btn-secondary" onClick={refresh} disabled={!online}>
            <ArrowsClockwise size={22} aria-hidden="true" />
            Actualizar
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmOut(true)}>
            <SignOut size={22} aria-hidden="true" />
            Cambiar de curso
          </button>
        </div>
      </header>

      <div className="grid gap-10">
        {loading ? (
          <Loading label="Buscando tus materiales" />
        ) : lista.length === 0 ? (
          <EmptyState icon={BookOpen} title="Todavía no hay materiales">
            Cuando tu docente suba uno, aparece acá solo. Si tenés señal, también se guarda en tu celular.
          </EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {lista.map((m) => (
              <li key={m.id}>
                <MaterialCard material={m} headingLevel={2} />
              </li>
            ))}
          </ul>
        )}

        <InstallPrompt />

        {otros.length > 0 && (
          <section aria-labelledby="otros-t" className="grid gap-4" data-nonessential>
            <h2 id="otros-t" className="text-[1.4rem] font-bold">
              Otros materiales guardados en tu celular
            </h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {otros.map((m) => (
                <li key={m.id}>
                  <MaterialCard material={m} headingLevel={3} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ConfirmDialog
        open={confirmOut}
        onClose={() => setConfirmOut(false)}
        title="¿Cambiar de curso?"
        confirmLabel="Sí, cambiar"
        onConfirm={() => {
          clearCurso();
          navigate('/alumno');
        }}
      >
        <p>Vas a necesitar el código del otro curso. Los materiales guardados en tu celular no se borran.</p>
      </ConfirmDialog>
    </div>
  );
}
