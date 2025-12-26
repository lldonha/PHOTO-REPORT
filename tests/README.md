# PHOTO-REPORT Tests

This directory contains test scripts and resources for verifying the PHOTO-REPORT API.

## Quick Verification

### Verify /processar-foto endpoint

**Windows:**
```bash
scripts\tests\verify-processar-foto.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/tests/verify-processar-foto.sh
./scripts/tests/verify-processar-foto.sh
```

**Using Python:**
```bash
pip install requests pillow
python tests/test_processar_foto.py
```

**Using curl (with your own photo):**
```bash
curl -X POST http://localhost:8002/processar-foto \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/your/photo.jpg"
```

## Test Scripts

| Script | Description |
|--------|-------------|
| `test_processar_foto.py` | Python test for /processar-foto endpoint |
| `scripts/tests/verify-processar-foto.bat` | Windows batch script |
| `scripts/tests/verify-processar-foto.sh` | Linux/Mac shell script |

## Testing with Real Photos

For best results, use photos with EXIF metadata:
1. Photos taken with smartphones usually have GPS coordinates
2. DSLR cameras record date/time
3. Some cameras record compass direction (gps_img_direction)

Place test photos in this directory and run:
```bash
curl -X POST -F "file=@tests/my-photo.jpg" http://localhost:8002/processar-foto | python -m json.tool
```

## Expected Response

```json
{
  "sucesso": true,
  "mensagem": "Foto processada com sucesso",
  "metadados": {
    "data_hora": "2025:12:25 10:30:00",
    "data_hora_formatada": "25/12/2025 10:30",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "gps_string": "-23.5505, -46.6333",
    "direcao_graus": 45.0,
    "direcao_cardeal": "NE (45.0)",
    "tem_gps": true,
    "tem_direcao": true
  },
  "imagem_base64": "...",
  "thumbnail_base64": "...",
  "minimapa_base64": "..."
}
```

## Prerequisites

- Docker container `photo-processor` must be running
- Start with: `cd src/docker && docker-compose up -d`
- Verify with: `curl http://localhost:8002/health`
