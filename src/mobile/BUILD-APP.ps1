# Script para fazer build do app PHOTO-REPORT

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BUILD APP - PHOTO REPORT MOBILE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "E:\Projetos\PHOTO-REPORT\src\mobile"

Write-Host "[PASSO 1/4] Login no Expo..." -ForegroundColor Yellow
Write-Host "Se nao tem conta, crie gratuitamente em: https://expo.dev/signup" -ForegroundColor Gray
Write-Host ""
eas login

Write-Host ""
Write-Host "[PASSO 2/4] Configurando projeto..." -ForegroundColor Yellow
eas build:configure

Write-Host ""
Write-Host "[PASSO 3/4] Iniciando build Android (Development)..." -ForegroundColor Yellow
Write-Host "Isso vai levar ~10-15 minutos. Pode fazer outras coisas enquanto builda!" -ForegroundColor Gray
Write-Host ""
eas build --profile development --platform android

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BUILD CONCLUIDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximo passo:" -ForegroundColor Cyan
Write-Host "1. Abra o link do APK no celular" -ForegroundColor White
Write-Host "2. Instale o APK" -ForegroundColor White
Write-Host "3. Execute: npx expo start" -ForegroundColor White
Write-Host "4. Escaneie QR code com o APP que voce instalou (nao Expo Go!)" -ForegroundColor White
Write-Host ""
