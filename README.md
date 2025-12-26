# 📷 PHOTO-REPORT

> Sistema completo para geração de relatórios fotográficos de obras com extração automática de metadados EXIF, GPS, mini-mapas e geração de PDF profissional.

[![Status](https://img.shields.io/badge/status-funcionando-success)](https://github.com/lldonha/PHOTO-REPORT)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-green)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

## ✨ Funcionalidades

### ✅ Implementado (v1.0.0)

- **📸 Upload de Fotos**: Drag-and-drop ou clique para selecionar até 100 fotos (JPEG/PNG)
- **🗺️ Extração EXIF**: Data/hora, coordenadas GPS, direção da câmera automática
- **🌍 Mini-mapa Automático**: Geração de mapa com localização (OpenStreetMap)
- **🎨 Overlay com Metadados**: Máscara na foto com data, GPS, direção e legenda
- **📄 Geração de PDF**: Relatório A4 com layout 2x3 (6 fotos por página)
- **⚡ CORS Configurado**: Frontend e backend funcionando perfeitamente
- **🐳 Docker Ready**: Containerização completa do backend

### 🚧 Próximas Melhorias

Veja [TODO.md](./TODO.md) para detalhes completos.

1. **🎨 Melhorar Overlay**: Design elegante com ícones, layout otimizado
2. **📄 Melhorar PDF**: Cabeçalho profissional, rodapé, metadados por foto
3. **🏗️ Navegação de Projetos**: Sistema de multi-obras com toggle
4. **☁️ Cloudflare Tunnel**: Acesso externo via URL pública ([Guia](./CLOUDFLARE-TUNNEL-SETUP.md))

## Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Frontend      │────▶│  Photo Processor │────▶│  PostgreSQL │
│   (HTML puro)   │     │  (FastAPI:8002)  │     │   (cosmic)  │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

### Componentes

| Componente | Tecnologia | Porta |
|------------|------------|-------|
| Frontend | HTML/CSS/JS (vanilla) | - |
| API | Python FastAPI | 8002 |
| Database | PostgreSQL | 5432 |

## Estrutura do Projeto

```
PHOTO-REPORT/
├── .claude/skills/photo-processor/   # Skill Claude para processamento
├── Context/                          # Documentação de contexto
├── Tasks/                            # Gestão de tarefas
│   ├── Backlog/
│   ├── Queue/
│   ├── InProgress/
│   └── Done/
├── src/
│   ├── docker/                       # Dockerfile e docker-compose
│   ├── python/                       # API FastAPI
│   │   ├── processor.py              # Entry point da API
│   │   ├── exif_extractor.py         # Extração de metadados EXIF
│   │   ├── overlay_generator.py      # Geração de overlay com Pillow
│   │   ├── map_generator.py          # Geração de mini-mapas
│   │   ├── pdf_generator.py          # Geração de PDF
│   │   └── requirements.txt          # Dependências Python
│   └── frontend/                     # Interface web
│       └── index.html
├── scripts/sql/                      # Scripts SQL
│   └── create-tables.sql
└── workflows/n8n/                    # Workflows n8n (futuro)
```

## Quick Start

### 1. Criar rede Docker (se não existir)

```bash
docker network create coletor_default
```

### 2. Build e Start do Container

```bash
cd src/docker
docker-compose build
docker-compose up -d
```

### 3. Verificar Status

```bash
curl http://localhost:8002/health
# Esperado: {"status":"ok","version":"1.0.0","service":"photo-processor"}
```

### 4. Criar Tabelas no Banco

```bash
docker exec -it pg psql -U lucas -d cosmic -f /scripts/sql/create-tables.sql
```

### 5. Abrir Frontend

```bash
start src/frontend/index.html
```

## API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/health` | GET | Status do container |
| `/processar-foto` | POST | Extrai EXIF e retorna metadados + mini mapa |
| `/aplicar-mascara` | POST | Gera overlay com metadados e legenda |
| `/gerar-pdf` | POST | Compila fotos processadas em PDF |
| `/docs` | GET | Swagger UI (documentação interativa) |

### Exemplo de Uso

```bash
# Processar uma foto
curl -X POST -F "file=@foto.jpg" http://localhost:8002/processar-foto

# Resposta:
{
  "data_hora": "2024-01-15 14:30:00",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "direcao": "Norte (0°)",
  "imagem_base64": "...",
  "minimapa_base64": "..."
}
```

## Tech Stack

- **Backend**: Python 3.11, FastAPI 0.100.0
- **Processamento de Imagem**: Pillow 10.0.0, exif 1.6.0
- **Mapas**: py-staticmaps 0.4.0, pycairo 1.26.0
- **PDF**: WeasyPrint 60.0, Jinja2 3.1.2
- **Database**: PostgreSQL
- **Container**: Docker, docker-compose

## Configuração do Banco

### Tabelas

- `photo_reports` - Sessões/relatórios
- `photo_items` - Fotos individuais com EXIF + legenda
- `photo_reports_summary` - View com contagem de fotos

### Conexão

```
Host: host.docker.internal
Port: 5432
Database: cosmic
User: lucas
```

## Workflow de Uso

1. **Upload**: Arraste fotos para a zona de upload
2. **Processamento**: Sistema extrai EXIF automaticamente
3. **Visualização**: Veja metadados e mini mapas de cada foto
4. **Edição**: Personalize legendas de cada foto
5. **Geração**: Clique em "Gerar Relatório PDF"
6. **Download**: PDF é gerado e baixado automaticamente

## Tratamento de Casos Especiais

| Cenário | Comportamento |
|---------|---------------|
| Foto sem EXIF | Exibe "-" para campos ausentes |
| Foto sem GPS | Processa normalmente, omite coordenadas e mapa |
| Foto sem Bússola | Processa normalmente, omite direção |
| Imagem não-JPEG | Converte para RGB se necessário |
| Legenda muito longa | Trunca em 80 caracteres com "..." |

## Desenvolvimento

### Requisitos

- Docker e docker-compose
- PostgreSQL com banco `cosmic` configurado
- Navegador moderno (Chrome, Firefox, Edge)

### Testes Manuais

```bash
# Health check
curl http://localhost:8002/health

# Verificar Swagger
# Abrir: http://localhost:8002/docs

# Logs do container
docker logs photo-processor
```

## Roadmap (Fora do MVP)

- [ ] Integração com n8n (workflow orchestrator)
- [ ] Módulo de IA para geração automática de legendas
- [ ] Suporte a múltiplas obras simultâneas (multi-tenancy)
- [ ] Autenticação e autorização de usuários
- [ ] Testes automatizados (unit/integration)

## Licença

Projeto interno - Todos os direitos reservados.
