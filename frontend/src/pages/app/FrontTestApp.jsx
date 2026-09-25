import { Route, Routes } from "react-router-dom";

// Providers del front-test
import { AnnouncerProvider, VoiceGuide } from "../../../front-test/src/context/AnnouncerContext.jsx";
import { AuthProvider } from "../../../front-test/src/context/AuthContext.jsx";
import { PreferencesProvider } from "../../../front-test/src/context/PreferencesContext.jsx";

// Layout del front-test
import Layout from "../../../front-test/src/components/Layout.jsx";

// Páginas del front-test
import Accessibility from "../../../front-test/src/pages/Accessibility.jsx";
import FrontTestHome from "../../../front-test/src/pages/Landing.jsx";
import Library from "../../../front-test/src/pages/Library.jsx";
import MaterialView from "../../../front-test/src/pages/MaterialView.jsx";
import NotFound from "../../../front-test/src/pages/NotFound.jsx";
import MyMaterials from "../../../front-test/src/pages/alumno/MyMaterials.jsx";
import StudentJoin from "../../../front-test/src/pages/alumno/StudentJoin.jsx";
import StudentSetup from "../../../front-test/src/pages/alumno/StudentSetup.jsx";
import AccountPages from "../../../front-test/src/pages/docente/AccountPages.jsx";
import TeacherAuth from "../../../front-test/src/pages/docente/TeacherAuth.jsx";
import TeacherCourse from "../../../front-test/src/pages/docente/TeacherCourse.jsx";
import TeacherCourses from "../../../front-test/src/pages/docente/TeacherCourses.jsx";
import TeacherMaterial from "../../../front-test/src/pages/docente/TeacherMaterial.jsx";
import UploadMaterial from "../../../front-test/src/pages/docente/UploadMaterial.jsx";
import Glossary from "../../../front-test/src/pages/traductor/Glossary.jsx";
import TranslateHome from "../../../front-test/src/pages/traductor/TranslateHome.jsx";
import TranslateMaterial from "../../../front-test/src/pages/traductor/TranslateMaterial.jsx";

export default function FrontTestApp() {
  return (
    <PreferencesProvider>
      <AnnouncerProvider>
        <AuthProvider>
          <VoiceGuide />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<FrontTestHome />} />
              <Route path="biblioteca" element={<Library />} />
              <Route path="material/:id" element={<MaterialView />} />
              <Route path="alumno" element={<StudentJoin />} />
              <Route path="alumno/bienvenida" element={<StudentSetup />} />
              <Route path="mis-materiales" element={<MyMaterials />} />
              <Route path="docente" element={<TeacherAuth />} />
              <Route path="docente/cursos" element={<TeacherCourses />} />
              <Route path="docente/cursos/:code" element={<TeacherCourse />} />
              <Route path="docente/subir" element={<UploadMaterial />} />
              <Route path="docente/material/:id" element={<TeacherMaterial />} />
              <Route path="verify-email" element={<AccountPages page="verify" />} />
              <Route path="recuperar-clave" element={<AccountPages page="forgot" />} />
              <Route path="reset-password" element={<AccountPages page="reset" />} />
              <Route path="traducir" element={<TranslateHome />} />
              <Route path="traducir/:id" element={<TranslateMaterial />} />
              <Route path="glosario" element={<Glossary />} />
              <Route path="accesibilidad" element={<Accessibility />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </AnnouncerProvider>
    </PreferencesProvider>
  );
}

