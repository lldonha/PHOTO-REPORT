# 🤖 Integração com n8n para Automação

**Status:** 💤 BACKLOG
**Branches:** `008-n8n-workflow-integration`, `009-integra-o-com-n8n-para-automa-o`
**Priority:** Baixo (feature avançada)
**Estimate:** 2-3 dias
**Data Criação:** 2025-12-26

---

## 📋 Objetivo

Integrar PHOTO-REPORT com n8n para automação de workflows (upload via Telegram, envio automático de PDFs, etc).

## 💡 Por Quê?

- ✅ Upload de fotos via Telegram Bot no campo
- ✅ Geração automática de relatórios programados
- ✅ Envio de PDF por email automaticamente
- ✅ Sincronização com Google Drive/Dropbox
- ✅ Notificações em Slack/Teams

## ✅ Workflows Desejados

### 1. Telegram → PHOTO-REPORT
- Engenheiro envia foto via Telegram
- n8n recebe webhook do Telegram
- Chama `/processar-foto` do PHOTO-REPORT
- Retorna confirmação no Telegram

### 2. Relatório Agendado
- Cron diário/semanal
- Gera PDF do projeto atual
- Envia por email para responsável
- Backup no Google Drive

### 3. Notificações
- Quando relatório estiver pronto
- Enviar notificação Slack/Teams
- Com link para download

## ✅ Tarefas

### 1. Webhooks na API
- [ ] Endpoint `/webhook/upload-foto`
- [ ] Endpoint `/webhook/gerar-relatorio`
- [ ] Autenticação de webhooks (API key)

### 2. n8n Workflows
- [ ] Workflow: Telegram Bot → PHOTO-REPORT
- [ ] Workflow: Cron → Gerar PDF → Email
- [ ] Workflow: PDF Pronto → Notificar Slack
- [ ] Workflow: Sync com Google Drive

### 3. Documentação
- [ ] Tutorial de setup n8n
- [ ] JSON dos workflows exportados
- [ ] Guia de configuração Telegram Bot

---

**Referências:**
- `.worktrees/008-n8n-workflow-integration/`
- `.worktrees/009-integra-o-com-n8n-para-automa-o/`
- TODO.md linha 169-186
