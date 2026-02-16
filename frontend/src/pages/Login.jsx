import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">

      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            FinIntel AI
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            AI-Powered Financial Intelligence Platform
          </p>
        </div>

        {/* GLASS CARD */}
        <div className="
          p-10 rounded-2xl
          bg-white/30 dark:bg-white/10
          backdrop-blur-xl
          border border-white/30
          shadow-2xl
        ">

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Welcome Back
          </h2>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg
              bg-white/60 dark:bg-white/10
              border border-white/40
              focus:ring-2 focus:ring-indigo-400
              outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg
              bg-white/60 dark:bg-white/10
              border border-white/40
              focus:ring-2 focus:ring-indigo-400
              outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-lg font-semibold text-white
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            hover:scale-[1.02] transition-transform duration-200 shadow-lg"
          >
            Login
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
