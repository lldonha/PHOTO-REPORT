# Task: Suporte a Multiplas Obras (Multi-Tenancy)

## Prioridade
Baixa (Pos-MVP)

## Status
Backlog

## Sprint Planejada
Sprint 5

## Descricao
Implementar suporte a multiplos usuarios e obras simultaneas, com autenticacao, separacao de dados e historico de relatorios.

## Objetivo
Permitir que multiplos engenheiros usem o sistema simultaneamente, cada um com suas obras e relatorios isolados.

## Requisitos Funcionais

### RF01: Autenticacao de Usuarios
- Login com email/senha
- Tokens JWT para sessoes
- Logout e expiracao de sessao

### RF02: Gerenciamento de Obras
- CRUD de obras por usuario
- Vinculacao de relatorios a obras
- Listagem de obras do usuario

### RF03: Historico de Relatorios
- Listagem de relatorios por obra
- Visualizacao de relatorio anterior
- Download de PDFs anteriores

### RF04: Separacao de Dados
- Cada usuario ve apenas seus dados
- Obras isoladas por usuario
- PDFs armazenados por usuario/obra

### RF05: Interface Atualizada
- Tela de login
- Seletor de obra
- Lista de relatorios anteriores

## Arquitetura Proposta

### Modelo de Dados Atualizado
```sql
-- Nova tabela de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP
);

-- Nova tabela de obras
CREATE TABLE obras (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    nome VARCHAR(255) NOT NULL,
    endereco TEXT,
    cliente VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ativa',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modificar photo_reports
ALTER TABLE photo_reports
ADD COLUMN user_id INTEGER REFERENCES users(id),
ADD COLUMN obra_id INTEGER REFERENCES obras(id);
```

### Autenticacao JWT
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
        return user_id
    except JWTError:
        raise HTTPException(status_code=401)
```

### Endpoints Novos

| Endpoint | Metodo | Descricao |
|----------|--------|-----------|
| `/auth/login` | POST | Autenticacao |
| `/auth/logout` | POST | Invalidar token |
| `/auth/me` | GET | Dados do usuario |
| `/obras` | GET | Listar obras |
| `/obras` | POST | Criar obra |
| `/obras/{id}` | GET | Detalhes da obra |
| `/obras/{id}/relatorios` | GET | Relatorios da obra |

## Interface Frontend

### Tela de Login
```html
<div class="login-container">
    <h2>PHOTO-REPORT</h2>
    <form id="loginForm">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Senha" required>
        <button type="submit">Entrar</button>
    </form>
</div>
```

### Seletor de Obra
```html
<div class="obra-selector">
    <label>Obra:</label>
    <select id="obraSelect">
        <option value="">Selecione uma obra</option>
        <!-- Populado via API -->
    </select>
    <button onclick="novaObra()">+ Nova Obra</button>
</div>
```

### Lista de Relatorios
```html
<div class="relatorios-anteriores">
    <h3>Relatorios Anteriores</h3>
    <div class="relatorio-grid">
        <!-- Cards de relatorios -->
    </div>
</div>
```

## Armazenamento de PDFs

### Estrutura de Diretorios
```
/storage/
  /users/
    /{user_id}/
      /obras/
        /{obra_id}/
          /relatorios/
            /2024-01-15_relatorio-vistoria.pdf
            /2024-01-20_relatorio-fundacao.pdf
```

### Upload para Cloud (Opcional)
```python
import boto3

def upload_to_s3(pdf_bytes: bytes, user_id: int, obra_id: int, filename: str):
    s3 = boto3.client('s3')
    key = f"users/{user_id}/obras/{obra_id}/relatorios/{filename}"
    s3.put_object(Bucket='photo-report-pdfs', Key=key, Body=pdf_bytes)
    return f"s3://photo-report-pdfs/{key}"
```

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Complexidade de auth | Alta | Alto | Usar biblioteca pronta (python-jose) |
| Migracao de dados | Media | Alto | Script de migracao, backup antes |
| Performance com muitos usuarios | Baixa | Medio | Indices, cache, paginacao |
| Seguranca de dados | Media | Alto | Testes de penetracao, auditoria |

## Criterios de Aceitacao

- [ ] Login funciona com email/senha
- [ ] Token JWT valido por 24h
- [ ] Usuario ve apenas suas obras
- [ ] CRUD de obras funcional
- [ ] Historico de relatorios por obra
- [ ] PDFs armazenados por usuario/obra
- [ ] Logout invalida sessao

## Estimativa de Esforco
- Banco de dados: 1 dia
- Backend auth: 2 dias
- Backend obras/relatorios: 2 dias
- Frontend login: 1 dia
- Frontend obras: 1 dia
- Frontend historico: 1 dia
- Testes: 2 dias
- **Total: 10 dias**

## Dependencias
- MVP concluido e validado
- Modulo IA (opcional, mas recomendado antes)
- Decisao sobre storage (local vs cloud)

## Arquivos a Criar
- `src/python/auth.py`
- `src/python/models/user.py`
- `src/python/models/obra.py`
- `src/frontend/login.html`
- `scripts/sql/migration-v2.sql`

## Arquivos a Modificar
- `src/python/processor.py` (novos endpoints)
- `src/python/requirements.txt` (python-jose, passlib)
- `src/docker/docker-compose.yml` (volumes para storage)
- `src/frontend/index.html` (seletor de obra, historico)
- `scripts/sql/create-tables.sql` (novas tabelas)

## Consideracoes de Seguranca

### Senhas
- Hash com bcrypt (passlib)
- Salt unico por usuario
- Minimo 8 caracteres

### Tokens
- JWT com expiracao
- Refresh token opcional
- Blacklist de tokens invalidados

### Dados
- Validacao de ownership em todas queries
- Prepared statements (psycopg2)
- Logs de acesso
