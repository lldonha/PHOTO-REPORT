@echo off
REM Script para build do container Docker photo-processor
REM Executa o docker-compose build no diretorio src/docker

echo ========================================
echo PHOTO-REPORT - Docker Build
echo ========================================
echo.

REM Verificar se Docker esta rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta rodando. Inicie o Docker Desktop primeiro.
    exit /b 1
)

REM Garantir que a rede existe
echo [1/3] Verificando rede Docker...
call "%~dp0setup-network.bat"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao configurar rede Docker.
    exit /b 1
)

echo.
echo [2/3] Iniciando build do container photo-processor...
echo.

REM Navegar para o diretorio do docker-compose
pushd "%~dp0..\..\src\docker"

REM Executar build
docker-compose build --no-cache
set BUILD_RESULT=%errorlevel%

popd

if %BUILD_RESULT% equ 0 (
    echo.
    echo ========================================
    echo [OK] Build concluido com sucesso!
    echo ========================================
    echo.
    echo [3/3] Verificando imagem criada...
    docker images photo-processor:1.0.0
    echo.
    echo Para iniciar o container:
    echo   cd src\docker
    echo   docker-compose up -d
    echo.
) else (
    echo.
    echo ========================================
    echo [ERRO] Falha no build do container.
    echo ========================================
    exit /b 1
)
