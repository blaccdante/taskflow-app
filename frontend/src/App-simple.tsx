import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🚀 TaskFlow is Working!
        </h1>
        <p className="text-gray-600 mb-4">
          The React app is successfully loading.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ React rendering</p>
          <p className="text-sm text-gray-500">✅ Tailwind CSS working</p>
          <p className="text-sm text-gray-500">✅ Vite dev server running</p>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;