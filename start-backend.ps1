# Quick Start Script untuk Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Form Usulan Investasi - Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"

Write-Host "Checking Go modules..." -ForegroundColor Yellow
go mod tidy

Write-Host ""
Write-Host "Building backend..." -ForegroundColor Yellow
go build -o fui-backend.exe

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to build backend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting backend server on http://localhost:8081" -ForegroundColor Green
Write-Host "Backend API available at: http://localhost:8081/api" -ForegroundColor Green
Write-Host "Health check: http://localhost:8081/health" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

.\fui-backend.exe
