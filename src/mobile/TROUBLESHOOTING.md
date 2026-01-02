# 🔧 Troubleshooting - Photo Report Mobile

## ❌ Erro: "Unable to download iOS" / "Unable to download Android"

**Causa:** O app usa bibliotecas nativas (Camera, GPS, SQLite) que **NÃO funcionam com Expo Go**.

---

## ✅ Soluções

### Solução 1: Development Build (Recomendado)

O app precisa de um **build nativo** porque usa:
- 📷 `expo-camera` (câmera nativa)
- 📍 `expo-location` (GPS/bússola)
- 💾 `expo-sqlite` (banco SQLite)

**Passo a passo:**

1. **Instalar EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login Expo:**
```bash
eas login
```

3. **Configurar projeto:**
```bash
cd E:\Projetos\PHOTO-REPORT\src\mobile
eas build:configure
```

4. **Build para Android (mais rápido):**
```bash
# Development build (para testar)
eas build --profile development --platform android

# Ou build de produção
eas build --profile production --platform android
```

5. **Instalar no celular:**
   - EAS vai gerar um link de download
   - Abra no celular e instale o APK
   - Escaneie QR code do Metro Bundler

**Tempo estimado:** 10-20 minutos

---

### Solução 2: Testar Apenas UI (sem câmera/GPS)

Se quiser testar rapidamente apenas a interface:

1. **Criar versão mock:**
```bash
cd E:\Projetos\PHOTO-REPORT\src\mobile
git checkout -b test/expo-go-mock
```

2. **Editar App.tsx** - comentar imports de serviços nativos

3. **Rodar:**
```bash
npx expo start
```

**Limitações:** Não vai funcionar câmera, GPS, SQLite (apenas navegação de telas)

---

### Solução 3: Emulador Android (Local)

Se tiver Android Studio instalado:

1. **Abrir Android Studio**
2. **Tools > AVD Manager**
3. **Create Virtual Device**
4. **Rodar emulador**

5. **No terminal do Expo, pressionar `a`:**
```bash
npx expo start
# Pressione 'a' para abrir no Android
```

**Vantagem:** Testa localmente sem build

---

## 🚀 Método Mais Rápido: EAS Development Build

Execute isso agora:

```powershell
# 1. Instalar EAS
npm install -g eas-cli

# 2. Login (cria conta grátis se não tiver)
eas login

# 3. Build development para Android
cd E:\Projetos\PHOTO-REPORT\src\mobile
eas build --profile development --platform android
```

Depois:
- EAS vai buildar na nuvem (~10 min)
- Retorna um link de download do APK
- Instala no celular
- App funciona 100% com câmera, GPS, tudo!

---

## 📱 Alternativa: Usar Expo Go para Apps Simples

Se quiser criar um app de TESTE que funcione no Expo Go:

```bash
npx create-expo-app test-app
cd test-app
npx expo start
```

Escaneie o QR code - esse funciona no Expo Go porque não tem bibliotecas nativas.

---

## 💡 Por Que Isso Acontece?

**Expo Go** = App genérico que roda código JavaScript
- ✅ Funciona com: componentes básicos, navegação, estilo
- ❌ NÃO funciona com: câmera, GPS, SQLite, Bluetooth, NFC, etc.

**Development Build** = Seu próprio app nativo
- ✅ Funciona com TUDO
- ⚠️ Precisa buildar (10-20 min primeira vez)

---

## 🎯 Recomendação

Use **EAS Development Build** - é gratuito e permite testar o app completo no celular com todas as features (câmera, GPS, SQLite).

Execute:
```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

Aguarde 10-15 minutos, instale o APK no celular, e pronto!
