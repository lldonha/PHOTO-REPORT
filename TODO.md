# 📋 TODO - PHOTO-REPORT

> Lista de tarefas prioritárias para o projeto PHOTO-REPORT

**Última atualização:** 2025-12-27 10:00
**Versão Atual:** v1.1.0

---

## 🔥 PRIORIDADE ALTA - Queue

### 1. 🎨 Melhorar Overlay/Máscara - Estilo Solocator ⭐ PRÓXIMA PRIORIDADE

**Status:** 📋 Planejado
**Branch:** `007-templates-de-overlay-customiz-veis` (já existe)
**Prioridade:** 🔥 ALTA (Requisição do usuário)
**Descrição:** Design mais elegante e profissional para o overlay nas fotos

**Inspiração:** [Solocator GPS Field Camera](https://solocator.com/) - Ver `Research/solocator-research.md`

**Melhorias Desejadas:**

#### Visual
- [ ] Gradiente suave no fundo (preto transparente → transparente)
- [ ] Ícones vetoriais para data, GPS, direção (em vez de emojis)
- [ ] Fonte mais elegante e legível (Roboto, Open Sans, Inter)
- [ ] Separadores visuais entre metadados
- [ ] Sombra/outline no texto para melhor contraste
- [ ] Logo LLD Engenharia no canto

#### Conteúdo (inspirado no Solocator)
- [ ] Formatar GPS com mais clareza ("Lat: -23.550, Lon: -46.633")
- [ ] **Acurácia GPS** - Mostrar `± X metros` (ex: "±5m")
- [ ] **Altitude** - Mostrar `📏 Altitude: 760m` (já está no EXIF!)
- [ ] **Endereço** via Reverse Geocoding (Google Maps API)
- [ ] Indicador de direção cardeal com rosa dos ventos visual
- [ ] **Norte Verdadeiro vs Magnético** (ex: "N 45° True")
- [ ] Timestamp mais legível (ex: "26/12/2025 às 14:30")
- [ ] **Indicador de qualidade GPS** - 🟢 ±0-5m, 🟡 ±5-15m, 🔴 ±15m+

#### Layout
- [ ] Overlay em 2 seções: superior (data/hora) e inferior (GPS, direção)
- [ ] Largura responsiva (adapta ao tamanho da foto)
- [ ] Opção de posicionamento (superior, inferior, lateral)
- [ ] Background semi-transparente elegante

#### Customização
- [ ] Templates pré-definidos (Simples, Completo, Minimalista)
- [ ] Escolher quais metadados exibir
- [ ] Tamanho de fonte ajustável
- [ ] Cores customizáveis (branding LLD)

**Tecnologias:**
- Pillow (Python) para desenhar overlay
- Cairo ou ReportLab para renderização avançada
- SVG icons (Font Awesome, Material Icons)

**Referências:**
- `.worktrees/007-templates-de-overlay-customiz-veis/`
- `Research/solocator-research.md`
- `Tasks/Queue/003-melhorar-overlay-design.md`

---

### 2. 🔀 Toggle de Projetos/Obras (Multi-Project Management)

**Status:** 📋 Planejado
**Branch:** `010-multi-project-obra-management` (já existe)
**Descrição:** Sistema de navegação entre múltiplos projetos/obras

**Funcionalidades:**
- [ ] Dropdown/Select para trocar entre projetos
- [ ] Persistência de fotos por projeto (LocalStorage ou backend)
- [ ] API endpoints para CRUD de projetos
- [ ] UI para criar/editar/deletar projetos
- [ ] Filtros de fotos por projeto no frontend
- [ ] Breadcrumb mostrando projeto atual
- [ ] Migração de dados existentes para estrutura de projetos

**Endpoints necessários:**
- `GET /projetos` - Listar todos os projetos
- `POST /projetos` - Criar novo projeto
- `GET /projetos/{id}` - Detalhes do projeto
- `PUT /projetos/{id}` - Atualizar projeto
- `DELETE /projetos/{id}` - Deletar projeto
- `GET /projetos/{id}/fotos` - Fotos do projeto

**UI/UX:**
- Dropdown no header com lista de projetos
- Botão "+ Novo Projeto" ao lado do dropdown
- Modal para criar/editar projeto (campos: nome, responsável, data)
- Confirmação antes de trocar projeto (se houver fotos não salvas)

**Referências:**
- `.worktrees/010-multi-project-obra-management/`
- Issue/Spec: Spec-010 Multi-Project Management

---

### 2. 🎨 Melhorar Máscara/Overlay

**Status:** 📋 Planejado
**Branch:** `007-templates-de-overlay-customiz-veis` (já existe)
**Descrição:** Design mais elegante e profissional para o overlay nas fotos

**Inspiração:** [Solocator GPS Field Camera](https://solocator.com/) - Ver `Research/solocator-research.md`

**Melhorias Desejadas:**

#### Visual
- [ ] Gradiente suave no fundo (preto transparente → transparente)
- [ ] Ícones vetoriais para data, GPS, direção (em vez de emojis)
- [ ] Fonte mais elegante e legível (ex: Roboto, Open Sans)
- [ ] Separadores visuais entre metadados
- [ ] Sombra/outline no texto para melhor contraste
- [ ] Logo LLD Engenharia no canto

#### Conteúdo (inspirado no Solocator)
- [ ] Formatar GPS com mais clareza (ex: "Lat: -23.550, Lon: -46.633")
- [ ] **Acurácia GPS** - Mostrar `± X metros` (ex: "±5m")
- [ ] **Altitude** - Mostrar `📏 Altitude: 760m` (já está no EXIF!)
- [ ] **Endereço** via Reverse Geocoding (Google Maps API) - `🏠 Rua Augusta, 123 - SP`
- [ ] Indicador de direção cardeal com rosa dos ventos
- [ ] **Norte Verdadeiro vs Magnético** (ex: "N 45° True")
- [ ] Timestamp mais legível (ex: "26/12/2025 às 14:30")
- [ ] **Indicador de qualidade GPS** - Ícone colorido (🟢 ±0-5m, 🟡 ±5-15m, 🔴 ±15m+)

#### Layout
- [ ] Overlay em 2 seções: superior (data/hora) e inferior (GPS, direção, legenda)
- [ ] Largura responsiva (adapta ao tamanho da foto)
- [ ] Opção de posicionamento (canto superior, inferior, lateral)
- [ ] Background semi-transparente para não cobrir detalhes da foto

#### Customização
- [ ] Templates pré-definidos (Simples, Completo, Minimalista)
- [ ] Escolher quais metadados exibir
- [ ] Tamanho de fonte ajustável
- [ ] Cores customizáveis (branding da empresa)

**Tecnologias:**
- Pillow (Python) para desenhar overlay
- Cairo ou ReportLab para renderização avançada
- SVG icons (Font Awesome, Material Icons)

**Referências:**
- `.worktrees/007-templates-de-overlay-customiz-veis/`
- Exemplos de relatórios fotográficos de outras empresas de engenharia

---


## 📦 BACKLOG - Futuras Implementações

### 3. 👤 Autenticação de Usuários

**Status:** 💤 Backlog
**Branch:** `009-user-authentication-system`

- [ ] Sistema de login/logout
- [ ] JWT tokens para API
- [ ] Cadastro de usuários
- [ ] Níveis de permissão (admin, editor, viewer)
- [ ] Associar projetos a usuários

**Referências:**
- `.worktrees/009-user-authentication-system/`

---

### 4. 📄 Templates de PDF Customizáveis

**Status:** 💤 Backlog
**Branch:** `008-templates-de-pdf-customiz-veis`

- [ ] Cabeçalho profissional com logo LLD
- [ ] Rodapé com numeração de páginas
- [ ] Sumário executivo na primeira página
- [ ] Metadados detalhados abaixo de cada foto
- [ ] Layout configurável (1x1, 2x2, 2x3, 3x3)
- [ ] Opção de incluir/excluir mini-mapas
- [ ] Seção de observações/notas ao final

**Referências:**
- `.worktrees/008-templates-de-pdf-customiz-veis/`

---

### 5. 🤖 Integração com n8n para Automação

**Status:** 💤 Backlog
**Branch:** `008-n8n-workflow-integration`, `009-integra-o-com-n8n-para-automa-o`

- [ ] Webhook para disparar geração de relatório
- [ ] Envio automático de PDF por email
- [ ] Upload de fotos via Telegram Bot
- [ ] Sincronização com Google Drive
- [ ] Notificações em Slack/Teams quando relatório estiver pronto
- [ ] Agendamento de relatórios periódicos

**Referências:**
- `.worktrees/008-n8n-workflow-integration/`
- `.worktrees/009-integra-o-com-n8n-para-automa-o/`

---

### 6. ⚡ Cache de Mini-mapas

**Status:** 💤 Backlog
**Branch:** `006-cache-de-mini-mapas`

- [ ] Salvar mini-mapas gerados em cache (Redis ou filesystem)
- [ ] Evitar requisições duplicadas ao OpenStreetMap
- [ ] Expiração de cache configurável (ex: 30 dias)
- [ ] Endpoint para limpar cache

**Referências:**
- `.worktrees/006-cache-de-mini-mapas/`

---

### 7. 🗄️ Persistência com PostgreSQL

**Status:** 💤 Backlog
**Branch:** `001-postgresql-persistence-layer`, `004-persist-ncia-real-no-postgresql`

- [ ] Migrar de armazenamento em memória para PostgreSQL
- [ ] Schema para projetos, fotos, metadados
- [ ] ORM (SQLAlchemy ou Prisma)
- [ ] Migrations com Alembic
- [ ] Backup automático

**Referências:**
- `.worktrees/001-postgresql-persistence-layer/`
- `.worktrees/004-persist-ncia-real-no-postgresql/`

---

### 8. 🧪 Testes Automatizados

**Status:** 💤 Backlog
**Branch:** `002-automated-test-suite`, `002-testes-automatizados-unit-integration`

- [ ] Testes unitários (pytest)
- [ ] Testes de integração
- [ ] Testes E2E com Playwright
- [ ] CI/CD com GitHub Actions
- [ ] Cobertura de código (>80%)

**Referências:**
- `.worktrees/002-automated-test-suite/`
- `.worktrees/002-testes-automatizados-unit-integration/`

---

### 9. ⚠️ Tratamento de Erros Robusto

**Status:** 💤 Backlog
**Branch:** `003-tratamento-de-erros-e-valida-o-robusta`

- [ ] Logging estruturado
- [ ] Tratamento de exceções em todas as rotas
- [ ] Validação de input com Pydantic
- [ ] Mensagens de erro amigáveis
- [ ] Retry automático para operações de rede

**Referências:**
- `.worktrees/003-tratamento-de-erros-e-valida-o-robusta/`

---

### 10. ✅ Validação de Upload e Feedback de Progresso

**Status:** 💤 Backlog
**Branch:** `005-valida-o-de-upload-e-progress-feedback`

- [ ] Barra de progresso durante processamento
- [ ] Validação de tipo de arquivo no backend
- [ ] Limite de tamanho de arquivo
- [ ] Preview de fotos antes de processar
- [ ] Indicador de fotos com erros

**Referências:**
- `.worktrees/005-valida-o-de-upload-e-progress-feedback/`

---

### 11. 🌐 Localização Completa em Português BR

**Status:** 💤 Backlog
**Branch:** `006-complete-brazilian-portuguese-localization`

- [ ] Todas as mensagens em PT-BR
- [ ] Formatos de data/hora brasileiros
- [ ] Mensagens de erro traduzidas
- [ ] Documentação da API em português
- [ ] Interface totalmente localizada

**Referências:**
- `.worktrees/006-complete-brazilian-portuguese-localization/`

---

## 🏁 DONE - Tarefas Concluídas

### ✅ v1.1.0 (2025-12-27) - Google Maps + Drag & Drop Fix

- [x] **Google Maps Satélite** implementado e funcionando
  - Google Maps Static API integrado
  - Maptype: satellite (imagens de satélite em alta resolução)
  - Fallback automático para OpenStreetMap
  - Variáveis de ambiente configuradas
  - API Key ativada no Google Cloud Platform
  - Testado e validado em produção ✅

- [x] **Drag & Drop Fix** - Reordenação automática
  - Bug corrigido: `initSortable()` não era chamado após upload
  - Agora inicializa automaticamente após processar fotos
  - Testado e validado em produção ✅
  - Undo/Redo funcionando perfeitamente

- [x] Container rebuilt com novas dependências
  - `requests==2.31.0`
  - `python-dotenv==1.0.0`

- [x] Frontend atualizado em produção
  - Cloudflare Tunnel servindo versão corrigida
  - Hard refresh funcionando

**Commits:**
- feat: Implementa Google Maps satélite com fallback OSM
- fix: Adiciona initSortable() após upload de fotos

**Deploy:** https://diario.lldonha.com/ | https://api.lldonha.com/

---

### ✅ v1.0.0 (2025-12-26)

- [x] Sistema base completo
- [x] Upload de fotos (drag & drop)
- [x] Extração de metadados EXIF
- [x] Geração de mini-mapas
- [x] Overlay com metadados
- [x] Geração de PDF
- [x] Drag & drop reordering
- [x] Undo/Redo (Ctrl+Z / Ctrl+Y)
- [x] Frontend moderno (design blueprint LLD)
- [x] Integração frontend ↔ backend via Cloudflare Tunnel
- [x] Docker containerização
- [x] Deploy em produção

**Branch principal:** `001-criar-sistema-photo-report-completo`
**Branch merged:** `005-drag-and-drop-photo-reordering`

---

## 📊 Estatísticas

- **Total de Tarefas:** 11
- **Prioridade Alta:** 2
- **Backlog:** 9
- **Concluídas:** 10+ (v1.0.0)
- **Worktrees Ativas:** 17

---

## 🎯 Como Usar Este TODO

### Para Claude Code:
```bash
# Ao iniciar trabalho em nova tarefa:
1. Ler este TODO.md
2. Verificar branch correspondente em .worktrees/
3. Atualizar status da tarefa
4. Documentar progresso
```

### Para Humanos:
- ✅ Marque checkbox quando concluir subtarefas
- 📝 Adicione novas tarefas conforme necessário
- 🔄 Mova tarefas entre seções (Queue → InProgress → Done)
- 📅 Atualize a data no topo do arquivo

---

*Template baseado em: agent-workspace-template.md*
*Referências: https://github.com/anthropics/skills*
