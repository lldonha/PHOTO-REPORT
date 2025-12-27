# 🔍 Pesquisa: Solocator - Inspirações para PHOTO-REPORT

**Data:** 2025-12-27
**Objetivo:** Analisar features do Solocator para melhorar nosso overlay/máscara

---

## 📱 O que é o Solocator?

**Solocator** é um app GPS Field Camera para trabalho de campo, usado por indústrias, agências governamentais e profissionais em todo o mundo para documentação fotográfica.

- **Plataformas:** iOS e Android
- **Site oficial:** https://solocator.com/
- **Google Play:** https://play.google.com/store/apps/details?id=com.solocator
- **App Store:** https://apps.apple.com/app/solocator-gps-field-camera/id582584117

**Histórico:** Desenvolvido por um profissional com 30 anos de experiência na indústria de construção civil.

---

## ✨ Features Principais

### 1. **Overlay/Máscara Automática**

O Solocator stampa automaticamente nas fotos:
- ✅ **Localização GPS** (Latitude & Longitude em vários formatos)
- ✅ **Acurácia GPS** (± metros)
- ✅ **Direção da Bússola** - bearing (Norte Verdadeiro/Magnético)
- ✅ **Altitude**
- ✅ **Data e Hora** (timestamp)

**Modos de Overlay:**
- **GPS Mode:** Barra de informações GPS no topo
- **Street Mode:** Endereço da rua sobreposto
  - Atualiza automaticamente conforme você se move
  - Configurável: intervalo de distância para atualização
- **Compass Mode:** Direção da bússola
- **Building Mode:** Informações de edifícios
- **Flexibilidade:** Pode desligar modos para mostrar mais da imagem

### 2. **Industry Pack (In-App Purchase)**

Funcionalidades profissionais:
- ✅ **Nome do Projeto**
- ✅ **Descrição da Foto**
- ✅ **Nome da Empresa ou Usuário**
- ✅ **Notas de Campo** editáveis

### 3. **Exportação de Dados**

Formatos de exportação:
- ✅ **KML/KMZ** (Google Earth)
- ✅ **CSV** (Excel)
- ✅ **Email** com fotos e dados

**Organização:**
- Salva fotos em subpastas por data
- Salva fotos em subpastas por nome do projeto (automático)

### 4. **Workflow Profissional**

- ✅ Captura dados de campo consistentemente (funcionários + contratados)
- ✅ Comprime workflow e minimiza trabalho pós-campo no escritório
- ✅ Documentação e verificação para projetos (construção, surveys ambientais, etc.)

---

## 🎨 Exemplos de Overlay do Solocator

### Overlay Completo (GPS + Compass + Street)
```
┌──────────────────────────────────────────┐
│ 📍 -23.5505° S, 46.6333° W (±5m)        │ <- GPS + Acurácia
│ 🧭 N 45° (True North)                    │ <- Bússola
│ 📏 Altitude: 760m                        │ <- Altitude
│ 📅 27 Dec 2025, 09:45 AM                │ <- Timestamp
│ 🏠 Rua Augusta, 123 - São Paulo/SP      │ <- Endereço
└──────────────────────────────────────────┘
```

### Overlay Minimalista (GPS Only)
```
┌──────────────────────────────────────────┐
│ -23.5505, -46.6333 | 27/12/2025 09:45   │
└──────────────────────────────────────────┘
```

---

## 💡 O que o PHOTO-REPORT pode melhorar inspirado no Solocator

### ✅ Features que já temos
- ✅ GPS (Latitude/Longitude)
- ✅ Direção (Norte/Sul/Leste/Oeste)
- ✅ Data/Hora
- ✅ Legenda editável

### 🚀 Features que podemos adicionar

#### 1. **Acurácia GPS**
- Mostrar `± X metros` ao lado das coordenadas
- Útil para saber a precisão da localização

#### 2. **Altitude**
- Já vem nos dados EXIF
- Adicionar ao overlay: `📏 Altitude: 760m`

#### 3. **Endereço via Reverse Geocoding**
- Converter GPS → Endereço (Rua, Número, Bairro, Cidade)
- API: Google Maps Geocoding API
- Exibir: `🏠 Rua Augusta, 123 - São Paulo/SP`

#### 4. **Modos de Overlay Configuráveis**
Permitir usuário escolher:
- **Modo Completo:** GPS + Endereço + Altitude + Direção + Data
- **Modo GPS:** Apenas coordenadas + data
- **Modo Simples:** Data + Localização resumida
- **Modo Customizado:** Usuário escolhe quais campos exibir

#### 5. **Norte Verdadeiro vs Magnético**
- Mostrar `N 45° (True)` ou `N 48° (Magnetic)`
- Converter entre os dois

#### 6. **Acurácia Visual**
- Ícone ou cor indicando qualidade do GPS:
  - 🟢 Verde: ±0-5m (excelente)
  - 🟡 Amarelo: ±5-15m (bom)
  - 🔴 Vermelho: ±15m+ (ruim)

---

## 🗺️ Google Maps Satélite (Sugestão do usuário)

### Ideia: Substituir OpenStreetMap por Google Maps com camada satélite

**Vantagens:**
- ✅ Imagens de satélite mais nítidas
- ✅ Visualização real do terreno (melhor para obras)
- ✅ Atualização mais frequente
- ✅ Camadas: Satélite, Híbrido (satélite + ruas), Terreno

**Implementação:**
```python
# Usar Google Maps Static API com maptype=satellite
url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lon}&zoom=18&size=300x200&maptype=satellite&markers=color:red%7C{lat},{lon}&key={API_KEY}"
```

**API Necessária:**
- Google Maps Static API
- Google Maps Geocoding API (para endereço)

**Custo:**
- Static Maps: $2 por 1000 requisições (grátis até 28.500/mês)
- Geocoding: $5 por 1000 requisições (grátis até 40.000/mês)

**Comparação com OpenStreetMap:**
| Feature | OpenStreetMap | Google Maps |
|---------|---------------|-------------|
| Custo | Grátis | Grátis até limite |
| Qualidade de Imagem | Básico (desenho) | Satélite HD |
| Atualização | Lento | Rápido |
| Ideal para | Mapas genéricos | Obras/terrenos |

---

## 📊 Comparação: PHOTO-REPORT vs Solocator

| Feature | Solocator | PHOTO-REPORT (v1.0) | PHOTO-REPORT (Futuro) |
|---------|-----------|---------------------|----------------------|
| GPS Overlay | ✅ | ✅ | ✅ |
| Acurácia GPS | ✅ | ❌ | 🔜 Adicionar |
| Direção/Bússola | ✅ | ✅ | ✅ |
| Altitude | ✅ | ❌ | 🔜 Adicionar |
| Endereço (Geocoding) | ✅ | ❌ | 🔜 Adicionar |
| Timestamp | ✅ | ✅ | ✅ |
| Legenda customizada | ✅ | ✅ | ✅ |
| Modos de overlay | ✅ 4 modos | ❌ | 🔜 3 templates |
| Nome do Projeto | ✅ | ❌ | 🔜 Multi-projeto |
| Exportação KML/KMZ | ✅ | ❌ | 📋 Backlog |
| Exportação CSV | ✅ | ❌ | 📋 Backlog |
| Geração de PDF | ❌ | ✅ | ✅ |
| Mini-mapa | ❌ | ✅ OpenStreetMap | 🔜 Google Maps Satélite |
| Drag & Drop Reorder | ❌ | ✅ | ✅ |
| Undo/Redo | ❌ | ✅ | ✅ |
| Web App | ❌ Mobile only | ✅ | ✅ |
| Cloudflare Tunnel | ❌ | ✅ | ✅ |

---

## 🎯 Recomendações de Implementação

### Prioridade ALTA (Adicionar ao TODO)
1. ✅ **Altitude no overlay** (já está no EXIF)
2. ✅ **Acurácia GPS** (mostrar ± metros)
3. ✅ **Google Maps Satélite** ao invés de OpenStreetMap
4. ✅ **Reverse Geocoding** para endereço

### Prioridade MÉDIA (Backlog)
5. **Modos de overlay** (Completo, GPS, Simples)
6. **Norte Verdadeiro vs Magnético**
7. **Exportação KML/KMZ** (para Google Earth)
8. **Exportação CSV** (planilha de fotos)

### Prioridade BAIXA
9. **Indicador visual de qualidade GPS** (ícone verde/amarelo/vermelho)
10. **Atualização automática de endereço** (ao mover no mapa)

---

## 🔗 Referências

### Solocator
- **Website:** https://solocator.com/
- **Android Features:** https://solocator.com/android-features/
- **iOS Features:** https://solocator.com/ios-features/
- **FAQs:** https://solocator.com/frequently-asked-questions/
- **Google Play:** https://play.google.com/store/apps/details?id=com.solocator
- **App Store:** https://apps.apple.com/app/solocator-gps-field-camera/id582584117

### APIs para Implementar
- **Google Maps Static API:** https://developers.google.com/maps/documentation/maps-static
- **Google Maps Geocoding API:** https://developers.google.com/maps/documentation/geocoding
- **Google Maps Pricing:** https://mapsplatform.google.com/pricing/

### Inspiração
- **Rocketry Forum:** https://www.rocketryforum.com/threads/new-for-me-gps-compass-camera-app-solocator.193004/

---

## 📝 Notas

- Solocator é **mobile-only** (iOS/Android)
- PHOTO-REPORT é **web-based** (desktop + mobile via browser)
- Nossa vantagem: PDF profissional, multi-projetos, cloud-based
- Vantagem deles: App nativo, offline, exportação KML/CSV

**Conclusão:** Combinar o melhor dos dois mundos! 🚀

---

*Pesquisa realizada em: 2025-12-27*
*Fontes: Solocator.com, Google Play Store, Apple App Store*
