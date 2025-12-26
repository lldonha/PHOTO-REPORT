#!/bin/bash
# ============================================================
# PHOTO-REPORT: Verifica tabelas no banco cosmic
# ============================================================

echo ""
echo "============================================"
echo "  PHOTO-REPORT - Verificar Tabelas"
echo "============================================"
echo ""

# Função para executar psql
run_psql() {
    if docker ps | grep -q "pg"; then
        docker exec -i pg psql -U lucas -d cosmic "$@"
    else
        psql -h localhost -U lucas -d cosmic "$@"
    fi
}

# Verificar conexão
if docker ps | grep -q "pg"; then
    echo "[INFO] Usando container 'pg'..."
elif command -v psql > /dev/null 2>&1; then
    echo "[INFO] Usando psql local..."
else
    echo "[ERRO] Nem container pg nem psql local disponiveis."
    exit 1
fi

echo ""
echo "--- Tabelas (\\dt) ---"
run_psql -c "\dt"

echo ""
echo "--- Views (\\dv) ---"
run_psql -c "\dv"

echo ""
echo "--- Indices (\\di) ---"
run_psql -c "\di"

echo ""
echo "============================================"
echo "  Verificacao concluida!"
echo "============================================"
echo ""

# Verificar especificamente as tabelas do PHOTO-REPORT
echo "[INFO] Verificando tabelas PHOTO-REPORT especificas..."
echo ""

run_psql -c "SELECT table_name FROM information_schema.tables WHERE table_name IN ('photo_reports', 'photo_items');"

echo ""
echo "[INFO] Verificando view photo_reports_summary..."
run_psql -c "SELECT viewname FROM pg_views WHERE viewname = 'photo_reports_summary';"

echo ""
echo "Done!"
