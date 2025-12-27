# 🎨 Melhorar Máscara/Overlay

**Prioridade:** 🔥 ALTA
**Status:** 📋 Planejado
**Branch:** `007-templates-de-overlay-customiz-veis`
**Criado em:** 2025-12-27

---

## 📝 Descrição

Redesenhar o overlay de metadados nas fotos para um visual mais elegante, profissional e informativo, alinhado com a identidade visual LLD Engenharia.

---

## 🎯 Objetivos

- [ ] Design visual mais elegante (gradientes, sombras, ícones)
- [ ] Fonte profissional e legível
- [ ] Layout em 2 seções (superior e inferior)
- [ ] Ícones SVG para cada tipo de metadado
- [ ] Logo LLD Engenharia
- [ ] Background semi-transparente
- [ ] Templates pré-definidos (Simples, Completo, Minimalista)
- [ ] Customização via API (cores, tamanho de fonte, posição)

---

## 🎨 Design Proposto

### Layout 2 Seções

**Seção Superior (topo da foto):**
```
┌──────────────────────────────────────────────┐
│  📅 26/12/2025 às 14:30    [Logo LLD]        │
│  ⏰ Quinta-feira                              │
└──────────────────────────────────────────────┘
```

**Seção Inferior (rodapé da foto):**
```
┌──────────────────────────────────────────────┐
│  📍 GPS: -23.5505, -46.6333                  │
│  🧭 Direção: Norte (0°)                      │
│  📏 Altitude: 760m                           │
│  ────────────────────────────────────        │
│  💬 Vista frontal do canteiro de obras       │
└──────────────────────────────────────────────┘
```

### Estilo Visual

**Cores:**
- Background: Gradiente preto semi-transparente
  - Superior: `rgba(15, 31, 53, 0.85)` → `rgba(15, 31, 53, 0)`
  - Inferior: `rgba(15, 31, 53, 0)` → `rgba(15, 31, 53, 0.85)`
- Texto primário: `#FFFFFF`
- Texto secundário: `#D4A574` (gold LLD)
- Divisor: `#D4A574` (linha dourada)

**Tipografia:**
- Fonte principal: **Roboto** ou **Open Sans** (bold para labels)
- Tamanho: 14-18px (ajustável)
- Sombra: `text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8)`

**Ícones:**
- Usar Font Awesome ou Material Icons (SVG)
- Tamanho: 16x16px
- Cor: `#D4A574`

---

## 🛠️ Implementação Técnica

### Backend (Python + Pillow)

**Arquivo:** `src/services/overlay_service.py`

```python
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from dataclasses import dataclass
from typing import Optional

@dataclass
class OverlayConfig:
    template: str = 'completo'  # simples | completo | minimalista
    font_size: int = 16
    position: str = 'top_bottom'  # top | bottom | top_bottom
    show_logo: bool = True
    show_altitude: bool = True
    show_compass: bool = True
    text_color: str = '#FFFFFF'
    accent_color: str = '#D4A574'
    bg_opacity: float = 0.85

def criar_overlay_moderno(
    imagem: Image.Image,
    metadados: dict,
    config: OverlayConfig = OverlayConfig()
) -> Image.Image:
    """
    Cria overlay moderno com gradientes, ícones e layout profissional
    """

    draw = ImageDraw.Draw(imagem, 'RGBA')
    width, height = imagem.size

    # Carregar fontes
    font_bold = ImageFont.truetype('fonts/Roboto-Bold.ttf', config.font_size)
    font_regular = ImageFont.truetype('fonts/Roboto-Regular.ttf', config.font_size - 2)

    # Seção Superior (se habilitado)
    if config.position in ['top', 'top_bottom']:
        _draw_section_superior(draw, width, metadados, font_bold, config)

    # Seção Inferior (se habilitado)
    if config.position in ['bottom', 'top_bottom']:
        _draw_section_inferior(draw, width, height, metadados, font_regular, config)

    # Logo LLD (se habilitado)
    if config.show_logo:
        _draw_logo(imagem, width, config)

    return imagem

def _draw_section_superior(draw, width, metadados, font, config):
    """Desenha seção superior com data/hora"""

    # Background com gradiente
    altura_secao = 80
    for y in range(altura_secao):
        opacity = int(255 * config.bg_opacity * (1 - y / altura_secao))
        color = (*hex_to_rgb('#0F1F35'), opacity)
        draw.rectangle([(0, y), (width, y+1)], fill=color)

    # Texto data/hora
    data_hora = metadados.get('data_hora_formatada', 'Sem data')
    draw.text((20, 15), f"📅 {data_hora}", font=font, fill=config.text_color)

def _draw_section_inferior(draw, width, height, metadados, font, config):
    """Desenha seção inferior com GPS, direção, legenda"""

    altura_secao = 120
    y_start = height - altura_secao

    # Background com gradiente invertido
    for y in range(altura_secao):
        opacity = int(255 * config.bg_opacity * (y / altura_secao))
        color = (*hex_to_rgb('#0F1F35'), opacity)
        draw.rectangle([(0, y_start + y), (width, y_start + y + 1)], fill=color)

    # GPS
    gps_string = metadados.get('gps_string', 'GPS não disponível')
    draw.text((20, y_start + 10), f"📍 {gps_string}", font=font, fill=config.text_color)

    # Direção
    if config.show_compass:
        direcao = metadados.get('direcao_cardeal', '-')
        draw.text((20, y_start + 35), f"🧭 Direção: {direcao}", font=font, fill=config.text_color)

    # Altitude
    if config.show_altitude and metadados.get('altitude'):
        altitude = metadados['altitude']
        draw.text((20, y_start + 60), f"📏 Altitude: {altitude}m", font=font, fill=config.accent_color)

    # Divisor
    draw.line([(20, y_start + 85), (width - 20, y_start + 85)],
              fill=config.accent_color, width=2)

    # Legenda (se houver)
    legenda = metadados.get('legenda', '')
    if legenda:
        draw.text((20, y_start + 95), f"💬 {legenda}", font=font, fill='#FFFFFF')

def _draw_logo(imagem: Image.Image, width: int, config: OverlayConfig):
    """Adiciona logo LLD no canto superior direito"""

    logo = Image.open('assets/logo-lld.png').convert('RGBA')
    logo.thumbnail((80, 40), Image.Resampling.LANCZOS)

    # Posicionar no canto superior direito
    x_pos = width - logo.width - 20
    y_pos = 15

    imagem.paste(logo, (x_pos, y_pos), logo)
```

---

## 🎨 Templates Pré-definidos

### 1. Template "Simples"
- Apenas data/hora no topo
- GPS no rodapé
- Sem ícones elaborados
- Sem logo

### 2. Template "Completo" (Padrão)
- Data/hora + logo no topo
- GPS + direção + altitude + legenda no rodapé
- Ícones coloridos
- Divisor dourado

### 3. Template "Minimalista"
- Data/hora centralizado no topo (fonte pequena)
- GPS centralizado no rodapé
- Sem ícones
- Background mais transparente (0.6)

---

## 🔧 API Endpoints

### POST /aplicar-mascara
**Request atualizado:**
```json
{
  "imagem_base64": "...",
  "data_hora": "26/12/2025 14:30",
  "gps_string": "-23.5505, -46.6333",
  "direcao_cardeal": "Norte",
  "legenda": "Vista frontal do canteiro",
  "altitude": 760,
  "incluir_minimapa": true,

  // NOVO: Configurações de overlay
  "overlay_config": {
    "template": "completo",
    "font_size": 16,
    "position": "top_bottom",
    "show_logo": true,
    "show_altitude": true,
    "show_compass": true,
    "text_color": "#FFFFFF",
    "accent_color": "#D4A574",
    "bg_opacity": 0.85
  }
}
```

---

## 📦 Assets Necessários

- [ ] Baixar fontes Roboto (Bold, Regular)
- [ ] Criar logo LLD em PNG transparente (200x100px)
- [ ] Ícones SVG:
  - 📅 Calendário
  - ⏰ Relógio
  - 📍 Pin de localização
  - 🧭 Rosa dos ventos
  - 📏 Régua (altitude)
  - 💬 Balão de fala (legenda)

**Fontes:**
- Google Fonts: https://fonts.google.com/specimen/Roboto
- Font Awesome Icons: https://fontawesome.com/icons
- Material Icons: https://fonts.google.com/icons

---

## 🧪 Testes

- [ ] Testar com fotos de diferentes tamanhos (pequenas, médias, grandes)
- [ ] Verificar legibilidade em fotos claras e escuras
- [ ] Testar cada template (simples, completo, minimalista)
- [ ] Validar posicionamento do logo
- [ ] Checar que gradiente não cobre detalhes importantes da foto

---

## ✅ Critérios de Aceitação

- [ ] Overlay visualmente mais elegante que a versão atual
- [ ] Texto legível em qualquer tipo de foto (claro/escuro)
- [ ] Logo LLD aparece no canto superior direito
- [ ] Gradiente suave não interfere na visualização da foto
- [ ] Ícones coloridos e bem alinhados
- [ ] 3 templates funcionais (simples, completo, minimalista)
- [ ] API aceita configurações customizadas de overlay
- [ ] Performance: processar overlay em < 500ms por foto

---

## 🔗 Referências

- **Branch:** `.worktrees/007-templates-de-overlay-customiz-veis/`
- **TODO Principal:** `../TODO.md`
- **Pillow Docs:** https://pillow.readthedocs.io/
- **Inspiração:** Relatórios fotográficos de construtoras profissionais

---

## 📅 Timeline Estimado

- **Fase 1 (Design + Assets):** 2-3 horas
  - Finalizar design visual
  - Baixar fontes e ícones
  - Criar logo LLD

- **Fase 2 (Backend):** 4-5 horas
  - Implementar `overlay_service.py`
  - Criar função de gradientes
  - Integrar ícones e logo
  - Testes com diferentes fotos

- **Fase 3 (API + Frontend):** 2-3 horas
  - Atualizar endpoint `/aplicar-mascara`
  - Frontend: UI para selecionar template
  - Integração completa

**Total estimado:** 8-11 horas

---

*Tarefa criada em: 2025-12-27*
