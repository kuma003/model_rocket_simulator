@echo off
echo =====================================
echo   Port Closing Script for Docker Dev Environment
echo =====================================
echo.

REM Load .env file content as environment variables
set ENV_FILE=%~dp0.env
echo Loading environment variables from %ENV_FILE%
if exist "%ENV_FILE%" (
    FOR /F "tokens=1,2 delims==" %%A IN (%ENV_FILE%) DO (
        set "%%A=%%B"
    )
    echo Environment variables loaded successfully.
) else (
    echo Warning: .env file not found at %ENV_FILE%
    REM Set default values
    set "FRONTEND_PORT=5173"
    set "BACKEND_PORT=8000"
    echo Using default port values: Frontend=%FRONTEND_PORT%, Backend=%BACKEND_PORT%
)

REM Check for admin privileges and auto-elevate
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges...
    echo.
    goto :main
) else (
    echo Administrator privileges required. Elevating permissions...
    echo.
    
    REM Pass environment variables to the elevated process
    powershell -Command "Start-Process '%~f0' -Verb RunAs -ArgumentList '%FRONTEND_PORT%,%BACKEND_PORT%'"
    exit /b 0
)

:main
REM Check if arguments were passed from the non-elevated script
if not "%~1"=="" (
    for /F "tokens=1,2 delims=," %%a in ("%~1") do (
        set "FRONTEND_PORT=%%a"
        set "BACKEND_PORT=%%b"
    )
)

echo Closing frontend port %FRONTEND_PORT%...
netsh advfirewall firewall delete rule name="React Dev Server"
if %errorLevel% == 0 (
    echo ✓ Successfully closed port %FRONTEND_PORT%
) else (
    echo ℹ Port %FRONTEND_PORT% rule not found (already removed)
)

echo.
echo Closing backend port %BACKEND_PORT%...
netsh advfirewall firewall delete rule name="Backend API"
if %errorLevel% == 0 (
    echo ✓ Successfully closed port %BACKEND_PORT%
) else (
    echo ℹ Port %BACKEND_PORT% rule not found (already removed)
)

echo.
echo =====================================
echo Port closing completed!
echo Security has been enhanced.
echo =====================================
echo.
pause