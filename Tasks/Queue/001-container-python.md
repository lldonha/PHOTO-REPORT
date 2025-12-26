# Task: Build e Start do Container Python

## Prioridade
Alta

## Status
Queue

## Descricao
Realizar o build do container Docker `photo-processor` e iniciar o servico para disponibilizar a API FastAPI na porta 8002.

## Pre-requisitos
- Docker Desktop instalado e rodando
- Rede `coletor_default` criada (criar se nao existir)
- Arquivos `src/docker/Dockerfile` e `src/docker/docker-compose.yml` presentes

## Passos

### 1. Criar rede Docker (se nao existir)
```bash
docker network create coletor_default 2>nul || echo "Rede ja existe"
```

### 2. Build do container
```bash
cd E:\Projetos\PHOTO-REPORT\src\docker
docker-compose build
```

### 3. Start do container
```bash
docker-compose up -d
```

### 4. Verificar logs
```bash
docker-compose logs -f photo-processor
```

### 5. Testar health endpoint
```bash
curl http://localhost:8002/health
```

## Resultado Esperado
```json
{
  "status": "ok",
  "version": "1.0.0",
  "service": "photo-processor"
}
```

## Verificacao
- Container `photo-processor` listado em `docker ps`
- Porta 8002 respondendo
- Swagger UI disponivel em http://localhost:8002/docs
- Logs sem erros de importacao ou dependencias

## Troubleshooting

### Erro: Cairo/WeasyPrint nao encontrado
O Dockerfile ja inclui as dependencias de sistema necessarias. Se houver erro, verificar se o build completou todas as etapas.

### Erro: Rede nao encontrada
```bash
docker network create coletor_default
```

### Erro: Porta em uso
```bash
docker ps -a | findstr 8002
docker stop <container_id>
```

## Arquivos Relacionados
- `src/docker/Dockerfile`
- `src/docker/docker-compose.yml`
- `src/python/processor.py`
- `src/python/requirements.txt`

## Tempo Estimado
10-15 minutos (primeiro build pode demorar mais)

## Dependencias
Nenhuma task anterior necessaria.

## Proxima Task
002-criar-tabelas-sql.md
