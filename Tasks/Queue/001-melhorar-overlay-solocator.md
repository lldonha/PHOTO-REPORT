# 🎨 Melhorar Máscara/Overlay - Design Profissional

**Status:** 🚀 QUEUE - Prioridade ALTA
**Branch:** `007-templates-de-overlay-customiz-veis` (já existe)
**Inspiração:** [Solocator GPS Field Camera](https://solocator.com/)
**Estimate:** 2-3 dias
**Data Criação:** 2025-12-26

---

## 📋 Objetivo

Redesenhar o overlay das fotos com design mais elegante, profissional e rico em metadados, inspirado no Solocator.

## 💡 Por Quê?

- ✅ Overlay atual é funcional mas visualmente básico
- ✅ Solocator tem design profissional e informativo
- ✅ Clientes valorizam relatórios bem apresentados
- ✅ Mais metadados = mais valor agregado

## 📌 Status Atual

- ✅ Overlay V2 já implementado (`overlay_generator_v2.py`)
- ✅ Integrado na API (commit 79e0e64)
- ⚠️ Ainda pode ser melhorado visualmente

## ✨ Melhorias Desejadas

### 1. Visual Elegante

**Atual:**
- Texto simples sobre fundo semi-transparente
- Emojis para ícones (📅, 🧭, 📍)

**Desejado:**
- ✅ Gradiente suave no fundo (preto transparente → transparente)
- ✅ Ícones vetoriais SVG (data, GPS, direção, altitude)
- ✅ Fonte profissional (Roboto, Open Sans, Inter)
- ✅ Separadores visuais entre metadados
- ✅ Sombra/outline no texto para contraste
- ✅ Logo LLD Engenharia discreto no canto

### 2. Conteúdo Rico (inspirado Solocator)

**Metadados Atuais:**
- Data/Hora
- GPS (lat, lon)
- Direção Cardeal
- Legenda

**Metadados Desejados:**
- ✅ **Data/Hora** formatada: "26/12/2025 às 14:30"
- ✅ **GPS** com mais clareza: "Lat: -23.550520, Lon: -46.633308"
- ✅ **Acurácia GPS** - `± X metros` (ex: "±5m") → já no EXIF!
- ✅ **Altitude** - `📏 760m` → já no EXIF!
- ✅ **Direção** com rosa dos ventos visual
- ✅ **Norte Verdadeiro vs Magnético** (ex: "N 45° True")
- ✅ **Endereço** via Reverse Geocoding → Google Maps API
- ✅ **Indicador de qualidade GPS** - 🟢 ±0-5m, 🟡 ±5-15m, 🔴 ±15m+
- ✅ **Nome do Projeto** (quando multi-project estiver ativo)

### 3. Layout Otimizado

**Estrutura:**
```
┌─────────────────────────────────────────┐
│  [LOGO LLD]              📅 26/12/2025  │ ← Header
│                              14:30:25   │
├─────────────────────────────────────────┤
│                                         │
│         [ FOTO ]                        │
│                                         │
├─────────────────────────────────────────┤
│ 📍 GPS: -23.5505, -46.6333  🟢 ±3m     │ ← Footer
│ 🧭 N 45° | 📏 760m                      │
│ 🏠 Rua Augusta, 123 - São Paulo/SP     │
│ "Fundação - Pilar P1"                  │
└─────────────────────────────────────────┘
```

**Opções de Posicionamento:**
- Canto inferior (padrão)
- Canto superior
- Lateral direita/esquerda
- Transparência ajustável

### 4. Templates Customizáveis

**3 Templates Pré-definidos:**

1. **Simples** - Data, GPS, Legenda
2. **Completo** - Todos os metadados disponíveis
3. **Minimalista** - Apenas data e legenda

**Customização:**
- Escolher quais metadados exibir
- Tamanho de fonte (pequeno, médio, grande)
- Cores personalizáveis (branding da empresa)
- Posição do overlay

## ✅ Tarefas

### Sprint 1: Design e Layout

- [ ] Estudar `overlay_generator_v2.py` atual
- [ ] Criar mockup do novo design (Figma/Sketch ou código)
- [ ] Definir paleta de cores LLD Engenharia
- [ ] Escolher fontes profissionais (TrueType)
- [ ] Criar/obter ícones SVG (data, GPS, bússola, altitude)

### Sprint 2: Implementação Visual

**Arquivo:** `overlay_generator_v3.py` ou atualizar V2

- [ ] Implementar gradiente de fundo suave
- [ ] Renderizar ícones SVG (via Pillow ou Cairo)
- [ ] Aplicar fonte profissional
- [ ] Adicionar sombra/outline em texto
- [ ] Inserir logo LLD Engenharia

### Sprint 3: Novos Metadados

- [ ] Extrair acurácia GPS do EXIF (`exif_extractor.py`)
- [ ] Extrair altitude do EXIF (já existe?)
- [ ] Implementar Reverse Geocoding (Google Maps API)
- [ ] Criar indicador visual de qualidade GPS (cores)
- [ ] Formatar direção com norte verdadeiro

### Sprint 4: Templates e Customização

- [ ] Criar classe `OverlayTemplate` (Simples, Completo, Minimalista)
- [ ] Implementar configuração de template via API
- [ ] Adicionar endpoint `/overlay/templates` para listar opções
- [ ] Permitir customização de cores e fontes
- [ ] Salvar preferências por projeto (se multi-project ativo)

### Sprint 5: Integração e Testes

- [ ] Atualizar endpoint `/aplicar-mascara` para suportar templates
- [ ] Testar com fotos reais de obra
- [ ] Comparar visual V2 vs V3
- [ ] Validar performance (tempo de processamento)
- [ ] Obter feedback do usuário

## 🎨 Tecnologias

**Renderização de Overlay:**
- **Pillow** (atual) - Bom para básico
- **Cairo** - Melhor para gráficos vetoriais
- **ReportLab** - Alternativa para PDFs

**Ícones:**
- Font Awesome (TTF)
- Material Icons
- SVG customizados

**Fontes:**
- Roboto
- Open Sans
- Inter
- IBM Plex Sans (já usado no frontend!)

## 📚 Referências

- `Research/solocator-research.md` - Análise detalhada do Solocator
- `.worktrees/001-criar-sistema-photo-report-completo/src/python/overlay_generator_v2.py`
- `.worktrees/007-templates-de-overlay-customiz-veis/` - Branch
- TODO.md linha 46-94
- [Solocator.com](https://solocator.com/)

## 🔗 Dependências

- **Opcional:** Google Maps API (para reverse geocoding)
- **Recomendado:** Multi-Project (para salvar preferências por obra)

## ⚠️ Notas Importantes

- Overlay V2 JÁ está bom, esta task é para **excelência**
- Focar em usabilidade e legibilidade
- Permitir cliente escolher nível de detalhe
- Testes com fotos reais de obras LLD

## 🎯 Critérios de Sucesso

- [ ] Visual profissional comparável ao Solocator
- [ ] Todos os metadados importantes visíveis
- [ ] Templates configuráveis funcionando
- [ ] Performance aceitável (<2s por foto)
- [ ] Aprovação do usuário (LLD Engenharia)

---

*Última atualização: 2025-12-26*
*Inspiração: Solocator GPS Field Camera*
