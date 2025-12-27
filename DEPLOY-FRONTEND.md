# 🚀 Como Fazer Deploy do Frontend

**Problema:** O código está atualizado localmente mas não reflete em produção (https://diario.lldonha.com/)

**Causa:** O frontend está hospedado no **Cloudflare Pages/Tunnel** e precisa ser re-deployed.

---

## 📋 Situação Atual

### ✅ Código Corrigido
- **Drag & Drop fix aplicado** em `.worktrees/001-criar-sistema-photo-report-completo/src/frontend/index.html`
- Linha 963-966: `initSortable()` adicionado após processar fotos

### ❌ Não Refletido em Produção
- https://diario.lldonha.com/ ainda serve a **versão antiga**
- Precisa fazer deploy para Cloudflare

---

## 🔧 Opções de Deploy

### Opção 1: Cloudflare Pages (Recomendado)

Se você usa Cloudflare Pages:

1. **Acesse:** https://dash.cloudflare.com/
2. **Vá em:** Pages → Seu Projeto
3. **Deploy Manual:**
   - Faça upload de `.worktrees/001-criar-sistema-photo-report-completo/src/frontend/index.html`
   - Ou conecte com Git e faça push

### Opção 2: Cloudflare Tunnel (Servindo Arquivo Local)

Se você usa Cloudflare Tunnel apontando para pasta local:

1. **Encontre o diretório que o tunnel está servindo**
2. **Copie o HTML atualizado:**

```bash
# Descobrir onde está o diretório servido:
cat .worktrees/001-criar-sistema-photo-report-completo/cloudflared-config.yml

# Copiar HTML atualizado:
cp .worktrees/001-criar-sistema-photo-report-completo/src/frontend/index.html [DIRETÓRIO_SERVIDO]/
```

### Opção 3: Copiar para Servidor Web (Nginx/Apache)

Se você tem um servidor web:

```bash
# Copiar para diretório web:
scp .worktrees/001-criar-sistema-photo-report-completo/src/frontend/index.html usuario@servidor:/var/www/diario/
```

---

## 🎯 Solução Rápida (Para Testar Agora)

**Enquanto não faz deploy, você pode:**

1. Abrir https://diario.lldonha.com/
2. **F12** (Console)
3. Digitar:

```javascript
// Função para reinicializar Sortable após cada upload
(function() {
    const originalProcessarArquivos = window.processarArquivos;
    window.processarArquivos = async function(files) {
        await originalProcessarArquivos.call(this, files);
        setTimeout(() => initSortable(), 500);
    };
})();
```

4. **Fechar e salvar** (isso vai funcionar até recarregar a página)

---

## 📊 Como Verificar se Funcionou

Após fazer deploy:

1. **Hard Refresh:** `Ctrl + Shift + R`
2. **Upload de 2 fotos**
3. **Console (F12):**

```javascript
sortableInstance
```

**Esperado:** `Object {...}` (não `null`)

4. **Tente arrastar fotos** - Deve funcionar!

---

## 🗺️ Google Maps Status

**Ainda com erro 403:**
```
This API project is not authorized to use this API
```

### ✅ Checklist de Ativação

- [ ] Acesse: https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com
- [ ] Clique "ATIVAR"
- [ ] Aguarde 5 minutos para propagar
- [ ] Verifique se a API Key tem **Maps Static API** nas restrições
- [ ] Teste novamente fazendo upload de foto

### Se Ainda Não Funcionar

**Verifique restrições da API Key:**

1. https://console.cloud.google.com/apis/credentials
2. Clique na API Key `AIzaSy...`
3. **Restrições de API:**
   - ✅ Deve incluir "Maps Static API"
4. **Restrições de aplicativo:**
   - Escolha "Nenhuma" temporariamente para testar
5. **Salvar**
6. Aguarde 2 minutos
7. Teste

---

*Última atualização: 2025-12-27*
