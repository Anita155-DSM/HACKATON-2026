// seed.js
import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  sequelize,
  User,
  Course,
  Material,
  Translation,
  GlossaryTerm,
} from "./models/index.js";

const FUENTE_WICHI = "Glosario wichí lhämtes (INAI, 2017)";

const glosarioWichi = [
  { es: "sol", term: "fwala" },
  { es: "luz", term: "isill" },
  { es: "agua", term: "waj" },
  { es: "planta", term: "käs" },
  { es: "árbol", term: "halä" },
  { es: "tierra", term: "honhat" },
  { es: "aire", term: "yalh" },
  { es: "verde", term: "wats´an" },
  { es: "flor", term: "lhawo" },
  { es: "fruto", term: "lhay" },
  { es: "crecer", term: "t´inhayaj" },
  { es: "alimento", term: "lhäk" },
  { es: "calor", term: "chayokwe" },
  { es: "vida", term: "watsancheyaj" },
  { es: "cielo", term: "pul´e" },
];

const TEXTO_FOTOSINTESIS = `La fotosíntesis es el proceso por el cual las plantas fabrican su propio alimento. Usan la luz del sol, el agua que toman de la tierra y el dióxido de carbono del aire. Con la luz, las hojas transforman esos elementos en azúcares que alimentan a la planta y liberan oxígeno, el gas que necesitamos para respirar.`;

const TEXTO_FACIL = `Las plantas hacen su propia comida. Para eso usan tres cosas: la luz del sol, el agua y el aire. Las hojas juntan todo y fabrican el alimento. Además, las plantas largan oxígeno. El oxígeno es el aire que respiramos.`;

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync(); // crea las tablas si no existen (no borra nada)

  // 1) Docente de la demo ------------------------------------------------
  // El modelo User NO hashea la contraseña solo (eso lo hace el controller de
  // registro). Por eso acá la hasheamos a mano; si no, el login de la demo falla.
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
  const passwordHash = await bcrypt.hash("demo1234", rounds);

  const [docente] = await User.findOrCreate({
    where: { email: "docente@demo.com" },
    defaults: {
      firstName: "Profe",
      lastName: "Demo",
      password: passwordHash,
      role: "user",
      isActive: true,
      isEmailVerified: true, // así se loguea sin verificar el mail
    },
  });

  // 2) Curso 4827 --------------------------------------------------------
  const [curso] = await Course.findOrCreate({
    where: { code: "4827" },
    defaults: {
      name: "1° Año - Ciencias Naturales",
      level: "secundaria",
      year: 1,
      subject: "Ciencias Naturales",
      teacherId: docente.id,
    },
  });

  // 3) Material de la demo ----------------------------------------------
  const [material] = await Material.findOrCreate({
    where: { title: "La fotosíntesis", courseId: curso.id },
    defaults: {
      courseId: curso.id,
      createdBy: String(docente.id),
      title: "La fotosíntesis",
      sourceType: "texto",
      accessibleText: TEXTO_FOTOSINTESIS,
      textSource: "pegado",
      easyReadText: TEXTO_FACIL,
      easyReadStatus: "respaldo",
      level: "secundaria",
      grade: 1,
      subject: "Ciencias Naturales",
      visibility: "curso",
    },
  });

  // 4) Traducción al wichí (SIMULADA para la demo) ----------------------
  // Sin traducción real validada por la comunidad, va marcada como simulada.
  // Reemplazar text + audioUrl cuando Leo entregue el contenido real.
  await Translation.findOrCreate({
    where: { materialId: material.id, language: "wichi" },
    defaults: {
      materialId: material.id,
      language: "wichi",
      text: "(Traducción de ejemplo para la demo — pendiente de validación por la comunidad)",
      audioUrl: null,
      validated: false,
      simulated: true,
      author: "Ejemplo",
    },
  });

  // 5) Glosario wichí (15 términos del tema) ----------------------------
  for (const t of glosarioWichi) {
    await GlossaryTerm.findOrCreate({
      where: { es: t.es, language: "wichi" },
      defaults: {
        es: t.es,
        term: t.term,
        language: "wichi",
        source: FUENTE_WICHI,
      },
    });
  }

  console.log("Seed completo:");
  console.log("  Docente:  docente@demo.com / demo1234");
  console.log(`  Curso:    4827 (${curso.name})`);
  console.log(`  Material: ${material.title}`);
  console.log(`  Glosario: ${glosarioWichi.length} términos wichí`);
}

seed()
  .then(async () => {
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Error en el seed:", err);
    await sequelize.close();
    process.exit(1);
  });