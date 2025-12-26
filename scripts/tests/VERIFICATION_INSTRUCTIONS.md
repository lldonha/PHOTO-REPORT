# Verification Instructions

This document contains verification instructions for the PHOTO-REPORT integration tests.

---

# subtask-9-1: Verificar endpoint /processar-foto com uma foto de teste

### Prerequisites

1. Docker must be running
2. Container photo-processor must be started

### Step 1: Start the Container (if not running)

```bash
cd src/docker
docker-compose up -d
```

Wait a few seconds for the container to initialize.

### Step 2: Verify Container is Running

```bash
docker ps --filter "name=photo-processor"
```

Expected output should show the container running on port 8002.

### Step 3: Verify Health Endpoint

```bash
curl http://localhost:8002/health
```

Expected response:
```json
{"status":"ok","version":"1.0.0","service":"photo-processor"}
```

### Step 4: Test /processar-foto Endpoint

**Option A: Using Python test script (recommended)**
```bash
pip install requests pillow
python tests/test_processar_foto.py
```

**Option B: Using curl with a test photo**
```bash
# Replace 'photo.jpg' with an actual JPEG file
curl -X POST http://localhost:8002/processar-foto \
  -F "file=@photo.jpg" \
  | python -m json.tool
```

**Option C: Using Windows batch script**
```cmd
scripts\tests\verify-processar-foto.bat
```

**Option D: Using shell script (Linux/Mac)**
```bash
chmod +x scripts/tests/verify-processar-foto.sh
./scripts/tests/verify-processar-foto.sh
```

### Expected Response for /processar-foto

Status Code: **200**

Response body (JSON):
```json
{
  "sucesso": true,
  "mensagem": "Foto processada com sucesso",
  "metadados": {
    "data_hora": null,
    "data_hora_formatada": "-",
    "latitude": null,
    "longitude": null,
    "gps_string": "-",
    "direcao_graus": null,
    "direcao_cardeal": "-",
    "tem_gps": false,
    "tem_direcao": false
  },
  "imagem_base64": "<base64-encoded-image>",
  "thumbnail_base64": "<base64-encoded-thumbnail>",
  "minimapa_base64": null
}
```

Note: If the test image has EXIF data (GPS, date/time, compass), those fields will be populated. Simple test images may not have EXIF metadata.

### Verification Checklist

- [ ] Container starts without errors
- [ ] Health endpoint returns status 200 with "ok"
- [ ] /processar-foto accepts multipart/form-data with file field
- [ ] Response has status 200
- [ ] Response contains `sucesso: true`
- [ ] Response contains `metadados` object with expected fields
- [ ] Response contains `imagem_base64` (non-empty string)
- [ ] Response contains `thumbnail_base64` (may be null for tiny images)
- [ ] Response contains `minimapa_base64` (null if no GPS data)

### Troubleshooting

**Container fails to start:**
- Check Docker logs: `docker logs photo-processor`
- Verify network exists: `docker network ls | grep coletor_default`
- Create network if missing: `docker network create coletor_default`

**Connection refused:**
- Ensure container is running: `docker ps`
- Check container health: `docker logs photo-processor`

**500 Internal Server Error:**
- Check server logs: `docker logs photo-processor`
- May indicate missing dependencies or code errors

### Success Criteria

The verification is **PASSED** when:
1. `curl -X POST http://localhost:8002/processar-foto -F "file=@image.jpg"` returns HTTP 200
2. Response JSON contains `"sucesso": true`
3. Response contains valid `metadados` structure
4. Response contains non-empty `imagem_base64`

---

# subtask-9-2: Verificar frontend abre corretamente no navegador

## Description

Verify that the frontend HTML file opens correctly in the browser with all UI elements visible and no JavaScript console errors.

## Prerequisites

1. Browser (Chrome, Firefox, Edge, or Safari)
2. Frontend file exists at `src/frontend/index.html`

## How to Verify

### Option A: Using verification script (Windows)
```cmd
scripts\tests\verify-frontend.bat
```

### Option B: Using verification script (Linux/Mac)
```bash
chmod +x scripts/tests/verify-frontend.sh
./scripts/tests/verify-frontend.sh
```

### Option C: Manual verification
1. Open `src/frontend/index.html` directly in your browser
2. Follow the verification checklist below

## Verification Checklist

### 1. Page Loads Successfully
- [ ] Page opens without 404 or loading errors
- [ ] Header shows "PHOTO-REPORT" with camera emoji
- [ ] Subtitle shows "Gerador de Relatorios Fotograficos de Obra"

### 2. Dropzone is Visible
- [ ] Large drag-and-drop area with dashed border
- [ ] Camera emoji icon (large)
- [ ] Text: "Arraste as fotos aqui"
- [ ] Text: "ou clique para selecionar arquivos (JPEG, PNG)"
- [ ] Text: "Maximo 100 fotos por relatorio"

### 3. Configuration Fields Visible
- [ ] **Titulo do Relatorio** input field
  - Has default value "Relatorio Fotografico"
- [ ] **Nome da Obra** input field
  - Has placeholder text
- [ ] **Responsavel Tecnico** input field
  - Has placeholder text

### 4. Status Bar Visible
- [ ] Badge showing "Pronto" (green)
- [ ] Counter showing "0 fotos carregadas"
- [ ] "Limpar Tudo" button (disabled, grayed out)
- [ ] "Gerar Relatorio PDF" button (disabled, grayed out)

### 5. Empty State Visible
- [ ] Camera icon (grayed out)
- [ ] Text: "Nenhuma foto carregada ainda"
- [ ] Text: "Arraste fotos para a area acima ou clique para selecionar"

### 6. No Console Errors
- [ ] Open Developer Tools (F12)
- [ ] Click on "Console" tab
- [ ] **NO RED ERROR MESSAGES**
- [ ] Note: A warning about API connection is acceptable if Docker is not running:
      "API nao esta disponivel. Inicie o container Docker."

## Expected DOM Elements

The following elements must exist and be visible:

| Element ID | Type | Description |
|------------|------|-------------|
| `dropzone` | div | Drag-and-drop area |
| `fileInput` | input[file] | Hidden file input |
| `titulo` | input[text] | Report title field |
| `obra` | input[text] | Construction site name |
| `responsavel` | input[text] | Technical responsible |
| `statusBadge` | span | Status indicator badge |
| `fotoCount` | span | Photo counter |
| `btnLimpar` | button | Clear all button |
| `btnGerarPdf` | button | Generate PDF button |
| `fotoGrid` | div | Grid for photo cards |
| `emptyState` | div | Empty state message |

## JavaScript Console Check

Open the browser console (F12 > Console) and verify:

1. **No syntax errors** - JavaScript loads without errors
2. **No undefined references** - All elements are found
3. **API check** - You may see a toast notification about API status:
   - If Docker is running: "Conectado a API PHOTO-REPORT!"
   - If Docker is not running: "API nao esta disponivel..."

This is expected behavior and NOT an error.

## Success Criteria

The verification is **PASSED** when:
1. Page loads completely without errors
2. All UI elements from the checklist are visible
3. Browser console shows NO RED ERROR MESSAGES
4. Configuration fields are editable
5. Dropzone responds to hover (border color changes)

## Troubleshooting

**Page is blank:**
- Check if index.html exists in src/frontend/
- Verify the file is not corrupted (open in text editor)

**JavaScript errors in console:**
- Check for typos in element IDs
- Ensure all script sections are properly closed

**Styles not loading:**
- All styles are inline in the HTML file
- If styles are missing, the file may be truncated

**Elements missing:**
- Verify the HTML structure is complete
- Check that the file wasn't partially saved

---

# subtask-9-3: Teste End-to-End - Upload de Foto -> EXIF -> Overlay -> PDF

## Description

Complete end-to-end test verifying the full workflow from photo upload through PDF generation.

## Prerequisites

1. Docker must be running
2. Container photo-processor must be started
3. Python 3.8+ with requests and Pillow libraries

## Automated E2E Test

### Option A: Using Python test script (Recommended)

```bash
# Install dependencies
pip install requests Pillow

# Run E2E test
python tests/test_e2e_complete_flow.py
```

### Option B: Using Windows batch script

```cmd
scripts\tests\run-e2e-test.bat
```

### Option C: Using shell script (Linux/Mac)

```bash
chmod +x scripts/tests/run-e2e-test.sh
./scripts/tests/run-e2e-test.sh
```

## What the E2E Test Verifies

The automated test performs these steps:

1. **Health Check** - Verifies API is running
2. **Process Photo** - Uploads test image, extracts EXIF metadata
3. **Apply Overlay** - Adds legend and metadata bar to image
4. **Generate PDF** - Creates PDF report with multiple photos
5. **PDF Download** - Tests direct download endpoint

## Manual Browser E2E Test

For a complete manual verification through the browser:

### Step 1: Start Container

```bash
cd src/docker
docker-compose up -d
```

### Step 2: Verify Container

```bash
curl http://localhost:8002/health
```

Expected: `{"status":"ok","version":"1.0.0","service":"photo-processor"}`

### Step 3: Open Frontend

Open `src/frontend/index.html` in your browser.

### Step 4: Prepare Test Photo

Use a photo with GPS metadata for best results:
- Photos from smartphones typically have GPS
- You can use any JPEG image for basic testing

### Step 5: Upload Photo

1. Drag the photo to the dropzone area OR click to select file
2. Wait for processing (loading spinner)
3. Verify the photo card appears in the grid

### Step 6: Verify EXIF Extraction

Check the photo card displays:
- [ ] Thumbnail image
- [ ] Date/time (or "-" if no EXIF)
- [ ] GPS coordinates (or "-" if no GPS)
- [ ] Compass direction (or "-" if no direction)
- [ ] Mini-map (only if GPS data exists)

### Step 7: Edit Legend

1. Find the legend textarea below the photo
2. Type a test legend (max 80 characters)
3. Verify character counter updates
4. Example: "Vista frontal da entrada principal do canteiro"

### Step 8: Configure Report

Fill in the configuration fields:
- **Titulo:** "Relatorio Fotografico de Teste"
- **Obra:** "Edificio Residencial Alpha"
- **Responsavel:** "Eng. Teste - CREA 123456"

### Step 9: Generate PDF

1. Click the "Gerar Relatorio PDF" button
2. Wait for processing (loading overlay shows progress)
3. PDF should automatically download

### Step 10: Verify PDF

Open the downloaded PDF and verify:
- [ ] PDF opens correctly
- [ ] Header shows title, obra, responsavel, date
- [ ] Photo appears in the grid
- [ ] Overlay bar at bottom of photo with:
  - Date/time
  - GPS coordinates
  - Compass direction
  - Legend (in yellow)
- [ ] Page number in footer

## Verification Checklist

### API Endpoints

- [ ] GET /health returns 200 with status "ok"
- [ ] POST /processar-foto accepts file upload, returns metadata
- [ ] POST /aplicar-mascara applies overlay, returns image
- [ ] POST /gerar-pdf generates PDF, returns base64
- [ ] POST /gerar-pdf/download returns PDF file directly

### Frontend Functionality

- [ ] Dropzone accepts drag-and-drop files
- [ ] Dropzone accepts click-to-select files
- [ ] Multiple files can be uploaded (up to 100)
- [ ] Photo cards display correctly with metadata
- [ ] Legend textarea accepts input (max 80 chars)
- [ ] Remove button (X) removes individual photos
- [ ] Clear All button removes all photos
- [ ] Generate PDF button creates downloadable PDF
- [ ] Toast notifications show success/error messages
- [ ] Loading overlay shows during processing
- [ ] Preview modal opens on photo click

### PDF Content

- [ ] PDF is valid and opens in PDF viewers
- [ ] Header contains report title
- [ ] Header contains obra name
- [ ] Header contains responsavel name
- [ ] Header contains generation date
- [ ] Photos displayed in 2x3 grid (6 per page)
- [ ] Photo overlay shows date/GPS/direction/legend
- [ ] Pages are numbered
- [ ] Multiple pages work correctly (for >6 photos)

## Expected Output Files

After running the E2E test, these files are generated:

| File | Description |
|------|-------------|
| `tests/e2e_test_output.pdf` | PDF generated via /gerar-pdf endpoint |
| `tests/e2e_download_test.pdf` | PDF from /gerar-pdf/download endpoint |

## Troubleshooting

### Container not running

```bash
# Check if container exists
docker ps -a | grep photo-processor

# Start container
cd src/docker && docker-compose up -d

# Check logs
docker logs photo-processor
```

### API returns 500 error

```bash
# Check container logs for error details
docker logs photo-processor --tail 50
```

### PDF generation fails

- Ensure WeasyPrint dependencies are installed in container
- Check for valid base64 image data
- Verify Jinja2 template is correct

### Frontend API connection fails

- Container must be running on port 8002
- Check CORS settings in API
- Open browser console for detailed errors

## Success Criteria

The E2E test is **PASSED** when:

1. All 5 automated test steps pass
2. Generated PDFs are valid and contain correct content
3. OR: Manual browser test completes all steps successfully
4. PDF downloads correctly with proper overlay and layout

## Test with Real Photo

For the most comprehensive test, use a photo with full EXIF data:

```bash
# Test with a real photo that has GPS
curl -X POST http://localhost:8002/processar-foto \
  -F "file=@your-photo-with-gps.jpg" \
  | python -m json.tool
```

This will show actual GPS coordinates, date/time, and compass direction in the metadata.