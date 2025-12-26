# Arquitetura do Sistema PHOTO-REPORT

## Visao Geral

O PHOTO-REPORT e um sistema web para geracao de relatorios fotograficos de obra. A arquitetura segue um modelo cliente-servidor simples, com frontend estatico comunicando-se com uma API Python containerizada.

## Diagrama de Arquitetura

```
                    USUARIO
                       |
                       v
    +------------------------------------------+
    |              FRONTEND                    |
    |         (HTML/CSS/JavaScript)            |
    |                                          |
    |  - Upload drag-and-drop                  |
    |  - Edicao de legendas                    |
    |  - Visualizacao de metadados             |
    |  - Geracao de PDF                        |
    +------------------------------------------+
                       |
                       | HTTP (localhost:8002)
                       v
    +------------------------------------------+
    |           PHOTO-PROCESSOR                |
    |            (FastAPI API)                 |
    |                                          |
    |  Container Docker: photo-processor       |
    |  Porta: 8002                             |
    |  Rede: coletor_default                   |
    +------------------------------------------+
         |              |              |
         v              v              v
    +---------+   +---------+   +---------+
    |  EXIF   |   | OVERLAY |   |   PDF   |
    |Extractor|   |Generator|   |Generator|
    +---------+   +---------+   +---------+
                       |
                       v
                 +---------+
                 |   MAP   |
                 |Generator|
                 +---------+
                       |
                       v
    +------------------------------------------+
    |             POSTGRESQL                   |
    |           (Banco: cosmic)                |
    |                                          |
    |  Host: host.docker.internal              |
    |  Porta: 5432                             |
    |  Tabelas: photo_reports, photo_items     |
    +------------------------------------------+
```

## Componentes

### 1. Frontend (HTML Puro)

**Localizacao:** `src/frontend/index.html`

**Responsabilidades:**
- Interface de usuario para upload de fotos
- Visualizacao de metadados EXIF extraidos
- Edicao de legendas customizaveis
- Requisicoes a API para processamento
- Download de PDF gerado

**Tecnologias:**
- HTML5 (estrutura)
- CSS3 (estilizacao responsiva)
- JavaScript vanilla (logica de interacao)

**Decisao de Design:**
Optamos por HTML puro (sem frameworks como React/Vue) para:
- Simplicidade de deploy (arquivo estatico)
- Sem necessidade de build process
- Manutencao simples
- Performance maxima para a aplicacao

### 2. Photo Processor API (FastAPI)

**Localizacao:** `src/python/processor.py`

**Responsabilidades:**
- Receber e processar fotos
- Expor endpoints REST para o frontend
- Orquestrar modulos de processamento
- Gerenciar comunicacao com banco de dados

**Endpoints:**

| Endpoint | Metodo | Funcao |
|----------|--------|--------|
| `/health` | GET | Status do container |
| `/processar-foto` | POST | Extrai EXIF e gera thumbnails |
| `/aplicar-mascara` | POST | Aplica overlay com metadados |
| `/gerar-pdf` | POST | Gera PDF (retorna base64) |
| `/gerar-pdf/download` | POST | Gera PDF (download direto) |
| `/docs` | GET | Swagger UI |

**Configuracao Docker:**
- Container: `photo-processor`
- Porta: `8002`
- Rede: `coletor_default`
- Volume: codigo Python montado em `/app`

### 3. Modulos Python

#### 3.1 EXIF Extractor
**Arquivo:** `src/python/exif_extractor.py`

**Funcionalidades:**
- Extracao de data/hora (`datetime_original`)
- Extracao de coordenadas GPS (`gps_latitude`, `gps_longitude`)
- Extracao de direcao da bussola (`gps_img_direction`)
- Conversao DMS para decimal
- Conversao de graus para direcao cardeal

**Biblioteca:** `exif` 1.6.0

#### 3.2 Overlay Generator
**Arquivo:** `src/python/overlay_generator.py`

**Funcionalidades:**
- Criacao de barra inferior semi-transparente (100px)
- Renderizacao de icones emoji
- Integracao de mini-mapa no overlay
- Truncamento de legendas longas (80 chars)

**Biblioteca:** `Pillow` 10.0.0

#### 3.3 Map Generator
**Arquivo:** `src/python/map_generator.py`

**Funcionalidades:**
- Geracao de mapas estaticos 150x150px
- Marcador na localizacao GPS
- Linha indicando direcao da bussola
- Suporte a multiplos pontos (relatorio completo)

**Biblioteca:** `py-staticmaps` 0.4.0

**Tile Provider:** OpenStreetMap

#### 3.4 PDF Generator
**Arquivo:** `src/python/pdf_generator.py`

**Funcionalidades:**
- Geracao de PDF A4
- Layout grid 2x3 (6 fotos por pagina)
- Cabecalho com titulo, obra, responsavel
- Numeracao automatica de paginas

**Biblioteca:** `WeasyPrint` 60.0

### 4. Banco de Dados (PostgreSQL)

**Banco:** `cosmic` (existente)

**Tabelas:**

#### photo_reports
```sql
CREATE TABLE photo_reports (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    obra VARCHAR(255),
    responsavel VARCHAR(255),
    status VARCHAR(50) DEFAULT 'rascunho',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_geracao_pdf TIMESTAMP,
    pdf_path VARCHAR(500),
    observacoes TEXT
);
```

#### photo_items
```sql
CREATE TABLE photo_items (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES photo_reports(id),
    nome_arquivo VARCHAR(255) NOT NULL,
    ordem INTEGER DEFAULT 0,
    data_hora TIMESTAMP,
    latitude DECIMAL(11, 8),
    longitude DECIMAL(11, 8),
    direcao_graus DECIMAL(6, 2),
    direcao_cardeal VARCHAR(10),
    legenda VARCHAR(255),
    imagem_original_path VARCHAR(500),
    imagem_processada_path VARCHAR(500),
    thumbnail_base64 TEXT,
    minimapa_base64 TEXT,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processado BOOLEAN DEFAULT FALSE
);
```

#### photo_reports_summary (View)
Resumo de relatorios com contagem de fotos processadas.

## Fluxo de Dados

### 1. Upload e Processamento
```
Usuario arrasta foto
       |
       v
Frontend captura arquivo
       |
       | POST /processar-foto (FormData)
       v
API recebe imagem
       |
       v
EXIF Extractor extrai metadados
       |
       v
Map Generator cria mini-mapa (se GPS)
       |
       v
API retorna: metadados + thumbnail + minimapa
       |
       v
Frontend exibe card com informacoes
```

### 2. Aplicacao de Overlay
```
Usuario edita legenda
       |
       v
Frontend prepara dados (imagem + metadados + legenda)
       |
       | POST /aplicar-mascara (JSON)
       v
API recebe dados
       |
       v
Overlay Generator cria barra + insere minimapa
       |
       v
API retorna: imagem com overlay (base64)
       |
       v
Frontend atualiza preview
```

### 3. Geracao de PDF
```
Usuario clica "Gerar PDF"
       |
       v
Frontend coleta todas as fotos processadas
       |
       | POST /gerar-pdf (JSON)
       v
API recebe lista de fotos
       |
       v
PDF Generator cria HTML com Jinja2
       |
       v
WeasyPrint converte HTML para PDF
       |
       v
API retorna: PDF (base64 ou download)
       |
       v
Frontend inicia download automatico
```

## Decisoes Tecnicas

### Por que FastAPI?
- Performance assincrona
- Documentacao automatica (Swagger)
- Validacao de tipos com Pydantic
- Facilidade de integracao com Docker

### Por que HTML Puro?
- Zero dependencias de build
- Maximo controle sobre comportamento
- Deploy simples (arquivo estatico)
- Sem overhead de framework

### Por que WeasyPrint?
- Suporte completo a CSS3
- Qualidade tipografica
- Integracao nativa com Python
- Renderizacao precisa de layouts complexos

### Por que py-staticmaps?
- Geracao offline de mapas
- Nao requer API key
- Suporte a marcadores e linhas
- Integracao com Pillow/Cairo

### Por que PostgreSQL existente?
- Reutilizacao de infraestrutura
- Banco `cosmic` ja configurado
- Sem overhead de novo container
- Consistencia com outros projetos

## Consideracoes de Seguranca

### Atual (MVP)
- Sem autenticacao (uso interno)
- CORS habilitado para desenvolvimento
- Validacao de tipos de arquivo
- Limite de tamanho de upload

### Futuro (Pos-MVP)
- Autenticacao JWT
- Rate limiting
- Validacao de origem
- Sanitizacao de entradas

## Escalabilidade

### Atual (MVP)
- Single container
- Processamento sincrono
- Armazenamento local

### Futuro (Pos-MVP)
- Multiplos workers (Gunicorn)
- Fila de processamento (Celery/Redis)
- Armazenamento em cloud (S3)
- Cache de mini-mapas

## Monitoramento

### Atual (MVP)
- Logs estruturados em JSON
- Health check endpoint
- Docker health check

### Futuro (Pos-MVP)
- Metricas Prometheus
- Dashboards Grafana
- Alertas de erro
- Tracing distribuido

## Dependencias de Sistema

### Docker Container
```dockerfile
# Base
python:3.11-slim

# Sistema (para Cairo/WeasyPrint)
- libcairo2-dev
- libpango1.0-dev
- libgdk-pixbuf2.0-dev
- fonts-noto-color-emoji

# Python
- fastapi==0.100.0
- pillow==10.0.0
- exif==1.6.0
- py-staticmaps==0.4.0
- pycairo==1.26.0
- weasyprint==60.0
- jinja2==3.1.2
- uvicorn
- python-multipart
- psycopg2-binary
```

## Rede Docker

```yaml
networks:
  coletor_default:
    external: true
```

O container `photo-processor` participa da rede `coletor_default` para comunicacao com outros containers do ecossistema (PostgreSQL, n8n futuro).

## Volumes

```yaml
volumes:
  # Codigo Python (desenvolvimento)
  - ../python:/app:ro

  # Arquivos temporarios
  - photo-temp:/tmp/photo-processor
```
