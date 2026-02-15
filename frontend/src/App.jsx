function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-700 flex items-center justify-center">
      
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>

        <p className="text-gray-600 mb-6">
          If you see colors, spacing, and styling → Tailwind is working 🚀
        </p>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-800 transition">
          Click Me
        </button>
      </div>

    </div>
  );
}

export default App;
