# Escopo MVP - PHOTO-REPORT

## Definicao do MVP

O MVP (Minimum Viable Product) do PHOTO-REPORT e um sistema funcional que permite engenheiros de obra gerarem relatorios fotograficos padronizados a partir de fotos tiradas em campo.

## Objetivo Principal

Automatizar a criacao de relatorios fotograficos que hoje sao feitos manualmente no Word/Excel, economizando tempo e garantindo padronizacao.

## Funcionalidades Incluidas no MVP

### 1. Upload de Fotos em Lote
- [x] Drag-and-drop de multiplas fotos
- [x] Suporte ate 100 fotos por sessao
- [x] Formatos aceitos: JPEG, PNG
- [x] Preview das fotos carregadas

### 2. Extracao Automatica de EXIF
- [x] Data e hora original da foto
- [x] Coordenadas GPS (latitude/longitude)
- [x] Direcao da bussola (quando disponivel)
- [x] Tratamento de fotos sem metadados

### 3. Geracao de Mini-Mapas
- [x] Mapa estatico 150x150 pixels
- [x] Marcador vermelho na localizacao
- [x] Linha azul indicando direcao
- [x] Tile provider: OpenStreetMap

### 4. Overlay Editavel
- [x] Barra inferior semi-transparente (100px)
- [x] Exibicao de data/hora com emoji
- [x] Exibicao de coordenadas GPS com emoji
- [x] Exibicao de direcao com emoji
- [x] Legenda customizavel (max 80 caracteres)
- [x] Mini-mapa integrado ao overlay

### 5. Edicao de Legendas
- [x] Campo textarea por foto
- [x] Limite de 80 caracteres (trunca com "...")
- [x] Preview em tempo real

### 6. Geracao de PDF
- [x] Formato A4
- [x] Layout grid 2x3 (6 fotos por pagina)
- [x] Cabecalho com titulo, obra, responsavel
- [x] Numeracao automatica de paginas
- [x] Download automatico do PDF

### 7. Interface Web
- [x] Campos de configuracao (titulo, obra, responsavel)
- [x] Zona de drop para fotos
- [x] Grid de cards com metadados
- [x] Botoes de acao (remover foto, gerar PDF)
- [x] Mensagens de status/erro
- [x] Design responsivo

### 8. API Backend
- [x] Endpoint /health (status)
- [x] Endpoint /processar-foto (extracao EXIF)
- [x] Endpoint /aplicar-mascara (overlay)
- [x] Endpoint /gerar-pdf (PDF base64)
- [x] Endpoint /gerar-pdf/download (PDF direto)
- [x] Documentacao Swagger (/docs)

### 9. Infraestrutura
- [x] Container Docker (photo-processor)
- [x] Docker Compose configurado
- [x] Rede coletor_default
- [x] Health check configurado

### 10. Banco de Dados
- [x] Tabela photo_reports
- [x] Tabela photo_items
- [x] View photo_reports_summary
- [x] Indices de performance

### 11. Documentacao
- [x] README.md principal
- [x] SKILL.md do photo-processor
- [x] Arquitetura documentada
- [x] Escopo MVP documentado

## Funcionalidades EXCLUIDAS do MVP

### 1. Integracao com n8n
- Motivo: Complexidade adicional desnecessaria para validar o conceito
- Quando: Pos-validacao do MVP, Sprint 2

### 2. Modulo de IA para Legendas
- Motivo: Requer integracao com LLM (custo + complexidade)
- Quando: Pos-MVP, quando validar uso real

### 3. Multi-Tenancy (Multiplas Obras)
- Motivo: MVP focado em fluxo single-user
- Quando: Quando houver demanda de multiplos usuarios

### 4. Autenticacao e Autorizacao
- Motivo: Sistema interno, acesso controlado por rede
- Quando: Quando houver exposicao externa

### 5. Testes Automatizados
- Motivo: Foco em entrega rapida do MVP
- Quando: Antes de deploy em producao

### 6. Deploy em Producao
- Motivo: Primeiro validar localmente
- Quando: Apos testes de aceitacao

### 7. Persistencia de Sessoes
- Motivo: MVP processa fotos em memoria
- Quando: Quando validar necessidade

### 8. Reordenacao de Fotos
- Motivo: Simplificar interface inicial
- Quando: Feedback de usuarios

### 9. Preview do PDF
- Motivo: Download direto e suficiente
- Quando: Se usuarios solicitarem

### 10. Exportacao em Outros Formatos
- Motivo: PDF e o formato padrao solicitado
- Quando: Se houver demanda

## Casos de Uso MVP

### UC1: Gerar Relatorio Basico
```
Ator: Engenheiro de obra
Pre-condicao: Container rodando, fotos com GPS

1. Usuario abre frontend no navegador
2. Usuario preenche titulo, obra e responsavel
3. Usuario arrasta fotos para zona de drop
4. Sistema extrai EXIF e exibe metadados
5. Usuario edita legendas de cada foto
6. Usuario clica "Gerar Relatorio PDF"
7. Sistema gera PDF e inicia download
```

### UC2: Processar Fotos sem GPS
```
Ator: Engenheiro de obra
Pre-condicao: Container rodando, fotos sem GPS

1. Usuario abre frontend
2. Usuario arrasta fotos sem metadados GPS
3. Sistema exibe "-" para coordenadas
4. Sistema nao gera mini-mapa
5. Usuario edita legendas normalmente
6. Usuario gera PDF (sem mapas)
```

### UC3: Corrigir Legenda
```
Ator: Engenheiro de obra
Pre-condicao: Fotos ja carregadas

1. Usuario identifica legenda incorreta
2. Usuario edita textarea da foto
3. Sistema limita a 80 caracteres
4. Usuario gera novo PDF
```

## Tratamento de Erros MVP

| Cenario | Comportamento |
|---------|---------------|
| Foto sem EXIF | Exibe "-" nos campos ausentes |
| Foto sem GPS | Omite coordenadas e mini-mapa |
| Foto sem bussola | Omite direcao |
| Legenda longa | Trunca com "..." |
| Erro de API | Toast com mensagem de erro |
| Container parado | Mensagem de conexao recusada |
| Arquivo invalido | Rejeitado no upload |

## Metricas de Sucesso MVP

### Funcionalidade
- [ ] Upload de 10+ fotos funciona
- [ ] Extracao EXIF precisa (95% das fotos)
- [ ] Mini-mapa gerado para fotos com GPS
- [ ] PDF gerado com layout correto

### Performance
- [ ] Processamento < 3s por foto
- [ ] Geracao de PDF < 30s (10 fotos)
- [ ] Inicio do container < 30s

### Usabilidade
- [ ] Zero erros no console do browser
- [ ] Interface responsiva
- [ ] Mensagens de erro claras

## Restricoes Tecnicas MVP

### Ambiente
- Docker Desktop instalado
- Rede coletor_default existente
- PostgreSQL com banco cosmic

### Limites
- Maximo 100 fotos por sessao
- Maximo 10MB por foto
- Legenda maxima 80 caracteres
- Timeout de 5 minutos para PDF

### Navegadores Suportados
- Chrome 90+
- Firefox 90+
- Edge 90+

## Cronograma MVP

### Fase 1: Setup (Concluido)
- [x] Estrutura de diretorios
- [x] README.md
- [x] Docker config

### Fase 2: Backend Core (Concluido)
- [x] requirements.txt
- [x] exif_extractor.py
- [x] overlay_generator.py
- [x] map_generator.py
- [x] pdf_generator.py

### Fase 3: API (Concluido)
- [x] processor.py (FastAPI)

### Fase 4: Database (Concluido)
- [x] create-tables.sql

### Fase 5: Frontend (Concluido)
- [x] index.html

### Fase 6: Documentacao (Em Andamento)
- [x] SKILL.md
- [x] arquitetura.md
- [x] escopo-mvp.md
- [ ] Task files

### Fase 7: Integracao (Pendente)
- [ ] Build Docker
- [ ] Criar tabelas
- [ ] Testes E2E

## Proximos Passos Pos-MVP

### Sprint 2: Estabilizacao
1. Testes automatizados basicos
2. Correcao de bugs encontrados
3. Melhorias de UX baseadas em feedback

### Sprint 3: Integracao n8n
1. Workflow de processamento automatico
2. Trigger via webhook
3. Notificacoes de conclusao

### Sprint 4: IA para Legendas
1. Integracao com Claude/GPT
2. Geracao automatica de legendas
3. Sugestoes contextuais

### Sprint 5: Multi-Tenancy
1. Autenticacao JWT
2. Separacao por usuario/obra
3. Historico de relatorios

## Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Cairo/WeasyPrint falha no build | Media | Alto | Docker multi-stage, testes de build |
| Fotos sem EXIF sao maioria | Media | Medio | UI clara para adicao manual |
| Performance em PDFs grandes | Baixa | Medio | Limite de fotos, processamento async |
| OpenStreetMap rate limit | Baixa | Baixo | Cache de tiles, fallback sem mapa |

## Criterios de Aceitacao Final

O MVP sera considerado completo quando:

1. Container inicia sem erros
2. /health retorna status OK
3. Upload de foto extrai EXIF corretamente
4. Mini-mapa gerado para fotos com GPS
5. Overlay aplicado com todas informacoes
6. PDF gerado com layout 2x3
7. Frontend funciona sem erros de console
8. Tabelas SQL criadas no banco cosmic
9. Documentacao completa
