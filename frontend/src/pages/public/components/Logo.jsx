// Isologo de FormA: dos figuras con los brazos en alto y una estrella
export function LogoMark({ className = "" }) {
    return (
        <svg viewBox="0 0 70 56" fill="currentColor" className={className} aria-hidden="true">
            <circle cx="9" cy="30" r="4.5" />
            <path d="M2 54c3-9 7-15 15-18-2 7-7 13-15 18z" />
            <circle cx="31" cy="13" r="6.5" />
            <path d="M16 23c7 5 14 7 21 4L53 9c-4 16-12 30-27 44 5-11 4-21-10-30z" />
            <path d="M60 0l1.8 4.6 4.9.3-3.8 3.1 1.2 4.8L60 10.1l-4.1 2.7 1.2-4.8-3.8-3.1 4.9-.3z" />
        </svg>
    );
}

export default function Logo({ className = "" }) {
    return (
        <span className={`inline-flex items-center gap-2 text-white ${className}`}>
            <LogoMark className="h-[3.1rem] w-auto -mt-2" />
            <span className="font-raleway font-light text-[2.4rem] leading-none tracking-wide">FormA</span>
        </span>
    );
}
