# ☁️ Cloudflare Tunnel - Setup Guide

## 📋 Pré-requisitos

- ✅ Cloudflared instalado: `C:\Program Files (x86)\cloudflared\cloudflared.exe`
- ✅ Conta no Cloudflare (gratuita)
- ✅ Aplicação rodando localmente:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:8002

---

## 🚀 Passo a Passo

### 1️⃣ Login no Cloudflare

```bash
cloudflared tunnel login
```

Isso abrirá seu navegador. Faça login na sua conta Cloudflare e autorize o acesso.

**Resultado**: Um arquivo `cert.pem` será salvo em `C:\Users\<SEU_USUARIO>\.cloudflared\`

---

### 2️⃣ Criar o Tunnel

```bash
cloudflared tunnel create photo-report
```

**Resultado**:
- Tunnel criado com um ID único (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- Arquivo de credenciais salvo: `C:\Users\<SEU_USUARIO>\.cloudflared\<TUNNEL_ID>.json`

**Anote o TUNNEL_ID!** Você vai precisar dele.

---

### 3️⃣ Configurar o Tunnel

Edite o arquivo `cloudflared-config.yml` e atualize:

```yaml
tunnel: <COLE_SEU_TUNNEL_ID_AQUI>
credentials-file: C:\Users\<SEU_USUARIO>\.cloudflared\<TUNNEL_ID>.json

ingress:
  # Sem domínio customizado, use URLs automáticas do Cloudflare
  - service: http://localhost:3000
```

**Nota**: URLs automáticas serão geradas (ex: `https://<TUNNEL_ID>.cfargotunnel.com`)

---

### 4️⃣ Iniciar o Tunnel

```bash
cd E:\Projetos\PHOTO-REPORT\.worktrees\001-criar-sistema-photo-report-completo
cloudflared tunnel --config cloudflared-config.yml run photo-report
```

**Resultado**: Você verá uma mensagem como:
```
Your tunnel is now connected to Cloudflare!
URL: https://a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
```

---

### 5️⃣ Testar o Acesso

Abra a URL fornecida no navegador:
```
https://<TUNNEL_ID>.cfargotunnel.com
```

Você deve ver o frontend do PHOTO-REPORT! 🎉

---

## 🔧 Configuração Avançada (Opcional)

### Usar Domínio Customizado

Se você tem um domínio no Cloudflare (ex: `meusite.com`):

#### 1. Criar rota DNS

```bash
cloudflared tunnel route dns photo-report photo-report.meusite.com
cloudflared tunnel route dns photo-report api.photo-report.meusite.com
```

#### 2. Atualizar config

Edite `cloudflared-config.yml`:

```yaml
tunnel: <SEU_TUNNEL_ID>
credentials-file: C:\Users\<SEU_USUARIO>\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: photo-report.meusite.com
    service: http://localhost:3000

  - hostname: api.photo-report.meusite.com
    service: http://localhost:8002

  - service: http_status:404
```

#### 3. Reiniciar tunnel

```bash
cloudflared tunnel --config cloudflared-config.yml run photo-report
```

Acesse: `https://photo-report.meusite.com` 🚀

---

## 🤖 Executar como Serviço (Windows)

Para manter o tunnel rodando permanentemente:

### 1. Instalar como serviço

```bash
cloudflared service install
```

### 2. Copiar config para pasta padrão

```bash
copy cloudflared-config.yml C:\Users\<SEU_USUARIO>\.cloudflared\config.yml
```

### 3. Iniciar serviço

```bash
cloudflared service install
sc start cloudflared
```

---

## 📝 Comandos Úteis

```bash
# Ver tunnels existentes
cloudflared tunnel list

# Ver informações do tunnel
cloudflared tunnel info photo-report

# Parar tunnel
Ctrl+C (ou parar o serviço)

# Deletar tunnel (cuidado!)
cloudflared tunnel delete photo-report

# Ver logs
cloudflared tunnel run photo-report --loglevel debug
```

---

## 🔒 Segurança

### Adicionar Autenticação (Cloudflare Access)

Para proteger sua aplicação com login:

1. Acesse o Cloudflare Dashboard
2. Vá em **Access** → **Applications**
3. Clique em **Add an application**
4. Configure:
   - **Application name**: PHOTO-REPORT
   - **Domain**: `photo-report.meusite.com`
   - **Identity providers**: Google, GitHub, etc.
5. Adicione regras de acesso (ex: apenas emails `@suaempresa.com`)

Agora só pessoas autorizadas podem acessar! 🔐

---

## ❌ Troubleshooting

### Erro: "tunnel credentials file not found"
**Solução**: Verifique se o path em `credentials-file` está correto

### Erro: "failed to connect to cloudflare"
**Solução**: Verifique sua conexão com a internet e firewall

### Erro: "service http://localhost:3000 is unreachable"
**Solução**: Certifique-se de que o frontend está rodando na porta 3000

### Frontend funciona, mas API não
**Solução**:
1. Verifique se o Docker está rodando
2. Confirme que a porta 8002 está acessível
3. Atualize a URL da API no frontend para usar o domínio público

---

## 📊 Status Atual

- [x] Cloudflared instalado
- [ ] Tunnel criado
- [ ] Config atualizada
- [ ] Tunnel rodando
- [ ] URL pública testada

---

## 🎯 Próximos Passos

1. Execute os comandos acima
2. Copie a URL pública gerada
3. Compartilhe com sua equipe
4. Opcional: Configure domínio customizado
5. Opcional: Adicione autenticação com Cloudflare Access

---

**Documentação oficial**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
