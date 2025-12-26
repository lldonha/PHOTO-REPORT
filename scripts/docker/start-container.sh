#!/bin/bash
# Script para iniciar o container Docker photo-processor e verificar health endpoint
# Executa docker-compose up e verifica se o endpoint /health responde

set -e

echo "========================================"
echo "PHOTO-REPORT - Start Container"
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
echo "[1/4] Verificando rede Docker..."
"$SCRIPT_DIR/setup-network.sh"

echo
echo "[2/4] Iniciando container photo-processor..."
echo

# Navegar para o diretorio do docker-compose
cd "$SCRIPT_DIR/../../src/docker"

# Parar container existente se houver
docker-compose down 2>/dev/null || true

# Iniciar container em background
docker-compose up -d

echo
echo "[3/4] Aguardando container inicializar (10 segundos)..."
sleep 10

echo
echo "[4/4] Verificando health endpoint..."
echo

# Tentar curl multiplas vezes (ate 5 tentativas)
RETRY_COUNT=0
MAX_RETRIES=5

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8002/health 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "  Tentativa $RETRY_COUNT/$MAX_RETRIES - aguardando..."
    sleep 3
done

if [ "$HTTP_CODE" != "200" ]; then
    echo
    echo "========================================"
    echo "[ERRO] Health endpoint nao respondeu."
    echo "========================================"
    echo
    echo "Verifique os logs do container:"
    echo "  docker logs photo-processor"
    echo
    exit 1
fi

echo
echo "========================================"
echo "[OK] Container iniciado com sucesso!"
echo "========================================"
echo

# Mostrar resposta do health endpoint
echo "Health Response:"
curl -s http://localhost:8002/health
echo
echo

# Mostrar status do container
echo "Container Status:"
docker ps --filter "name=photo-processor" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo

echo "----------------------------------------"
echo "Endpoints disponiveis:"
echo "  Health:  http://localhost:8002/health"
echo "  Docs:    http://localhost:8002/docs"
echo "  API:     http://localhost:8002/"
echo "----------------------------------------"
echo
echo "Para parar o container:"
echo "  cd src/docker"
echo "  docker-compose down"
echo
