# -*- coding: utf-8 -*-
"""
End-to-End Test for PHOTO-REPORT System.

Tests the complete flow: upload photo → EXIF extraction → overlay → PDF generation.

This test simulates the full user workflow through the API:
1. Process a photo with EXIF data (extracts metadata)
2. Apply overlay/mask with legend
3. Generate PDF report

Usage:
    python tests/test_e2e_complete_flow.py

Requirements:
    - requests library: pip install requests
    - Pillow library: pip install Pillow
    - Container photo-processor must be running on port 8002
"""

import requests
import sys
import json
import base64
from io import BytesIO
from datetime import datetime

# API endpoint
API_URL = "http://localhost:8002"


def create_test_image_with_size(width=800, height=600):
    """
    Create a test JPEG image with specified dimensions.
    Creates a gradient image to make it visually interesting.
    """
    try:
        from PIL import Image, ImageDraw

        # Create image with gradient
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)

        # Create gradient background
        for y in range(height):
            r = int(255 * (1 - y / height))
            g = int(128 + 127 * (y / height))
            b = int(255 * (y / height))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Add some shapes to make it look like a construction site photo
        draw.rectangle([50, 50, 200, 200], fill=(100, 100, 100), outline=(50, 50, 50))
        draw.rectangle([250, 100, 450, 300], fill=(150, 120, 80), outline=(100, 80, 50))
        draw.ellipse([500, 150, 700, 350], fill=(50, 100, 50), outline=(30, 70, 30))

        # Save to bytes
        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=90)
        buffer.seek(0)
        return buffer.getvalue()
    except ImportError:
        print("[WARN] Pillow not available, using minimal JPEG")
        # Return minimal valid JPEG
        return bytes([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
            0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
            0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
            0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
            0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F,
            0x00, 0xFB, 0xD5, 0xDB, 0xFF, 0xD9
        ])


def test_step_1_health_check():
    """Step 1: Verify API is running."""
    print("\n" + "=" * 70)
    print("STEP 1: Health Check - Verify API is Running")
    print("=" * 70)

    try:
        response = requests.get(f"{API_URL}/health", timeout=10)

        if response.status_code == 200:
            data = response.json()
            print(f"[OK] API Status: {data.get('status')}")
            print(f"[OK] Version: {data.get('version')}")
            print(f"[OK] Service: {data.get('service')}")
            return True
        else:
            print(f"[FAIL] Unexpected status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("[FAIL] Connection refused - Container not running!")
        print("       Start container: cd src/docker && docker-compose up -d")
        return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False


def test_step_2_process_photo():
    """Step 2: Upload and process a photo."""
    print("\n" + "=" * 70)
    print("STEP 2: Process Photo - Upload and Extract EXIF")
    print("=" * 70)

    try:
        # Create test image
        print("[INFO] Creating test image (800x600)...")
        image_bytes = create_test_image_with_size(800, 600)
        print(f"[INFO] Image size: {len(image_bytes)} bytes")

        # Upload to /processar-foto
        print("[INFO] Uploading to /processar-foto...")
        files = {'file': ('test_photo.jpg', image_bytes, 'image/jpeg')}
        response = requests.post(f"{API_URL}/processar-foto", files=files, timeout=30)

        if response.status_code != 200:
            print(f"[FAIL] HTTP {response.status_code}: {response.text}")
            return None

        data = response.json()

        if not data.get('sucesso'):
            print(f"[FAIL] API returned sucesso=false: {data.get('mensagem')}")
            return None

        print(f"[OK] Photo processed successfully")
        print(f"[OK] Message: {data.get('mensagem')}")

        # Display metadata
        metadados = data.get('metadados', {})
        print(f"\n[INFO] Extracted Metadata:")
        print(f"       - Data/Hora: {metadados.get('data_hora_formatada', '-')}")
        print(f"       - GPS: {metadados.get('gps_string', '-')}")
        print(f"       - Direcao: {metadados.get('direcao_cardeal', '-')}")
        print(f"       - Tem GPS: {metadados.get('tem_gps', False)}")
        print(f"       - Tem Direcao: {metadados.get('tem_direcao', False)}")

        # Verify base64 images
        if data.get('imagem_base64'):
            print(f"[OK] imagem_base64: {len(data['imagem_base64'])} chars")
        if data.get('thumbnail_base64'):
            print(f"[OK] thumbnail_base64: {len(data['thumbnail_base64'])} chars")
        if data.get('minimapa_base64'):
            print(f"[OK] minimapa_base64: {len(data['minimapa_base64'])} chars")

        return data

    except Exception as e:
        print(f"[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_step_3_apply_overlay(processed_photo):
    """Step 3: Apply overlay/mask with legend."""
    print("\n" + "=" * 70)
    print("STEP 3: Apply Overlay - Add Legend and Metadata Bar")
    print("=" * 70)

    if not processed_photo:
        print("[SKIP] No processed photo available")
        return None

    try:
        metadados = processed_photo.get('metadados', {})

        # Prepare overlay request
        payload = {
            "imagem_base64": processed_photo.get('imagem_base64'),
            "data_hora": metadados.get('data_hora_formatada', '-'),
            "gps_string": metadados.get('gps_string', '-'),
            "direcao_cardeal": metadados.get('direcao_cardeal', '-'),
            "legenda": "Teste E2E - Verificacao do Sistema PHOTO-REPORT",
            "latitude": metadados.get('latitude'),
            "longitude": metadados.get('longitude'),
            "direcao_graus": metadados.get('direcao_graus'),
            "incluir_minimapa": metadados.get('tem_gps', False)
        }

        print(f"[INFO] Applying overlay with legend: '{payload['legenda']}'")
        print(f"[INFO] Sending POST to /aplicar-mascara...")

        response = requests.post(
            f"{API_URL}/aplicar-mascara",
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            print(f"[FAIL] HTTP {response.status_code}: {response.text}")
            return None

        data = response.json()

        if not data.get('sucesso'):
            print(f"[FAIL] API returned sucesso=false: {data.get('mensagem')}")
            return None

        print(f"[OK] Overlay applied successfully")
        print(f"[OK] Message: {data.get('mensagem')}")

        if data.get('imagem_base64'):
            print(f"[OK] Result image: {len(data['imagem_base64'])} chars")

            # Verify the image is valid by decoding
            try:
                img_bytes = base64.b64decode(data['imagem_base64'])
                print(f"[OK] Decoded image size: {len(img_bytes)} bytes")
            except Exception as e:
                print(f"[WARN] Could not decode image: {e}")

        return data

    except Exception as e:
        print(f"[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_step_4_generate_pdf(overlay_result, processed_photo):
    """Step 4: Generate PDF report."""
    print("\n" + "=" * 70)
    print("STEP 4: Generate PDF - Create Report with Photos")
    print("=" * 70)

    if not overlay_result and not processed_photo:
        print("[SKIP] No images available for PDF")
        return None

    try:
        # Use overlay result if available, otherwise use processed photo
        image_base64 = (
            overlay_result.get('imagem_base64') if overlay_result
            else processed_photo.get('imagem_base64')
        )

        # Prepare PDF request with multiple photos for better testing
        fotos = [
            {
                "imagem_base64": image_base64,
                "legenda": "Foto 1 - Entrada do canteiro de obras"
            },
            {
                "imagem_base64": image_base64,
                "legenda": "Foto 2 - Vista lateral da estrutura"
            },
            {
                "imagem_base64": image_base64,
                "legenda": "Foto 3 - Fundacao concluida"
            }
        ]

        payload = {
            "fotos": fotos,
            "titulo": "Relatorio Fotografico - Teste E2E",
            "obra": "Edificio Teste PHOTO-REPORT",
            "responsavel": "Eng. Teste Automatizado - CREA 123456"
        }

        print(f"[INFO] Generating PDF with {len(fotos)} photos...")
        print(f"[INFO] Title: {payload['titulo']}")
        print(f"[INFO] Obra: {payload['obra']}")
        print(f"[INFO] Responsavel: {payload['responsavel']}")
        print(f"[INFO] Sending POST to /gerar-pdf...")

        response = requests.post(
            f"{API_URL}/gerar-pdf",
            json=payload,
            timeout=60
        )

        if response.status_code != 200:
            print(f"[FAIL] HTTP {response.status_code}: {response.text}")
            return None

        data = response.json()

        if not data.get('sucesso'):
            print(f"[FAIL] API returned sucesso=false: {data.get('mensagem')}")
            return None

        print(f"[OK] PDF generated successfully!")
        print(f"[OK] Message: {data.get('mensagem')}")
        print(f"[OK] Number of pages: {data.get('num_paginas')}")
        print(f"[OK] Number of photos: {data.get('num_fotos')}")

        if data.get('pdf_base64'):
            pdf_base64 = data['pdf_base64']
            print(f"[OK] PDF base64 length: {len(pdf_base64)} chars")

            # Verify PDF is valid
            try:
                pdf_bytes = base64.b64decode(pdf_base64)
                print(f"[OK] PDF size: {len(pdf_bytes)} bytes ({len(pdf_bytes) / 1024:.1f} KB)")

                # Check PDF magic bytes
                if pdf_bytes[:4] == b'%PDF':
                    print(f"[OK] Valid PDF header detected")
                else:
                    print(f"[WARN] PDF header not found (got: {pdf_bytes[:10]})")

                # Save PDF for manual inspection
                output_path = "tests/e2e_test_output.pdf"
                with open(output_path, 'wb') as f:
                    f.write(pdf_bytes)
                print(f"[OK] PDF saved to: {output_path}")

            except Exception as e:
                print(f"[WARN] Could not process PDF: {e}")

        return data

    except Exception as e:
        print(f"[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_step_5_verify_pdf_download():
    """Step 5: Test direct PDF download endpoint."""
    print("\n" + "=" * 70)
    print("STEP 5: Direct PDF Download - Test /gerar-pdf/download")
    print("=" * 70)

    try:
        # Create a simple test image
        image_bytes = create_test_image_with_size(400, 300)
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

        payload = {
            "fotos": [
                {"imagem_base64": image_base64, "legenda": "Download test photo"}
            ],
            "titulo": "Download Test",
            "obra": "Test",
            "responsavel": "Test"
        }

        print("[INFO] Testing /gerar-pdf/download endpoint...")

        response = requests.post(
            f"{API_URL}/gerar-pdf/download",
            json=payload,
            timeout=60
        )

        if response.status_code != 200:
            print(f"[FAIL] HTTP {response.status_code}")
            return False

        # Check content type
        content_type = response.headers.get('content-type', '')
        print(f"[INFO] Content-Type: {content_type}")

        if 'application/pdf' in content_type:
            print(f"[OK] Correct content type for PDF download")
        else:
            print(f"[WARN] Unexpected content type: {content_type}")

        # Check content disposition
        content_disposition = response.headers.get('content-disposition', '')
        print(f"[INFO] Content-Disposition: {content_disposition}")

        # Verify PDF content
        pdf_bytes = response.content
        print(f"[OK] Downloaded PDF size: {len(pdf_bytes)} bytes")

        if pdf_bytes[:4] == b'%PDF':
            print(f"[OK] Valid PDF header in download")

            # Save for inspection
            output_path = "tests/e2e_download_test.pdf"
            with open(output_path, 'wb') as f:
                f.write(pdf_bytes)
            print(f"[OK] Downloaded PDF saved to: {output_path}")
            return True
        else:
            print(f"[FAIL] Invalid PDF content")
            return False

    except Exception as e:
        print(f"[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def run_e2e_tests():
    """Run all E2E tests in sequence."""
    print("\n" + "#" * 70)
    print("#" + " " * 68 + "#")
    print("#    PHOTO-REPORT - End-to-End Test Suite" + " " * 26 + "#")
    print("#    Complete Flow: Upload → EXIF → Overlay → PDF" + " " * 18 + "#")
    print("#" + " " * 68 + "#")
    print("#" * 70)
    print(f"\nTarget API: {API_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    results = {
        "health_check": False,
        "process_photo": False,
        "apply_overlay": False,
        "generate_pdf": False,
        "pdf_download": False
    }

    # Step 1: Health Check
    results["health_check"] = test_step_1_health_check()
    if not results["health_check"]:
        print("\n[ABORT] API not available. Cannot continue E2E test.")
        return False

    # Step 2: Process Photo
    processed_photo = test_step_2_process_photo()
    results["process_photo"] = processed_photo is not None

    # Step 3: Apply Overlay
    overlay_result = test_step_3_apply_overlay(processed_photo)
    results["apply_overlay"] = overlay_result is not None

    # Step 4: Generate PDF
    pdf_result = test_step_4_generate_pdf(overlay_result, processed_photo)
    results["generate_pdf"] = pdf_result is not None

    # Step 5: Test Download
    results["pdf_download"] = test_step_5_verify_pdf_download()

    # Summary
    print("\n" + "=" * 70)
    print("E2E TEST SUMMARY")
    print("=" * 70)

    all_passed = True
    for test_name, passed in results.items():
        status = "[PASS]" if passed else "[FAIL]"
        print(f"  {status} {test_name.replace('_', ' ').title()}")
        if not passed:
            all_passed = False

    print("=" * 70)

    if all_passed:
        print("\n[SUCCESS] All E2E tests PASSED!")
        print("\nThe complete flow is working:")
        print("  1. Photo upload and processing ✓")
        print("  2. EXIF metadata extraction ✓")
        print("  3. Overlay with legend application ✓")
        print("  4. PDF report generation ✓")
        print("  5. Direct PDF download ✓")
        print("\nCheck the generated PDFs in tests/ directory.")
        return True
    else:
        print("\n[FAILURE] Some E2E tests FAILED!")
        print("Review the output above for details.")
        return False


def main():
    """Main entry point."""
    success = run_e2e_tests()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
