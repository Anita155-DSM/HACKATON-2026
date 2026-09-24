export const Button = ({
  children,
  variant = "primary", // por defecto será azul
  size = "md", // por defecto será mediano
  className = "",
  disabled = false,
  type = "button",
  ...props // Atrapa cualquier otra cosa (onClick, id, etc.)
}) => {
  // Clases base que tienen TODOS los botones
  const baseStyles =
    "inline-flex justify-center items-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Diccionario de variantes de color
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
  };

  // Diccionario de tamaños
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
