import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Topbar = ({ collapsed, toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  // Dynamic title mapping
  const getTitle = (path) => {
    if (path === "/") return "Financial Intelligence Dashboard";
    if (path.startsWith("/upload")) return "Financial Data Upload";
    if (path.startsWith("/risk")) return "Risk Analysis";
    if (path.startsWith("/forecast")) return "Financial Forecast";
    if (path.startsWith("/ai")) return "AI Intelligence";
    if (path.startsWith("/reports")) return "Reports";
    return "FinIntel AI";
  };

  const pageTitle = getTitle(location.pathname);

  return (
    <div
      className={`
        fixed
        top-0
        ${collapsed ? "left-20" : "left-64"}
        right-0
        h-16
        z-30
        flex items-center justify-between
        px-8
        transition-all duration-300

        bg-white/60
        dark:bg-slate-900/80
        backdrop-blur-xl
        border-b
        border-white/20
        dark:border-white/10
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="
            text-2xl
            font-bold
            text-gray-900
            dark:text-white
          "
        >
          ☰
        </button>

        <h1 className="
          text-lg font-semibold
          text-gray-900
          dark:text-white
        ">
          {pageTitle}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        <button
          onClick={toggleTheme}
          className="text-2xl"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="flex items-center gap-3">
          <span className="
            text-sm font-semibold
            text-gray-900
            dark:text-white
          ">
            Dinesh
          </span>

          <div className="
            w-9 h-9
            rounded-full
            bg-gradient-to-r from-blue-500 to-purple-500
            flex items-center justify-center
            text-white font-semibold
          ">
            D
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
