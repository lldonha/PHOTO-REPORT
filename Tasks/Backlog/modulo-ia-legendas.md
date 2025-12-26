# Task: Modulo de IA para Geracao Automatica de Legendas

## Prioridade
Baixa (Pos-MVP)

## Status
Backlog

## Sprint Planejada
Sprint 4

## Descricao
Implementar um modulo de inteligencia artificial que analisa as fotos e gera sugestoes de legendas automaticamente, utilizando modelos de visao computacional (Claude Vision, GPT-4 Vision ou similar).

## Objetivo
Automatizar a criacao de legendas descritivas para fotos de obra, economizando tempo do engenheiro e padronizando as descricoes.

## Requisitos Funcionais

### RF01: Analise de Imagem
- Enviar imagem para API de visao computacional
- Receber descricao textual da imagem
- Contextualizar para ambiente de obra

### RF02: Sugestao de Legenda
- Exibir sugestao no textarea
- Permitir edicao pelo usuario
- Limitar a 80 caracteres

### RF03: Contextualizacao
- Usar prompt especifico para obras/construcao
- Identificar elementos: estrutura, equipamento, fase da obra
- Gerar descricao tecnica, nao artistica

### RF04: Interface
- Botao "Sugerir Legenda" por foto
- Botao "Sugerir Todas" para lote
- Indicador de loading durante processamento

## Requisitos Tecnicos

### Opcao A: Claude Vision (Anthropic)
```python
import anthropic

def sugerir_legenda(imagem_base64: str) -> str:
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=100,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": imagem_base64
                    }
                },
                {
                    "type": "text",
                    "text": "Descreva esta foto de obra em uma frase curta (max 80 caracteres). Foque em: fase da construcao, elementos visiveis, materiais. Seja tecnico e objetivo."
                }
            ]
        }]
    )
    return message.content[0].text[:80]
```

### Opcao B: GPT-4 Vision (OpenAI)
```python
from openai import OpenAI

def sugerir_legenda(imagem_base64: str) -> str:
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Descreva esta foto de obra em uma frase curta (max 80 caracteres)."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{imagem_base64}"}}
            ]
        }],
        max_tokens=100
    )
    return response.choices[0].message.content[:80]
```

## Endpoint da API

### POST /sugerir-legenda
```python
@app.post("/sugerir-legenda")
async def sugerir_legenda_endpoint(request: ImagemBase64Request):
    try:
        sugestao = sugerir_legenda(request.imagem_base64)
        return {"legenda": sugestao, "status": "ok"}
    except Exception as e:
        logger.error(f"Erro ao sugerir legenda: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

## Configuracao

### Variaveis de Ambiente
```yaml
# docker-compose.yml
environment:
  - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
  # OU
  - OPENAI_API_KEY=${OPENAI_API_KEY}
```

### Custos Estimados
- Claude Haiku: ~$0.00025 por imagem
- GPT-4 Vision: ~$0.01 por imagem
- Para 100 fotos: $0.025 (Haiku) ou $1.00 (GPT-4V)

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Custo alto em lotes grandes | Media | Medio | Usar Haiku, cache de resultados |
| Descricoes genericas | Media | Baixo | Prompt engineering, exemplos |
| Latencia alta | Baixa | Medio | Processamento em background |
| API indisponivel | Baixa | Alto | Fallback para legenda manual |

## Criterios de Aceitacao

- [ ] Sugestao gerada em menos de 5 segundos
- [ ] Legenda relevante para contexto de obra
- [ ] Limite de 80 caracteres respeitado
- [ ] Erro tratado graciosamente
- [ ] Custo por foto documentado

## Estimativa de Esforco
- Desenvolvimento: 2-3 dias
- Testes: 1 dia
- Documentacao: 0.5 dia
- **Total: 3-4 dias**

## Dependencias
- MVP concluido e validado
- API key do provedor escolhido
- Budget aprovado para uso da API

## Arquivos a Criar
- `src/python/ia_legendas.py`
- `src/python/prompts/legenda_obra.txt`

## Arquivos a Modificar
- `src/python/processor.py` (novo endpoint)
- `src/python/requirements.txt` (anthropic ou openai)
- `src/docker/docker-compose.yml` (env vars)
- `src/frontend/index.html` (botao sugerir)
