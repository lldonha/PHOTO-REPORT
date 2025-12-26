#!/bin/bash
# Script para verificar o health endpoint do container photo-processor
# Testa se o endpoint /health responde corretamente

echo "========================================"
echo "PHOTO-REPORT - Health Verification"
echo "========================================"
echo

echo "Verificando endpoint: http://localhost:8002/health"
echo

# Verificar se curl esta disponivel
if ! command -v curl &> /dev/null; then
    echo "[ERRO] curl nao encontrado. Instale o curl primeiro."
    exit 1
fi

# Fazer request ao health endpoint
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8002/health 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "Response:"
echo "$BODY"
echo
echo "HTTP Status: $HTTP_CODE"
echo

if [ "$HTTP_CODE" = "200" ]; then
    echo "========================================"
    echo "[OK] Health endpoint respondeu!"
    echo "========================================"
else
    echo "========================================"
    echo "[ERRO] Falha ao conectar ao endpoint."
    echo "========================================"
    echo
    echo "Verifique se o container esta rodando:"
    echo "  docker ps | grep photo-processor"
    echo
    echo "Para iniciar o container:"
    echo "  scripts/docker/start-container.sh"
    exit 1
fi
