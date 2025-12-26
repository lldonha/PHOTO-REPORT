---
name: PHOTO-REPORT - Relatório Fotográfico de Obras
description: |
  Sistema completo para geração de relatórios fotográficos profissionais com:
  - Extração automática de metadados EXIF (data, GPS, direção)
  - Geração de mini-mapas com OpenStreetMap
  - Overlay customizável com informações e legendas
  - Geração de PDF A4 com layout 2x3 (6 fotos/página)
  - Interface drag-and-drop para upload
  - Cloudflare Tunnel para acesso público

  Use esta skill quando:
  - Criar relatórios fotográficos de obras/vistorias
  - Processar fotos com EXIF e GPS
  - Gerar PDFs profissionais automaticamente
  - Integrar frontend web com backend FastAPI
---

# 📷 PHOTO-REPORT - Skill

## 🎯 Propósito

Sistema web profissional para engenheiros e técnicos gerarem relatórios fotográficos de obras com:
- Upload em lote (até 100 fotos)
- Extração automática de metadados
- Processamento de imagens com overlay
- Geração de PDF padronizado

---

## 🏗️ Arquitetura

```
┌──────────────────────────┐
│   Frontend (Vanilla JS)   │  → http://diario.lldonha.com
│   - Drag & drop upload    │
│   - Preview + edit        │
│   - PDF generation UI     │
└───────────┬───────────────┘
            │
            │ HTTPS (Cloudflare Tunnel)
            │
┌───────────▼───────────────┐
│   Backend (FastAPI)       │  → https://api.lldonha.com
│   - EXIF extraction       │     (porta 8002 local)
│   - Image processing      │
│   - PDF generation        │
│   - Mini-map generation   │
└───────────────────────────┘
```

---

## 📦 Componentes

### Backend (Python FastAPI)

**Localização**: `.worktrees/001-criar-sistema-photo-report-completo/src/python/`

| Arquivo | Responsabilidade |
|---------|------------------|
| `processor.py` | API FastAPI principal (8002) |
| `exif_extractor.py` | Extração de metadados EXIF |
| `overlay_generator.py` | Geração de overlay com Pillow |
| `map_generator.py` | Mini-mapas com py-staticmaps |
| `pdf_generator.py` | PDFs com WeasyPrint |

**Dependências**:
- FastAPI 0.100.0
- Pillow 10.0.0
- exif 1.6.0
- py-staticmaps 0.4.0
- WeasyPrint 60.1
- pydyf 0.10.0 (pinned)

### Frontend (Vanilla JavaScript)

**Localização**: `.worktrees/001-criar-sistema-photo-report-completo/src/frontend/`

- `index.html` - UI completa (HTML + CSS + JS)
- Drag-and-drop nativo
- State management simples
- Fetch API para backend

### Docker

**Localização**: `.worktrees/001-criar-sistema-photo-report-completo/src/docker/`

- `Dockerfile` - Container Python 3.11
- `docker-compose.yml` - Orquestração
- **Porta**: 8002
- **Rede**: coletor_default

---

## 🚀 API Endpoints

### GET /health
Status do serviço

**Response**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "service": "photo-processor"
}
```

### POST /processar-foto
Upload de foto + extração EXIF

**Input**: FormData com `file` (JPEG/PNG)

**Response**:
```json
{
  "sucesso": true,
  "mensagem": "Foto processada com sucesso",
  "metadados": {
    "data_hora": "2025:11:22 08:03:56",
    "data_hora_formatada": "22/11/2025 08:03",
    "latitude": -20.516672,
    "longitude": -54.693725,
    "gps_string": "-20.516672, -54.693725",
    "direcao_graus": null,
    "direcao_cardeal": "-",
    "tem_gps": true,
    "tem_direcao": false
  },
  "imagem_base64": "...",
  "thumbnail_base64": "...",
  "minimapa_base64": "..."
}
```

### POST /aplicar-mascara
Aplica overlay com metadados

**Input**:
```json
{
  "imagem_base64": "...",
  "data_hora": "22/11/2025 08:03",
  "gps_string": "-20.516672, -54.693725",
  "direcao_cardeal": "Norte (0°)",
  "legenda": "Vista frontal da fachada",
  "latitude": -20.516672,
  "longitude": -54.693725,
  "direcao_graus": 0,
  "incluir_minimapa": true
}
```

**Response**:
```json
{
  "sucesso": true,
  "mensagem": "Overlay aplicado com sucesso",
  "imagem_base64": "..."
}
```

### POST /gerar-pdf
Gera relatório PDF

**Input**:
```json
{
  "fotos": [
    {"imagem_base64": "...", "legenda": "Foto 1"}
  ],
  "titulo": "Relatório Fotográfico",
  "obra": "Edifício Central",
  "responsavel": "Eng. João Silva - CREA 12345"
}
```

**Response**:
```json
{
  "sucesso": true,
  "mensagem": "PDF gerado com sucesso: 1 página(s), 1 foto(s)",
  "pdf_base64": "...",
  "num_paginas": 1,
  "num_fotos": 1
}
```

---

## 💻 Como Usar

### 1. Iniciar Backend (Docker)

```bash
cd .worktrees/001-criar-sistema-photo-report-completo/src/docker
docker-compose up -d
```

### 2. Iniciar Frontend (HTTP Server)

```bash
cd .worktrees/001-criar-sistema-photo-report-completo/src/frontend
python -m http.server 3000
```

### 3. Configurar Cloudflare Tunnel (Para Produção)

```bash
# 1. Login
cloudflared tunnel login

# 2. Criar tunnel
cloudflared tunnel create photo-report

# 3. Configurar DNS
cloudflared tunnel route dns photo-report diario.lldonha.com
cloudflared tunnel route dns photo-report api.lldonha.com

# 4. Executar
cloudflared tunnel run photo-report
```

**Configuração** (`~/.cloudflared/config.yml`):
```yaml
tunnel: 2325ef4e-1f5d-4785-9273-5a6dd0743fdd
credentials-file: ~/.cloudflared/2325ef4e-1f5d-4785-9273-5a6dd0743fdd.json

ingress:
  - hostname: api.lldonha.com
    service: http://localhost:8002
  - service: http_status:404
```

---

## 🔧 Desenvolvimento

### Estrutura de Código

```python
# Extração EXIF
from exif_extractor import extrair_exif

metadados = extrair_exif(bytes_imagem)
# Retorna: {data_hora, latitude, longitude, direcao_graus, ...}
```

```python
# Overlay
from overlay_generator import aplicar_mascara

imagem_processada = aplicar_mascara(
    dados_imagem=bytes_originais,
    data_hora="22/11/2025 08:03",
    gps_string="-20.52, -54.69",
    direcao_cardeal="Norte (0°)",
    legenda="Minha legenda",
    mini_mapa=bytes_mapa  # opcional
)
```

```python
# Mini-mapa
from map_generator import gerar_minimapa

mapa_bytes = gerar_minimapa(
    latitude=-20.516672,
    longitude=-54.693725,
    direcao_graus=45.0  # opcional
)
```

```python
# PDF
from pdf_generator import gerar_pdf

pdf_bytes = gerar_pdf(
    fotos=[{"imagem_base64": "...", "legenda": "..."}],
    titulo="Relatório",
    obra="Obra X",
    responsavel="Eng. Y"
)
```

---

## ✅ Status Atual (v1.0.0)

### Implementado
- ✅ Upload drag-and-drop
- ✅ Extração EXIF (data, GPS, direção)
- ✅ Mini-mapas automáticos (OpenStreetMap)
- ✅ Overlay com metadados
- ✅ Geração de PDF A4 (2x3)
- ✅ CORS configurado
- ✅ Cloudflare Tunnel ativo
- ✅ Frontend público em diario.lldonha.com
- ✅ Backend público em api.lldonha.com

### 🚧 Roadmap

**Veja**: [TODO.md](.worktrees/001-criar-sistema-photo-report-completo/TODO.md)

1. **Melhorar Overlay** - Design elegante, ícones, layout 2 colunas
2. **Melhorar PDF** - Cabeçalho profissional, rodapé, metadados por foto
3. **Navegação de Projetos** - Multi-obras com toggle, persistência

---

## 📚 Documentação

- **README.md** - Visão geral do projeto
- **TODO.md** - Roadmap de melhorias detalhado
- **CLOUDFLARE-TUNNEL-SETUP.md** - Guia passo a passo do tunnel

---

## 🐛 Casos Especiais

| Cenário | Comportamento |
|---------|---------------|
| Foto sem EXIF | Campos retornam "-" ou None |
| Foto sem GPS | `tem_gps=False`, sem mini-mapa |
| Foto sem bússola | `tem_direcao=False`, omite direção |
| Legenda > 80 chars | Truncada com "..." |
| Imagem RGBA | Convertida para RGB |
| Erro mini-mapa | Log warning, continua sem mapa |

---

## 🔗 Links

- **Repositório**: https://github.com/lldonha/PHOTO-REPORT
- **Branch**: `auto-claude/001-criar-sistema-photo-report-completo`
- **Frontend Prod**: https://diario.lldonha.com
- **Backend Prod**: https://api.lldonha.com
- **API Docs**: https://api.lldonha.com/docs

---

**Versão**: 1.0.0
**Última Atualização**: 2025-12-26
