#!/bin/bash
# ============================================================================
# PHOTO-REPORT - End-to-End Test Runner (Linux/Mac)
# Tests the complete flow: upload -> EXIF extraction -> overlay -> PDF
# ============================================================================

echo ""
echo "========================================================================"
echo " PHOTO-REPORT - End-to-End Test"
echo " Complete Flow: Upload -> EXIF -> Overlay -> PDF"
echo "========================================================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "[ERROR] Python is not installed"
        echo "        Please install Python 3.8 or higher"
        exit 1
    fi
    PYTHON=python
else
    PYTHON=python3
fi

echo "[INFO] Using: $($PYTHON --version)"

# Check if container is running
echo "[INFO] Checking if photo-processor container is running..."
if ! curl -s -f http://localhost:8002/health > /dev/null 2>&1; then
    echo "[WARN] Container might not be running."
    echo "       Start it with: cd src/docker && docker-compose up -d"
fi

# Change to project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

# Install dependencies if needed
echo "[INFO] Checking Python dependencies..."
if ! $PYTHON -c "import requests" 2>/dev/null; then
    echo "[INFO] Installing requests library..."
    pip install requests
fi

if ! $PYTHON -c "from PIL import Image" 2>/dev/null; then
    echo "[INFO] Installing Pillow library..."
    pip install Pillow
fi

# Create tests output directory if it doesn't exist
mkdir -p tests

# Run the E2E test
echo ""
echo "[INFO] Running E2E test..."
echo ""
$PYTHON tests/test_e2e_complete_flow.py
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "========================================================================"
    echo " E2E TEST PASSED!"
    echo "========================================================================"
    echo ""
    echo "Generated files:"
    [ -f "tests/e2e_test_output.pdf" ] && echo "  - tests/e2e_test_output.pdf"
    [ -f "tests/e2e_download_test.pdf" ] && echo "  - tests/e2e_download_test.pdf"
else
    echo ""
    echo "========================================================================"
    echo " E2E TEST FAILED!"
    echo "========================================================================"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure Docker is running"
    echo "  2. Start the container: cd src/docker && docker-compose up -d"
    echo "  3. Check container logs: docker logs photo-processor"
    echo "  4. Verify health endpoint: curl http://localhost:8002/health"
fi

echo ""
exit $EXIT_CODE
