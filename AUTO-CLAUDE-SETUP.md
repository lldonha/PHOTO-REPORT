# Como Usar Auto-Claude para PHOTO-REPORT

## Método 1: Desktop UI (Recomendado)

### Passo 1: Preparar o Ambiente

```bash
# 1. Certifique-se de ter Docker Desktop rodando
# Verifique o ícone da baleia 🐳 no system tray

# 2. Vá para a pasta do Auto-Claude
cd "E:\AGENTE COMPLETO\Auto-Claude"

# 3. Ative o ambiente Python
.venv\Scripts\activate

# 4. Inicie o FalkorDB (Memory Layer)
docker-compose up -d falkordb

# 5. Inicie a UI Desktop
cd auto-claude-ui
npm install  # primeira vez apenas
npm run build && npm run start
```

### Passo 2: Adicionar o Projeto PHOTO-REPORT

1. Na UI do Auto-Claude, clique em **"Add Project"**
2. Selecione: `E:\Projetos\PHOTO-REPORT`
3. O Auto-Claude vai detectar que é um novo projeto

### Passo 3: Criar a Task

1. Clique em **"New Task"** no Kanban Board
2. **Título**: `Criar Sistema PHOTO-REPORT Completo`
3. **Descrição**: Cole TODO o conteúdo do arquivo `prompt-photo-report.md`
4. Clique em **"Create"**

### Passo 4: Deixar Rodar

O Auto-Claude vai:
- ✅ **Fase 1 - Spec Creation** (5-10 min)
  - Analisar o prompt
  - Criar especificação detalhada
  - Planejar subtasks

- ✅ **Fase 2 - Implementation** (30-60 min)
  - Criar toda estrutura de pastas
  - Escrever todos os arquivos Python
  - Criar Docker configs
  - Implementar frontend
  - Executar testes

- ✅ **Fase 3 - QA Validation**
  - Validar código
  - Corrigir erros automaticamente
  - Gerar relatório de qualidade

### Passo 5: Revisar e Merge

```bash
# 1. Veja as mudanças no worktree isolado
cd .worktrees/auto-claude-photo-report

# 2. Teste o código
cd src/docker
docker-compose up -d
curl http://localhost:8002/health

# 3. Se tudo estiver ok, faça merge via UI
# Clique em "Merge" no Kanban Board
```

---

## Método 2: CLI (Terminal Apenas)

### Setup Inicial

```bash
cd "E:\AGENTE COMPLETO\Auto-Claude\auto-claude"

# Ativar ambiente
..\\.venv\Scripts\activate

# Configurar token (primeira vez)
claude setup-token
# Adicione o token ao arquivo .env
```

### Criar Spec a Partir do Prompt

```bash
# Navegar para o projeto
cd E:\Projetos\PHOTO-REPORT

# Criar spec usando o prompt completo
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\spec_runner.py" \
  --task "$(cat prompt-photo-report.md)" \
  --complexity complex
```

### Executar Build Autônomo

```bash
# Listar specs criadas
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\run.py" --list

# Executar a build (assumindo que seja spec 001)
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\run.py" --spec 001
```

### Revisar e Merge

```bash
# 1. Revisar mudanças
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\run.py" --spec 001 --review

# 2. Checar status QA
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\run.py" --spec 001 --qa-status

# 3. Fazer merge se tudo estiver ok
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\run.py" --spec 001 --merge

# 4. OU descartar se não gostar
python "E:\AGENTE COMPLETO\Auto-Claude\auto-claude\run.py" --spec 001 --discard
```

---

## Vantagens do Auto-Claude para Este Projeto

### 1. **Contexto Completo**
O Auto-Claude lê TODO o prompt e entende:
- Stack técnica (Python + FastAPI + n8n + PostgreSQL)
- Estrutura de arquivos completa
- Referências externas (awasisto/exif_overlay, py-staticmaps)
- Fluxo de dados e endpoints

### 2. **Implementação Autônoma**
Você não precisa:
- ❌ Criar pastas manualmente
- ❌ Copiar/colar código
- ❌ Configurar Docker linha por linha
- ❌ Debugar erros básicos

O Auto-Claude faz tudo isso sozinho.

### 3. **Workspace Isolado**
- Tudo acontece em `.worktrees/auto-claude/`
- Seu código original em `E:\Projetos\PHOTO-REPORT` fica intocado
- Só faz merge quando você aprovar

### 4. **QA Automático**
- Valida código Python
- Testa endpoints
- Verifica se Docker sobe corretamente
- Corrige erros em loop até funcionar

### 5. **Memory Layer**
- Lembra de decisões entre sessões
- Aprende padrões do seu código
- Reaproveita conhecimento

---

## Troubleshooting

### "Docker não encontrado"
```bash
# Windows: Certifique-se que Docker Desktop está rodando
# Veja o ícone 🐳 no system tray
```

### "CLAUDE_CODE_OAUTH_TOKEN não configurado"
```bash
cd "E:\AGENTE COMPLETO\Auto-Claude\auto-claude"
claude setup-token

# Copie o token e adicione ao .env:
# CLAUDE_CODE_OAUTH_TOKEN=seu-token-aqui
```

### "FalkorDB connection failed"
```bash
cd "E:\AGENTE COMPLETO\Auto-Claude"
docker-compose up -d falkordb
docker ps  # Verifique se está rodando
```

---

## Próximos Passos

1. **Escolha o método**: Desktop UI (visual) ou CLI (terminal)
2. **Inicie o Auto-Claude** com os comandos acima
3. **Cole o prompt do PHOTO-REPORT** como task
4. **Deixe rodar** (30-60 min)
5. **Revise e teste** no worktree
6. **Faça merge** quando estiver satisfeito

Pronto! O Auto-Claude vai criar todo o projeto PHOTO-REPORT automaticamente.
