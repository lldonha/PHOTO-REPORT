# 🗄️ Persistência com PostgreSQL

**Status:** 💤 BACKLOG
**Branches:** `001-postgresql-persistence-layer`, `004-persist-ncia-real-no-postgresql`
**Priority:** Médio
**Estimate:** 3-5 dias
**Data Criação:** 2025-12-26

---

## 📋 Objetivo

Migrar armazenamento de dados de memória/LocalStorage para banco de dados PostgreSQL real.

## 💡 Por Quê?

- ✅ Persistência real entre sessões
- ✅ Compartilhamento de dados entre usuários
- ✅ Histórico completo de relatórios
- ✅ Queries complexas e relatórios
- ✅ Backup e recovery profissional

## 📌 Status Atual

- ❌ Dados apenas em memória (API) ou LocalStorage (frontend)
- ✅ Schema SQL já existe (`scripts/sql/create-tables.sql`)
- ✅ Container PostgreSQL "cosmic" já configurado

## ✅ Tarefas

### 1. Setup Database
- [ ] Verificar container PostgreSQL "cosmic"
- [ ] Executar `create-tables.sql`
- [ ] Criar usuário e permissões
- [ ] Testar conexão

### 2. ORM / Database Layer
- [ ] Escolher: SQLAlchemy vs Prisma vs Raw SQL
- [ ] Criar models (Projeto, Foto, Metadados)
- [ ] Implementar repository pattern
- [ ] Connection pooling

### 3. Migrations
- [ ] Setup Alembic para migrations
- [ ] Criar migration inicial
- [ ] Migração de dados existentes (se houver)

### 4. Atualizar API
- [ ] Substituir armazenamento em memória
- [ ] Implementar CRUD com database
- [ ] Transações e rollback
- [ ] Error handling específico de DB

### 5. Testes
- [ ] Unit tests com banco de teste
- [ ] Integration tests
- [ ] Performance tests (queries otimizadas)

---

**Referências:**
- `.worktrees/001-postgresql-persistence-layer/`
- `.worktrees/004-persist-ncia-real-no-postgresql/`
- TODO.md linha 203-218
