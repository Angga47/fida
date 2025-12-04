@echo off
echo ========================================
echo Form Usulan Investasi - Frontend App
echo ========================================
echo.

cd frontend

echo Checking npm packages...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting frontend server on http://localhost:3000
echo Press Ctrl+C to stop
echo.
call npm run dev

pause
