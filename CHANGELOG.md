# 📝 CHANGELOG - PHOTO-REPORT

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2025-12-26

### ✨ Adicionado

#### Sistema Base
- ✅ Upload de fotos via drag-and-drop ou clique (até 100 fotos JPEG/PNG)
- ✅ Extração automática de metadados EXIF (data/hora, GPS, direção)
- ✅ Geração automática de mini-mapas com OpenStreetMap
- ✅ Overlay de metadados nas fotos (data, GPS, direção, legenda)
- ✅ Geração de PDF A4 com layout 2x3 (6 fotos por página)

#### Frontend Moderno
- ✅ Design blueprint técnico com identidade visual LLD Engenharia
- ✅ Cores customizadas (Navy Primary #1B3A5C, Gold Accent #D4A574)
- ✅ Grid background animado com scanline effect
- ✅ Fontes profissionais (Rajdhani, IBM Plex Sans, JetBrains Mono)
- ✅ Layout responsivo (sidebar + main content)
- ✅ Animações suaves com clip-paths técnicos

#### Funcionalidades Avançadas
- ✅ **Drag & Drop Reordering**: Reordenar fotos arrastando com SortableJS
- ✅ **Undo/Redo**: Desfazer/Refazer reordenações (Ctrl+Z / Ctrl+Y)
  - Histórico de até 50 operações
  - Debounce para evitar sobrecarga
  - Botões visuais + atalhos de teclado
  - Estado desabilitado quando não há ações
- ✅ Preview de fotos em modal (clique na imagem)
- ✅ Contador de caracteres em legendas (máx. 80)
- ✅ Toast notifications (sucesso, erro, warning)
- ✅ Loading overlay com progresso

#### Backend (API)
- ✅ FastAPI framework (Python 3.11)
- ✅ Docker containerizado (`photo-processor:1.0.0`)
- ✅ Endpoints:
  - `GET /health` - Health check
  - `POST /processar-foto` - Upload e processamento de foto
  - `POST /aplicar-mascara` - Aplicar overlay de metadados
  - `POST /gerar-pdf` - Gerar PDF do relatório
  - `GET /docs` - Documentação Swagger UI
- ✅ CORS configurado para acesso público
- ✅ Health checks automáticos

#### Deploy e Infraestrutura
- ✅ Frontend em produção: https://diario.lldonha.com/
- ✅ API em produção: https://api.lldonha.com/
- ✅ Cloudflare Tunnel configurado
- ✅ Container Docker rodando em produção (porta 8002)
- ✅ Servidor frontend Python SimpleHTTP (porta 3000)

### 🔧 Configurado
- ✅ CORS headers para permitir requisições cross-origin
- ✅ API_BASE_URL apontando para `https://api.lldonha.com`
- ✅ Git worktrees para desenvolvimento paralelo (17 branches)
- ✅ Claude Code skills customizadas (`.claude/skills/photo-report/`)

### 📚 Documentado
- ✅ README.md principal com overview do projeto
- ✅ TODO.md com roadmap detalhado
- ✅ CHANGELOG.md (este arquivo)
- ✅ Cloudflare Tunnel setup guide
- ✅ API documentation (Swagger UI)

---

## [Unreleased] - Próximas Versões

### 📋 Planejado para v1.1.0

#### 🔀 Toggle de Projetos/Obras
- [ ] Sistema de multi-projetos
- [ ] CRUD de projetos via API
- [ ] Dropdown de seleção de projeto
- [ ] Associar fotos a projetos
- [ ] Breadcrumb com projeto atual

#### 🎨 Melhorar Overlay
- [ ] Design mais elegante com gradientes
- [ ] Ícones SVG profissionais
- [ ] Logo LLD Engenharia
- [ ] Templates customizáveis (Simples, Completo, Minimalista)
- [ ] Fontes Roboto/Open Sans

### 📋 Planejado para v2.0.0

#### 👤 Autenticação
- [ ] Sistema de login/logout
- [ ] JWT tokens
- [ ] Níveis de permissão (admin, editor, viewer)

#### 📄 Templates de PDF
- [ ] Cabeçalho profissional
- [ ] Rodapé com numeração
- [ ] Layouts configuráveis (1x1, 2x2, 2x3, 3x3)
- [ ] Sumário executivo

#### 🗄️ Persistência
- [ ] Migração para PostgreSQL
- [ ] Schema de banco de dados
- [ ] Migrations com Alembic

#### 🧪 Testes
- [ ] Testes unitários (pytest)
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)
- [ ] CI/CD (GitHub Actions)

---

## Legenda de Tipos de Mudanças

- **✨ Adicionado** - Para novas funcionalidades
- **🔧 Alterado** - Para mudanças em funcionalidades existentes
- **🗑️ Depreciado** - Para funcionalidades que serão removidas
- **🚫 Removido** - Para funcionalidades removidas
- **🐛 Corrigido** - Para correção de bugs
- **🔒 Segurança** - Para vulnerabilidades corrigidas
- **📚 Documentado** - Para mudanças na documentação

---

## Versionamento

- **MAJOR** (X.0.0) - Mudanças incompatíveis na API
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs compatíveis

---

*Última atualização: 2025-12-27*
*Baseado em: https://keepachangelog.com/pt-BR/1.0.0/*
