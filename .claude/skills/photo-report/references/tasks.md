# 📋 PHOTO-REPORT - Tasks & Roadmap

## ✅ Completed (v1.0.0)

- [x] Sistema base 100% funcional
- [x] Upload drag-and-drop de fotos
- [x] Extração EXIF (data, GPS, direção)
- [x] Geração de mini-mapas (OpenStreetMap)
- [x] Overlay com metadados e legendas
- [x] Geração de PDF A4 (layout 2x3)
- [x] CORS configurado corretamente
- [x] Fix botão "Gerar PDF" após upload
- [x] Cloudflare Tunnel configurado
  - [x] Login e autenticação
  - [x] Tunnel criado (ID: 2325ef4e-1f5d-4785-9273-5a6dd0743fdd)
  - [x] DNS configurado (api.lldonha.com)
  - [x] Tunnel rodando (4 conexões ativas)
- [x] Frontend conectado ao backend público
- [x] Repositório organizado no GitHub
- [x] Documentação completa (README, TODO, CLOUDFLARE-TUNNEL-SETUP)
- [x] Skill criada e documentada

---

## 🚧 Em Progresso

☐ Organizar repositório com estrutura de skills
  ☐ Mover documentação para /references
  ☐ Criar índice de projetos
  ☐ Sincronizar com E:\Contexto CLAUDE\.claude\skills

---

## 📝 Backlog - Próximas Melhorias

### 🎨 Melhorar Máscara/Overlay das Fotos

**Prioridade**: Média
**Estimativa**: 2-3h

☐ **Design Elegante**
  ☐ Fundo semi-transparente com gradiente
  ☐ Cantos arredondados
  ☐ Sombra suave

☐ **Ícones Visuais**
  ☐ 📅 Ícone para data/hora
  ☐ 📍 Ícone para GPS
  ☐ 🧭 Ícone para direção

☐ **Layout Otimizado**
  ☐ Organizar informações em 2 colunas
  ☐ Espaçamento consistente
  ☐ Fonte com melhor legibilidade
  ☐ Contraste adequado

☐ **Mini-mapa Integrado**
  ☐ Posicionar no canto superior direito
  ☐ Borda e sombra para destacar
  ☐ Indicador de direção da câmera

☐ **Legenda Customizável**
  ☐ Fonte maior e negrito
  ☐ Posicionamento centralizado
  ☐ Background semi-transparente

**Arquivo**: `src/python/overlay_generator.py`

---

### 📄 Melhorar Layout do Relatório PDF

**Prioridade**: Média
**Estimativa**: 3-4h

☐ **Cabeçalho Profissional**
  ☐ Logo da empresa (opcional)
  ☐ Título em destaque com bordas
  ☐ Informações do projeto em tabela
  ☐ Data de geração automática

☐ **Grid de Fotos Otimizado**
  ☐ Manter layout 2x3 (6 fotos/página) ✅
  ☐ Espaçamento consistente entre fotos
  ☐ Bordas nas imagens
  ☐ Numeração automática das fotos

☐ **Rodapé Informativo**
  ☐ Número da página (Página X de Y)
  ☐ Nome do responsável
  ☐ Data de geração
  ☐ Copyright/marca d'água

☐ **Metadados por Foto**
  ☐ Exibir data/hora abaixo de cada foto
  ☐ Mostrar coordenadas GPS (se disponível)
  ☐ Legenda com quebra de linha automática

☐ **Configurações de Impressão**
  ☐ Margens adequadas
  ☐ Orientação retrato
  ☐ Tamanho A4
  ☐ Qualidade de imagem otimizada

**Arquivos**:
- `src/python/pdf_generator.py`
- `src/python/templates/relatorio_template.html` (criar)

---

### 🏗️ Navegação de Projetos com Toggle

**Prioridade**: Alta
**Estimativa**: 5-6h

☐ **Seletor de Projeto**
  ☐ Dropdown com lista de projetos existentes
  ☐ Opção "Criar novo projeto"
  ☐ Busca/filtro de projetos
  ☐ Indicador de projeto ativo

☐ **Modal de Gerenciamento**
  ☐ Criar novo projeto
    ☐ Nome
    ☐ Endereço
    ☐ Cliente
    ☐ Status (Ativo/Concluído/Arquivado)
  ☐ Editar projeto existente
  ☐ Arquivar/deletar projeto
  ☐ Ver histórico de relatórios por projeto

☐ **Integração com Relatórios**
  ☐ Associar fotos ao projeto selecionado
  ☐ Filtrar relatórios por projeto
  ☐ Incluir dados do projeto no PDF

☐ **Persistência de Dados**
  ☐ Salvar projetos no localStorage
  ☐ API backend para persistência (futuro)
  ☐ Carregar projeto ao abrir aplicação
  ☐ Exportar/importar lista de projetos

**Arquivos a criar**:
- `src/frontend/js/projects.js`
- `src/frontend/css/projects.css`

**Arquivos a modificar**:
- `src/frontend/index.html`

**UI Mockup**:
```
┌─────────────────────────────────────────┐
│ 📷 PHOTO-REPORT                         │
├─────────────────────────────────────────┤
│ 🏗️ Projeto: [Edifício Alpha ▼]  [➕]   │
├─────────────────────────────────────────┤
│ 📄 Configurações do Relatório           │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## 🔮 Futuro (Fora do MVP Atual)

☐ **Persistência Backend (PostgreSQL)**
  - Salvar projetos no banco
  - Histórico de relatórios
  - Multi-usuário

☐ **Autenticação**
  - Login/registro
  - Permissões por projeto
  - Cloudflare Access

☐ **IA para Legendas**
  - Claude Vision API
  - Geração automática de descrições
  - Sugestões contextuais

☐ **Templates Customizáveis**
  - Editor de overlay visual
  - Templates de PDF personalizados
  - Branding da empresa

☐ **Integração n8n**
  - Workflow automático
  - Notificações (email, Telegram)
  - Backup automático

---

## 📊 Métricas de Progresso

### Sprint Atual (v1.0.0)
- ✅ **100%** - Sistema base funcional
- ✅ **100%** - Cloudflare Tunnel configurado
- ✅ **100%** - Documentação completa

### Próximo Sprint (v1.1.0)
- ☐ **0%** - Melhorar overlay
- ☐ **0%** - Melhorar PDF
- ☐ **0%** - Navegação de projetos

---

**Última Atualização**: 2025-12-26
**Versão**: 1.0.0
