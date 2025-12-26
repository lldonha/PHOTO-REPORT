# Verification Instructions for subtask-9-1

## Subtask: Verificar endpoint /processar-foto com uma foto de teste

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
