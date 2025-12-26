@echo off
REM ============================================================
REM PHOTO-REPORT: Verifica tabelas no banco cosmic
REM ============================================================

echo.
echo ============================================
echo   PHOTO-REPORT - Verificar Tabelas
echo ============================================
echo.

REM Tentar via container pg primeiro
docker ps | findstr /i "pg" > nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [INFO] Usando container 'pg'...
    echo.

    echo --- Tabelas (\dt) ---
    docker exec -i pg psql -U lucas -d cosmic -c "\dt"

    echo.
    echo --- Views (\dv) ---
    docker exec -i pg psql -U lucas -d cosmic -c "\dv"

    echo.
    echo --- Indices (\di) ---
    docker exec -i pg psql -U lucas -d cosmic -c "\di"

) else (
    REM Tentar psql local
    where psql > nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo [INFO] Usando psql local...
        echo.

        echo --- Tabelas (\dt) ---
        psql -h localhost -U lucas -d cosmic -c "\dt"

        echo.
        echo --- Views (\dv) ---
        psql -h localhost -U lucas -d cosmic -c "\dv"

        echo.
        echo --- Indices (\di) ---
        psql -h localhost -U lucas -d cosmic -c "\di"

    ) else (
        echo [ERRO] Nem container pg nem psql local disponiveis.
        exit /b 1
    )
)

echo.
echo ============================================
echo   Verificacao concluida!
echo ============================================
echo.

REM Verificar especificamente as tabelas do PHOTO-REPORT
echo [INFO] Verificando tabelas PHOTO-REPORT especificas...
echo.

if docker ps | findstr /i "pg" > nul 2>&1 (
    docker exec -i pg psql -U lucas -d cosmic -c "SELECT table_name FROM information_schema.tables WHERE table_name IN ('photo_reports', 'photo_items');"

    echo.
    echo [INFO] Verificando view photo_reports_summary...
    docker exec -i pg psql -U lucas -d cosmic -c "SELECT viewname FROM pg_views WHERE viewname = 'photo_reports_summary';"
) else (
    psql -h localhost -U lucas -d cosmic -c "SELECT table_name FROM information_schema.tables WHERE table_name IN ('photo_reports', 'photo_items');"

    echo.
    echo [INFO] Verificando view photo_reports_summary...
    psql -h localhost -U lucas -d cosmic -c "SELECT viewname FROM pg_views WHERE viewname = 'photo_reports_summary';"
)

echo.
echo Done!
