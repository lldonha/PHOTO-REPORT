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

## [1.1.0] - 2025-12-27

### ✨ Adicionado

#### Google Maps Satélite
- ✅ **Google Maps Static API** integrado com visualização satélite
- ✅ Mini-mapas agora renderizam com **imagens de satélite em alta resolução**
- ✅ Fallback automático para OpenStreetMap em caso de erro/quota
- ✅ Suporte a múltiplos tipos de mapa: `satellite`, `hybrid`, `roadmap`, `terrain`
- ✅ Linha de direção (path) azul indicando orientação da câmera
- ✅ Variáveis de ambiente: `GOOGLE_MAPS_API_KEY` e `USE_GOOGLE_MAPS`

#### Dependências
- ✅ `requests==2.31.0` - Para chamadas HTTP à Google Maps API
- ✅ `python-dotenv==1.0.0` - Para gerenciamento de variáveis de ambiente

### 🐛 Corrigido

#### Drag & Drop Reordenação
- ✅ **Bug crítico:** `initSortable()` não era chamado automaticamente após upload
- ✅ Fotos agora podem ser reorganizadas **imediatamente após o upload**
- ✅ Sortable reinicializado corretamente após processar múltiplas fotos
- ✅ Testado e validado em produção

### 🔧 Alterado

#### map_generator.py
- ✅ Nova função `gerar_minimapa_google()` para Google Maps Static API
- ✅ Função original renomeada para `gerar_minimapa_osm()` (OpenStreetMap)
- ✅ Função `gerar_minimapa()` agora é wrapper inteligente com fallback
- ✅ Melhor logging e tratamento de erros (INFO, WARNING, ERROR)

#### Frontend (index.html)
- ✅ Adicionado `initSortable()` após processamento de fotos (linhas 965 e 1436)
- ✅ Garantia de que drag & drop funciona em todas as situações

#### Docker
- ✅ `docker-compose.yml` atualizado com `GOOGLE_MAPS_API_KEY` e `USE_GOOGLE_MAPS`
- ✅ Arquivo `.env` configurado no diretório docker
- ✅ Container rebuilt: `photo-processor:1.0.0`

### 📚 Documentado
- ✅ `TROUBLESHOOTING-GUIDE.md` - Guia completo de debug
- ✅ `DEBUG-LIVE.md` - Debug em tempo real
- ✅ `DEPLOY-FRONTEND.md` - Instruções de deploy
- ✅ `Tasks/Done/google-maps-satelite-implementado.md` - Documentação técnica
- ✅ `RESUMO-FINAL.md` - Resumo da sessão de desenvolvimento
- ✅ TODO.md atualizado com v1.1.0

### 🚀 Deploy
- ✅ Frontend atualizado via Cloudflare Tunnel (porta 3000)
- ✅ Backend rodando em container `photo-processor:1.0.0` (porta 8002)
- ✅ Produção: https://diario.lldonha.com/ | https://api.lldonha.com/
- ✅ **Testado e validado em produção** pelo usuário

### 🧪 Testes Validados
- [x] Google Maps API retornando imagens satélite
- [x] Fallback OSM funcionando quando Google Maps indisponível
- [x] Drag & drop funcionando após upload
- [x] Undo/Redo preservado (Ctrl+Z / Ctrl+Y)
- [x] Botão "Gerar Relatório" habilitando corretamente
- [x] Container saudável (healthy status)

---

## [Unreleased] - Próximas Versões

### 📋 Planejado para v1.2.0 ⭐ PRÓXIMA PRIORIDADE

#### 🎨 Melhorar Overlay/Máscara - Estilo Solocator
- [ ] Design mais elegante com gradientes suaves
- [ ] Ícones vetoriais SVG (data, GPS, direção)
- [ ] Rosa dos ventos visual para direção cardeal
- [ ] Indicador de qualidade GPS com cores (🟢 ±0-5m, 🟡 ±5-15m, 🔴 ±15m+)
- [ ] Acurácia GPS visível (± X metros)
- [ ] Altitude destacada
- [ ] Reverse Geocoding para endereços
- [ ] Logo LLD Engenharia elegante
- [ ] Templates customizáveis (Simples, Completo, Minimalista)
- [ ] Fontes profissionais (Roboto/Open Sans/Inter)
- [ ] Background semi-transparente com sombras

### 📋 Planejado para v1.3.0

#### 🔀 Toggle de Projetos/Obras
- [ ] Sistema de multi-projetos/obras
- [ ] CRUD de projetos via API
- [ ] Dropdown de seleção de projeto
- [ ] Associar fotos a projetos
- [ ] Breadcrumb com projeto atual
- [ ] Persistência por projeto (LocalStorage ou PostgreSQL)

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
