@echo off
REM Script para iniciar o container Docker photo-processor e verificar health endpoint
REM Executa docker-compose up e verifica se o endpoint /health responde

echo ========================================
echo PHOTO-REPORT - Start Container
echo ========================================
echo.

REM Verificar se Docker esta rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta rodando. Inicie o Docker Desktop primeiro.
    exit /b 1
)

REM Garantir que a rede existe
echo [1/4] Verificando rede Docker...
call "%~dp0setup-network.bat"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao configurar rede Docker.
    exit /b 1
)

echo.
echo [2/4] Iniciando container photo-processor...
echo.

REM Navegar para o diretorio do docker-compose
pushd "%~dp0..\..\src\docker"

REM Parar container existente se houver
docker-compose down 2>nul

REM Iniciar container em background
docker-compose up -d
set START_RESULT=%errorlevel%

popd

if %START_RESULT% neq 0 (
    echo.
    echo ========================================
    echo [ERRO] Falha ao iniciar o container.
    echo ========================================
    exit /b 1
)

echo.
echo [3/4] Aguardando container inicializar (10 segundos)...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Verificando health endpoint...
echo.

REM Tentar curl multiplas vezes (ate 5 tentativas)
set RETRY_COUNT=0
:RETRY_LOOP
if %RETRY_COUNT% geq 5 goto :HEALTH_FAILED

curl -s -o nul -w "%%{http_code}" http://localhost:8002/health > "%TEMP%\health_status.txt" 2>nul
set /p HTTP_CODE=<"%TEMP%\health_status.txt"
del "%TEMP%\health_status.txt" 2>nul

if "%HTTP_CODE%"=="200" goto :HEALTH_SUCCESS

set /a RETRY_COUNT=%RETRY_COUNT%+1
echo   Tentativa %RETRY_COUNT%/5 - aguardando...
timeout /t 3 /nobreak >nul
goto :RETRY_LOOP

:HEALTH_FAILED
echo.
echo ========================================
echo [ERRO] Health endpoint nao respondeu.
echo ========================================
echo.
echo Verifique os logs do container:
echo   docker logs photo-processor
echo.
exit /b 1

:HEALTH_SUCCESS
echo.
echo ========================================
echo [OK] Container iniciado com sucesso!
echo ========================================
echo.

REM Mostrar resposta do health endpoint
echo Health Response:
curl -s http://localhost:8002/health
echo.
echo.

REM Mostrar status do container
echo Container Status:
docker ps --filter "name=photo-processor" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo ----------------------------------------
echo Endpoints disponiveis:
echo   Health:  http://localhost:8002/health
echo   Docs:    http://localhost:8002/docs
echo   API:     http://localhost:8002/
echo ----------------------------------------
echo.
echo Para parar o container:
echo   cd src\docker
echo   docker-compose down
echo.
