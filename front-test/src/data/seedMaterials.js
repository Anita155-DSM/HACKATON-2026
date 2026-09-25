// Materiales de ejemplo para la demo (el documento pide de 3 a 5 por nivel).
// Textos escritos por el equipo, con licencia abierta. Tienen la misma forma que
// GET /api/materials/:id, así la app los trata igual que a los del servidor.
// La lectura fácil de "La fotosíntesis" es la misma del respaldo del backend
// (backend/data/lectura-facil-respaldo.json).

const EQUIPO = {
  license: 'CC BY-SA 4.0',
  source: 'Texto de ejemplo escrito por el equipo para la demo',
  author: 'Equipo FormA',
};

const base = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const DEMO_COURSE_ID = '00000000-0000-4000-9000-000000004827';

export const SEED_MATERIALS = [
  {
    id: base(1),
    title: 'Las fracciones',
    level: 'primaria',
    grade: 4,
    subject: 'Matemática',
    visibility: 'publico',
    accessibleText: `Las fracciones

Una fracción sirve para nombrar una parte de algo que está dividido en partes iguales. Si cortamos una pizza en 4 porciones iguales y comemos 1, comimos un cuarto de la pizza. Se escribe 1/4.

Las partes de una fracción

El número de abajo se llama denominador. Dice en cuántas partes iguales se dividió el entero. El número de arriba se llama numerador. Dice cuántas de esas partes tomamos.

Fracciones en la vida diaria

Usamos fracciones todo el tiempo: medio litro de leche, un cuarto de hora, tres cuartos de kilo de harina. Cuando el numerador y el denominador son iguales, como en 4/4, tenemos el entero completo.`,
    easyReadText: `Las fracciones

Una fracción es una parte de algo.
El entero se corta en partes iguales.

Ejemplo
- Cortamos una pizza en 4 partes iguales.
- Comemos 1 parte.
- Comimos 1/4 de la pizza. Se lee "un cuarto".

Los números de la fracción
- El número de abajo dice en cuántas partes cortamos.
- El número de arriba dice cuántas partes tomamos.

Si los dos números son iguales, tenemos el entero.
Por ejemplo, 4/4 es la pizza completa.`,
  },
  {
    id: base(2),
    title: 'El ciclo del agua',
    level: 'primaria',
    grade: 5,
    subject: 'Ciencias Naturales',
    visibility: 'publico',
    accessibleText: `El ciclo del agua

El agua de la Tierra está siempre en movimiento. Pasa del río al aire, del aire a las nubes y de las nubes otra vez a la tierra. A este recorrido lo llamamos ciclo del agua.

Evaporación

El sol calienta el agua de ríos, lagunas y esteros. El agua se transforma en vapor, que es invisible, y sube al aire.

Condensación

Arriba el aire está más frío. El vapor se enfría y forma gotitas muy pequeñas. Muchas gotitas juntas forman las nubes.

Precipitación

Cuando las gotas se juntan y pesan mucho, caen como lluvia. El agua vuelve a los ríos, a los esteros y a la tierra, y el ciclo empieza otra vez.`,
    easyReadText: `El ciclo del agua

El agua siempre se mueve.
Va del río al aire y del aire vuelve a la tierra.
Este camino se llama ciclo del agua.

1. El sol calienta el agua
El agua de los ríos se calienta.
Se hace vapor y sube al aire.

2. Se forman las nubes
Arriba hace frío.
El vapor se hace gotitas.
Muchas gotitas juntas son una nube.

3. Llueve
Las gotas pesan y caen.
Eso es la lluvia.
El agua vuelve a los ríos y empieza otra vez.`,
  },
  {
    id: base(3),
    title: 'El monte chaqueño',
    level: 'primaria',
    grade: 4,
    subject: 'Ciencias Sociales',
    visibility: 'publico',
    accessibleText: `El monte chaqueño

Gran parte de Formosa está cubierta por el monte chaqueño, un bosque que se extiende también por Chaco, Salta, Santiago del Estero, Paraguay y Bolivia.

Plantas del monte

En el monte crecen árboles como el quebracho colorado, el algarrobo y el palo santo. Sus maderas son muy duras. El algarrobo da frutos que se usan como alimento.

Animales del monte

Viven el tatú carreta, el oso hormiguero, el pecarí y muchas aves. Algunos, como el yaguareté, están en peligro porque el monte se achica.

El monte y las personas

Para los pueblos originarios de Formosa, el monte da alimento, remedios, agua y materiales para hacer casas y artesanías. Cuidarlo es cuidar la vida de todos.`,
    easyReadText: `El monte chaqueño

El monte es un bosque.
Hay mucho monte en Formosa.

Árboles del monte
- Quebracho colorado.
- Algarrobo. Da frutos que se comen.
- Palo santo.

Animales del monte
- Tatú carreta.
- Oso hormiguero.
- Pecarí.
- Muchos pájaros.

Algunos animales están en peligro.
El monte se hace más chico.

El monte da comida, remedios y materiales.
Cuidar el monte es cuidar la vida.`,
  },
  {
    id: base(4),
    title: 'Los sustantivos',
    level: 'primaria',
    grade: 3,
    subject: 'Lengua',
    visibility: 'publico',
    accessibleText: `Los sustantivos

Los sustantivos son las palabras que usamos para nombrar personas, animales, lugares, cosas y sentimientos.

Sustantivos comunes y propios

Los sustantivos comunes nombran cualquier elemento de un grupo: río, escuela, perro. Los sustantivos propios nombran a uno en particular y se escriben con mayúscula: Pilcomayo, Formosa, Lucía.

Género y número

Los sustantivos pueden ser femeninos o masculinos, como la mesa o el banco. También pueden estar en singular, si nombran uno solo, o en plural, si nombran varios: libro, libros.`,
    easyReadText: `Los sustantivos

Un sustantivo es una palabra que nombra.
Nombra personas, animales, lugares y cosas.

Hay dos clases
- Comunes: nombran cualquiera. Por ejemplo: río, escuela, perro.
- Propios: nombran uno solo. Van con mayúscula. Por ejemplo: Formosa, Lucía.

Uno o varios
- Singular: uno solo. Por ejemplo: libro.
- Plural: varios. Por ejemplo: libros.`,
  },
  {
    id: base(5),
    title: 'La fotosíntesis',
    level: 'secundaria',
    grade: 1,
    subject: 'Biología',
    visibility: 'publico',
    courseId: DEMO_COURSE_ID,
    accessibleText: `La fotosíntesis

La fotosíntesis es el proceso por el cual las plantas fabrican su propio alimento a partir de la luz del sol, el agua y el dióxido de carbono.

Qué necesita la planta

La planta absorbe agua del suelo por las raíces. El agua sube por el tallo hasta las hojas. Por pequeños orificios de las hojas, llamados estomas, entra el dióxido de carbono del aire.

Qué ocurre en las hojas

Las hojas tienen clorofila, un pigmento verde que capta la energía de la luz. Con esa energía, la planta transforma el agua y el dióxido de carbono en glucosa, un azúcar que usa como alimento y para crecer.

Qué liberan las plantas

Como resultado de la fotosíntesis, las plantas liberan oxígeno al aire. Casi todos los seres vivos necesitamos ese oxígeno para respirar.`,
    easyReadText: `La fotosíntesis

Las plantas fabrican su propio alimento.
Este proceso se llama fotosíntesis.

Qué necesita la planta
- Luz del sol.
- Agua. La planta toma el agua por las raíces.
- Dióxido de carbono. Es un gas que está en el aire.

Qué pasa en las hojas
Las hojas tienen clorofila. La clorofila es lo que hace verdes a las hojas.
La clorofila atrapa la luz del sol.
Con esa luz, la planta transforma el agua y el dióxido de carbono en azúcar.
El azúcar es el alimento de la planta.

Qué largan las plantas
Las plantas largan oxígeno al aire.
Las personas y los animales necesitamos oxígeno para respirar.`,
    translations: [
      {
        id: '00000000-0000-4000-a000-000000000001',
        language: 'wichi',
        text: 'Traducción simulada para la demo. Acá va la lectura fácil en wichí, escrita o validada por una persona hablante de la comunidad.',
        audioUrl: null,
        validated: false,
        simulated: true,
        author: 'Ejemplo del equipo (no es una traducción real)',
      },
    ],
  },
  {
    id: base(6),
    title: 'La célula',
    level: 'secundaria',
    grade: 2,
    subject: 'Biología',
    visibility: 'publico',
    courseId: DEMO_COURSE_ID,
    accessibleText: `La célula

Todos los seres vivos están formados por células. La célula es la unidad más pequeña que tiene vida: puede alimentarse, crecer y reproducirse.

Partes de la célula

La membrana plasmática rodea la célula y controla qué entra y qué sale. El citoplasma es el interior, donde ocurren muchas reacciones. El núcleo guarda el material genético, que tiene la información para el funcionamiento de la célula.

Tipos de células

Las células procariotas no tienen núcleo, como las bacterias. Las células eucariotas sí tienen núcleo, como las de plantas, animales y hongos. Las células vegetales tienen además pared celular y cloroplastos, donde se hace la fotosíntesis.`,
    easyReadText: `La célula

Todos los seres vivos tienen células.
La célula es la parte más chica que tiene vida.
Se alimenta, crece y se reproduce.

Partes de la célula
- Membrana: es como una piel. Deja pasar algunas cosas y otras no.
- Citoplasma: es el interior de la célula.
- Núcleo: guarda la información de la célula.

Dos tipos de células
- Sin núcleo. Por ejemplo, las bacterias.
- Con núcleo. Por ejemplo, las de plantas y animales.`,
  },
  {
    id: base(7),
    title: 'La provincia de Formosa',
    level: 'secundaria',
    grade: 1,
    subject: 'Geografía',
    visibility: 'publico',
    accessibleText: `La provincia de Formosa

Formosa está en el noreste de la Argentina, en la región del Gran Chaco. Su capital es la ciudad de Formosa, a orillas del río Paraguay.

Límites

Al norte limita con Paraguay, separada por el río Pilcomayo. Al este también limita con Paraguay, por el río Paraguay. Al sur limita con la provincia del Chaco, por el río Bermejo. Al oeste limita con Salta.

Clima y paisaje

El clima es cálido. Hacia el este llueve más y hay esteros, bañados y selvas en galería. Hacia el oeste llueve menos y domina el monte seco.

Pueblos originarios

En Formosa viven los pueblos qom, wichí, pilagá y nivaclé. Cada uno tiene su lengua, su historia y su forma de relacionarse con el territorio.`,
    easyReadText: `La provincia de Formosa

Formosa está en el norte de la Argentina.
La capital es la ciudad de Formosa.

Límites
- Al norte y al este: Paraguay.
- Al sur: la provincia del Chaco.
- Al oeste: la provincia de Salta.

Clima
Hace calor.
En el este llueve más. Hay esteros y bañados.
En el oeste llueve menos. Hay monte seco.

Pueblos originarios
En Formosa viven los pueblos qom, wichí, pilagá y nivaclé.
Cada pueblo tiene su lengua.`,
  },
  {
    id: base(8),
    title: 'Ecuaciones de primer grado',
    level: 'secundaria',
    grade: 2,
    subject: 'Matemática',
    visibility: 'publico',
    accessibleText: `Ecuaciones de primer grado

Una ecuación es una igualdad en la que hay un valor desconocido, llamado incógnita. Por lo general, la incógnita se escribe con la letra x.

Resolver una ecuación

Resolver una ecuación es encontrar el valor de x que hace que la igualdad sea verdadera. Para eso, se hace la misma operación en los dos lados de la igualdad, así se mantiene el equilibrio.

Ejemplo

En la ecuación x + 5 = 12, restamos 5 en los dos lados: x = 12 - 5, entonces x = 7. Para comprobar, reemplazamos: 7 + 5 = 12. Es verdadero, así que la solución es correcta.`,
    easyReadText: `Ecuaciones de primer grado

Una ecuación tiene un número que no conocemos.
A ese número lo llamamos x.

Resolver es encontrar cuánto vale x.

Regla importante
Lo que hacés de un lado del igual, lo hacés del otro lado.

Ejemplo
- La ecuación es x + 5 = 12.
- Restamos 5 de los dos lados.
- Queda x = 7.

Comprobamos: 7 + 5 = 12. Está bien.`,
  },
  {
    id: base(9),
    title: 'Los ecosistemas',
    level: 'secundaria',
    grade: 3,
    subject: 'Biología',
    visibility: 'curso',
    courseId: DEMO_COURSE_ID,
    accessibleText: `Los ecosistemas

Un ecosistema es el conjunto formado por los seres vivos de un lugar y el ambiente en el que viven: el suelo, el agua, el aire y el clima.

Relaciones en el ecosistema

Los seres vivos se relacionan entre sí. Las plantas son productoras: fabrican su alimento. Los animales son consumidores: se alimentan de plantas o de otros animales. Los hongos y las bacterias son descomponedores: transforman los restos en nutrientes para el suelo.

Un ejemplo cercano

El estero es un ecosistema típico del este de Formosa. Allí viven plantas acuáticas, peces, yacarés, carpinchos y muchas aves.`,
    easyReadText: `Los ecosistemas

Un ecosistema es un lugar con seres vivos.
También tiene suelo, agua, aire y clima.

Quién hace qué
- Las plantas fabrican su alimento.
- Los animales comen plantas u otros animales.
- Los hongos y las bacterias deshacen los restos.

Un ejemplo de Formosa
El estero es un ecosistema.
Viven plantas de agua, peces, yacarés, carpinchos y pájaros.`,
  },
].map((m) => ({
  courseId: null,
  sourceType: 'texto',
  originalFileName: null,
  textSource: 'pegado',
  easyReadStatus: 'manual',
  easyReadModel: null,
  translations: [],
  createdAt: '2026-09-20T12:00:00.000Z',
  updatedAt: '2026-09-20T12:00:00.000Z',
  ejemplo: true,
  ...EQUIPO,
  ...m,
}));

export const SEED_IDS = new Set(SEED_MATERIALS.map((m) => m.id));

export const DEMO_COURSE = {
  id: DEMO_COURSE_ID,
  name: '3.er año Biología',
  code: '4827',
  level: 'secundaria',
  year: 3,
  subject: 'Biología',
  teacherId: 'demo',
};
