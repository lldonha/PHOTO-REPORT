@echo off
REM ============================================================
REM PHOTO-REPORT: Script para criar tabelas no banco cosmic
REM Executa create-tables.sql no PostgreSQL
REM ============================================================

echo.
echo ============================================
echo   PHOTO-REPORT - Criar Tabelas SQL
echo ============================================
echo.

REM Verificar se Docker está rodando
docker info > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Docker nao esta rodando!
    echo        Inicie o Docker Desktop e tente novamente.
    exit /b 1
)

REM Verificar se container pg está rodando
docker ps | findstr /i "pg" > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [AVISO] Container 'pg' nao encontrado rodando.
    echo         Tentando usar host.docker.internal para conexao local...
    echo.

    REM Tentar conexão direta via psql local se disponível
    where psql > nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo [INFO] Usando psql local...
        psql -h localhost -U lucas -d cosmic -f "%~dp0..\sql\create-tables.sql"
        if %ERRORLEVEL% neq 0 (
            echo [ERRO] Falha ao executar script SQL!
            exit /b 1
        )
    ) else (
        echo [ERRO] psql nao encontrado e container pg nao esta rodando.
        echo        Verifique se PostgreSQL esta instalado ou inicie o container pg.
        exit /b 1
    )
) else (
    echo [INFO] Container 'pg' encontrado. Executando script SQL...
    echo.

    REM Copiar script SQL para o container
    docker cp "%~dp0..\sql\create-tables.sql" pg:/tmp/create-tables.sql
    if %ERRORLEVEL% neq 0 (
        echo [ERRO] Falha ao copiar script para container!
        exit /b 1
    )

    REM Executar script SQL no container
    docker exec -i pg psql -U lucas -d cosmic -f /tmp/create-tables.sql
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERRO] Falha ao executar script SQL!
        exit /b 1
    )

    REM Limpar arquivo temporário
    docker exec pg rm -f /tmp/create-tables.sql
)

echo.
echo ============================================
echo   Tabelas criadas com sucesso!
echo ============================================
echo.

REM Verificar se tabelas foram criadas
echo [INFO] Verificando tabelas criadas...
echo.

if exist "%~dp0verify-tables.bat" (
    call "%~dp0verify-tables.bat"
) else (
    echo [INFO] Listando tabelas no banco cosmic:
    docker exec -i pg psql -U lucas -d cosmic -c "\dt" 2>nul || psql -h localhost -U lucas -d cosmic -c "\dt"
)

echo.
echo Done!
