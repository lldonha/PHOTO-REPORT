# Task: Criar Tabelas SQL no Banco cosmic

## Prioridade
Alta

## Status
Queue

## Descricao
Executar o script SQL para criar as tabelas `photo_reports`, `photo_items`, indices e view `photo_reports_summary` no banco de dados PostgreSQL `cosmic`.

## Pre-requisitos
- PostgreSQL rodando e acessivel
- Banco `cosmic` existente
- Usuario `lucas` com permissoes de CREATE TABLE
- Script `scripts/sql/create-tables.sql` presente

## Passos

### 1. Conectar ao PostgreSQL
```bash
psql -U lucas -d cosmic
```

Ou via Docker (se PostgreSQL estiver em container):
```bash
docker exec -it pg psql -U lucas -d cosmic
```

### 2. Executar script SQL
```sql
\i E:/Projetos/PHOTO-REPORT/scripts/sql/create-tables.sql
```

Ou diretamente:
```bash
psql -U lucas -d cosmic -f scripts/sql/create-tables.sql
```

### 3. Verificar tabelas criadas
```sql
\dt photo*
```

### 4. Verificar view criada
```sql
\dv photo*
```

### 5. Verificar indices criados
```sql
\di idx_photo*
```

## Resultado Esperado

### Tabelas
```
             List of relations
 Schema |     Name      | Type  | Owner
--------+---------------+-------+-------
 public | photo_items   | table | lucas
 public | photo_reports | table | lucas
```

### View
```
                List of relations
 Schema |         Name          | Type | Owner
--------+-----------------------+------+-------
 public | photo_reports_summary | view | lucas
```

### Indices
```
                     List of relations
 Schema |           Name            | Type  | Owner | Table
--------+---------------------------+-------+-------+-------------
 public | idx_photo_items_report    | index | lucas | photo_items
 public | idx_photo_reports_status  | index | lucas | photo_reports
```

## Verificacao
- Tabela `photo_reports` com 9 colunas
- Tabela `photo_items` com 15 colunas
- View `photo_reports_summary` funcional
- Indices criados para performance

## Troubleshooting

### Erro: Tabela ja existe
Se executar novamente, as tabelas serao recriadas (DROP IF EXISTS).

### Erro: Permissao negada
```sql
GRANT ALL PRIVILEGES ON DATABASE cosmic TO lucas;
```

### Erro: Banco nao existe
```sql
CREATE DATABASE cosmic;
```

## Script SQL
O script `scripts/sql/create-tables.sql` inclui:

1. **photo_reports** - Sessoes/relatorios
   - id, titulo, obra, responsavel
   - status (rascunho/processando/concluido/erro)
   - datas (criacao, atualizacao, geracao_pdf)
   - pdf_path, observacoes

2. **photo_items** - Fotos individuais
   - id, report_id (FK)
   - nome_arquivo, ordem
   - data_hora, latitude, longitude
   - direcao_graus, direcao_cardeal
   - legenda (max 255 chars)
   - imagem_original_path, imagem_processada_path
   - thumbnail_base64, minimapa_base64
   - processado (boolean)

3. **photo_reports_summary** - View agregada
   - Contagem de fotos por relatorio
   - Contagem de fotos processadas

4. **Indices**
   - idx_photo_items_report (busca por relatorio)
   - idx_photo_reports_status (filtro por status)

## Arquivos Relacionados
- `scripts/sql/create-tables.sql`
- `Context/arquitetura.md` (diagrama do schema)

## Tempo Estimado
5 minutos

## Dependencias
001-container-python.md (opcional, mas recomendado ter container rodando)

## Proxima Task
003-frontend-upload.md
