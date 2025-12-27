# 🔍 DEBUG AO VIVO - Problemas Atuais

**Data:** 2025-12-27
**Hora:** ~09:00

---

## ❌ Problema 1: Drag & Drop Não Funciona

### Código Verificado
✅ **SortableJS carregando do CDN** - https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js
✅ **initSortable() presente** no código JavaScript
✅ **Event listeners configurados** corretamente

### Possíveis Causas

1. **SortableJS não está carregando** do CDN
2. **Erro de JavaScript** bloqueando inicialização
3. **Você não tem 2+ fotos** carregadas (precisa de múltiplas fotos)

### 🧪 Teste Imediato - Abra o Console

1. Abra https://diario.lldonha.com/
2. Pressione **F12** (Console do navegador)
3. Digite este comando:

```javascript
typeof Sortable
```

**Resultado esperado:** `"function"`
**Se aparecer:** `"undefined"` → SortableJS não carregou!

### Se SortableJS não carregou:

**Opção 1: Problema de rede/firewall**
- Teste se consegue acessar: https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js
- Abra diretamente no navegador
- Se der erro de DNS/timeout → Problema de rede

**Opção 2: Usar versão local (solução rápida)**

Posso baixar o SortableJS e hospedar localmente no container.

---

## ❌ Problema 2: Google Maps Não Funciona (OpenStreetMap)

### Status Atual

Container está **tentando usar Google Maps**, mas recebe:

```
ERROR - Erro Google Maps API: HTTP 403
This API project is not authorized to use this API.
```

### ✅ Solução Definitiva

**Você JÁ ATIVOU a Maps Static API no Google Cloud Console?**

Se **NÃO**, faça agora:

#### Passo 1: Acessar Console
https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com

#### Passo 2: Ativar API
1. Clique em **"ATIVAR"** (Enable)
2. Aguarde 1-2 minutos

#### Passo 3: Verificar Credenciais
1. Vá em: https://console.cloud.google.com/apis/credentials
2. Encontre a API Key: `AIzaSyDJQR5_oKUq_1mjuWjYC6YTcmvOm1ejieQ`
3. Clique nela
4. Em **"Restrições de API"**, verifique se inclui:
   - ✅ **Maps Static API**

5. Se não incluir, adicione e **SALVE**

#### Passo 4: Testar
1. Aguarde **2 minutos** para propagar
2. Faça upload de uma foto nova
3. Verifique logs:

```bash
docker logs photo-processor -f
```

**Procure:**
```
✅ Mini-mapa Google Maps gerado com sucesso
```

---

## 🎯 Debug Rápido - Execute Agora

### Teste 1: Verificar Console (F12)

```javascript
// No console do navegador (F12):
console.log('SortableJS:', typeof Sortable);
console.log('Fotos:', state.fotos.length);
console.log('Sortable instance:', sortableInstance);
```

**Resultados esperados:**
```
SortableJS: "function"
Fotos: 2 (ou mais)
Sortable instance: Object {...}
```

### Teste 2: Verificar Fotos Carregadas

1. Abra https://diario.lldonha.com/
2. Upload de **2 fotos** (arrastar para área de upload)
3. Aguarde aparecerem na grid
4. Console (F12), digite:

```javascript
state.fotos.length
```

**Deve retornar:** `2` (ou mais)

### Teste 3: Forçar Inicialização do Sortable

Se `typeof Sortable === "function"` mas não funciona, force:

```javascript
// No console:
initSortable();
```

Agora tente arrastar as fotos.

### Teste 4: Verificar Erro no Console

1. Console (F12)
2. Procure por **linhas vermelhas** (erros)
3. Copie o erro completo

**Erros comuns:**
- `Sortable is not defined` → SortableJS não carregou
- `Cannot read property of undefined` → Bug no código
- `Failed to fetch` → Problema de CORS/API

---

## 🔧 Soluções Rápidas

### Solução 1: Hard Refresh Total

```
Ctrl + Shift + Delete
→ Limpar cache das últimas 24 horas
→ Recarregar página
```

### Solução 2: Testar Outro Navegador

- Se funciona no **Chrome** mas não no **Edge** → Cache
- Se não funciona em **nenhum** → Problema no código

### Solução 3: Verificar Adblocker

Alguns **adblockers bloqueiam CDNs**.

1. **Desative o adblocker** temporariamente
2. Recarregue https://diario.lldonha.com/
3. Tente novamente

---

## 📊 Checklist de Diagnóstico

Marque o que já testou:

### Google Maps
- [ ] Acessei Google Cloud Console
- [ ] Ativei a "Maps Static API"
- [ ] Verifiquei restrições da API Key
- [ ] Aguardei 2 minutos após ativar
- [ ] Testei upload de nova foto
- [ ] Verifiquei logs do container

### Drag & Drop
- [ ] Fiz upload de 2+ fotos
- [ ] Fotos apareceram na grid
- [ ] Abri Console (F12)
- [ ] Testei `typeof Sortable` → Retornou "function"
- [ ] Testei `state.fotos.length` → Retornou 2+
- [ ] Tentei arrastar fotos
- [ ] Fiz hard refresh (Ctrl+Shift+R)
- [ ] Testei outro navegador
- [ ] Desativei adblocker

---

## 🆘 Se Ainda Não Funcionar

### Para Drag & Drop:

**Me mande este comando executado no Console (F12):**

```javascript
console.log({
    sortableExists: typeof Sortable,
    fotosCount: state?.fotos?.length || 0,
    instance: sortableInstance !== null,
    gridElement: !!document.getElementById('photoGrid'),
    cards: document.querySelectorAll('.photo-card').length
});
```

### Para Google Maps:

**Me mande os últimos logs:**

```bash
docker logs photo-processor --tail 50 > logs.txt
```

E cole o conteúdo de `logs.txt`.

---

## 🎯 Ação Imediata

**Execute AGORA no seu navegador:**

1. Abra https://diario.lldonha.com/
2. Pressione **F12**
3. Cole no Console:

```javascript
console.log('=== DEBUG PHOTO-REPORT ===');
console.log('SortableJS loaded?', typeof Sortable !== 'undefined');
console.log('Fotos carregadas:', state?.fotos?.length || 0);
console.log('Sortable instance:', sortableInstance !== null);
console.log('CDN accessible?', 'Check Network tab for sortablejs');
console.log('=========================');
```

**Me mande o resultado!**

---

*Última atualização: 2025-12-27 09:00*
