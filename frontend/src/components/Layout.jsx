import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative">

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 z-40">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* TOPBAR */}
      <Topbar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
      />

      {/* PAGE CONTENT */}
      <div
        className={`
          ${collapsed ? "ml-20" : "ml-64"}
          pt-24 px-10 pb-10
          transition-all duration-300
          relative z-10
        `}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
