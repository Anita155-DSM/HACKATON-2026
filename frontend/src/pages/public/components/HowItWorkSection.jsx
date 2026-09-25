import {
  LuFileText, LuCheck, LuType, LuHeadphones, LuBookOpen, LuLanguages,
  LuUpload, LuWandSparkles, LuWifiOff, LuCloudUpload, LuPlay, LuSkipBack, LuSkipForward, LuChevronLeft,
} from "react-icons/lu";
import SectionBadge from "./SectionBadge";
import IconBadge from "./IconBadge";
import PhoneMockup from "./PhoneMockup";

const primaryButton = "mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-forma-primary text-white font-semibold text-[13px] py-3 shadow-md";

// Pantalla 1: el docente sube un apunte
function UploadScreen() {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-forma-primary/70">Matemática · 3° A</p>
      <p className="mt-0.5 text-[17px] font-bold text-forma-ink">Nuevo material</p>

      <div className="mt-4 rounded-2xl border-2 border-dashed border-forma-cyan/70 bg-white px-3 py-4 flex flex-col items-center text-center">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-forma-sky text-forma-primary text-[20px]">
          <LuCloudUpload strokeWidth={1.75} />
        </span>
        <p className="mt-2 text-[11px] text-slate-500">Foto, PDF o apunte</p>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white border border-slate-200 p-2.5 shadow-sm">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 text-[18px]">
          <LuFileText strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-forma-ink truncate">apunte.pdf</p>
          <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-full rounded-full bg-forma-cyan" />
          </div>
        </div>
        <LuCheck className="text-[15px] text-emerald-500" strokeWidth={3} />
      </div>

      <div className={primaryButton}>
        <LuUpload strokeWidth={2} /> Subir material
      </div>
    </>
  );
}

// Pantalla 2: FormA genera las versiones accesibles
function VersionsScreen() {
  const versions = [
    [LuType, "Texto"],
    [LuHeadphones, "Audio"],
    [LuBookOpen, "Lectura fácil"],
    [LuLanguages, "Traducción"],
  ];
  return (
    <>
      <p className="flex items-center gap-1 text-[11px] font-semibold text-forma-primary/70">
        <LuChevronLeft strokeWidth={2.5} /> apunte.pdf
      </p>
      <p className="mt-0.5 text-[17px] font-bold text-forma-ink">Versiones listas</p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {versions.map(([Icon, name]) => (
          <li key={name} className="flex items-center gap-2.5 rounded-xl bg-white border border-slate-200 p-2.5 shadow-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-forma-sky text-forma-primary text-[16px]">
              <Icon strokeWidth={1.75} />
            </span>
            <span className="flex-1 whitespace-nowrap text-[12.5px] font-medium text-forma-ink">{name}</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px]">
              <LuCheck strokeWidth={3.5} />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

// Pantalla 3: el alumno lee y escucha sin conexión
function OfflineScreen() {
  return (
    <>
      <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10.5px] font-semibold px-2.5 py-1 self-start">
        <LuWifiOff strokeWidth={2.5} /> Sin conexión · guardado
      </div>

      <p className="mt-3 text-[16px] font-bold text-forma-ink leading-tight">Las fracciones</p>
      <p className="mt-2 text-[12px] leading-[1.55] text-slate-600">
        Una fracción es una parte de un todo. Si cortás una pizza en 4 porciones iguales, cada porción es <strong className="text-forma-ink">1/4</strong>.
      </p>

      <div className="mt-auto rounded-2xl bg-forma-navy text-white p-3 shadow-md">
        <p className="text-[11px] text-white/70">Escuchando</p>
        <div className="mt-2 h-1 rounded-full bg-white/20">
          <div className="h-full w-2/5 rounded-full bg-forma-cyan" />
        </div>
        <div className="mt-2.5 flex items-center justify-center gap-5 text-[16px]">
          <LuSkipBack strokeWidth={2} />
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-forma-cyan text-forma-navy">
            <LuPlay strokeWidth={2.5} className="ml-0.5" />
          </span>
          <LuSkipForward strokeWidth={2} />
        </div>
      </div>
    </>
  );
}

const steps = [
  {
    icon: LuUpload,
    title: "1. El docente sube el material",
    desc: "Un apunte, una foto o un PDF. Una sola vez.",
    phoneLabel: "Pantalla de FormA para subir un apunte en PDF",
    screen: <UploadScreen />,
  },
  {
    icon: LuWandSparkles,
    title: "2. Se crean versiones accesibles",
    desc: "Texto real, audio, lectura fácil y traducción.",
    phoneLabel: "Pantalla de FormA con las versiones de texto, audio, lectura fácil y traducción",
    screen: <VersionsScreen />,
  },
  {
    icon: LuWifiOff,
    title: "3. El alumno lo usa sin internet",
    desc: "Lo descarga una vez y lo lee o escucha donde esté.",
    phoneLabel: "Pantalla de FormA mostrando un material guardado para leer y escuchar sin conexión",
    screen: <OfflineScreen />,
    offline: true,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-forma-sky dark:bg-forma-midnight font-raleway pt-24 pb-24">
      <div className="max-w-[1366px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

        <SectionBadge rounded="lg" className="px-12 py-2.5">Cómo funciona</SectionBadge>
        <h2 className="mt-5 text-forma-ink dark:text-white text-[2.1rem] [text-shadow:1px_1px_1px_rgba(0,0,0,0.2)]">Así funciona FormA</h2>
        <p className="mt-3 text-forma-ink dark:text-slate-300 text-[1.1rem]">Tres pasos, sin vueltas.</p>

        <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-6">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center">
              <PhoneMockup label={step.phoneLabel} offline={step.offline}>{step.screen}</PhoneMockup>
              <IconBadge icon={step.icon} tone="white" className="mt-9" />
              <h3 className="mt-3 text-black dark:text-white font-bold text-[1.15rem]">{step.title}</h3>
              <p className="mt-4 max-w-[400px] text-black dark:text-slate-300 text-[1rem] leading-[1.5]">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
