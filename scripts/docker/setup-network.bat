@echo off
REM Script para criar rede Docker coletor_default
REM Verifica se existe e cria se necessario

echo Verificando rede Docker coletor_default...

docker network ls | findstr coletor_default >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Rede coletor_default ja existe.
) else (
    echo Criando rede coletor_default...
    docker network create coletor_default
    if %errorlevel% equ 0 (
        echo [OK] Rede coletor_default criada com sucesso.
    ) else (
        echo [ERRO] Falha ao criar rede coletor_default.
        exit /b 1
    )
)

echo.
echo Redes Docker disponiveis:
docker network ls
