import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* GLOBAL TOAST SYSTEM */}
      <Toaster
        position="top-right"
        containerStyle={{
          top: 80,   // pushes below fixed Topbar
          right: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(17, 24, 39, 0.95)",
            color: "#fff",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 99999,
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
