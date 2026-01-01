# Referências: SoloCator Overlay

## Fotos de Exemplo (Projeto Sinergisa)

As fotos abaixo foram copiadas do projeto Sinergisa e servem como referência do tipo de overlay que queremos no sistema PHOTO-REPORT.

**Localização:** `E:\Projetos\PHOTO-REPORT\referencias\`

**Fotos incluídas:**
1. `foto-exemplo-1.jpg` - Cômodo Entrada
2. `foto-exemplo-2.jpg` - Banheiro Cômodo Entrada
3. `foto-exemplo-3.jpg` - Acesso ao Cômodo Entrada

---

## Análise do Overlay Desejado

### Características do SoloCator (Inspiração)

#### Layout Visual:
- **Posição:** Barra inferior da foto
- **Altura:** ~100-120px
- **Cor de fundo:** Preto semi-transparente (RGB: 0,0,0 com alpha ~200/255 = 78% opaco)
- **Margem interna:** ~15px

#### Campos Exibidos (de cima para baixo):

**1. Data e Hora** 📅
```
Formato: DD/MM/YYYY HH:MM
Exemplo: 14/12/2025 08:11
Ícone: 📅
Cor: Branco
Tamanho fonte: 14-16px
```

**2. Coordenadas GPS** 📍
```
Formato: Latitude, Longitude (decimal)
Exemplo: -20.458611, -54.619722
Ícone: 📍
Cor: Branco
Tamanho fonte: 14px
Precisão: 6 casas decimais
```

**3. Direção da Bússola** 🧭
```
Formato: Cardeal (Graus)
Exemplo: NE (45°)
Opções cardeal: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW
Ícone: 🧭
Cor: Branco
Tamanho fonte: 14px
```

**4. Project Name** 📝
```
Campo editável pelo usuário
Exemplo: "Vistoria Sinergisa - Sede"
Ícone: 📝 (ou nenhum)
Cor: Amarelo (destaque)
Tamanho fonte: 16px (maior para destaque)
Limite: ~80 caracteres
```

**5. Photo Description** 📝
```
Campo editável pelo usuário
Exemplo: "Vista frontal do cômodo de entrada"
Cor: Amarelo
Tamanho fonte: 14px
Limite: ~100 caracteres
```

**6. Notes (Opcional)** 📝
```
Campo editável pelo usuário
Exemplo: "Observar acabamento das paredes"
Cor: Branco/Cinza claro
Tamanho fonte: 12px
Limite: ~150 caracteres
```

---

## Funcionalidades Essenciais

### 1. Duas Versões SEMPRE
- ✅ **Original:** Foto sem modificação (backup permanente)
- ✅ **Com Máscara:** Foto + overlay aplicado

### 2. Edição de Campos
- ✅ Campos editáveis ANTES de aplicar overlay
- ✅ Interface mobile para edição rápida
- ✅ Interface web para edição em lote (big picture)

### 3. Mini-Mapa (Opcional)
- Posição: Canto superior direito
- Tamanho: ~150x150px
- Borda branca: 3px
- Margem da borda: 10px
- Marker vermelho na localização
- Seta azul indicando direção da bússola

---

## Padrões do Backend Existente

O backend Python em `E:\Projetos\PHOTO-REPORT\backend\src\python\overlay_generator.py` já implementa:

```python
# Configurações atuais
ALTURA_BARRA = 100
COR_FUNDO = (0, 0, 0, 200)  # RGBA
COR_TEXTO = "white"
COR_LEGENDA = "yellow"
MARGEM = 15
TAMANHO_FONTE_NORMAL = 14
TAMANHO_FONTE_LEGENDA = 16
```

**Ícones usados:**
- 📅 Data/hora
- 📍 GPS
- 🧭 Bússola
- 📝 Legendas

**Fontes disponíveis:**
```python
Prioridade:
1. DejaVuSans.ttf (Linux)
2. Arial.ttf (Windows)
3. Fallback: fonte padrão Pillow
```

---

## Exemplos de Uso

### Cenário 1: Engenheiro em Campo
```
1. Abre app mobile
2. Tira foto do ambiente
3. GPS capturado automaticamente
4. Preenche:
   - Project: "Vistoria Obra XPTO"
   - Description: "Fachada principal"
   - Notes: "Verificar infiltração"
5. Salva → gera 2 versões (original + máscara)
6. Sync com Google Drive quando online
```

### Cenário 2: Engenheiro no Escritório
```
1. Acessa interface web
2. Visualiza fotos sincronizadas do Drive
3. Modo "Big Picture" - vê todas as fotos
4. Edita legendas vendo contexto completo
5. Reordena fotos (drag-and-drop)
6. Adiciona mini-mapas sob demanda
7. Gera PDF final com fotos selecionadas
```

---

## Comparação com SoloCator

| Funcionalidade | SoloCator | PHOTO-REPORT (planejado) |
|----------------|-----------|--------------------------|
| 2 versões (original + overlay) | ✅ | ✅ |
| GPS + Bússola automático | ✅ | ✅ |
| Campos editáveis | ✅ | ✅ |
| Offline-first | ✅ | ✅ |
| Google Drive sync | ✅ | ✅ |
| Edição contextual (big picture) | ❌ | ✅ |
| Geração de PDF | ❌ | ✅ |
| Interface web (desktop) | ❌ | ✅ |
| Mini-mapas interativos | ⚠️ Limitado | ✅ |
| Export KML/KMZ | ✅ | 🔜 Futuro |

---

## Notas Técnicas

### Extração de EXIF
Backend já suporta via `exif_extractor.py`:
- ✅ datetime_original
- ✅ gps_latitude / gps_longitude
- ✅ gps_img_direction (bússola)
- ✅ Conversão DMS → Decimal
- ✅ Conversão Graus → Cardeal

### Geração de Overlay
Backend já suporta via `overlay_generator.py`:
- ✅ Barra semi-transparente
- ✅ Emojis nativos
- ✅ Texto com anti-aliasing
- ✅ Truncamento de legendas longas
- ✅ Suporte a mini-mapa

### Geração de Mini-Mapas
Backend já suporta via `map_generator.py`:
- ✅ OpenStreetMap (gratuito)
- ✅ Marker na posição
- ✅ Seta de direção (se bússola disponível)
- ✅ Tamanho configurável

---

## Requisitos Específicos do Mobile

### Captura de Foto
- ✅ Usar `expo-camera`
- ✅ GPS via `expo-location`
- ✅ Bússola via `expo-sensors` (Magnetometer + DeviceMotion)
- ✅ Permissões: CAMERA, ACCESS_FINE_LOCATION

### Armazenamento Offline
- ✅ AsyncStorage para metadados
- ✅ expo-file-system para fotos
- ✅ Queue de sync (quando offline)
- ✅ Indicador visual de "pendente sync"

### Estrutura de Pastas Local
```
FileSystem.documentDirectory/
├── originais/
│   └── foto-{uuid}.jpg
├── com_mascara/
│   └── foto-{uuid}.jpg
└── metadados.json
```

---

## Requisitos Específicos da Web

### Grid de Fotos
- ✅ Cards responsivos
- ✅ Thumbnail + mini-mapa
- ✅ Metadados visíveis
- ✅ Status visual (original/máscara/validada)

### Edição Inline
- ✅ Textarea para legendas
- ✅ Auto-save (debounced)
- ✅ Indicador de "não salvo"

### Drag-and-Drop
- ✅ Biblioteca: `dnd-kit`
- ✅ Reordenar fotos visualmente
- ✅ Persistir ordem em metadados.json

---

**Data de criação:** 2025-12-31
**Projeto:** PHOTO-REPORT
**Origem das fotos:** E:\Sinergisa (Projeto Sinergisa - Vistoria Sede)
