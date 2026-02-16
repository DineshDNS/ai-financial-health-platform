import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            Create Account
          </h2>

          {/* NAME */}
          <div className="mb-5">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg
              bg-white/60 dark:bg-white/10
              border border-white/40
              focus:ring-2 focus:ring-indigo-400
              outline-none text-gray-900 dark:text-white"
            />
          </div>

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
          <div className="mb-5">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg
              bg-white/60 dark:bg-white/10
              border border-white/40
              focus:ring-2 focus:ring-indigo-400
              outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg
              bg-white/60 dark:bg-white/10
              border border-white/40
              focus:ring-2 focus:ring-indigo-400
              outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-lg font-semibold text-white
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            hover:scale-[1.02] transition-transform duration-200 shadow-lg"
          >
            Register
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
