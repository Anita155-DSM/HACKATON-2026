// Curso del alumno guardado en el celular. Con esto, abrir la app lleva directo a "Mis materiales".
import { load, save } from './storage.js';

export const getCurso = () => load('curso', null);
export const setCurso = (curso) => save('curso', curso);
export const clearCurso = () => {
  save('curso', null);
  save('curso-materiales', null);
};

// Última lista de materiales del curso, para mostrarla sin señal
export const getMaterialesCurso = () => load('curso-materiales', []);
export const setMaterialesCurso = (lista) => save('curso-materiales', lista);

export const onboardingHecho = () => load('onboarding', false);
export const marcarOnboarding = () => save('onboarding', true);
