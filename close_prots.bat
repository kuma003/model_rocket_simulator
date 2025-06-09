@echo off
echo =====================================
echo   Port Closing Script for Docker Dev Environment
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

echo Closing frontend port 5173...
netsh advfirewall firewall delete rule name="React Dev Server"
if %errorLevel% == 0 (
    echo ✓ Successfully closed port 5173
) else (
    echo ℹ Port 5173 rule not found (already removed)
)

echo.
echo Closing backend port 8000...
netsh advfirewall firewall delete rule name="Backend API"
if %errorLevel% == 0 (
    echo ✓ Successfully closed port 8000
) else (
    echo ℹ Port 8000 rule not found (already removed)
)

echo.
echo =====================================
echo Port closing completed!
echo Security has been enhanced.
echo =====================================
echo.
pause