import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Plus, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    // Dashboard view
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow Dashboard</h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500">Connected</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Kanban Board Demo */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Kanban Board</h3>
            <div className="flex gap-6 overflow-x-auto">
              <div className="flex-1 min-w-80 bg-gray-50 rounded-lg border p-4">
                <h4 className="font-semibold text-gray-700 mb-4">To Do</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border shadow-sm">
                    <h5 className="font-medium">Design new feature</h5>
                    <p className="text-sm text-gray-600">Create mockups for the dashboard</p>
                  </div>
                  <div className="bg-white p-3 rounded border shadow-sm">
                    <h5 className="font-medium">Update documentation</h5>
                    <p className="text-sm text-gray-600">Add API endpoints docs</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-80 bg-blue-50 rounded-lg border p-4">
                <h4 className="font-semibold text-blue-700 mb-4">In Progress</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border shadow-sm">
                    <h5 className="font-medium">Fix login bug</h5>
                    <p className="text-sm text-gray-600">Authentication not working properly</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-80 bg-green-50 rounded-lg border p-4">
                <h4 className="font-semibold text-green-700 mb-4">Completed</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border shadow-sm opacity-75">
                    <h5 className="font-medium line-through">Setup project</h5>
                    <p className="text-sm text-gray-600">Initialize React app</p>
                  </div>
                  <div className="bg-white p-3 rounded border shadow-sm opacity-75">
                    <h5 className="font-medium line-through">Database setup</h5>
                    <p className="text-sm text-gray-600">Configure SQLite database</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isLogin ? 'Sign in to TaskFlow' : 'Create TaskFlow Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Or ' : 'Already have an account? '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'create a new account' : 'sign in'}
            </button>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              {isLogin ? 'Sign In (Demo)' : 'Create Account (Demo)'}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>This is a demo version - no real authentication</p>
        </div>
      </div>
    </div>
  );
}

export default App;