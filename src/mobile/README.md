# 📱 PHOTO-REPORT Mobile App

App mobile React Native com Expo para captura de fotos com GPS e bússola.

## 🚀 Como Testar

### Opção 1: Script Automático (Recomendado)

```powershell
# Abra um novo PowerShell e execute:
cd E:\Projetos\PHOTO-REPORT\src\mobile
.\START-APP.ps1
```

### Opção 2: Manual

```powershell
cd E:\Projetos\PHOTO-REPORT\src\mobile
npx expo start --port 8083
```

Depois:
- **No celular:** Escaneie o QR code com o app **Expo Go**
- **No navegador:** Pressione `w`
- **Android emulator:** Pressione `a`
- **iOS simulator:** Pressione `i`

## 📦 Recursos

- ✅ Câmera nativa com preview ao vivo
- ✅ GPS + Bússola em tempo real
- ✅ Armazenamento offline (SQLite)
- ✅ Sincronização automática com backend
- ✅ 3 telas: Câmera / Galeria / Sync
- ✅ Tema navy + dourado (matching web app)

## 🔧 Troubleshooting

### "Port 8081 já em uso"
O backend está rodando na 8081. Use a porta 8083:
```bash
npx expo start --port 8083
```

### "Metro Bundler travado"
Limpe o cache:
```bash
npx expo start --clear
```

### "Expo Go não conecta"
1. Verifique se celular e PC estão na mesma rede Wi-Fi
2. Ou use tunnel: `npx expo start --tunnel`

## 📱 Instalar Expo Go

- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/app/expo-go/id982107779

## 🏗️ Build para Produção

```bash
# Android APK
eas build --platform android

# iOS
eas build --platform ios
```

## 🎯 Endpoints Backend

- `POST /mobile/upload` - Enviar foto com metadados GPS

## ⚙️ Configuração

Ver `app.json` para configurações de permissões, ícones, splash screen, etc.
