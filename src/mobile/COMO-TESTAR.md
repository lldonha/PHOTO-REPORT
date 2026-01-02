# 🚀 Como Testar o App PHOTO-REPORT no Celular

## ⚠️ Problema: "Unable to Download" no Expo Go

**Expo Go NÃO funciona** porque o app usa câmera, GPS e SQLite (bibliotecas nativas).

---

## ✅ Solução: Build Development (10 minutos)

### Método Automático (Execute isso):

**Abra um novo PowerShell e execute:**

```powershell
cd E:\Projetos\PHOTO-REPORT\src\mobile
.\BUILD-APP.ps1
```

O script vai:
1. Pedir login Expo (crie conta grátis se não tiver)
2. Configurar projeto
3. Buildar APK na nuvem (~10 min)
4. Retornar link de download

### Depois do Build:

1. **Abra o link no celular**
2. **Baixe e instale o APK**
3. **No PC, inicie Expo:**
   ```bash
   npx expo start
   ```
4. **No celular, abra o app instalado** (não Expo Go!)
5. **Escaneie o QR code**

---

## 📱 O Que Vai Funcionar:

Depois do build development:
- ✅ Câmera nativa
- ✅ GPS + Bússola em tempo real
- ✅ SQLite offline
- ✅ Sincronização com backend
- ✅ Todas as 3 telas (Câmera/Galeria/Sync)

---

## 🔧 Alternativa: Emulador Android

Se tiver Android Studio instalado:

1. Abra AVD Manager
2. Crie/inicie emulador Android
3. Execute: `npx expo start`
4. Pressione `a` quando Expo abrir
5. App abre no emulador automaticamente

---

## ⏱️ Tempo Total:

- **Build:** 10-15 minutos (primeira vez)
- **Próximos builds:** 3-5 minutos
- **Instalação no celular:** 1 minuto

---

## 💡 Por Que Isso?

**Expo Go** = navegador de apps JavaScript (limitado)
- ✅ Funciona: UI, navegação, componentes básicos
- ❌ NÃO funciona: câmera, GPS, SQLite, sensores

**Development Build** = SEU app nativo completo
- ✅ Funciona TUDO
- ⚠️ Precisa buildar uma vez

---

## 🎯 Execute Agora:

```powershell
cd E:\Projetos\PHOTO-REPORT\src\mobile
.\BUILD-APP.ps1
```

Aguarde 10 minutos, instale no celular, e pronto! 🚀
