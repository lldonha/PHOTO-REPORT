# 📁 Estrutura do Projeto PHOTO-REPORT

**Data:** 2025-12-27

---

## 🌳 Árvore de Diretórios

```
📁 PHOTO-REPORT/
│
├── 📁 .auto-claude/              # Auto-Claude workflow metadata
├── 📁 .claude/                   # Configurações Claude Code
│   ├── 📁 skills/
│   │   └── 📁 photo-report/      # Skill principal do projeto
│   │       ├── 📄 SKILL.md
│   │       └── 📁 references/
│   │           └── 📄 CLOUDFLARE-TUNNEL-SETUP.md
│   └── 📄 settings.local.json
│
├── 📁 .git/                      # Repositório Git
├── 📁 .pytest_cache/             # Cache do pytest
├── 📁 .qodo/                     # Qodo (ferramenta de testes)
│
├── 📁 .worktrees/                # Git worktrees (17 branches)
│   ├── 📁 001-criar-sistema-photo-report-completo/
│   ├── 📁 001-postgresql-persistence-layer/
│   ├── 📁 002-automated-test-suite/
│   ├── 📁 002-testes-automatizados-unit-integration/
│   ├── 📁 003-tratamento-de-erros-e-valida-o-robusta/
│   ├── 📁 004-persist-ncia-real-no-postgresql/
│   ├── 📁 005-drag-and-drop-photo-reordering/      # ✅ MERGED
│   ├── 📁 005-valida-o-de-upload-e-progress-feedback/
│   ├── 📁 006-cache-de-mini-mapas/
│   ├── 📁 006-complete-brazilian-portuguese-localization/
│   ├── 📁 007-templates-de-overlay-customiz-veis/  # 🔥 PRÓXIMA
│   ├── 📁 008-n8n-workflow-integration/
│   ├── 📁 008-templates-de-pdf-customiz-veis/
│   ├── 📁 009-integra-o-com-n8n-para-automa-o/
│   ├── 📁 009-user-authentication-system/
│   └── 📁 010-multi-project-obra-management/       # 🔥 PRÓXIMA
│
├── 📁 src/                       # Código fonte
│   ├── 📁 frontend/              # Interface web
│   │   ├── 📄 index.html         # ✅ PRODUÇÃO (design moderno LLD)
│   │   ├── 📄 index-modern.html  # Backup versão moderna
│   │   └── 📄 index.html.backup  # Backup versão antiga
│   │
│   ├── 📁 core/                  # Lógica principal (Python)
│   │   └── ... (processamento de fotos, EXIF, etc.)
│   │
│   ├── 📁 api/                   # Endpoints FastAPI
│   │   └── ... (rotas da API)
│   │
│   └── 📁 services/              # Serviços
│       └── ... (EXIF, GPS, PDF, overlay, mapas)
│
├── 📁 tests/                     # Testes automatizados
│   └── 📄 README.md
│
├── 📁 Tasks/                     # 📋 Sistema de Gestão de Tarefas
│   ├── 📁 Backlog/               # Tarefas futuras
│   ├── 📁 Queue/                 # 🔥 FILA - Próximas tarefas
│   │   ├── 📄 001-toggle-projetos.md
│   │   └── 📄 002-melhorar-mascara.md
│   ├── 📁 InProgress/            # Em andamento
│   └── 📁 Done/                  # Concluídas
│
├── 📁 Context/                   # 📚 Documentação e Contexto
│   ├── 📄 worktrees-analysis.md  # Análise de worktrees
│   └── 📄 project-structure.md   # ESTE ARQUIVO
│
├── 📁 Assets/                    # Recursos visuais
├── 📁 Notes/                     # Anotações
├── 📁 Research/                  # Pesquisas
├── 📁 Templates/                 # Templates
│
├── 📁 logs/                      # Logs do sistema
│
├── 📄 .gitignore                 # Arquivos ignorados pelo Git
├── 📄 .claude_settings.json      # Configurações Claude
│
├── 📄 README.md                  # 📖 PRINCIPAL - Overview do projeto
├── 📄 TODO.md                    # 📋 Roadmap detalhado
├── 📄 CHANGELOG.md               # 📝 Histórico de versões
│
├── 📄 AUTO-CLAUDE-SETUP.md       # Setup do Auto-Claude
├── 📄 build-progress.txt         # Progresso de builds
├── 📄 context.json               # Contexto do projeto
├── 📄 implementation_plan.json   # Plano de implementação
├── 📄 project_index.json         # Índice do projeto
├── 📄 prompt-photo-report.md     # Prompt original do projeto
├── 📄 RESUMO-SESSAO-2025-12-26.md # Resumo da última sessão
│
└── 📄 init.sh                    # Script de inicialização

```

---

## 📂 Descrição das Pastas Principais

### 🔧 Desenvolvimento

| Pasta | Propósito |
|-------|-----------|
| `.claude/skills/` | Skills customizadas do Claude Code |
| `.worktrees/` | Branches em desenvolvimento paralelo (17 worktrees) |
| `src/` | Código fonte (frontend + backend) |
| `tests/` | Testes automatizados |

### 📋 Gestão de Tarefas

| Pasta | Propósito |
|-------|-----------|
| `Tasks/Queue/` | **FILA ATIVA** - Próximas tarefas prioritárias |
| `Tasks/Backlog/` | Tarefas futuras/planejadas |
| `Tasks/InProgress/` | Tarefas em andamento |
| `Tasks/Done/` | Tarefas concluídas |

### 📚 Documentação

| Pasta | Propósito |
|-------|-----------|
| `Context/` | Documentação técnica e análises |
| `Assets/` | Imagens, logos, recursos visuais |
| `Notes/` | Anotações rápidas |
| `Research/` | Pesquisas e referências |
| `Templates/` | Templates reutilizáveis |

---

## 📄 Arquivos Importantes

### Documentação Principal
- **README.md** - Overview do projeto, instruções para Claude
- **TODO.md** - Roadmap detalhado com todas as tarefas
- **CHANGELOG.md** - Histórico de versões e mudanças

### Tarefas em Queue (Próximas)
- **Tasks/Queue/001-toggle-projetos.md** - Toggle de Projetos/Obras
- **Tasks/Queue/002-melhorar-mascara.md** - Melhorar Overlay/Máscara

### Análises e Contexto
- **Context/worktrees-analysis.md** - Análise completa das 17 worktrees
- **Context/project-structure.md** - Este arquivo

---

## 🎯 Worktrees Prioritárias

### Para Trabalhar AGORA

1. **`010-multi-project-obra-management`**
   - Path: `.worktrees/010-multi-project-obra-management/`
   - Tarefa: `Tasks/Queue/001-toggle-projetos.md`
   - Feature: Toggle de Projetos/Obras

2. **`007-templates-de-overlay-customiz-veis`**
   - Path: `.worktrees/007-templates-de-overlay-customiz-veis/`
   - Tarefa: `Tasks/Queue/002-melhorar-mascara.md`
   - Feature: Melhorar Máscara/Overlay

---

## 🚀 Como Navegar

### Para Claude Code

```bash
# 1. Ler overview do projeto
cat README.md

# 2. Ver próximas tarefas
cat TODO.md

# 3. Escolher tarefa da fila
ls Tasks/Queue/

# 4. Acessar worktree correspondente
cd .worktrees/010-multi-project-obra-management/

# 5. Começar a trabalhar
git status
```

### Para Humanos

1. **Começar sempre pelo README.md**
2. **Ver tarefas em Tasks/Queue/**
3. **Consultar TODO.md para roadmap completo**
4. **Documentar mudanças em CHANGELOG.md**

---

## 📊 Estatísticas do Projeto

- **Linhas de Código (estimado):** ~3.000+ (frontend + backend)
- **Arquivos Fonte:** 15+
- **Worktrees Ativas:** 17
- **Tarefas em Queue:** 2
- **Tarefas no Backlog:** 9
- **Features Completas:** 10+
- **Versão Atual:** 1.0.0

---

## 🔗 Links Úteis

- **Frontend em Produção:** https://diario.lldonha.com/
- **API em Produção:** https://api.lldonha.com/
- **API Docs:** https://api.lldonha.com/docs
- **Skills Repository:** https://github.com/anthropics/skills

---

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# Backend (Docker)
API_BASE_URL=https://api.lldonha.com
PORT=8002

# Frontend
API_BASE_URL=https://api.lldonha.com (em index.html, linha 1091)
PORT=3000
```

### Serviços Rodando

```bash
# Docker
docker ps | grep photo-processor
# → Container: photo-processor (porta 8002)

# Frontend
netstat -an | grep ":3000"
# → Python SimpleHTTP Server (porta 3000)

# Cloudflare Tunnel
ps aux | grep cloudflared
# → Tunneling localhost:3000 para diario.lldonha.com
# → Tunneling localhost:8002 para api.lldonha.com
```

---

## 🧹 Manutenção

### Limpeza Recomendada

```bash
# Remover worktree já mergeada
git worktree remove .worktrees/005-drag-and-drop-photo-reordering
git branch -d auto-claude/005-drag-and-drop-photo-reordering

# Limpar cache
rm -rf .pytest_cache/
rm -rf src/__pycache__/
rm -rf src/core/__pycache__/

# Limpar logs antigos
rm -rf logs/*.log.old
```

---

*Estrutura organizada em: 2025-12-27*
*Baseado em: agent-workspace-template.md (profile-and-skill-creator)*
