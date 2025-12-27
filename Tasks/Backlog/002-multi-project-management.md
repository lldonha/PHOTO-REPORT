# 🔀 Toggle de Projetos/Obras (Multi-Project Management)

**Status:** 🚀 QUEUE - Prioridade ALTA
**Branch:** `010-multi-project-obra-management` (já existe)
**Spec:** Spec-010 Multi-Project Management
**Estimate:** 1-2 dias
**Data Criação:** 2025-12-26

---

## 📋 Objetivo

Permitir que o usuário gerencie múltiplos projetos/obras simultaneamente, com persistência de fotos por projeto.

## 💡 Por Quê?

- ✅ Engenheiro trabalha em várias obras ao mesmo tempo
- ✅ Fotos de obras diferentes não devem se misturar
- ✅ Facilita organização e rastreabilidade
- ✅ Permite histórico por projeto

## 📌 Status Atual

- ✅ Branch `010-multi-project-obra-management` existe
- ✅ Testes implementados (commit 4b2cb87)
- ❓ Verificar se funcionalidade está completa

## ✅ Funcionalidades Necessárias

### 1. Backend - API Endpoints

**Criar em:** `.worktrees/010-multi-project-obra-management/src/python/processor.py`

```python
@app.get("/projetos")
async def listar_projetos():
    """Lista todos os projetos do usuário."""
    pass

@app.post("/projetos")
async def criar_projeto(request: CriarProjetoRequest):
    """Cria novo projeto."""
    # CriarProjetoRequest: nome, responsavel, data_inicio
    pass

@app.get("/projetos/{id}")
async def detalhes_projeto(id: str):
    """Detalhes de um projeto específico."""
    pass

@app.put("/projetos/{id}")
async def atualizar_projeto(id: str, request: AtualizarProjetoRequest):
    """Atualiza dados do projeto."""
    pass

@app.delete("/projetos/{id}")
async def deletar_projeto(id: str):
    """Deleta projeto (com confirmação)."""
    pass

@app.get("/projetos/{id}/fotos")
async def listar_fotos_projeto(id: str):
    """Lista fotos de um projeto."""
    pass
```

### 2. Frontend - UI de Navegação

**Criar em:** `.worktrees/010-multi-project-obra-management/src/frontend/index.html`

#### Dropdown no Header

```html
<div class="project-selector">
    <label>Obra Atual:</label>
    <select id="projectDropdown">
        <option value="">Selecione um projeto...</option>
        <option value="proj-1">Obra Centro - LLD Engenharia</option>
        <option value="proj-2">Residencial Park - 2025</option>
    </select>
    <button class="btn-icon" id="btnNewProject" title="Novo Projeto">➕</button>
</div>
```

#### Modal de Criar/Editar Projeto

```html
<div class="modal" id="projectModal">
    <div class="modal-content">
        <h2>Novo Projeto</h2>
        <form id="projectForm">
            <label>Nome da Obra:</label>
            <input type="text" id="projectName" required>

            <label>Responsável:</label>
            <input type="text" id="projectResponsavel">

            <label>Data de Início:</label>
            <input type="date" id="projectDate">

            <div class="modal-actions">
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" class="btn btn-secondary" id="btnCancelProject">Cancelar</button>
            </div>
        </form>
    </div>
</div>
```

### 3. Persistência de Dados

**Opções:**

**A) LocalStorage (MVP - Sem Backend)**
```javascript
// Salvar projeto atual
localStorage.setItem('currentProjectId', projectId);

// Salvar fotos por projeto
const projectPhotos = JSON.parse(localStorage.getItem(`project_${projectId}_photos`) || '[]');
projectPhotos.push(newPhoto);
localStorage.setItem(`project_${projectId}_photos`, JSON.stringify(projectPhotos));
```

**B) PostgreSQL (Ideal - Requer Spec-004)**
```sql
CREATE TABLE projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    responsavel VARCHAR(255),
    data_inicio DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE photo_items ADD COLUMN projeto_id UUID REFERENCES projetos(id);
```

### 4. UI/UX - Confirmações e Validações

- [ ] Confirmar antes de trocar projeto (se houver fotos não salvas)
- [ ] Breadcrumb mostrando projeto atual
- [ ] Badge com contador de fotos por projeto
- [ ] Confirmação antes de deletar projeto
- [ ] Migração de dados existentes para estrutura de projetos

### 5. Integração com Geração de PDF

**Atualizar:** Incluir nome do projeto no cabeçalho do PDF

```python
# Em pdf_generator.py
def gerar_pdf(fotos, titulo, obra, responsavel, projeto_nome=None):
    if projeto_nome:
        pdf.drawString(100, 750, f"Projeto: {projeto_nome}")
```

## ✅ Tarefas

### Sprint 1: Backend
- [ ] Verificar status da branch `010-multi-project-obra-management`
- [ ] Implementar endpoints de CRUD de projetos
- [ ] Decidir: LocalStorage ou PostgreSQL?
- [ ] Adicionar `projeto_id` nas rotas de fotos
- [ ] Testar endpoints com Postman/curl

### Sprint 2: Frontend
- [ ] Criar dropdown de seleção de projeto
- [ ] Criar modal de novo projeto
- [ ] Implementar troca de contexto (carregar fotos do projeto)
- [ ] Breadcrumb e indicadores visuais
- [ ] Confirmações de ações destrutivas

### Sprint 3: Integração
- [ ] Salvar/carregar fotos por projeto
- [ ] Sincronizar estado entre tabs (localStorage events)
- [ ] Migração de dados existentes
- [ ] Atualizar geração de PDF

### Sprint 4: Testes e QA
- [ ] Testar troca entre projetos
- [ ] Testar criação/edição/deleção de projetos
- [ ] Verificar edge cases (sem projetos, projeto vazio)
- [ ] Validar performance com muitos projetos

## 📚 Referências

- `.worktrees/010-multi-project-obra-management/` - Branch existente
- Commits: 4b2cb87, 6d9017f, b5de4ae
- TODO.md linha 9-43
- Spec-010 Multi-Project Management (se existir em `.auto-claude/`)

## 🔗 Dependências

- **Opcional:** Spec-004 PostgreSQL Persistence (se optar por banco de dados)
- **Recomendado:** Testar na branch antes de merge para master

## ⚠️ Notas Importantes

- Branch já tem commits e testes → **VERIFICAR SE JÁ ESTÁ FUNCIONAL**
- Se já estiver pronto, apenas fazer merge e documentar
- Decidir arquitetura de persistência (LocalStorage vs PostgreSQL)

---

*Última atualização: 2025-12-26*
*Branch: auto-claude/010-multi-project-obra-management*
