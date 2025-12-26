# -*- coding: utf-8 -*-
"""
PHOTO-REPORT - API Principal FastAPI
Processa fotos de obra: extração EXIF, overlay com metadados e geração de PDF.

Endpoints:
- GET  /health         - Status do container
- POST /processar-foto - Extrai EXIF e retorna metadados + mini mapa
- POST /aplicar-mascara - Gera overlay com metadados e legenda
- POST /gerar-pdf      - Compila fotos processadas em PDF

Porta: 8002

Autor: auto-claude
Data: 2025-12-26
"""

import logging
import base64
from typing import Optional, List
from io import BytesIO

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from starlette.middleware.base import BaseHTTPMiddleware

# Módulos locais
from exif_extractor import extrair_exif, formatar_data_hora
from overlay_generator import aplicar_mascara, criar_thumbnail
from map_generator import gerar_minimapa
from pdf_generator import gerar_pdf

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Criação da aplicação FastAPI
app = FastAPI(
    title="PHOTO-REPORT API",
    description="API para processamento de fotos de obra com extração EXIF, overlay e geração de PDF",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware customizado para adicionar cabeçalhos CORS
class CORSHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Handle preflight requests
        if request.method == "OPTIONS":
            response = Response(status_code=200)
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Max-Age"] = "3600"
            return response

        # Process normal requests
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

# Adicionar o middleware customizado
app.add_middleware(CORSHeaderMiddleware)

# Configuração de CORS para permitir acesso do frontend (backup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios permitidos
    allow_credentials=False,  # Não pode ser True com allow_origins=["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# ============================================================================
# Modelos Pydantic
# ============================================================================

class HealthResponse(BaseModel):
    """Resposta do endpoint de health check."""
    status: str
    version: str
    service: str


class MetadadosExif(BaseModel):
    """Metadados EXIF extraídos da imagem."""
    data_hora: Optional[str] = None
    data_hora_formatada: str = "-"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    gps_string: str = "-"
    direcao_graus: Optional[float] = None
    direcao_cardeal: str = "-"
    tem_gps: bool = False
    tem_direcao: bool = False


class ProcessarFotoResponse(BaseModel):
    """Resposta do endpoint /processar-foto."""
    sucesso: bool
    mensagem: str
    metadados: MetadadosExif
    imagem_base64: str
    thumbnail_base64: Optional[str] = None
    minimapa_base64: Optional[str] = None


class AplicarMascaraRequest(BaseModel):
    """Request para o endpoint /aplicar-mascara."""
    imagem_base64: str
    data_hora: Optional[str] = None
    gps_string: Optional[str] = None
    direcao_cardeal: Optional[str] = None
    legenda: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    direcao_graus: Optional[float] = None
    incluir_minimapa: bool = True


class AplicarMascaraResponse(BaseModel):
    """Resposta do endpoint /aplicar-mascara."""
    sucesso: bool
    mensagem: str
    imagem_base64: str


class FotoParaPdf(BaseModel):
    """Dados de uma foto para inclusão no PDF."""
    imagem_base64: str
    legenda: Optional[str] = None


class GerarPdfRequest(BaseModel):
    """Request para o endpoint /gerar-pdf."""
    fotos: List[FotoParaPdf]
    titulo: str = "Relatório Fotográfico"
    obra: str = "-"
    responsavel: str = "-"


class GerarPdfResponse(BaseModel):
    """Resposta do endpoint /gerar-pdf."""
    sucesso: bool
    mensagem: str
    pdf_base64: str
    num_paginas: int
    num_fotos: int


# ============================================================================
# Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Verifica o status do serviço.

    Returns:
        HealthResponse com status "ok" se o serviço está funcionando.
    """
    logger.info("Health check solicitado")
    return HealthResponse(
        status="ok",
        version="1.0.0",
        service="photo-processor"
    )


@app.post("/processar-foto", response_model=ProcessarFotoResponse)
async def processar_foto(file: UploadFile = File(...)):
    """
    Processa uma foto: extrai metadados EXIF e gera mini-mapa.

    Recebe uma imagem JPEG/PNG, extrai data/hora, coordenadas GPS e
    direção da bússola. Se houver coordenadas GPS, gera um mini-mapa.

    Args:
        file: Arquivo de imagem (JPEG/PNG)

    Returns:
        ProcessarFotoResponse com metadados, imagem em base64, thumbnail e mini-mapa

    Raises:
        HTTPException: Se ocorrer erro no processamento
    """
    try:
        logger.info(f"Processando foto: {file.filename}")

        # Lê bytes da imagem
        dados_imagem = await file.read()

        if not dados_imagem:
            raise HTTPException(
                status_code=400,
                detail="Arquivo de imagem vazio"
            )

        # Extrai metadados EXIF
        exif = extrair_exif(dados_imagem)

        # Formata data/hora para exibição
        data_hora_formatada = formatar_data_hora(exif.get("data_hora"))

        # Cria objeto de metadados
        metadados = MetadadosExif(
            data_hora=exif.get("data_hora"),
            data_hora_formatada=data_hora_formatada,
            latitude=exif.get("latitude"),
            longitude=exif.get("longitude"),
            gps_string=exif.get("gps_string", "-"),
            direcao_graus=exif.get("direcao_graus"),
            direcao_cardeal=exif.get("direcao_cardeal", "-"),
            tem_gps=exif.get("tem_gps", False),
            tem_direcao=exif.get("tem_direcao", False)
        )

        # Converte imagem para base64
        imagem_base64 = base64.b64encode(dados_imagem).decode('utf-8')

        # Gera thumbnail
        thumbnail_base64 = None
        try:
            thumbnail_bytes = criar_thumbnail(dados_imagem, (300, 300))
            thumbnail_base64 = base64.b64encode(thumbnail_bytes).decode('utf-8')
        except Exception as e:
            logger.warning(f"Erro ao gerar thumbnail: {e}")

        # Gera mini-mapa se tiver GPS
        minimapa_base64 = None
        if metadados.tem_gps and metadados.latitude and metadados.longitude:
            try:
                mapa_bytes = gerar_minimapa(
                    latitude=metadados.latitude,
                    longitude=metadados.longitude,
                    direcao_graus=metadados.direcao_graus
                )
                if mapa_bytes:
                    minimapa_base64 = base64.b64encode(mapa_bytes).decode('utf-8')
                    logger.info("Mini-mapa gerado com sucesso")
            except Exception as e:
                logger.warning(f"Erro ao gerar mini-mapa: {e}")

        logger.info(f"Foto processada com sucesso: GPS={metadados.tem_gps}, Direção={metadados.tem_direcao}")

        return ProcessarFotoResponse(
            sucesso=True,
            mensagem="Foto processada com sucesso",
            metadados=metadados,
            imagem_base64=imagem_base64,
            thumbnail_base64=thumbnail_base64,
            minimapa_base64=minimapa_base64
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar foto: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar foto: {str(e)}"
        )


@app.post("/aplicar-mascara", response_model=AplicarMascaraResponse)
async def aplicar_mascara_endpoint(request: AplicarMascaraRequest):
    """
    Aplica overlay/máscara com metadados e legenda na imagem.

    Recebe uma imagem em base64 e informações de metadados,
    retorna a imagem com overlay aplicado (barra inferior com
    data, GPS, direção e legenda).

    Args:
        request: AplicarMascaraRequest com imagem e metadados

    Returns:
        AplicarMascaraResponse com imagem processada em base64

    Raises:
        HTTPException: Se ocorrer erro no processamento
    """
    try:
        logger.info("Aplicando máscara na imagem")

        # Decodifica imagem de base64
        try:
            dados_imagem = base64.b64decode(request.imagem_base64)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Imagem base64 inválida: {str(e)}"
            )

        # Gera mini-mapa se solicitado e tiver coordenadas
        mini_mapa = None
        if request.incluir_minimapa and request.latitude and request.longitude:
            try:
                mini_mapa = gerar_minimapa(
                    latitude=request.latitude,
                    longitude=request.longitude,
                    direcao_graus=request.direcao_graus
                )
            except Exception as e:
                logger.warning(f"Erro ao gerar mini-mapa para overlay: {e}")

        # Aplica máscara/overlay
        imagem_processada = aplicar_mascara(
            dados_imagem=dados_imagem,
            data_hora=request.data_hora,
            gps_string=request.gps_string,
            direcao_cardeal=request.direcao_cardeal,
            legenda=request.legenda,
            mini_mapa=mini_mapa
        )

        # Converte resultado para base64
        imagem_base64 = base64.b64encode(imagem_processada).decode('utf-8')

        logger.info("Máscara aplicada com sucesso")

        return AplicarMascaraResponse(
            sucesso=True,
            mensagem="Overlay aplicado com sucesso",
            imagem_base64=imagem_base64
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao aplicar máscara: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao aplicar overlay: {str(e)}"
        )


@app.post("/gerar-pdf")
async def gerar_pdf_endpoint(request: GerarPdfRequest):
    """
    Gera PDF com as fotos processadas.

    Recebe lista de fotos com imagens em base64 e legendas,
    gera PDF A4 com layout 2x3 (6 fotos por página) e cabeçalho
    com título, obra e responsável.

    Args:
        request: GerarPdfRequest com lista de fotos e informações do relatório

    Returns:
        Response com PDF em bytes (Content-Type: application/pdf)
        ou GerarPdfResponse com PDF em base64 se Accept: application/json

    Raises:
        HTTPException: Se ocorrer erro na geração do PDF
    """
    try:
        logger.info(f"Gerando PDF com {len(request.fotos)} fotos")

        if not request.fotos:
            raise HTTPException(
                status_code=400,
                detail="Nenhuma foto fornecida para gerar o PDF"
            )

        # Prepara lista de fotos para o gerador
        fotos_para_pdf = []
        for foto in request.fotos:
            fotos_para_pdf.append({
                "imagem_base64": foto.imagem_base64,
                "legenda": foto.legenda or ""
            })

        # Gera PDF
        pdf_bytes = gerar_pdf(
            fotos=fotos_para_pdf,
            titulo=request.titulo,
            obra=request.obra,
            responsavel=request.responsavel
        )

        # Calcula número de páginas
        num_paginas = (len(request.fotos) + 5) // 6  # Ceil division

        logger.info(f"PDF gerado: {len(pdf_bytes)} bytes, {num_paginas} página(s)")

        # Retorna como JSON com base64
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')

        return GerarPdfResponse(
            sucesso=True,
            mensagem=f"PDF gerado com sucesso: {num_paginas} página(s), {len(request.fotos)} foto(s)",
            pdf_base64=pdf_base64,
            num_paginas=num_paginas,
            num_fotos=len(request.fotos)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao gerar PDF: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar PDF: {str(e)}"
        )


@app.post("/gerar-pdf/download")
async def gerar_pdf_download(request: GerarPdfRequest):
    """
    Gera PDF e retorna como arquivo para download direto.

    Mesmo comportamento de /gerar-pdf, mas retorna o PDF
    diretamente como bytes com Content-Type application/pdf.

    Args:
        request: GerarPdfRequest com lista de fotos e informações do relatório

    Returns:
        Response com PDF em bytes para download

    Raises:
        HTTPException: Se ocorrer erro na geração do PDF
    """
    try:
        logger.info(f"Gerando PDF para download com {len(request.fotos)} fotos")

        if not request.fotos:
            raise HTTPException(
                status_code=400,
                detail="Nenhuma foto fornecida para gerar o PDF"
            )

        # Prepara lista de fotos para o gerador
        fotos_para_pdf = []
        for foto in request.fotos:
            fotos_para_pdf.append({
                "imagem_base64": foto.imagem_base64,
                "legenda": foto.legenda or ""
            })

        # Gera PDF
        pdf_bytes = gerar_pdf(
            fotos=fotos_para_pdf,
            titulo=request.titulo,
            obra=request.obra,
            responsavel=request.responsavel
        )

        logger.info(f"PDF gerado para download: {len(pdf_bytes)} bytes")

        # Retorna como arquivo PDF para download
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="relatorio-fotografico.pdf"'
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao gerar PDF para download: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar PDF: {str(e)}"
        )


# ============================================================================
# Startup e Shutdown
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Evento executado ao iniciar a aplicação."""
    logger.info("=" * 60)
    logger.info("PHOTO-REPORT API iniciando...")
    logger.info("Versão: 1.0.0")
    logger.info("Porta: 8002")
    logger.info("Docs: http://localhost:8002/docs")
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Evento executado ao encerrar a aplicação."""
    logger.info("PHOTO-REPORT API encerrando...")


# ============================================================================
# Entry point para desenvolvimento
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "processor:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )
