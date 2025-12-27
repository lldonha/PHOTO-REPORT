# 🗺️ Google Maps Satélite (Substituir OpenStreetMap)

**Status:** 🚀 QUEUE - Prioridade ALTA
**Branch:** `007-templates-de-overlay-customiz-veis` ou criar nova
**Estimate:** 2-3 horas
**Data Criação:** 2025-12-26

---

## 📋 Objetivo

Substituir OpenStreetMap por Google Maps Static API com camada de satélite nos mini-mapas do overlay.

## 💡 Por Quê?

- ✅ Imagens de satélite mais nítidas e atualizadas
- ✅ Visualização real do terreno (melhor para obras)
- ✅ Camadas: Satélite, Híbrido (satélite + ruas), Terreno
- ✅ Maior qualidade visual nos relatórios

## 📌 Status Atual

- ❌ Ainda usando OpenStreetMap (`map_generator.py:69`)
- ❌ Sem Google Maps API Key configurada
- ✅ Estrutura de código pronta para substituição

## ✅ Tarefas

### 1. Setup Google Cloud Platform
- [ ] Criar conta Google Cloud Platform (se não tiver)
- [ ] Ativar Google Maps Static API
- [ ] Gerar API Key
- [ ] Configurar restrições de segurança (domínio, IP)

### 2. Implementar no Código

**Arquivo:** `.worktrees/001-criar-sistema-photo-report-completo/src/python/map_generator.py`

- [ ] Adicionar variável de ambiente `GOOGLE_MAPS_API_KEY`
- [ ] Criar nova função `gerar_minimapa_google()`
- [ ] Implementar fallback para OpenStreetMap (se API Key não configurada)
- [ ] Configurar `maptype=satellite` ou `maptype=hybrid`
- [ ] Manter marcador vermelho e linha de direção

**Código de Referência:**
```python
def gerar_minimapa_google(
    latitude: float,
    longitude: float,
    direcao_graus: Optional[float] = None,
    tamanho: int = 300,
    zoom: int = 18,
    maptype: str = "satellite"
) -> Optional[bytes]:
    """
    Gera mini-mapa usando Google Maps Static API.

    Args:
        maptype: "satellite", "hybrid", "roadmap", "terrain"
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if not api_key:
        logger.warning("Google Maps API Key não configurada, usando OpenStreetMap")
        return gerar_minimapa(latitude, longitude, direcao_graus, tamanho, zoom)

    url = (
        f"https://maps.googleapis.com/maps/api/staticmap?"
        f"center={latitude},{longitude}&"
        f"zoom={zoom}&"
        f"size={tamanho}x{tamanho}&"
        f"maptype={maptype}&"
        f"markers=color:red%7C{latitude},{longitude}&"
        f"key={api_key}"
    )

    # Se tiver direção, adicionar path indicando direção
    if direcao_graus is not None:
        # Calcular ponto final da linha
        # path=color:0x0000ff|weight:3|lat1,lon1|lat2,lon2
        pass

    response = requests.get(url)
    if response.status_code == 200:
        return response.content
    else:
        logger.error(f"Erro Google Maps API: {response.status_code}")
        return gerar_minimapa(latitude, longitude, direcao_graus, tamanho, zoom)
```

### 3. Configurar Variável de Ambiente

**Arquivo:** `.worktrees/001-criar-sistema-photo-report-completo/src/docker/.env`

```bash
# Google Maps API Key
GOOGLE_MAPS_API_KEY=AIza...seu_key_aqui
```

**Arquivo:** `.worktrees/001-criar-sistema-photo-report-completo/src/docker/docker-compose.yml`

```yaml
services:
  photo-processor:
    environment:
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
```

### 4. Implementar Cache (Opcional mas Recomendado)

- [ ] Cache de mini-mapas em disco para evitar custos
- [ ] Hash baseado em `lat,lon,zoom,maptype`
- [ ] TTL de 30 dias

### 5. Testar

- [ ] Upload de foto com GPS
- [ ] Verificar mini-mapa gerado com satélite
- [ ] Comparar qualidade OpenStreetMap vs Google Maps
- [ ] Validar custo (primeiras 28.500 requisições/mês são grátis)

## 💰 Custo

- **Static Maps API:** $2 por 1.000 requisições
- **Grátis:** até 28.500 requisições/mês
- **Com cache:** custo quase zero!

## 📚 Referências

- [Google Maps Static API Docs](https://developers.google.com/maps/documentation/maps-static)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- Research/solocator-research.md
- TODO.md linha 98-131

## ⚠️ Decisões Pendentes

**AGUARDANDO DECISÃO DO USUÁRIO:**

- [ ] **Opção A:** Implementar agora (usuário fornecerá API Key depois)
- [ ] **Opção B:** Manter ambas opções (OpenStreetMap + Google Maps) configurável
- [ ] **Opção C:** Pular por enquanto e focar em outras tasks

---

*Última atualização: 2025-12-26*
*Baseado em: TODO.md e agent-workspace-template.md*
