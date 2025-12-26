# Photo Processor - FastAPI Container
# Processa fotos, extrai EXIF, gera overlays e PDFs

FROM python:3.11-slim

# Metadados
LABEL maintainer="Photo Report Team"
LABEL description="Photo Processor API for EXIF extraction, overlay generation and PDF compilation"
LABEL version="1.0.0"

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias para:
# - pycairo (cairo, pkg-config)
# - Pillow (libjpeg, zlib, libpng)
# - WeasyPrint (pango, gdk-pixbuf, libffi)
# - py-staticmaps (cairo)
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Cairo e dependências para pycairo/py-staticmaps
    libcairo2-dev \
    pkg-config \
    # Pillow dependencies
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    # WeasyPrint dependencies
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    # Fonts para overlays e PDFs
    fonts-dejavu-core \
    fonts-liberation \
    # Build tools
    gcc \
    g++ \
    # Cleanup
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copiar requirements primeiro (cache de camadas Docker)
# Nota: context é o diretório pai (src/), então paths são relativos a src/
COPY python/requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY python/ .

# Criar diretório para arquivos temporários
RUN mkdir -p /tmp/photo-processor

# Expor porta da API
EXPOSE 8002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8002/health')" || exit 1

# Comando para iniciar a API
CMD ["uvicorn", "processor:app", "--host", "0.0.0.0", "--port", "8002"]
