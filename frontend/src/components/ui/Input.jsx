import { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Input = forwardRef(({ 
  label, 
  error, 
  className = "", 
  id, 
  type = "text",
  ...props 
}, ref) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const inputType = type === "password" && mostrarPassword ? "text" : type;

  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={inputType}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors
            ${error
              ? "border-red-500 focus:ring-red-500 bg-red-50"
              : "border-gray-300 focus:border-blue-500"
            } 
            ${type === "password" ? "pr-10" : ""} 
            ${className}`}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";