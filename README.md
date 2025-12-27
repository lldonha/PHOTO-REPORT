# 📷 PHOTO-REPORT

## Sobre Este Workspace

> Sistema completo para geração de relatórios fotográficos de obras com extração automática de metadados EXIF, GPS, mini-mapas e geração de PDF profissional.

- **Dono:** LLD Engenharia e Consultoria
- **Função:** Especialista em n8n, Claude Code, MCP e AI Agents
- **Objetivo Principal:** Automatizar geração de relatórios fotográficos para obras de engenharia

## 🎯 Status Atual

[![Status](https://img.shields.io/badge/status-produção-success)](https://diario.lldonha.com/)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-green)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

**URLs Públicas:**
- 📱 Frontend: https://diario.lldonha.com/
- 🔧 API: https://api.lldonha.com/
- 📚 Docs: https://api.lldonha.com/docs

---

## ✨ Funcionalidades Implementadas

### v1.0.0 - Sistema Base
- ✅ **Upload de Fotos**: Drag-and-drop ou clique (até 100 fotos JPEG/PNG)
- ✅ **Extração EXIF**: Data/hora, coordenadas GPS, direção automática
- ✅ **Mini-mapa Automático**: Geração com OpenStreetMap
- ✅ **Overlay com Metadados**: Máscara nas fotos com data, GPS, direção, legenda
- ✅ **Geração de PDF**: Relatório A4 layout 2x3 (6 fotos/página)
- ✅ **Drag & Drop Reordering**: Reordenar fotos com arrastar e soltar (SortableJS)
- ✅ **Undo/Redo**: Desfazer/Refazer reordenação (Ctrl+Z / Ctrl+Y)
- ✅ **Frontend Moderno**: Design blueprint técnico com branding LLD
- ✅ **CORS Configurado**: Frontend e backend integrados
- ✅ **Cloudflare Tunnel**: Acesso público via HTTPS
- ✅ **Docker Ready**: Backend containerizado

---

## 📂 Estrutura do Workspace

```
📁 PHOTO-REPORT/
│
├── 📁 .claude/                    # Configurações Claude Code
│   ├── 📁 skills/                 # Skills customizadas
│   │   └── 📁 photo-report/       # Skill principal do projeto
│   └── 📄 settings.local.json
│
├── 📁 src/                        # Código fonte
│   ├── 📁 frontend/               # Interface web
│   │   ├── index.html             # Frontend em produção
│   │   ├── index-modern.html      # Versão moderna (backup)
│   │   └── index.html.backup      # Backup versão anterior
│   ├── 📁 core/                   # Lógica principal
│   ├── 📁 api/                    # Endpoints FastAPI
│   └── 📁 services/               # Serviços (EXIF, GPS, PDF)
│
├── 📁 .worktrees/                 # Branches em desenvolvimento
│   ├── 001-criar-sistema-photo-report-completo
│   ├── 005-drag-and-drop-photo-reordering
│   ├── 010-multi-project-obra-management
│   └── ... (ver análise abaixo)
│
├── 📁 Tasks/                      # Gestão de tarefas
│   ├── 📁 Backlog/
│   ├── 📁 Queue/                 # FILA - Próximas tarefas
│   ├── 📁 InProgress/
│   └── 📁 Done/
│
├── 📁 Context/                    # Documentação e contexto
├── 📁 logs/                       # Logs do sistema
├── 📁 tests/                      # Testes automatizados
│
├── 📄 README.md                   # ESTE ARQUIVO
├── 📄 TODO.md                     # Próximas tarefas prioritárias
├── 📄 CHANGELOG.md                # Histórico de mudanças
└── 📄 .gitignore

```

---

## 🎯 Próximas Tarefas (Queue)

Veja **[TODO.md](./TODO.md)** para lista completa e detalhada.

### Prioridade ALTA
1. **🔀 Toggle de Projetos/Obras** - Sistema de navegação entre múltiplos projetos
2. **🎨 Melhorar Máscara/Overlay** - Design mais elegante e profissional

### Backlog
- Autenticação de usuários
- Templates de PDF customizáveis
- Integração com n8n para automação
- Cache de mini-mapas
- Templates de overlay customizáveis

---

## 🛠️ Análise de Worktrees

### ✅ Worktrees Válidas (17 branches)

Todas as worktrees estão funcionais e sincronizadas:

| # | Nome | Branch | Status |
|---|------|--------|--------|
| 1 | `001-criar-sistema-photo-report-completo` | auto-claude/001 | ✅ OK |
| 2 | `001-postgresql-persistence-layer` | auto-claude/001 | ✅ OK |
| 3 | `002-automated-test-suite` | auto-claude/002 | ✅ OK |
| 4 | `002-testes-automatizados-unit-integration` | auto-claude/002 | ✅ OK |
| 5 | `003-tratamento-de-erros-e-valida-o-robusta` | auto-claude/003 | ✅ OK |
| 6 | `004-persist-ncia-real-no-postgresql` | auto-claude/004 | ✅ OK |
| 7 | `005-drag-and-drop-photo-reordering` | auto-claude/005 | ✅ Merged |
| 8 | `005-valida-o-de-upload-e-progress-feedback` | auto-claude/005 | ✅ OK |
| 9 | `006-cache-de-mini-mapas` | auto-claude/006 | ✅ OK |
| 10 | `006-complete-brazilian-portuguese-localization` | auto-claude/006 | ✅ OK |
| 11 | `007-templates-de-overlay-customiz-veis` | auto-claude/007 | ✅ OK |
| 12 | `008-n8n-workflow-integration` | auto-claude/008 | ✅ OK |
| 13 | `008-templates-de-pdf-customiz-veis` | auto-claude/008 | ✅ OK |
| 14 | `009-integra-o-com-n8n-para-automa-o` | auto-claude/009 | ✅ OK |
| 15 | `009-user-authentication-system` | auto-claude/009 | ✅ OK |
| 16 | `010-multi-project-obra-management` | auto-claude/010 | ✅ OK |

**Recomendação:** Manter worktrees para features em desenvolvimento. Considere mergear branches completadas e deletar worktrees obsoletas.

---

## 📋 Instruções para Claude

### Regras
1. ✅ Sempre leia este README primeiro
2. ✅ Use a skill `photo-report` disponível em `.claude/skills/`
3. ✅ Consulte `TODO.md` para próximas tarefas prioritárias
4. ✅ Documente mudanças significativas no CHANGELOG.md
5. ✅ Pergunte antes de deletar worktrees ou branches

### Preferências de Estilo
- **Idioma:** Português BR
- **Tom:** Informal, técnico e direto
- **Contexto:** Sempre citar fontes oficiais
- **Estrutura:** Markdown organizado, exemplos práticos

### Comandos Úteis

```bash
# Iniciar backend (Docker)
docker start photo-processor

# Iniciar frontend (localhost:3000)
cd src/frontend && python -m http.server 3000

# Ver worktrees
git worktree list

# Testar API
curl http://localhost:8002/health
curl https://api.lldonha.com/health

# Acessar frontend local
http://localhost:3000

# Acessar frontend público
https://diario.lldonha.com/
```

---

## 🔗 Links Importantes

- **Cloudflare Tunnel Setup:** `.claude/skills/photo-report/references/CLOUDFLARE-TUNNEL-SETUP.md`
- **API Docs:** https://api.lldonha.com/docs
- **GitHub Skills:** https://github.com/anthropics/skills
- **FastAPI Docs:** https://fastapi.tiangolo.com/

---

## 📝 Changelog

Veja [CHANGELOG.md](./CHANGELOG.md) para histórico completo de versões.

### v1.0.0 (2025-12-26)
- ✅ Sistema base completo e funcional
- ✅ Frontend moderno em produção (design blueprint LLD)
- ✅ Backend integrado via Cloudflare Tunnel
- ✅ Drag & drop reordering com undo/redo
- ✅ Geração de PDF com overlay de metadados

---

*Última atualização: 2025-12-27*
*Template baseado em: https://github.com/anthropics/skills*
