import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  LineChart,
  Brain,
  FileText
} from "lucide-react";

function Sidebar({ collapsed }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Upload", path: "/upload", icon: Upload },
    { name: "Risk", path: "/risk", icon: AlertTriangle },
    { name: "Forecast", path: "/forecast", icon: LineChart },
    { name: "AI Insights", path: "/ai", icon: Brain },
    { name: "Reports", path: "/reports", icon: FileText },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full z-40
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-300
        bg-[#cbb68a]
        shadow-xl
        border-r border-white/20
        flex flex-col
      `}
    >
      {/* LOGO AREA */}
      <div className="px-6 py-6 border-b border-white/20">
        <h1 className="text-xl font-bold text-black whitespace-nowrap overflow-hidden">
          {collapsed ? "FI" : "FinIntel AI"}
        </h1>
        {!collapsed && (
          <p className="text-sm text-black/70 mt-1">
            Financial Intelligence
          </p>
        )}
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 p-3 mt-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                transition-all duration-200
                ${active
                  ? "bg-white/60 shadow font-semibold"
                  : "hover:bg-white/40"}
              `}
            >
              <Icon size={20} />

              {!collapsed && (
                <span className="text-sm">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
