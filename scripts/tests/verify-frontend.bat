@echo off
REM ============================================================================
REM PHOTO-REPORT - Frontend Browser Verification Script
REM ============================================================================
REM This script opens the frontend in the default browser for manual verification.
REM
REM Verification Checklist:
REM   [ ] Dropzone is visible (drag-and-drop area with camera icon)
REM   [ ] Title field ("Titulo do Relatorio") is visible and editable
REM   [ ] Obra field ("Nome da Obra") is visible and editable
REM   [ ] Responsavel field ("Responsavel Tecnico") is visible and editable
REM   [ ] No JavaScript console errors (press F12 to check)
REM   [ ] Page loads without 404 errors
REM   [ ] Status bar shows "Pronto" and "0 fotos carregadas"
REM   [ ] "Gerar Relatorio PDF" button is visible (disabled initially)
REM   [ ] "Limpar Tudo" button is visible (disabled initially)
REM ============================================================================

echo.
echo ============================================================================
echo PHOTO-REPORT - Frontend Browser Verification
echo ============================================================================
echo.

REM Get the directory of this script
set SCRIPT_DIR=%~dp0

REM Navigate to project root (2 levels up from scripts\tests)
cd /d "%SCRIPT_DIR%..\..\"

REM Check if frontend file exists
if not exist "src\frontend\index.html" (
    echo ERROR: Frontend file not found at src\frontend\index.html
    echo Please ensure the frontend has been created.
    exit /b 1
)

echo Opening frontend in default browser...
echo.

REM Open the HTML file in the default browser
start "" "src\frontend\index.html"

echo.
echo ============================================================================
echo VERIFICATION CHECKLIST
echo ============================================================================
echo.
echo Please verify the following in your browser:
echo.
echo   1. DROPZONE VISIBLE
echo      - Large drag-and-drop area with camera icon (camera emoji)
echo      - Text: "Arraste as fotos aqui"
echo      - Text: "ou clique para selecionar arquivos"
echo.
echo   2. CONFIGURATION FIELDS VISIBLE
echo      - "Titulo do Relatorio" input field (with default value)
echo      - "Nome da Obra" input field (placeholder text)
echo      - "Responsavel Tecnico" input field (placeholder text)
echo.
echo   3. STATUS BAR
echo      - Badge showing "Pronto"
echo      - Counter showing "0 fotos carregadas"
echo      - "Limpar Tudo" button (disabled)
echo      - "Gerar Relatorio PDF" button (disabled)
echo.
echo   4. NO CONSOLE ERRORS
echo      - Press F12 to open Developer Tools
echo      - Click on "Console" tab
echo      - Verify NO RED ERROR MESSAGES (warnings are OK)
echo      - You may see a warning about API connection if Docker is not running
echo.
echo   5. EMPTY STATE
echo      - Shows camera icon with text "Nenhuma foto carregada ainda"
echo.
echo ============================================================================
echo.
echo If all checks pass, the frontend verification is COMPLETE.
echo.
pause
