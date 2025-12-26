# 📋 PHOTO-REPORT - Lista de Melhorias

> **Status Atual**: Sistema 100% funcional ✅
> - Upload de fotos: ✅
> - Extração EXIF + GPS: ✅
> - Mini-mapa: ✅
> - Overlay com metadados: ✅
> - Geração de PDF: ✅
> - CORS configurado: ✅

---

## 🎯 Próximas Melhorias

### 1. 🎨 Melhorar Máscara/Overlay das Fotos

**Objetivo**: Criar overlay mais profissional e informativo

**Melhorias Planejadas**:
- [ ] **Design mais elegante**
  - Fundo semi-transparente com gradiente
  - Cantos arredondados
  - Sombra suave
  - Ícones para cada campo (📅 data, 📍 GPS, 🧭 direção)

- [ ] **Layout otimizado**
  - Organizar informações em duas colunas
  - Espaçamento consistente
  - Fonte com melhor legibilidade
  - Contraste adequado

- [ ] **Mini-mapa integrado**
  - Posicionar mini-mapa no canto superior direito
  - Borda e sombra para destacar
  - Indicador de direção da câmera

- [ ] **Legenda customizável**
  - Fonte maior e negrito
  - Posicionamento centralizado
  - Background semi-transparente

**Arquivos a modificar**:
- `src/python/overlay_generator.py`

---

### 2. 📄 Melhorar Layout do Relatório PDF Inicial

**Objetivo**: PDF mais profissional com melhor apresentação

**Melhorias Planejadas**:
- [ ] **Cabeçalho aprimorado**
  - Logo da empresa (opcional)
  - Título em destaque com bordas
  - Informações do projeto em tabela
  - Data de geração automática

- [ ] **Grid de fotos otimizado**
  - Layout 2x3 (6 fotos por página) - atual ✅
  - Espaçamento consistente entre fotos
  - Bordas nas imagens
  - Numeração automática das fotos

- [ ] **Rodapé informativo**
  - Número da página (Página X de Y)
  - Nome do responsável
  - Data de geração
  - Copyright/marca d'água

- [ ] **Metadados por foto**
  - Exibir data/hora abaixo de cada foto
  - Mostrar coordenadas GPS (se disponível)
  - Legenda com quebra de linha automática

- [ ] **Configurações de impressão**
  - Margens adequadas
  - Orientação retrato
  - Tamanho A4
  - Qualidade de imagem otimizada

**Arquivos a modificar**:
- `src/python/pdf_generator.py`
- `src/python/templates/relatorio_template.html` (criar se não existir)

---

### 3. 🏗️ Navegação de Projetos com Toggle

**Objetivo**: Gerenciar múltiplos projetos/obras facilmente

**Funcionalidades**:
- [ ] **Seletor de projeto**
  - Dropdown com lista de projetos existentes
  - Opção "Criar novo projeto"
  - Busca/filtro de projetos
  - Indicador de projeto ativo

- [ ] **Modal de gerenciamento**
  - Criar novo projeto (Nome, Endereço, Cliente, Status)
  - Editar projeto existente
  - Arquivar/deletar projeto
  - Ver histórico de relatórios por projeto

- [ ] **Integração com relatórios**
  - Associar fotos ao projeto selecionado
  - Filtrar relatórios por projeto
  - Incluir dados do projeto no PDF

- [ ] **Persistência de dados**
  - Salvar projetos no localStorage (ou backend futuro)
  - Carregar projeto ao abrir aplicação
  - Exportar/importar lista de projetos

**Arquivos a modificar**:
- `src/frontend/index.html` (adicionar UI de projetos)
- `src/frontend/js/projects.js` (criar novo arquivo)
- `src/frontend/css/projects.css` (criar novo arquivo)

**UI/UX**:
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

### 4. ☁️ Cloudflare Tunnel - Expor Aplicação

**Objetivo**: Tornar aplicação acessível externamente via Cloudflare

**Passos**:
- [ ] Instalar cloudflared
- [ ] Configurar tunnel
- [ ] Mapear porta local (3000 frontend + 8002 backend)
- [ ] Obter URL público
- [ ] Configurar DNS (opcional)

**Comando de exemplo**:
```bash
# Instalar cloudflared
# Windows: baixar de https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Criar tunnel
cloudflared tunnel create photo-report

# Configurar config.yml
cloudflared tunnel route dns photo-report photo-report.seu-dominio.com

# Iniciar tunnel
cloudflared tunnel run photo-report
```

**Configuração sugerida** (`~/.cloudflared/config.yml`):
```yaml
tunnel: <TUNNEL_ID>
credentials-file: ~/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: photo-report.seu-dominio.com
    service: http://localhost:3000
  - hostname: api.photo-report.seu-dominio.com
    service: http://localhost:8002
  - service: http_status:404
```

---

## 📊 Priorização

1. **Alta**: Navegação de Projetos (essencial para multi-obras)
2. **Média**: Melhorar Overlay (qualidade visual)
3. **Média**: Melhorar PDF (apresentação profissional)
4. **Baixa**: Cloudflare Tunnel (acesso externo opcional)

---

## 🚀 Como Implementar

### Opção 1: Implementação Manual
1. Escolher um item do TODO
2. Seguir as especificações acima
3. Testar localmente
4. Commit e push

### Opção 2: Com Claude Code
```bash
# Pedir ao Claude para implementar cada item
# Exemplo: "Implementar navegação de projetos com toggle conforme TODO.md"
```

---

## ✅ Checklist de Qualidade

Antes de marcar como concluído:
- [ ] Código testado localmente
- [ ] Sem erros no console do navegador
- [ ] Funciona no Chrome/Firefox/Edge
- [ ] Responsivo (se aplicável)
- [ ] Commit com mensagem descritiva
- [ ] Push para GitHub
- [ ] Atualizar este TODO.md

---

**Última atualização**: 2025-12-26
**Versão**: 1.0.0
