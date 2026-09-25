import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Esta función permite combinar arrays, objetos y strings de clases sin que choquen en Tailwind
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}