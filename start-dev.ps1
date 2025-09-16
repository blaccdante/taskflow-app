# TaskFlow Development Startup Script
# This script starts both frontend and backend servers concurrently

Write-Host "🚀 Starting TaskFlow Development Servers..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Function to start backend
function Start-Backend {
    Write-Host "📦 Starting backend server..." -ForegroundColor Blue
    Set-Location "backend"
    
    # Check if dependencies are installed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"
    Set-Location ".."
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting frontend server..." -ForegroundColor Blue
    Set-Location "frontend"
    
    # Check if dependencies are installed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
    Set-Location ".."
}

# Start backend
Start-Backend

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend
Start-Frontend

Write-Host ""
Write-Host "✅ Development servers starting..." -ForegroundColor Green
Write-Host "📊 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🎨 Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "🔄 Shutting down servers..." -ForegroundColor Yellow
}