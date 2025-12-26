@echo off
REM Script para verificar o health endpoint do container photo-processor
REM Testa se o endpoint /health responde corretamente

echo ========================================
echo PHOTO-REPORT - Health Verification
echo ========================================
echo.

echo Verificando endpoint: http://localhost:8002/health
echo.

REM Verificar se curl esta disponivel
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] curl nao encontrado. Instale o curl ou use PowerShell:
    echo   Invoke-WebRequest -Uri http://localhost:8002/health
    exit /b 1
)

REM Fazer request ao health endpoint
curl -s -w "\n\nHTTP Status: %%{http_code}\n" http://localhost:8002/health

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [OK] Health endpoint respondeu!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo [ERRO] Falha ao conectar ao endpoint.
    echo ========================================
    echo.
    echo Verifique se o container esta rodando:
    echo   docker ps ^| findstr photo-processor
    echo.
    echo Para iniciar o container:
    echo   scripts\docker\start-container.bat
    exit /b 1
)
