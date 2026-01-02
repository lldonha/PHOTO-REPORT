# Script para iniciar o app mobile PHOTO-REPORT
# Execute este script em um novo PowerShell

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "PHOTO-REPORT Mobile App" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Ir para pasta do mobile
Set-Location "E:\Projetos\PHOTO-REPORT\src\mobile"

Write-Host "[1/3] Limpando cache do Metro Bundler..." -ForegroundColor Yellow
npx expo start --clear --port 8083

Write-Host "" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "App iniciado!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opcoes:" -ForegroundColor Cyan
Write-Host "  a - Abrir no Android" -ForegroundColor White
Write-Host "  i - Abrir no iOS" -ForegroundColor White
Write-Host "  w - Abrir no navegador" -ForegroundColor White
Write-Host "  r - Recarregar app" -ForegroundColor White
Write-Host ""
Write-Host "Ou escaneie o QR code com o app Expo Go no celular!" -ForegroundColor Green
Write-Host ""
