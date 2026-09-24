export default function Footer() {
  const anio = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors duration-300">
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
        &copy; {anio} Mi Empresa. Todos los derechos reservados.
      </div>
    </footer>
  );
}