export default function Footer() {
  const anio = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="text-center text-sm text-gray-500">
        &copy; {anio} Mi Empresa. Todos los derechos reservados.
      </div>
    </footer>
  );
}