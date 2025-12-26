# E2E Browser Test Checklist

Use this checklist for manual browser-based end-to-end testing of PHOTO-REPORT.

## Prerequisites

- [ ] Docker is running
- [ ] Container started: `cd src/docker && docker-compose up -d`
- [ ] Health check passes: `curl http://localhost:8002/health`

---

## Test Steps

### 1. Open Frontend
- [ ] Open `src/frontend/index.html` in browser
- [ ] Page loads without errors
- [ ] Toast shows "Conectado a API PHOTO-REPORT!" (if container running)

### 2. Upload Photo with GPS
- [ ] Drag a photo with GPS data to the dropzone
  (Use a smartphone photo for best results)
- [ ] Loading spinner appears
- [ ] Photo card appears in grid after processing

### 3. Verify EXIF Extraction
Check the photo card displays:
- [ ] Thumbnail image visible
- [ ] Date/time extracted (e.g., "25/12/2025 10:30")
- [ ] GPS coordinates extracted (e.g., "-23.5505, -46.6333")
- [ ] Compass direction extracted (e.g., "NE (45.0)")
- [ ] Mini-map visible (if GPS present)

### 4. Edit Legend
- [ ] Find the legend textarea below the photo
- [ ] Type: "Vista frontal da entrada principal"
- [ ] Character counter updates (shows X/80)
- [ ] Verify max 80 characters enforced

### 5. Configure Report
- [ ] Set Titulo: "Relatorio Fotografico de Teste"
- [ ] Set Obra: "Edificio Residencial Alpha"
- [ ] Set Responsavel: "Eng. Teste - CREA 123456"

### 6. Generate PDF
- [ ] Click "Gerar Relatorio PDF" button
- [ ] Loading overlay appears with progress
- [ ] PDF file downloads automatically
- [ ] Toast shows success message

### 7. Verify PDF Content
Open the downloaded PDF and check:
- [ ] PDF opens correctly in viewer
- [ ] Header shows report title
- [ ] Header shows obra name
- [ ] Header shows responsavel
- [ ] Header shows generation date
- [ ] Photo displays in grid layout
- [ ] Photo has overlay bar at bottom with:
  - [ ] Date/time
  - [ ] GPS coordinates
  - [ ] Compass direction
  - [ ] Legend text (in yellow)
- [ ] Page number in footer

---

## Additional Tests

### Photo without EXIF
- [ ] Upload a simple image without EXIF data
- [ ] Fields show "-" for missing data
- [ ] No mini-map displayed
- [ ] PDF still generates correctly

### Multiple Photos
- [ ] Upload 3+ photos
- [ ] All cards display correctly
- [ ] Remove one photo (click X button)
- [ ] Photo removed, numbers updated
- [ ] Generate PDF with remaining photos

### Clear All
- [ ] Upload several photos
- [ ] Click "Limpar Tudo" button
- [ ] Confirm dialog appears
- [ ] All photos removed
- [ ] Empty state visible again

### Photo Preview
- [ ] Click on a photo thumbnail
- [ ] Preview modal opens with full image
- [ ] Click X or outside to close modal
- [ ] Press ESC to close modal

---

## Browser Console Check

Open Developer Tools (F12) > Console:
- [ ] No red error messages
- [ ] No JavaScript exceptions
- [ ] API calls complete successfully (Network tab)

---

## Test Result

| Test | Status |
|------|--------|
| Frontend loads | [ ] PASS / [ ] FAIL |
| Photo upload | [ ] PASS / [ ] FAIL |
| EXIF extraction | [ ] PASS / [ ] FAIL |
| Legend editing | [ ] PASS / [ ] FAIL |
| PDF generation | [ ] PASS / [ ] FAIL |
| PDF content | [ ] PASS / [ ] FAIL |

**Overall Result:** [ ] PASS / [ ] FAIL

**Tested by:** _______________
**Date:** _______________
**Browser:** _______________
**Notes:** _______________
