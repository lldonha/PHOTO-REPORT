#!/bin/bash
# Script para build do container Docker photo-processor
# Executa o docker-compose build no diretorio src/docker

set -e

echo "========================================"
echo "PHOTO-REPORT - Docker Build"
echo "========================================"
echo

# Verificar se Docker esta rodando
if ! docker info > /dev/null 2>&1; then
    echo "[ERRO] Docker nao esta rodando. Inicie o Docker primeiro."
    exit 1
fi

# Diretorio do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Garantir que a rede existe
echo "[1/3] Verificando rede Docker..."
"$SCRIPT_DIR/setup-network.sh"

echo
echo "[2/3] Iniciando build do container photo-processor..."
echo

# Navegar para o diretorio do docker-compose
cd "$SCRIPT_DIR/../../src/docker"

# Executar build
if docker-compose build --no-cache; then
    echo
    echo "========================================"
    echo "[OK] Build concluido com sucesso!"
    echo "========================================"
    echo
    echo "[3/3] Verificando imagem criada..."
    docker images photo-processor:1.0.0
    echo
    echo "Para iniciar o container:"
    echo "  cd src/docker"
    echo "  docker-compose up -d"
    echo
else
    echo
    echo "========================================"
    echo "[ERRO] Falha no build do container."
    echo "========================================"
    exit 1
fi
