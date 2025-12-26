#!/bin/bash
# ============================================================
# PHOTO-REPORT: Script para criar tabelas no banco cosmic
# Executa create-tables.sql no PostgreSQL
# ============================================================

set -e

echo ""
echo "============================================"
echo "  PHOTO-REPORT - Criar Tabelas SQL"
echo "============================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/../sql/create-tables.sql"

# Verificar se arquivo SQL existe
if [ ! -f "$SQL_FILE" ]; then
    echo "[ERRO] Arquivo SQL nao encontrado: $SQL_FILE"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "[ERRO] Docker nao esta rodando!"
    echo "       Inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se container pg está rodando
if docker ps | grep -q "pg"; then
    echo "[INFO] Container 'pg' encontrado. Executando script SQL..."
    echo ""

    # Copiar script SQL para o container
    docker cp "$SQL_FILE" pg:/tmp/create-tables.sql

    # Executar script SQL no container
    docker exec -i pg psql -U lucas -d cosmic -f /tmp/create-tables.sql

    # Limpar arquivo temporário
    docker exec pg rm -f /tmp/create-tables.sql

elif command -v psql > /dev/null 2>&1; then
    echo "[AVISO] Container 'pg' nao encontrado. Tentando conexao local..."
    echo ""

    # Tentar conexão direta via psql local
    psql -h localhost -U lucas -d cosmic -f "$SQL_FILE"
else
    echo "[ERRO] Container pg nao esta rodando e psql nao esta instalado."
    echo "       Verifique sua instalacao do PostgreSQL."
    exit 1
fi

echo ""
echo "============================================"
echo "  Tabelas criadas com sucesso!"
echo "============================================"
echo ""

# Verificar se tabelas foram criadas
echo "[INFO] Verificando tabelas criadas..."
echo ""

if docker ps | grep -q "pg"; then
    docker exec -i pg psql -U lucas -d cosmic -c "\dt"
else
    psql -h localhost -U lucas -d cosmic -c "\dt"
fi

echo ""
echo "Done!"
