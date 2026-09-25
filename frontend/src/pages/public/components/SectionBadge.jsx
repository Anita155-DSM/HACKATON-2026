// Etiqueta celeste que encabeza cada sección de la landing
export default function SectionBadge({ children, rounded = "full", className = "" }) {
    return (
        <span
            className={`inline-block bg-forma-badge text-forma-primary dark:bg-forma-cyan/15 dark:text-forma-cyan font-raleway font-bold uppercase tracking-wide text-[0.9rem] px-8 py-1.5 ${rounded === "full" ? "rounded-full" : "rounded-lg"} ${className}`}
        >
            {children}
        </span>
    );
}
