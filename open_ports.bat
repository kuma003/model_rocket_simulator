@echo off
echo =====================================
echo   Port Opening Script for Docker Dev Environment
echo =====================================
echo.

REM Check for admin privileges and auto-elevate
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges...
    echo.
    goto :main
) else (
    echo Administrator privileges required. Elevating permissions...
    echo.
    
    REM Use PowerShell to restart with admin privileges
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b 0
)

:main

echo Opening frontend port 5173...
netsh advfirewall firewall delete rule name="React Dev Server" >nul 2>&1
netsh advfirewall firewall add rule name="React Dev Server" dir=in action=allow protocol=TCP localport=5173
if %errorLevel% == 0 (
    echo ✓ Successfully opened port 5173
) else (
    echo ✗ Failed to open port 5173
)

echo.
echo Opening backend port 8000...
netsh advfirewall firewall delete rule name="Backend API" >nul 2>&1
netsh advfirewall firewall add rule name="Backend API" dir=in action=allow protocol=TCP localport=8000
if %errorLevel% == 0 (
    echo ✓ Successfully opened port 8000
) else (
    echo ✗ Failed to open port 8000
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
echo   Frontend: http://%IP_ADDRESS%:5173
echo   Backend:  http://%IP_ADDRESS%:8000
echo =====================================
echo.
pause