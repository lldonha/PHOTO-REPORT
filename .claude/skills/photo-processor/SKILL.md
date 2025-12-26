# Photo Report Processor Skill

## Descrição

Este skill permite processamento de fotos de obra para geração de relatórios fotográficos profissionais. Inclui extração automática de metadados EXIF, aplicação de overlay com informações e geração de PDF padronizado.

## Capacidades

### 1. Extração de Metadados EXIF
- Data e hora da foto (datetime_original)
- Coordenadas GPS (latitude/longitude)
- Direção da bússola (gps_img_direction)
- Conversão automática de DMS para decimal

### 2. Geração de Overlay
- Barra inferior semi-transparente (100px)
- Ícones visuais: 📅 Data, 📍 GPS, 🧭 Direção
- Legenda customizável em amarelo (máx 80 caracteres)
- Mini-mapa integrado ao overlay

### 3. Geração de Mini-Mapas
- Mapa estático 150x150 pixels
- Marcador na localização GPS
- Linha indicando direção da bússola
- Tile provider: OpenStreetMap

### 4. Geração de PDF
- Layout A4 com grid 2x3 (6 fotos por página)
- Cabeçalho: título, obra, responsável, data
- Numeração automática de fotos e páginas
- Fotos com overlay aplicado

## Arquivos do Skill

```
.claude/skills/photo-processor/
├── SKILL.md                    # Este arquivo
└── references/                 # Referências e exemplos
```

## Módulos Python

| Arquivo | Descrição |
|---------|-----------|
| `src/python/processor.py` | API FastAPI principal (porta 8002) |
| `src/python/exif_extractor.py` | Extração de metadados EXIF |
| `src/python/overlay_generator.py` | Geração de overlay com Pillow |
| `src/python/map_generator.py` | Geração de mini-mapas com py-staticmaps |
| `src/python/pdf_generator.py` | Geração de PDF com WeasyPrint |

## API Endpoints

### GET /health
Status do container.

**Resposta:**
```json
{"status": "ok", "version": "1.0.0", "service": "photo-processor"}
```

### POST /processar-foto
Extrai EXIF e retorna metadados + mini mapa.

**Input:** FormData com `file` (imagem JPEG/PNG)

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Foto processada com sucesso",
  "metadados": {
    "data_hora": "2024:01:15 14:30:00",
    "data_hora_formatada": "15/01/2024 14:30",
    "latitude": -23.550520,
    "longitude": -46.633308,
    "gps_string": "-23.55052, -46.63331",
    "direcao_graus": 45.0,
    "direcao_cardeal": "Nordeste (45°)",
    "tem_gps": true,
    "tem_direcao": true
  },
  "imagem_base64": "...",
  "thumbnail_base64": "...",
  "minimapa_base64": "..."
}
```

### POST /aplicar-mascara
Aplica overlay com metadados e legenda na imagem.

**Input:**
```json
{
  "imagem_base64": "...",
  "data_hora": "15/01/2024 14:30",
  "gps_string": "-23.55052, -46.63331",
  "direcao_cardeal": "Nordeste (45°)",
  "legenda": "Vista frontal da fachada principal",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "direcao_graus": 45.0,
  "incluir_minimapa": true
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Overlay aplicado com sucesso",
  "imagem_base64": "..."
}
```

### POST /gerar-pdf
Gera PDF com fotos processadas.

**Input:**
```json
{
  "fotos": [
    {"imagem_base64": "...", "legenda": "Foto 1"},
    {"imagem_base64": "...", "legenda": "Foto 2"}
  ],
  "titulo": "Relatório Fotográfico",
  "obra": "Edifício Central",
  "responsavel": "Eng. João Silva"
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "PDF gerado com sucesso: 1 página(s), 2 foto(s)",
  "pdf_base64": "...",
  "num_paginas": 1,
  "num_fotos": 2
}
```

### POST /gerar-pdf/download
Mesma funcionalidade de /gerar-pdf, mas retorna PDF como arquivo para download direto.

## Como Usar

### 1. Iniciar Container

```bash
cd src/docker
docker-compose build
docker-compose up -d
```

### 2. Verificar Status

```bash
curl http://localhost:8002/health
```

### 3. Processar Foto

```bash
curl -X POST -F "file=@foto.jpg" http://localhost:8002/processar-foto
```

### 4. Swagger Docs

Acesse: http://localhost:8002/docs

## Padrões de Código

### Extração EXIF
```python
from exif_extractor import extrair_exif

# Extrai metadados de bytes de imagem
metadados = extrair_exif(dados_imagem)
# Retorna: {"data_hora", "latitude", "longitude", "direcao_graus", ...}
```

### Overlay
```python
from overlay_generator import aplicar_mascara

# Aplica overlay com informações
imagem_bytes = aplicar_mascara(
    dados_imagem=bytes_originais,
    data_hora="15/01/2024 14:30",
    gps_string="-23.55, -46.63",
    direcao_cardeal="Norte (0°)",
    legenda="Minha legenda",
    mini_mapa=bytes_mapa  # opcional
)
```

### Mini-Mapa
```python
from map_generator import gerar_minimapa

# Gera mapa 150x150 com marcador
mapa_bytes = gerar_minimapa(
    latitude=-23.550520,
    longitude=-46.633308,
    direcao_graus=45.0  # opcional
)
```

### PDF
```python
from pdf_generator import gerar_pdf

# Gera PDF com lista de fotos
pdf_bytes = gerar_pdf(
    fotos=[{"imagem_base64": "...", "legenda": "..."}],
    titulo="Relatório",
    obra="Obra X",
    responsavel="Eng. Y"
)
```

## Tratamento de Casos Especiais

| Cenário | Comportamento |
|---------|---------------|
| Foto sem EXIF | Campos retornam "-" ou None |
| Foto sem GPS | `tem_gps=False`, sem mini-mapa |
| Foto sem bússola | `tem_direcao=False`, omite direção |
| Legenda > 80 chars | Truncada com "..." |
| Erro no mini-mapa | Log warning, continua sem mapa |
| Imagem RGBA | Convertida para RGB |

## Dependências

- Python 3.11
- FastAPI 0.100.0
- Pillow 10.0.0
- exif 1.6.0
- py-staticmaps 0.4.0
- pycairo 1.26.0
- WeasyPrint 60.0
- Jinja2 3.1.2

## Docker

- **Container:** photo-processor
- **Porta:** 8002
- **Rede:** coletor_default
- **Volume:** src/python montado em /app

## Banco de Dados

- **Host:** host.docker.internal
- **Porta:** 5432
- **Database:** cosmic
- **Tabelas:** photo_reports, photo_items
- **View:** photo_reports_summary
