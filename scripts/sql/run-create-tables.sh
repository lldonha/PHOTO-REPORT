#!/bin/bash
# ============================================================
# PHOTO-REPORT: Script para criar tabelas no banco cosmic
# ============================================================
#
# Este script executa o create-tables.sql no container PostgreSQL
# O container pg deve estar rodando
#
# Uso: ./run-create-tables.sh
# ============================================================

echo ""
echo "============================================================"
echo "PHOTO-REPORT - Criar Tabelas no Banco Cosmic"
echo "============================================================"
echo ""

# Diretorio do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Verificar se o container pg esta rodando
echo "[1/3] Verificando container PostgreSQL..."
if ! docker ps | grep -q pg; then
    echo "ERRO: Container 'pg' nao esta rodando!"
    echo "      Inicie o container com: docker start pg"
    exit 1
fi
echo "      OK - Container 'pg' esta rodando"

# Executar o script SQL
echo ""
echo "[2/3] Executando create-tables.sql..."
if ! docker exec -i pg psql -U lucas -d cosmic < "$SCRIPT_DIR/create-tables.sql"; then
    echo "ERRO: Falha ao executar o script SQL!"
    exit 1
fi
echo "      OK - Script SQL executado com sucesso"

# Verificar tabelas criadas
echo ""
echo "[3/3] Verificando tabelas criadas..."
docker exec -i pg psql -U lucas -d cosmic -c "\dt photo_*"

echo ""
echo "============================================================"
echo "VERIFICACAO COMPLETA!"
echo "============================================================"
echo ""
echo "Para verificar manualmente, execute:"
echo "  docker exec -it pg psql -U lucas -d cosmic"
echo ""
echo "Comandos uteis no psql:"
echo "  \dt             - Listar tabelas"
echo "  \dv             - Listar views"
echo "  \di             - Listar indices"
echo "  \d photo_reports     - Descrever tabela"
echo "  \d photo_items       - Descrever tabela"
echo ""

exit 0
