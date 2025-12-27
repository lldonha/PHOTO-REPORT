# 🔀 Toggle de Projetos/Obras

**Prioridade:** 🔥 ALTA
**Status:** 📋 Planejado
**Branch:** `010-multi-project-obra-management`
**Criado em:** 2025-12-27

---

## 📝 Descrição

Implementar sistema de navegação entre múltiplos projetos/obras, permitindo que o usuário:
- Crie novos projetos
- Alterne entre projetos existentes
- Visualize fotos organizadas por projeto
- Gere relatórios específicos de cada obra

---

## 🎯 Objetivos

- [ ] Backend: API de CRUD de projetos
- [ ] Frontend: Dropdown de seleção de projetos
- [ ] Frontend: Modal para criar/editar projetos
- [ ] Persistência: Associar fotos a projetos
- [ ] UI/UX: Breadcrumb mostrando projeto atual
- [ ] Migração: Converter dados existentes para estrutura de projetos

---

## 🛠️ Endpoints API (Backend)

### GET /projetos
Lista todos os projetos do usuário

**Response:**
```json
{
  "projetos": [
    {
      "id": "uuid",
      "nome": "Edifício Alpha",
      "responsavel": "Eng. João Silva",
      "data_criacao": "2025-12-01",
      "num_fotos": 45
    }
  ]
}
```

### POST /projetos
Cria novo projeto

**Request:**
```json
{
  "nome": "Edifício Beta",
  "responsavel": "Eng. Maria Santos - CREA 12345",
  "descricao": "Obra residencial - 10 pavimentos"
}
```

### GET /projetos/{id}
Detalhes do projeto específico

### PUT /projetos/{id}
Atualiza projeto

### DELETE /projetos/{id}
Deleta projeto (e todas as fotos associadas)

### GET /projetos/{id}/fotos
Lista fotos do projeto específico

---

## 🎨 UI/UX (Frontend)

### Dropdown de Projetos
**Localização:** Header, ao lado do título "PHOTO-REPORT"

**Estrutura:**
```html
<select id="projetoSelector">
  <option value="novo">+ Novo Projeto</option>
  <option value="uuid1" selected>Edifício Alpha (45 fotos)</option>
  <option value="uuid2">Edifício Beta (12 fotos)</option>
</select>
```

### Modal de Criar/Editar Projeto
**Campos:**
- Nome do Projeto (obrigatório)
- Responsável Técnico (obrigatório)
- Descrição (opcional)

**Botões:**
- "Salvar"
- "Cancelar"

### Breadcrumb
**Localização:** Abaixo do header

**Exemplo:**
```
🏠 Início > 📁 Edifício Alpha > 📸 45 Fotos Carregadas
```

---

## 📦 Estrutura de Dados

### Modelo Backend (Python/FastAPI)
```python
class Projeto(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    responsavel: str
    descricao: Optional[str] = None
    data_criacao: datetime = Field(default_factory=datetime.now)
    fotos: List[Foto] = []
```

### Modelo Frontend (JavaScript)
```javascript
const projeto = {
  id: 'uuid',
  nome: 'Edifício Alpha',
  responsavel: 'Eng. João Silva',
  fotos: [...],
  createdAt: '2025-12-01T10:00:00Z'
}
```

---

## 🔄 Fluxo de Trabalho

1. **Usuário acessa o sistema**
   - Frontend carrega lista de projetos via `GET /projetos`
   - Seleciona último projeto usado (ou pergunta qual abrir)

2. **Usuário cria novo projeto**
   - Clica em "+ Novo Projeto" no dropdown
   - Preenche modal com dados
   - Frontend envia `POST /projetos`
   - Backend retorna projeto criado
   - Frontend troca para o novo projeto

3. **Usuário troca de projeto**
   - Seleciona projeto no dropdown
   - Frontend pergunta: "Deseja salvar fotos atuais?" (se houver mudanças)
   - Frontend carrega fotos do novo projeto via `GET /projetos/{id}/fotos`
   - UI atualiza mostrando fotos do projeto selecionado

4. **Usuário gera PDF**
   - PDF inclui nome do projeto no cabeçalho
   - Fotos vêm apenas do projeto atual

---

## 🚧 Desafios e Considerações

### Persistência
- **Opção 1:** LocalStorage (simples, mas limitado)
- **Opção 2:** PostgreSQL (robusto, requer migração)
- **Opção 3:** Híbrido (LocalStorage + sincronização opcional)

**Decisão:** Começar com LocalStorage + API em memória, depois migrar para PostgreSQL

### Migração de Dados
- Fotos existentes devem ser associadas a um projeto padrão "Projeto Sem Nome"
- Permitir que usuário reorganize fotos entre projetos depois

### Confirmações
- Ao trocar projeto: confirmar se quer salvar fotos não salvas
- Ao deletar projeto: confirmar e avisar que fotos serão perdidas

---

## ✅ Critérios de Aceitação

- [ ] Usuário pode criar novo projeto com nome e responsável
- [ ] Usuário pode listar todos os projetos
- [ ] Usuário pode alternar entre projetos via dropdown
- [ ] Fotos são filtradas por projeto selecionado
- [ ] PDF gerado contém nome do projeto no cabeçalho
- [ ] Ao trocar projeto, sistema confirma se quer salvar mudanças
- [ ] Breadcrumb mostra projeto atual
- [ ] Contador de fotos por projeto está correto

---

## 🔗 Referências

- **Branch:** `.worktrees/010-multi-project-obra-management/`
- **Spec:** Spec-010 Multi-Project Management
- **TODO Principal:** `../TODO.md`

---

## 📅 Timeline Estimado

- **Fase 1 (Backend):** 2-3 horas
  - API de projetos
  - Testes unitários

- **Fase 2 (Frontend):** 3-4 horas
  - Dropdown + modal
  - Integração com API
  - LocalStorage

- **Fase 3 (Polish):** 1-2 horas
  - Breadcrumb
  - Confirmações
  - Testes E2E

**Total estimado:** 6-9 horas

---

*Tarefa criada em: 2025-12-27*
