// Escudo minimalista: ícono de un solo color dentro de un recuadro redondeado
const sizes = {
    sm: "w-8 h-8 rounded-lg text-[1.05rem]",
    md: "w-11 h-11 rounded-xl text-[1.4rem]",
    lg: "w-14 h-14 rounded-2xl text-[1.8rem]",
};

const tones = {
    // Sobre fondo blanco
    sky: "bg-forma-sky text-forma-primary dark:bg-forma-cyan/10 dark:text-forma-cyan",
    // Sobre fondo celeste
    white: "bg-white text-forma-primary shadow-sm dark:bg-forma-night dark:text-forma-cyan dark:shadow-none",
    // Sobre fondo oscuro
    navy: "bg-forma-primary text-white dark:bg-forma-cyan/10 dark:text-forma-cyan",
};

export default function IconBadge({ icon: Icon, size = "md", tone = "sky", className = "" }) {
    return (
        <span className={`inline-flex shrink-0 items-center justify-center ${sizes[size]} ${tones[tone]} ${className}`} aria-hidden="true">
            <Icon strokeWidth={1.75} />
        </span>
    );
}
