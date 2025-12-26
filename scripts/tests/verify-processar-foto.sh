#!/bin/bash
# Verify /processar-foto endpoint
# This script tests the endpoint by sending a test image

echo "============================================================"
echo "PHOTO-REPORT - Verify /processar-foto endpoint"
echo "============================================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Check if container is running
echo "Checking if photo-processor container is running..."
if ! docker ps --filter "name=photo-processor" --format "{{.Names}}" | grep -q "photo-processor"; then
    echo "[WARN] Container not running. Starting..."
    cd "$PROJECT_DIR/src/docker"
    docker-compose up -d
    echo "Waiting 5 seconds for container to start..."
    sleep 5
fi

# Test health endpoint first
echo ""
echo "Testing /health endpoint..."
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:8002/health

echo ""
echo "============================================================"
echo "Testing /processar-foto endpoint..."
echo "============================================================"

# Try with Python test script if available
if command -v python3 &> /dev/null; then
    echo "Using Python test script..."
    cd "$PROJECT_DIR"
    python3 tests/test_processar_foto.py
    exit $?
elif command -v python &> /dev/null; then
    echo "Using Python test script..."
    cd "$PROJECT_DIR"
    python tests/test_processar_foto.py
    exit $?
fi

# Fallback to curl basic test
echo "Python not found. Using curl basic test..."
echo "Note: For full test, run: python tests/test_processar_foto.py"
echo ""

# Test with empty file to check error handling
echo "Testing error handling (empty file)..."
TEMP_FILE=$(mktemp)
curl -s -X POST http://localhost:8002/processar-foto -F "file=@$TEMP_FILE"
rm -f "$TEMP_FILE"

echo ""
echo "============================================================"
echo "For complete testing with real image:"
echo "1. Place a JPEG with EXIF/GPS in tests/ folder"
echo "2. Run: curl -X POST -F \"file=@tests/your-photo.jpg\" http://localhost:8002/processar-foto"
echo "============================================================"

echo ""
echo "Done."
