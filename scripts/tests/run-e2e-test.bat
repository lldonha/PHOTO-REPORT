@echo off
REM ============================================================================
REM PHOTO-REPORT - End-to-End Test Runner (Windows)
REM Tests the complete flow: upload -> EXIF extraction -> overlay -> PDF
REM ============================================================================

echo.
echo ========================================================================
echo  PHOTO-REPORT - End-to-End Test
echo  Complete Flow: Upload -^> EXIF -^> Overlay -^> PDF
echo ========================================================================
echo.

REM Check if Python is available
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo         Please install Python 3.8 or higher
    exit /b 1
)

REM Check if container is running
echo [INFO] Checking if photo-processor container is running...
curl -s -o nul -w "" http://localhost:8002/health 2>nul
if %errorlevel% neq 0 (
    echo [WARN] Container might not be running. Attempting to check again...
    timeout /t 2 /nobreak >nul
)

REM Change to project root directory
cd /d "%~dp0\..\.."

REM Install dependencies if needed
echo [INFO] Checking Python dependencies...
python -c "import requests" 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing requests library...
    pip install requests
)

python -c "from PIL import Image" 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Pillow library...
    pip install Pillow
)

REM Create tests output directory if it doesn't exist
if not exist "tests" mkdir tests

REM Run the E2E test
echo.
echo [INFO] Running E2E test...
echo.
python tests\test_e2e_complete_flow.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================================================
    echo  E2E TEST PASSED!
    echo ========================================================================
    echo.
    echo Generated files:
    if exist "tests\e2e_test_output.pdf" (
        echo   - tests\e2e_test_output.pdf
    )
    if exist "tests\e2e_download_test.pdf" (
        echo   - tests\e2e_download_test.pdf
    )
) else (
    echo.
    echo ========================================================================
    echo  E2E TEST FAILED!
    echo ========================================================================
    echo.
    echo Troubleshooting:
    echo   1. Make sure Docker is running
    echo   2. Start the container: cd src\docker ^&^& docker-compose up -d
    echo   3. Check container logs: docker logs photo-processor
    echo   4. Verify health endpoint: curl http://localhost:8002/health
)

echo.
pause
