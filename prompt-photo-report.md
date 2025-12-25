# TAREFA: Criar Projeto PHOTO-REPORT

## Contexto
Sistema web para engenheiros gerarem relatórios fotográficos de obra. Upload em lote de fotos, extração automática de EXIF (data, GPS, bússola), overlay editável, e geração de PDF padronizado.

## Referências Pesquisadas (usar como base)
- **awasisto/exif_overlay** - Script Python CLI para overlay EXIF
- **copicseal/copicseal** - App Electron com templates visuais
- **Esri/field-maps-scripts** - Workflow Pillow + Cartopy + WeasyPrint para PDFs
- **py-staticmaps** - Mini mapas com OpenStreetMap (gratuito)
- Biblioteca `exif` do Python - API limpa, suporta `gps_img_direction`

## Estrutura Obrigatória

Criar em: `E:\Projetos\PHOTO-REPORT\`

```
PHOTO-REPORT/
├── .claude/
│   └── skills/
│       └── photo-processor/
│           ├── SKILL.md
│           └── references/
│               └── exif-cheatsheet.md
├── Context/
│   ├── arquitetura.md
│   └── escopo-mvp.md
├── Tasks/
│   ├── Backlog/
│   │   ├── modulo-ia-legendas.md
│   │   └── multi-obras.md
│   ├── Queue/
│   │   ├── 001-container-python.md
│   │   ├── 002-criar-tabelas-sql.md
│   │   └── 003-frontend-upload.md
│   ├── InProgress/
│   └── Done/
├── src/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── python/
│   │   ├── processor.py
│   │   ├── exif_extractor.py
│   │   ├── overlay_generator.py
│   │   ├── map_generator.py
│   │   ├── pdf_generator.py
│   │   └── requirements.txt
│   └── frontend/
│       └── index.html
├── workflows/
│   └── n8n/
├── scripts/
│   └── sql/
│       └── create-tables.sql
└── README.md
```

---

## CONTEÚDO DOS ARQUIVOS

### README.md

```markdown
# PHOTO-REPORT - Relatório Fotográfico de Obras

> Sistema para engenheiros gerarem relatórios fotográficos padronizados com máscaras automáticas

- **Dono:** Lucas (LLD Engenharia)
- **Stack:** n8n + Python (FastAPI) + PostgreSQL + HTML

## Arquitetura

```
Frontend (HTML) → n8n (Orquestrador) → Python Container → PostgreSQL
                                              ↓
                                     py-staticmaps (mapas)
                                     Pillow (overlay)
                                     WeasyPrint (PDF)
```

## Funcionalidades MVP

1. ✅ Upload em lote (até 100 fotos)
2. ✅ Extração automática: data/hora, GPS, direção bússola
3. ✅ Mini mapa com seta de direção
4. ✅ Overlay editável (legenda customizável)
5. ✅ Geração de PDF (6 fotos/página)

## Endpoints Python (porta 8002)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/processar-foto` | POST | Extrai EXIF e retorna metadados |
| `/aplicar-mascara` | POST | Gera overlay + mini mapa |
| `/gerar-pdf` | POST | Compila fotos em PDF |
| `/health` | GET | Status do container |

## Como Rodar

```bash
cd src/docker
docker-compose up -d
curl http://localhost:8002/health
```

## Banco de Dados

Usar banco `cosmic` existente (PostgreSQL), tabelas:
- `photo_reports` - Sessões/relatórios
- `photo_items` - Fotos individuais com EXIF + legenda

## Conexão PostgreSQL
- Host: host.docker.internal
- Port: 5432
- Database: cosmic
- User: lucas

---
*Projeto iniciado: Dezembro 2025*
*Referências: awasisto/exif_overlay, Esri/field-maps-scripts, py-staticmaps*
```

---

### .claude/skills/photo-processor/SKILL.md

```markdown
---
name: Photo Report Processor
description: |
  Use quando precisar processar fotos de obra, extrair EXIF, aplicar overlay
  ou gerar relatórios PDF. Também use para debugar problemas de extração
  de GPS, data/hora ou direção da bússola em fotos.
---

# Photo Report Processor

## Propósito
Processar fotos de obra com extração EXIF e geração de relatórios.

## Quando Usar
- "Processa essas fotos de obra"
- "Extrai GPS das fotos"
- "Gera relatório PDF"
- "A bússola não tá aparecendo"
- "Mini mapa não carrega"

## Stack Técnica

| Componente | Biblioteca |
|------------|------------|
| Extração EXIF | `exif` |
| Overlay | `Pillow` |
| Mini mapa | `py-staticmaps` |
| PDF | `WeasyPrint` |
| API | `FastAPI` |

## Campos EXIF Importantes

```python
# Data/hora
exif_data.datetime_original  # "2024:12:24 14:35:22"

# GPS
exif_data.gps_latitude       # (20, 27, 36.0)
exif_data.gps_latitude_ref   # "S"
exif_data.gps_longitude      # (54, 37, 12.0)
exif_data.gps_longitude_ref  # "W"

# Direção da bússola
exif_data.gps_img_direction      # 45.0 (graus)
exif_data.gps_img_direction_ref  # "T" (true north)
```

## Conversões

```python
def dms_para_decimal(dms, ref):
    graus, minutos, segundos = dms
    decimal = graus + minutos/60 + segundos/3600
    if ref in ['S', 'W']:
        decimal = -decimal
    return decimal

def graus_para_cardeal(graus):
    direcoes = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
                "S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return direcoes[int(graus / 22.5) % 16]
```

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| GPS vazio | Foto sem geotag | Verificar se GPS tava ligado |
| Bússola None | Campo não gravado | Nem todo celular grava |
| Data errada | Timezone | Converter pra local |

## Fontes
- awasisto/exif_overlay: https://github.com/awasisto/exif_overlay
- py-staticmaps: https://github.com/flopp/py-staticmaps
```

---

### src/python/requirements.txt

```
fastapi==0.100.0
uvicorn==0.23.0
pillow==10.0.0
exif==1.6.0
py-staticmaps==0.4.0
weasyprint==60.0
python-multipart==0.0.6
jinja2==3.1.2
```

---

### src/python/processor.py

```python
"""
PHOTO-REPORT - API de Processamento de Fotos
Container FastAPI para extração EXIF, overlay e geração de PDF
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import io
import base64
import logging

from exif_extractor import extrair_exif
from overlay_generator import aplicar_mascara
from map_generator import gerar_minimapa
from pdf_generator import gerar_pdf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Photo Report Processor",
    version="1.0.0",
    description="API para processamento de fotos de obra"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FotoMetadados(BaseModel):
    data_hora: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    direcao_graus: Optional[float] = None
    direcao_cardeal: Optional[str] = None

class FotoProcessada(BaseModel):
    metadados: FotoMetadados
    imagem_base64: Optional[str] = None
    minimapa_base64: Optional[str] = None

class MascaraRequest(BaseModel):
    imagem_base64: str
    metadados: FotoMetadados
    legenda: str

class PDFRequest(BaseModel):
    fotos: List[str]
    titulo: str = "Relatório Fotográfico"
    obra: str = ""
    responsavel: str = ""

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0", "service": "photo-processor"}

@app.post("/processar-foto", response_model=FotoProcessada)
async def processar_foto(file: UploadFile = File(...)):
    """Extrai EXIF da foto e retorna metadados + mini mapa"""
    try:
        logger.info(f"Processando foto: {file.filename}")
        conteudo = await file.read()
        metadados_dict = extrair_exif(conteudo)
        metadados = FotoMetadados(**metadados_dict)
        
        minimapa_b64 = None
        if metadados.latitude and metadados.longitude:
            try:
                minimapa = gerar_minimapa(
                    metadados.latitude, 
                    metadados.longitude,
                    metadados.direcao_graus
                )
                minimapa_b64 = base64.b64encode(minimapa).decode()
            except Exception as e:
                logger.warning(f"Erro ao gerar minimapa: {e}")
        
        return FotoProcessada(
            metadados=metadados,
            imagem_base64=base64.b64encode(conteudo).decode(),
            minimapa_base64=minimapa_b64
        )
    except Exception as e:
        logger.error(f"Erro ao processar foto: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/aplicar-mascara")
async def endpoint_aplicar_mascara(request: MascaraRequest):
    """Aplica overlay na foto com metadados e legenda"""
    try:
        logger.info(f"Aplicando máscara")
        img_bytes = base64.b64decode(request.imagem_base64)
        resultado = aplicar_mascara(img_bytes, request.metadados.dict(), request.legenda)
        return {"imagem_processada": base64.b64encode(resultado).decode()}
    except Exception as e:
        logger.error(f"Erro ao aplicar máscara: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gerar-pdf")
async def endpoint_gerar_pdf(request: PDFRequest):
    """Gera PDF com 6 fotos por página"""
    try:
        logger.info(f"Gerando PDF com {len(request.fotos)} fotos")
        pdf_bytes = gerar_pdf(
            fotos=[base64.b64decode(f) for f in request.fotos],
            titulo=request.titulo,
            obra=request.obra,
            responsavel=request.responsavel
        )
        return {"pdf_base64": base64.b64encode(pdf_bytes).decode()}
    except Exception as e:
        logger.error(f"Erro ao gerar PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
```

---

### src/python/exif_extractor.py

```python
"""Extração de metadados EXIF das fotos"""

from exif import Image as ExifImage
from datetime import datetime
from typing import Optional, Dict, Any
import io
import logging

logger = logging.getLogger(__name__)

def dms_para_decimal(dms, ref) -> Optional[float]:
    if not dms:
        return None
    try:
        graus, minutos, segundos = dms
        decimal = float(graus) + float(minutos)/60 + float(segundos)/3600
        if ref in ['S', 'W']:
            decimal = -decimal
        return round(decimal, 8)
    except Exception as e:
        logger.warning(f"Erro ao converter DMS: {e}")
        return None

def graus_para_cardeal(graus: Optional[float]) -> Optional[str]:
    if graus is None:
        return None
    direcoes = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
                "S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return direcoes[int(graus / 22.5) % 16]

def extrair_exif(imagem_bytes: bytes) -> Dict[str, Any]:
    resultado = {
        "data_hora": None,
        "latitude": None,
        "longitude": None,
        "direcao_graus": None,
        "direcao_cardeal": None
    }
    
    try:
        img = ExifImage(io.BytesIO(imagem_bytes))
        
        if hasattr(img, 'datetime_original'):
            try:
                dt = datetime.strptime(img.datetime_original, "%Y:%m:%d %H:%M:%S")
                resultado["data_hora"] = dt.strftime("%d/%m/%Y %H:%M")
            except:
                resultado["data_hora"] = str(img.datetime_original)
        
        if hasattr(img, 'gps_latitude') and hasattr(img, 'gps_latitude_ref'):
            resultado["latitude"] = dms_para_decimal(img.gps_latitude, img.gps_latitude_ref)
        
        if hasattr(img, 'gps_longitude') and hasattr(img, 'gps_longitude_ref'):
            resultado["longitude"] = dms_para_decimal(img.gps_longitude, img.gps_longitude_ref)
        
        if hasattr(img, 'gps_img_direction'):
            try:
                resultado["direcao_graus"] = float(img.gps_img_direction)
                resultado["direcao_cardeal"] = graus_para_cardeal(resultado["direcao_graus"])
            except:
                pass
        
        logger.info(f"EXIF extraído: {resultado}")
        return resultado
        
    except Exception as e:
        logger.error(f"Erro ao extrair EXIF: {e}")
        return resultado
```

---

### src/python/overlay_generator.py

```python
"""Geração de overlay/máscara nas fotos"""

from PIL import Image, ImageDraw, ImageFont
import io
import logging

logger = logging.getLogger(__name__)

def get_font(size: int = 14):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
    except:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            return ImageFont.load_default()

def aplicar_mascara(imagem_bytes: bytes, metadados: dict, legenda: str) -> bytes:
    try:
        img = Image.open(io.BytesIO(imagem_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        altura_barra = 100
        largura = img.width
        
        barra = Image.new('RGBA', (largura, altura_barra), (0, 0, 0, 200))
        draw = ImageDraw.Draw(barra)
        
        font_grande = get_font(16)
        font_normal = get_font(14)
        
        margem = 15
        y_atual = 10
        
        if metadados.get('data_hora'):
            draw.text((margem, y_atual), f"📅 {metadados['data_hora']}", fill="white", font=font_normal)
        
        y_atual += 22
        if metadados.get('latitude') and metadados.get('longitude'):
            coords = f"📍 {metadados['latitude']:.6f}, {metadados['longitude']:.6f}"
            draw.text((margem, y_atual), coords, fill="white", font=font_normal)
        
        y_atual += 22
        if metadados.get('direcao_cardeal'):
            direcao = f"🧭 {metadados['direcao_cardeal']}"
            if metadados.get('direcao_graus'):
                direcao += f" ({metadados['direcao_graus']:.0f}°)"
            draw.text((margem, y_atual), direcao, fill="white", font=font_normal)
        
        y_atual += 25
        if legenda:
            legenda_display = legenda[:80] + "..." if len(legenda) > 80 else legenda
            draw.text((margem, y_atual), legenda_display, fill="yellow", font=font_grande)
        
        resultado = Image.new('RGB', (img.width, img.height + altura_barra))
        resultado.paste(img, (0, 0))
        
        barra_rgb = Image.new('RGB', barra.size, (0, 0, 0))
        barra_rgb.paste(barra, mask=barra.split()[3])
        resultado.paste(barra_rgb, (0, img.height))
        
        buffer = io.BytesIO()
        resultado.save(buffer, format='JPEG', quality=90)
        return buffer.getvalue()
        
    except Exception as e:
        logger.error(f"Erro ao aplicar máscara: {e}")
        raise
```

---

### src/python/map_generator.py

```python
"""Geração de mini mapas estáticos com py-staticmaps"""

import staticmaps
import io
import math
import logging

logger = logging.getLogger(__name__)

def gerar_minimapa(lat: float, lon: float, direcao_graus: float = None, tamanho: int = 150) -> bytes:
    try:
        context = staticmaps.Context()
        context.set_tile_provider(staticmaps.tile_provider_OSM)
        
        location = staticmaps.create_latlng(lat, lon)
        marker = staticmaps.Marker(location, color=staticmaps.RED, size=12)
        context.add_object(marker)
        
        if direcao_graus is not None:
            distancia_km = 0.1
            rad = math.radians(direcao_graus)
            
            delta_lat = distancia_km / 111.0 * math.cos(rad)
            delta_lon = distancia_km / (111.0 * math.cos(math.radians(lat))) * math.sin(rad)
            
            end_lat = lat + delta_lat
            end_lon = lon + delta_lon
            
            line = staticmaps.Line(
                [location, staticmaps.create_latlng(end_lat, end_lon)],
                color=staticmaps.BLUE,
                width=3
            )
            context.add_object(line)
        
        image = context.render_cairo(tamanho, tamanho)
        
        buffer = io.BytesIO()
        image.write_to_png(buffer)
        return buffer.getvalue()
        
    except Exception as e:
        logger.error(f"Erro ao gerar minimapa: {e}")
        raise
```

---

### src/python/pdf_generator.py

```python
"""Geração de PDF com WeasyPrint"""

from weasyprint import HTML
from jinja2 import Template
import io
import base64
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

TEMPLATE_HTML = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page { size: A4; margin: 1.5cm; }
        body { font-family: Arial, sans-serif; font-size: 10pt; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16pt; }
        .header p { margin: 5px 0; color: #666; }
        .foto-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .foto-item { border: 1px solid #ddd; padding: 5px; break-inside: avoid; }
        .foto-item img { width: 100%; height: auto; }
        .page-break { page-break-after: always; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8pt; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ titulo }}</h1>
        {% if obra %}<p><strong>Obra:</strong> {{ obra }}</p>{% endif %}
        {% if responsavel %}<p><strong>Responsável:</strong> {{ responsavel }}</p>{% endif %}
        <p><strong>Data:</strong> {{ data_geracao }}</p>
    </div>
    <div class="foto-grid">
        {% for foto_b64 in fotos %}
        <div class="foto-item">
            <img src="data:image/jpeg;base64,{{ foto_b64 }}" />
        </div>
        {% if loop.index % 6 == 0 and not loop.last %}
        </div><div class="page-break"></div><div class="foto-grid">
        {% endif %}
        {% endfor %}
    </div>
    <div class="footer">Gerado por PHOTO-REPORT | {{ data_geracao }}</div>
</body>
</html>
"""

def gerar_pdf(fotos: list, titulo: str, obra: str, responsavel: str) -> bytes:
    try:
        fotos_b64 = [base64.b64encode(f).decode() for f in fotos]
        
        template = Template(TEMPLATE_HTML)
        html_content = template.render(
            titulo=titulo,
            obra=obra,
            responsavel=responsavel,
            fotos=fotos_b64,
            data_geracao=datetime.now().strftime("%d/%m/%Y %H:%M")
        )
        
        html = HTML(string=html_content)
        pdf_buffer = io.BytesIO()
        html.write_pdf(pdf_buffer)
        
        logger.info(f"PDF gerado com {len(fotos)} fotos")
        return pdf_buffer.getvalue()
        
    except Exception as e:
        logger.error(f"Erro ao gerar PDF: {e}")
        raise
```

---

### src/docker/Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libcairo2-dev \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

COPY python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY python/ .

EXPOSE 8002

CMD ["uvicorn", "processor:app", "--host", "0.0.0.0", "--port", "8002"]
```

---

### src/docker/docker-compose.yml

```yaml
version: '3.8'

services:
  photo-processor:
    build: .
    container_name: photo-processor
    ports:
      - "8002:8002"
    volumes:
      - ../python:/app
      - photo-cache:/app/cache
    environment:
      - PYTHONUNBUFFERED=1
    networks:
      - coletor_default
    restart: unless-stopped

volumes:
  photo-cache:

networks:
  coletor_default:
    external: true
```

---

### scripts/sql/create-tables.sql

```sql
-- PHOTO-REPORT - Schema do Banco
-- Usar no banco: cosmic

CREATE TABLE IF NOT EXISTS photo_reports (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL DEFAULT 'Relatório Fotográfico',
    obra VARCHAR(200),
    responsavel VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'rascunho',
    pdf_path VARCHAR(500),
    total_fotos INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS photo_items (
    id SERIAL PRIMARY KEY,
    report_id INT REFERENCES photo_reports(id) ON DELETE CASCADE,
    ordem INT NOT NULL DEFAULT 0,
    path_original VARCHAR(500),
    path_processada VARCHAR(500),
    filename_original VARCHAR(200),
    data_hora TIMESTAMP,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    direcao_graus DECIMAL(5,2),
    direcao_cardeal VARCHAR(3),
    legenda TEXT,
    incluir BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_items_report ON photo_items(report_id);
CREATE INDEX IF NOT EXISTS idx_photo_reports_status ON photo_reports(status);

CREATE OR REPLACE VIEW photo_reports_summary AS
SELECT 
    r.id, r.titulo, r.obra, r.responsavel, r.status, r.created_at,
    COUNT(p.id) as total_fotos,
    COUNT(p.id) FILTER (WHERE p.incluir = true) as fotos_incluidas
FROM photo_reports r
LEFT JOIN photo_items p ON r.id = p.report_id
GROUP BY r.id;
```

---

### src/frontend/index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Photo Report - Relatório Fotográfico de Obras</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; margin-bottom: 20px; }
        .dropzone { border: 3px dashed #ccc; border-radius: 10px; padding: 40px; text-align: center; background: white; cursor: pointer; }
        .dropzone:hover { border-color: #007bff; background: #f0f7ff; }
        .foto-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .foto-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .foto-card img { width: 100%; height: 200px; object-fit: cover; }
        .foto-info { padding: 15px; }
        .foto-info .meta { font-size: 12px; color: #666; margin-bottom: 10px; }
        .foto-info textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px; }
        .foto-actions { padding: 10px 15px; background: #f9f9f9; display: flex; justify-content: space-between; }
        .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-success { background: #28a745; color: white; }
        .header-actions { display: flex; gap: 10px; margin-bottom: 20px; }
        .status { padding: 10px; border-radius: 5px; margin-top: 10px; }
        .status.success { background: #d4edda; color: #155724; }
        .status.error { background: #f8d7da; color: #721c24; }
        .status.info { background: #cce5ff; color: #004085; }
        .loading { display: none; text-align: center; padding: 20px; }
        .loading.active { display: block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📷 Photo Report</h1>
        <p style="color: #666; margin-bottom: 20px;">Relatório Fotográfico de Obras</p>
        
        <div class="header-actions">
            <input type="text" id="titulo" placeholder="Título do Relatório" class="btn" style="flex: 1;">
            <input type="text" id="obra" placeholder="Nome da Obra" class="btn" style="flex: 1;">
            <input type="text" id="responsavel" placeholder="Responsável" class="btn" style="flex: 1;">
        </div>
        
        <div class="dropzone" id="dropzone">
            <p>📁 Arraste as fotos aqui ou clique para selecionar</p>
            <input type="file" id="fileInput" multiple accept="image/*" style="display: none;">
        </div>
        
        <div class="loading" id="loading"><p>⏳ Processando fotos...</p></div>
        <div id="status"></div>
        <div class="foto-grid" id="fotoGrid"></div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="btn btn-success" id="btnGerarPDF" style="display: none; font-size: 18px; padding: 15px 40px;">
                📄 Gerar Relatório PDF
            </button>
        </div>
    </div>
    
    <script>
        const API_URL = 'http://localhost:8002';
        const fotos = [];
        
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');
        const fotoGrid = document.getElementById('fotoGrid');
        const loading = document.getElementById('loading');
        const statusDiv = document.getElementById('status');
        const btnGerarPDF = document.getElementById('btnGerarPDF');
        
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = '#007bff'; });
        dropzone.addEventListener('dragleave', () => dropzone.style.borderColor = '#ccc');
        dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.style.borderColor = '#ccc'; handleFiles(e.dataTransfer.files); });
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        async function handleFiles(files) {
            loading.classList.add('active');
            statusDiv.innerHTML = '<div class="status info">Processando ' + files.length + ' fotos...</div>';
            
            for (const file of files) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const response = await fetch(`${API_URL}/processar-foto`, { method: 'POST', body: formData });
                    if (!response.ok) throw new Error('Erro');
                    const data = await response.json();
                    fotos.push({ ...data, legenda: '', filename: file.name });
                    renderFotos();
                } catch (error) {
                    statusDiv.innerHTML = '<div class="status error">Erro: ' + file.name + '</div>';
                }
            }
            
            loading.classList.remove('active');
            statusDiv.innerHTML = '<div class="status success">✅ ' + fotos.length + ' fotos carregadas</div>';
            btnGerarPDF.style.display = fotos.length > 0 ? 'inline-block' : 'none';
        }
        
        function renderFotos() {
            fotoGrid.innerHTML = fotos.map((foto, idx) => `
                <div class="foto-card">
                    <img src="data:image/jpeg;base64,${foto.imagem_base64}" />
                    <div class="foto-info">
                        <div class="meta">
                            📅 ${foto.metadados.data_hora || '-'}<br>
                            📍 ${foto.metadados.latitude?.toFixed(6) || '-'}, ${foto.metadados.longitude?.toFixed(6) || '-'}<br>
                            🧭 ${foto.metadados.direcao_cardeal || '-'}
                        </div>
                        <textarea placeholder="Legenda..." onchange="fotos[${idx}].legenda=this.value">${foto.legenda}</textarea>
                    </div>
                    <div class="foto-actions">
                        <button class="btn btn-danger" onclick="fotos.splice(${idx},1);renderFotos();btnGerarPDF.style.display=fotos.length?'inline-block':'none'">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
        
        btnGerarPDF.addEventListener('click', async () => {
            loading.classList.add('active');
            statusDiv.innerHTML = '<div class="status info">Gerando PDF...</div>';
            
            try {
                const processadas = [];
                for (const foto of fotos) {
                    const r = await fetch(`${API_URL}/aplicar-mascara`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imagem_base64: foto.imagem_base64, metadados: foto.metadados, legenda: foto.legenda || 'Sem legenda' })
                    });
                    const d = await r.json();
                    processadas.push(d.imagem_processada);
                }
                
                const pdfR = await fetch(`${API_URL}/gerar-pdf`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fotos: processadas,
                        titulo: document.getElementById('titulo').value || 'Relatório Fotográfico',
                        obra: document.getElementById('obra').value,
                        responsavel: document.getElementById('responsavel').value
                    })
                });
                const pdfData = await pdfR.json();
                
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,' + pdfData.pdf_base64;
                link.download = 'relatorio.pdf';
                link.click();
                
                statusDiv.innerHTML = '<div class="status success">✅ PDF gerado!</div>';
            } catch (e) {
                statusDiv.innerHTML = '<div class="status error">❌ Erro</div>';
            }
            loading.classList.remove('active');
        });
    </script>
</body>
</html>
```

---

### Tasks/Queue/001-container-python.md

```markdown
# Criar Container Python

**Prioridade:** Alta

## Passos
1. [ ] Criar arquivos em src/python/
2. [ ] Build do container
3. [ ] Testar /health

## Comandos
```bash
cd E:\Projetos\PHOTO-REPORT\src\docker
docker-compose build
docker-compose up -d
curl http://localhost:8002/health
```
```

---

### Tasks/Queue/002-criar-tabelas-sql.md

```markdown
# Criar Tabelas SQL

**Prioridade:** Alta

## Comando
```bash
docker exec -it pg psql -U lucas -d cosmic
```

Cole o conteúdo de `scripts/sql/create-tables.sql`

## Verificar
```sql
\dt
SELECT * FROM photo_reports_summary;
```
```

---

### Tasks/Queue/003-frontend-upload.md

```markdown
# Testar Frontend

**Prioridade:** Média

## Passos
1. Abrir src/frontend/index.html no navegador
2. Arrastar fotos com GPS
3. Editar legendas
4. Gerar PDF
```

---

## EXECUÇÃO

1. Crie toda a estrutura de pastas
2. Crie todos os arquivos com conteúdo exato
3. Mostre: `tree /F E:\Projetos\PHOTO-REPORT`
4. Liste comandos para executar

## OBSERVAÇÕES

- Container na rede `coletor_default`
- Porta 8002
- Banco: cosmic (host.docker.internal:5432)
- Frontend é HTML puro
