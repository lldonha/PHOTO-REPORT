#!/bin/bash
# ============================================================================
# PHOTO-REPORT - Frontend Browser Verification Script
# ============================================================================
# This script opens the frontend in the default browser for manual verification.
#
# Verification Checklist:
#   [ ] Dropzone is visible (drag-and-drop area with camera icon)
#   [ ] Title field ("Titulo do Relatorio") is visible and editable
#   [ ] Obra field ("Nome da Obra") is visible and editable
#   [ ] Responsavel field ("Responsavel Tecnico") is visible and editable
#   [ ] No JavaScript console errors (press F12 to check)
#   [ ] Page loads without 404 errors
#   [ ] Status bar shows "Pronto" and "0 fotos carregadas"
#   [ ] "Gerar Relatorio PDF" button is visible (disabled initially)
#   [ ] "Limpar Tudo" button is visible (disabled initially)
# ============================================================================

echo ""
echo "============================================================================"
echo "PHOTO-REPORT - Frontend Browser Verification"
echo "============================================================================"
echo ""

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to project root (2 levels up from scripts/tests)
cd "$SCRIPT_DIR/../.."

# Check if frontend file exists
if [ ! -f "src/frontend/index.html" ]; then
    echo "ERROR: Frontend file not found at src/frontend/index.html"
    echo "Please ensure the frontend has been created."
    exit 1
fi

echo "Opening frontend in default browser..."
echo ""

# Determine the OS and open the file accordingly
FRONTEND_PATH="$(pwd)/src/frontend/index.html"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$FRONTEND_PATH"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open "$FRONTEND_PATH"
    elif command -v gnome-open &> /dev/null; then
        gnome-open "$FRONTEND_PATH"
    else
        echo "Please open manually: file://$FRONTEND_PATH"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash, Cygwin)
    start "" "$FRONTEND_PATH"
else
    echo "Please open manually: file://$FRONTEND_PATH"
fi

echo ""
echo "============================================================================"
echo "VERIFICATION CHECKLIST"
echo "============================================================================"
echo ""
echo "Please verify the following in your browser:"
echo ""
echo "  1. DROPZONE VISIBLE"
echo "     - Large drag-and-drop area with camera icon (camera emoji)"
echo "     - Text: 'Arraste as fotos aqui'"
echo "     - Text: 'ou clique para selecionar arquivos'"
echo ""
echo "  2. CONFIGURATION FIELDS VISIBLE"
echo "     - 'Titulo do Relatorio' input field (with default value)"
echo "     - 'Nome da Obra' input field (placeholder text)"
echo "     - 'Responsavel Tecnico' input field (placeholder text)"
echo ""
echo "  3. STATUS BAR"
echo "     - Badge showing 'Pronto'"
echo "     - Counter showing '0 fotos carregadas'"
echo "     - 'Limpar Tudo' button (disabled)"
echo "     - 'Gerar Relatorio PDF' button (disabled)"
echo ""
echo "  4. NO CONSOLE ERRORS"
echo "     - Press F12 to open Developer Tools"
echo "     - Click on 'Console' tab"
echo "     - Verify NO RED ERROR MESSAGES (warnings are OK)"
echo "     - You may see a warning about API connection if Docker is not running"
echo ""
echo "  5. EMPTY STATE"
echo "     - Shows camera icon with text 'Nenhuma foto carregada ainda'"
echo ""
echo "============================================================================"
echo ""
echo "If all checks pass, the frontend verification is COMPLETE."
echo ""
