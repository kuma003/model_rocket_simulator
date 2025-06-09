@echo off
echo =====================================
echo   Port Opening Script for Docker Dev Environment
echo =====================================
echo.

REM Load .env file content as environment variables
set ENV_FILE=%~dp0.env
echo Loading environment variables from %ENV_FILE%
if exist "%ENV_FILE%" (
    FOR /F "tokens=1,2 delims==" %%A IN (%ENV_FILE%) DO (
        IF "%%A"=="FRONTEND_PORT" SET FRONTEND_PORT=%%B
        IF "%%A"=="BACKEND_PORT" SET BACKEND_PORT=%%B
    )
    echo Environment variables loaded successfully.
) else (
    echo Warning: .env file not found at %ENV_FILE%
    REM Set default values
    set "FRONTEND_PORT=5173"
    set "BACKEND_PORT=5000"
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
    
    REM Display access information in original console before elevation
    echo Note: After port opening, you can access from other PCs on the same LAN:
    FOR /F "tokens=*" %%a IN ('powershell -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet*,Wi-Fi* | Where-Object {$_.IPAddress -notmatch '^127\.'} | Select-Object -First 1).IPAddress"') DO SET IP_ADDRESS=%%a
    echo   Frontend: http://%IP_ADDRESS%:%FRONTEND_PORT%
    echo   Backend:  http://%IP_ADDRESS%:%BACKEND_PORT%
    echo.
    echo Starting elevated process...
    
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

echo Opening frontend port %FRONTEND_PORT%...
netsh advfirewall firewall delete rule name="React Dev Server" >nul 2>&1
netsh advfirewall firewall add rule name="React Dev Server" dir=in action=allow protocol=TCP localport=%FRONTEND_PORT%
if %errorLevel% == 0 (
    echo ✓ Successfully opened port %FRONTEND_PORT%
) else (
    echo ✗ Failed to open port %FRONTEND_PORT%
)

echo.
echo Opening backend port %BACKEND_PORT%...
netsh advfirewall firewall delete rule name="Backend API" >nul 2>&1
netsh advfirewall firewall add rule name="Backend API" dir=in action=allow protocol=TCP localport=%BACKEND_PORT%
if %errorLevel% == 0 (
    echo ✓ Successfully opened port %BACKEND_PORT%
) else (
    echo ✗ Failed to open port %BACKEND_PORT%
)

echo.
echo =====================================
echo Checking current firewall rules...
echo =====================================
netsh advfirewall firewall show rule name="React Dev Server"
echo.
netsh advfirewall firewall show rule name="Backend API"

echo.
echo =====================================
echo Port opening completed!
echo.
echo You can access from other PCs on the same LAN:
FOR /F "tokens=*" %%a IN ('powershell -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet*,Wi-Fi* | Where-Object {$_.IPAddress -notmatch '^127\.'} | Select-Object -First 1).IPAddress"') DO SET IP_ADDRESS=%%a
echo   Frontend: http://%IP_ADDRESS%:%FRONTEND_PORT%
echo   Backend:  http://%IP_ADDRESS%:%BACKEND_PORT%
echo =====================================
echo.
pause