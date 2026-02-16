import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Topbar = ({ collapsed, toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

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

        /* LIGHT MODE */
        bg-white/60

        /* DARK MODE STRONG GLASS */
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
          Financial Intelligence Dashboard
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
