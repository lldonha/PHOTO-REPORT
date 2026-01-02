# ============================================
# PHOTO-REPORT - Iniciar Auto-Claude
# ============================================
# Este script prepara e executa o Auto-Claude
# para criar as specs do sistema
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PHOTO-REPORT - Auto-Claude Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar localização
$CurrentDir = Get-Location
Write-Host "[1/5] Verificando diretório..." -ForegroundColor Yellow
if ($CurrentDir.Path -ne "E:\Projetos\PHOTO-REPORT") {
    Write-Host "  ⚠️  Navegando para E:\Projetos\PHOTO-REPORT..." -ForegroundColor Yellow
    Set-Location "E:\Projetos\PHOTO-REPORT"
}
Write-Host "  ✅ Diretório correto: $((Get-Location).Path)" -ForegroundColor Green
Write-Host ""

# 2. Verificar arquivos de referência
Write-Host "[2/5] Verificando arquivos de setup..." -ForegroundColor Yellow
$RequiredFiles = @(
    "prompt-auto-claude.txt",
    "Context\referencias-solocator.md",
    "referencias\foto-exemplo-1.jpg",
    "referencias\foto-exemplo-2.jpg",
    "referencias\foto-exemplo-3.jpg"
)

$AllOK = $true
foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (FALTANDO!)" -ForegroundColor Red
        $AllOK = $false
    }
}

if (-not $AllOK) {
    Write-Host ""
    Write-Host "❌ Alguns arquivos estão faltando!" -ForegroundColor Red
    Write-Host "Execute novamente o setup com Claude Code." -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. Verificar Git
Write-Host "[3/5] Verificando repositório Git..." -ForegroundColor Yellow
$GitStatus = git status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Repositório Git OK" -ForegroundColor Green
} else {
    Write-Host "  ❌ Não é um repositório Git!" -ForegroundColor Red
    Write-Host "  Inicializando Git..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit"
    Write-Host "  ✅ Git inicializado" -ForegroundColor Green
}
Write-Host ""

# 4. Verificar Auto-Claude
Write-Host "[4/5] Verificando Auto-Claude..." -ForegroundColor Yellow
$AutoClaudePath = "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\runners\spec_runner.py"
if (Test-Path $AutoClaudePath) {
    Write-Host "  ✅ Auto-Claude encontrado" -ForegroundColor Green
} else {
    Write-Host "  ❌ Auto-Claude não encontrado em:" -ForegroundColor Red
    Write-Host "     $AutoClaudePath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique o caminho do Auto-Claude e ajuste a variável" -ForegroundColor Yellow
    Write-Host "`$AutoClaudePath neste script." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 5. Exibir resumo
Write-Host "[5/5] Resumo do Setup:" -ForegroundColor Yellow
Write-Host "  📁 Projeto: E:\Projetos\PHOTO-REPORT" -ForegroundColor White
Write-Host "  📝 Prompt: prompt-auto-claude.txt" -ForegroundColor White
Write-Host "  📸 Referências: 3 fotos do Sinergisa" -ForegroundColor White
Write-Host "  📄 Documentação: Context/referencias-solocator.md" -ForegroundColor White
Write-Host "  🔧 Auto-Claude: $AutoClaudePath" -ForegroundColor White
Write-Host ""

# Perguntar se deve continuar
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pronto para executar Auto-Claude!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "O Auto-Claude vai criar 3 specs:" -ForegroundColor White
Write-Host "  1. Spec 001: Mobile App (Expo)" -ForegroundColor White
Write-Host "  2. Spec 002: Web Interface (React)" -ForegroundColor White
Write-Host "  3. Spec 003: Google Drive Sync" -ForegroundColor White
Write-Host ""
Write-Host "Tempo estimado por spec:" -ForegroundColor White
Write-Host "  - Spec Creation: 20-40 min" -ForegroundColor White
Write-Host "  - Implementation: 1-3 horas" -ForegroundColor White
Write-Host "  - QA Validation: 20-40 min" -ForegroundColor White
Write-Host ""

$Continue = Read-Host "Deseja continuar? (S/N)"
if ($Continue -ne "S" -and $Continue -ne "s") {
    Write-Host ""
    Write-Host "❌ Execução cancelada pelo usuário." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Executando Auto-Claude..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Ler o prompt
$PromptContent = Get-Content -Path "prompt-auto-claude.txt" -Raw

# Executar Auto-Claude em modo interativo
Write-Host "🚀 Iniciando Auto-Claude (modo interativo)..." -ForegroundColor Cyan
Write-Host ""
Write-Host "INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "1. Quando perguntar 'What would you like to build?'" -ForegroundColor White
Write-Host "   → Cole o conteúdo de prompt-auto-claude.txt" -ForegroundColor White
Write-Host ""
Write-Host "2. Quando perguntar 'complexity?'" -ForegroundColor White
Write-Host "   → Digite: standard" -ForegroundColor White
Write-Host ""
Write-Host "3. Quando perguntar 'additional context?'" -ForegroundColor White
Write-Host "   → Digite: Context/referencias-solocator.md" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER para continuar..." -ForegroundColor Green
Read-Host

# Executar
python $AutoClaudePath --interactive

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Auto-Claude finalizado!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Verificar specs criadas em .auto-claude/specs/" -ForegroundColor White
Write-Host "2. Acompanhar implementação nos worktrees" -ForegroundColor White
Write-Host "3. Revisar e testar quando QA aprovar" -ForegroundColor White
Write-Host "4. Fazer merge quando estiver satisfeito" -ForegroundColor White
Write-Host ""
