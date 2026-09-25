import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { AnnouncerProvider, VoiceGuide } from './context/AnnouncerContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { PreferencesProvider } from './context/PreferencesContext.jsx';
import { getCurso } from './lib/student.js';
import LandingPage from './pages/landing/LandingPage.jsx';

// La portada va en el bundle inicial. El resto se carga cuando se usa.
const AppHome = lazy(() => import('./pages/Landing.jsx'));
const StudentJoin = lazy(() => import('./pages/alumno/StudentJoin.jsx'));
const StudentSetup = lazy(() => import('./pages/alumno/StudentSetup.jsx'));
const MyMaterials = lazy(() => import('./pages/alumno/MyMaterials.jsx'));
const MaterialView = lazy(() => import('./pages/MaterialView.jsx'));
const Library = lazy(() => import('./pages/Library.jsx'));
const TeacherAuth = lazy(() => import('./pages/docente/TeacherAuth.jsx'));
const TeacherCourses = lazy(() => import('./pages/docente/TeacherCourses.jsx'));
const TeacherCourse = lazy(() => import('./pages/docente/TeacherCourse.jsx'));
const UploadMaterial = lazy(() => import('./pages/docente/UploadMaterial.jsx'));
const TeacherMaterial = lazy(() => import('./pages/docente/TeacherMaterial.jsx'));
const AccountPages = lazy(() => import('./pages/docente/AccountPages.jsx'));
const TranslateHome = lazy(() => import('./pages/traductor/TranslateHome.jsx'));
const TranslateMaterial = lazy(() => import('./pages/traductor/TranslateMaterial.jsx'));
const Glossary = lazy(() => import('./pages/traductor/Glossary.jsx'));
const Accessibility = lazy(() => import('./pages/Accessibility.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Inicio de la plataforma. Quien ya tiene un curso guardado va directo a sus materiales
// (sección 9, "Cómo se conecta con la app"). Con ?inicio=1 se ve igual esta pantalla.
function Home() {
  const [params] = useSearchParams();
  if (getCurso() && !params.has('inicio')) return <Navigate to="/mis-materiales" replace />;
  return <AppHome />;
}

function RequireAuth({ children, from }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={`/docente?volver=${encodeURIComponent(from || window.location.pathname)}`} replace />;
  return children;
}

export default function App() {
  return (
    <PreferencesProvider>
      <AnnouncerProvider>
        <AuthProvider>
          <VoiceGuide />
          <BrowserRouter>
            <Routes>
              {/* La portada pública, con su propia barra y su pie */}
              <Route path="/" element={<LandingPage />} />

              <Route element={<Layout />}>
                <Route path="plataforma" element={<Home />} />

                <Route path="alumno" element={<StudentJoin />} />
                <Route path="alumno/bienvenida" element={<StudentSetup />} />
                <Route path="mis-materiales" element={<MyMaterials />} />
                <Route path="material/:id" element={<MaterialView />} />
                <Route path="biblioteca" element={<Library />} />

                <Route path="docente" element={<TeacherAuth />} />
                <Route path="docente/cursos" element={<RequireAuth><TeacherCourses /></RequireAuth>} />
                <Route path="docente/cursos/:code" element={<RequireAuth><TeacherCourse /></RequireAuth>} />
                <Route path="docente/subir" element={<RequireAuth><UploadMaterial /></RequireAuth>} />
                <Route path="docente/material/:id" element={<RequireAuth><TeacherMaterial /></RequireAuth>} />
                <Route path="verify-email" element={<AccountPages page="verify" />} />
                <Route path="recuperar-clave" element={<AccountPages page="forgot" />} />
                <Route path="reset-password" element={<AccountPages page="reset" />} />

                <Route path="traducir" element={<TranslateHome />} />
                <Route path="traducir/:id" element={<RequireAuth><TranslateMaterial /></RequireAuth>} />
                <Route path="glosario" element={<Glossary />} />

                <Route path="accesibilidad" element={<Accessibility />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AnnouncerProvider>
    </PreferencesProvider>
  );
}
