@echo off
echo ========================================
echo Form Usulan Investasi - Backend Server
echo ========================================
echo.

cd backend

echo Checking Go modules...
go mod tidy

echo.
echo Building backend...
go build -o fui-backend.exe

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build backend
    pause
    exit /b 1
)

echo.
echo Starting backend server on http://localhost:8081
echo Backend API: http://localhost:8081/api
echo Health check: http://localhost:8081/health
echo Press Ctrl+C to stop
echo.
fui-backend.exe

pause
