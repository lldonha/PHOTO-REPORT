@echo off
REM Verify /processar-foto endpoint
REM This script tests the endpoint by sending a test image

echo ============================================================
echo PHOTO-REPORT - Verify /processar-foto endpoint
echo ============================================================
echo.

REM Check if container is running
echo Checking if photo-processor container is running...
docker ps --filter "name=photo-processor" --format "{{.Names}}" | findstr /i "photo-processor" >nul
if errorlevel 1 (
    echo [WARN] Container not running. Starting...
    cd /d "%~dp0..\..\src\docker"
    docker-compose up -d
    echo Waiting 5 seconds for container to start...
    timeout /t 5 /nobreak >nul
)

REM Test health endpoint first
echo.
echo Testing /health endpoint...
curl -s -w "\nHTTP Status: %%{http_code}\n" http://localhost:8002/health

echo.
echo ============================================================
echo Testing /processar-foto endpoint...
echo ============================================================

REM Create a minimal test by using curl with a simple file
REM First try with Python test script if available
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python test script...
    cd /d "%~dp0..\.."
    python tests/test_processar_foto.py
    goto :end
)

REM Fallback to curl with echo data (creates minimal jpeg-like data)
echo Python not found. Using curl basic test...
echo Note: For full test, run: python tests/test_processar_foto.py
echo.

REM Test with empty file to check error handling
echo Testing error handling (empty file)...
echo. > "%TEMP%\empty.jpg"
curl -s -X POST http://localhost:8002/processar-foto -F "file=@%TEMP%\empty.jpg"
del "%TEMP%\empty.jpg"

echo.
echo ============================================================
echo For complete testing with real image:
echo 1. Place a JPEG with EXIF/GPS in tests/ folder
echo 2. Run: curl -X POST -F "file=@tests/your-photo.jpg" http://localhost:8002/processar-foto
echo ============================================================

:end
echo.
echo Done.
pause
