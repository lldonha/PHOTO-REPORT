# PHOTO-REPORT Tests

This directory contains test scripts and resources for verifying the PHOTO-REPORT API.

## Quick Start

### Run End-to-End Test (Recommended)

The E2E test verifies the complete flow: upload -> EXIF extraction -> overlay -> PDF generation.

**Windows:**
```cmd
scripts\tests\run-e2e-test.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/tests/run-e2e-test.sh
./scripts/tests/run-e2e-test.sh
```

**Using Python directly:**
```bash
pip install requests pillow
python tests/test_e2e_complete_flow.py
```

### Verify /processar-foto endpoint only

**Windows:**
```cmd
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
| `test_e2e_complete_flow.py` | **Complete E2E test** - Upload -> EXIF -> Overlay -> PDF |
| `test_processar_foto.py` | Python test for /processar-foto endpoint |
| `scripts/tests/run-e2e-test.bat` | Windows batch script for E2E test |
| `scripts/tests/run-e2e-test.sh` | Linux/Mac shell script for E2E test |
| `scripts/tests/verify-processar-foto.bat` | Windows batch script for endpoint test |
| `scripts/tests/verify-processar-foto.sh` | Linux/Mac shell script for endpoint test |

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

## E2E Test Output Files

After running the E2E test, these files are generated:

| File | Description |
|------|-------------|
| `e2e_test_output.pdf` | PDF generated via /gerar-pdf endpoint |
| `e2e_download_test.pdf` | PDF from /gerar-pdf/download endpoint |

## E2E Test Flow

The complete E2E test performs these steps:

1. **Health Check** - Verifies API is running at localhost:8002
2. **Process Photo** - Uploads test image, extracts EXIF metadata
3. **Apply Overlay** - Adds legend and metadata bar to image
4. **Generate PDF** - Creates PDF report with multiple photos
5. **PDF Download** - Tests direct download endpoint

## Prerequisites

- Docker container `photo-processor` must be running
- Start with: `cd src/docker && docker-compose up -d`
- Verify with: `curl http://localhost:8002/health`

## Full Documentation

For complete verification instructions including manual browser testing, see:
`scripts/tests/VERIFICATION_INSTRUCTIONS.md`