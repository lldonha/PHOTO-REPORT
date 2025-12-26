#!/bin/bash
# ============================================================
# PHOTO-REPORT: Verificar tabelas no banco cosmic
# ============================================================

echo ""
echo "============================================================"
echo "PHOTO-REPORT - Verificar Tabelas no Banco Cosmic"
echo "============================================================"
echo ""

# Verificar container
if ! docker ps | grep -q pg; then
    echo "ERRO: Container 'pg' nao esta rodando!"
    exit 1
fi

echo "[1/4] Listando tabelas photo_*..."
docker exec -i pg psql -U lucas -d cosmic -c "\dt photo_*"

echo ""
echo "[2/4] Listando views photo_*..."
docker exec -i pg psql -U lucas -d cosmic -c "\dv photo_*"

echo ""
echo "[3/4] Listando indices idx_photo_*..."
docker exec -i pg psql -U lucas -d cosmic -c "\di idx_photo_*"

echo ""
echo "[4/4] Descrevendo estrutura das tabelas..."
echo ""
echo "--- photo_reports ---"
docker exec -i pg psql -U lucas -d cosmic -c "\d photo_reports"

echo ""
echo "--- photo_items ---"
docker exec -i pg psql -U lucas -d cosmic -c "\d photo_items"

echo ""
echo "============================================================"
echo "VERIFICACAO COMPLETA!"
echo "============================================================"
echo ""

exit 0
