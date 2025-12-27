# 🔧 Guia de Troubleshooting - PHOTO-REPORT

**Data:** 2025-12-27
**Problemas Reportados:**
1. ❌ Ainda aparece OpenStreetMap (não Google Maps Satélite)
2. ❌ Botão "Gerar Relatório" desabilitado
3. ❌ Não consegue reorganizar fotos (drag & drop)

---

## 🗺️ Problema 1: Google Maps não funciona (ainda OpenStreetMap)

### ✅ Causa Identificada

A API do Google Maps está retornando erro **HTTP 403**:

```
ERROR - Erro Google Maps API: HTTP 403 - This API project is not authorized to use this API.
```

**Diagnóstico:** A Google Maps **Static API** não está ativada no seu projeto Google Cloud.

### 🔧 Solução: Ativar Maps Static API

#### Passo 1: Acessar Google Cloud Console

1. Vá para: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto que tem a API Key `AIzaSyDJQR5_oKUq_1mjuWjYC6YTcmvOm1ejieQ`

#### Passo 2: Ativar a API

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Procure por **"Maps Static API"**
3. Clique em **"ATIVAR"** (Enable)
4. Aguarde alguns segundos até ativar

#### Passo 3: Verificar Restrições (Opcional mas Recomendado)

1. Vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique na sua API Key
3. Em **"Restrições de aplicativo"**, configure:
   - **Referenciadores HTTP:** `https://diario.lldonha.com/*`, `https://api.lldonha.com/*`
   - Ou **Endereços IP:** Adicione o IP do seu servidor

4. Em **"Restrições de API"**, selecione:
   - ✅ Maps Static API
   - ✅ Geocoding API (para endereços - futuro)

5. Clique em **"SALVAR"**

#### Passo 4: Testar

1. Aguarde 1-2 minutos para as mudanças propagarem
2. Faça upload de uma nova foto em https://diario.lldonha.com/
3. Verifique os logs do container:

```bash
docker logs photo-processor -f
```

**Busque por:**
```
✅ Mini-mapa Google Maps gerado com sucesso
```

**Se ainda falhar, você verá:**
```
⚠️ Google Maps falhou, usando OpenStreetMap como fallback
```

---

## 📄 Problema 2: Botão "Gerar Relatório" Desabilitado

### ✅ Causa

O botão está **desabilitado por padrão** e só é habilitado quando você tem fotos carregadas.

### 🔧 Solução

#### Teste 1: Verificar se há fotos carregadas

1. Abra https://diario.lldonha.com/
2. **Faça upload de pelo menos 1 foto:**
   - Arraste uma foto com GPS para a área de upload, OU
   - Clique em "📁 Selecionar Fotos" e escolha uma imagem

3. **Aguarde o processamento:**
   - Deve aparecer uma barra de loading
   - Após ~2-3 segundos, a foto deve aparecer na grid

4. **O botão deve ficar azul e clicável**

#### Teste 2: Verificar Console do Navegador

1. Pressione **F12** (ou Ctrl+Shift+I) no navegador
2. Vá na aba **"Console"**
3. Procure por **erros em vermelho**

**Erros comuns:**
- ❌ `Failed to fetch` → API offline ou CORS
- ❌ `Sortable is not defined` → SortableJS não carregou
- ❌ `Cannot read property...` → Erro no JavaScript

#### Teste 3: Verificar Network (Rede)

1. Ainda no F12, vá na aba **"Network"** (Rede)
2. Faça upload de uma foto
3. Procure pela requisição **`processar-foto`**
4. Verifique:
   - ✅ Status: **200 OK** → Sucesso
   - ❌ Status: **403**, **500**, etc → Erro

#### Teste 4: Hard Refresh (Limpar Cache)

1. Pressione **Ctrl + Shift + R** (Windows) ou **Cmd + Shift + R** (Mac)
2. Isso força o navegador a recarregar sem cache
3. Tente fazer upload novamente

---

## 🔀 Problema 3: Não Consegue Reorganizar Fotos (Drag & Drop)

### ✅ Causa Possível

1. **SortableJS não carregou** (erro de rede)
2. **Cache do navegador** (versão antiga do código)
3. **Erro no JavaScript** bloqueando a inicialização

### 🔧 Solução

#### Teste 1: Verificar se SortableJS Carregou

1. Abra o Console (F12)
2. Digite:

```javascript
typeof Sortable
```

3. **Resultado esperado:** `"function"`
4. **Se aparecer:** `"undefined"` → SortableJS não carregou

**Solução se não carregou:**
- Verifique sua conexão com internet
- Teste se https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js está acessível
- Tente outro navegador (Chrome, Firefox, Edge)

#### Teste 2: Verificar se Fotos Estão na Grid

**Drag & drop só funciona com 2+ fotos carregadas.**

1. Faça upload de **pelo menos 2 fotos**
2. Aguarde aparecerem na grid
3. Tente arrastar uma foto sobre a outra

#### Teste 3: Verificar Cursor

Quando você passa o mouse sobre uma foto:
- ✅ **Cursor vira "mãozinha" (grab/grabbing)** → Sortable ativo
- ❌ **Cursor normal** → Sortable não inicializou

#### Teste 4: Hard Refresh Forçado

1. **Ctrl + Shift + Delete** → Abre "Limpar dados de navegação"
2. Marque:
   - ✅ Imagens e arquivos em cache
   - ✅ Cookies e dados de site
3. Período: **Última hora**
4. Clique em **"Limpar dados"**
5. Recarregue https://diario.lldonha.com/

#### Teste 5: Verificar Erros JavaScript

1. Console (F12)
2. Procure por erros relacionados a:
   - `Sortable.create`
   - `initSortable`
   - `photo-card`

---

## 🎯 Checklist Rápida de Diagnóstico

Execute na ordem:

### 1. Verificar API Online
```bash
curl https://api.lldonha.com/health
# Esperado: {"status":"ok","version":"1.0.0","service":"photo-processor"}
```

### 2. Verificar Frontend Carregando
```bash
curl -I https://diario.lldonha.com/
# Esperado: HTTP/2 200
```

### 3. Verificar Console do Navegador (F12)
- ❌ Tem erros em vermelho? → Investigar
- ✅ Nenhum erro? → Continuar

### 4. Testar Upload de Foto
1. Arraste uma foto JPEG/PNG com GPS
2. Aguarde processamento
3. Foto deve aparecer na grid

### 5. Verificar Botão "Gerar Relatório"
- ❌ Ainda desabilitado (cinza)? → Nenhuma foto carregou com sucesso
- ✅ Habilitado (azul)? → Tudo OK!

### 6. Testar Drag & Drop
1. Upload de 2+ fotos
2. Arraste uma sobre a outra
3. Deve trocar de posição

---

## 🔍 Debug Avançado

### Verificar Logs do Container em Tempo Real

```bash
docker logs photo-processor -f
```

**Procure por:**
- ✅ `Foto processada com sucesso` → Upload funcionando
- ❌ `Erro ao processar foto` → Problema no backend
- ⚠️ `Google Maps falhou` → API 403 (ver Problema 1)

### Verificar Variáveis de Ambiente

```bash
docker exec photo-processor env | grep GOOGLE
```

**Esperado:**
```
GOOGLE_MAPS_API_KEY=AIza...
USE_GOOGLE_MAPS=true
```

### Testar API Diretamente (Postman/cURL)

```bash
# Health Check
curl https://api.lldonha.com/health

# Processar Foto (substitua pelo path real)
curl -X POST "https://api.lldonha.com/processar-foto" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/photo.jpg"
```

---

## 📞 Se Nada Funcionar

### 1. Restart Total

```bash
cd .worktrees/001-criar-sistema-photo-report-completo/src/docker
docker-compose down
docker-compose up -d
```

### 2. Verificar Status

```bash
docker ps | grep photo-processor
# Deve mostrar: Up X minutes (healthy)
```

### 3. Logs Completos

```bash
docker logs photo-processor --tail 200 > debug-logs.txt
```

Envie `debug-logs.txt` para análise.

---

## ✅ Resumo das Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| OpenStreetMap (não Google Maps) | Maps Static API não ativada | Ativar no Google Cloud Console |
| Botão "Gerar Relatório" desabilitado | Nenhuma foto carregada | Upload de fotos primeiro |
| Drag & Drop não funciona | Cache ou SortableJS não carregou | Hard refresh (Ctrl+Shift+R) |

---

## 🎯 Próximos Passos

1. **Ativar Maps Static API** → Google Cloud Console
2. **Testar upload de foto** → https://diario.lldonha.com/
3. **Verificar mini-mapa satélite** → Deve aparecer imagem de satélite
4. **Testar botão "Gerar Relatório"** → Deve ficar azul após upload
5. **Testar drag & drop** → Arrastar fotos para reordenar

---

*Última atualização: 2025-12-27*
*Container: photo-processor:1.0.0*
