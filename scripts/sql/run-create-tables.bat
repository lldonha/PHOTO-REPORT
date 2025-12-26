@echo off
REM ============================================================
REM PHOTO-REPORT: Script para criar tabelas no banco cosmic
REM ============================================================
REM
REM Este script executa o create-tables.sql no container PostgreSQL
REM O container pg deve estar rodando
REM
REM Uso: run-create-tables.bat
REM ============================================================

echo.
echo ============================================================
echo PHOTO-REPORT - Criar Tabelas no Banco Cosmic
echo ============================================================
echo.

REM Verificar se o container pg esta rodando
echo [1/3] Verificando container PostgreSQL...
docker ps | findstr pg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Container 'pg' nao esta rodando!
    echo       Inicie o container com: docker start pg
    exit /b 1
)
echo       OK - Container 'pg' esta rodando

REM Executar o script SQL
echo.
echo [2/3] Executando create-tables.sql...
docker exec -i pg psql -U lucas -d cosmic < "%~dp0create-tables.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao executar o script SQL!
    exit /b 1
)
echo       OK - Script SQL executado com sucesso

REM Verificar tabelas criadas
echo.
echo [3/3] Verificando tabelas criadas...
docker exec -i pg psql -U lucas -d cosmic -c "\dt photo_*"

echo.
echo ============================================================
echo VERIFICACAO COMPLETA!
echo ============================================================
echo.
echo Para verificar manualmente, execute:
echo   docker exec -it pg psql -U lucas -d cosmic
echo.
echo Comandos uteis no psql:
echo   \dt             - Listar tabelas
echo   \dv             - Listar views
echo   \di             - Listar indices
echo   \d photo_reports     - Descrever tabela
echo   \d photo_items       - Descrever tabela
echo.

exit /b 0
