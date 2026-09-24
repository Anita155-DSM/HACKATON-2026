import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Usuarios", path: "/usuarios", icon: <FaUsers /> },
    { name: "Ajustes", path: "/settings", icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-full transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-wider">MI PANEL</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}