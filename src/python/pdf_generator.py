# -*- coding: utf-8 -*-
"""
PHOTO-REPORT - Módulo de Geração de PDF
Gera relatórios PDF com WeasyPrint a partir de fotos processadas.
Layout: A4 com 6 fotos por página (grid 2x3), cabeçalho com título/obra/responsável.

Autor: auto-claude
Data: 2025-12-26
"""

import logging
import base64
from typing import List, Optional, Dict, Any
from io import BytesIO
from datetime import datetime

from jinja2 import Template
from weasyprint import HTML, CSS

# Configuração de logging
logger = logging.getLogger(__name__)

# Configurações do PDF
FOTOS_POR_PAGINA = 6  # Grid 2x3
COLUNAS_POR_LINHA = 2


# Template HTML para o PDF
TEMPLATE_PDF = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 15mm 10mm 15mm 10mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10pt;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 10mm;
            padding-bottom: 5mm;
            border-bottom: 2px solid #333;
        }

        .header h1 {
            font-size: 16pt;
            margin-bottom: 3mm;
            color: #1a1a1a;
        }

        .header-info {
            font-size: 10pt;
            color: #555;
        }

        .header-info span {
            margin: 0 10px;
        }

        .page {
            page-break-after: always;
        }

        .page:last-child {
            page-break-after: avoid;
        }

        .foto-grid {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .foto-row {
            display: table-row;
        }

        .foto-item {
            display: table-cell;
            width: 50%;
            padding: 3mm;
            vertical-align: top;
            text-align: center;
        }

        .foto-container {
            border: 1px solid #ccc;
            border-radius: 3px;
            overflow: hidden;
            background: #f9f9f9;
        }

        .foto-imagem {
            width: 100%;
            height: auto;
            max-height: 75mm;
            object-fit: contain;
            display: block;
        }

        .foto-legenda {
            padding: 2mm;
            font-size: 8pt;
            color: #666;
            background: #f0f0f0;
            text-align: left;
            min-height: 8mm;
        }

        .foto-numero {
            font-weight: bold;
            color: #333;
            margin-right: 3px;
        }

        .footer {
            text-align: center;
            font-size: 8pt;
            color: #888;
            margin-top: 5mm;
            padding-top: 3mm;
            border-top: 1px solid #ddd;
        }

        .page-number {
            position: running(pageNumber);
        }

        @page {
            @bottom-center {
                content: "Página " counter(page) " de " counter(pages);
                font-size: 8pt;
                color: #888;
            }
        }
    </style>
</head>
<body>
    {% for pagina in paginas %}
    <div class="page">
        {% if loop.first %}
        <div class="header">
            <h1>📷 {{ titulo }}</h1>
            <div class="header-info">
                <span><strong>Obra:</strong> {{ obra }}</span>
                <span><strong>Responsável:</strong> {{ responsavel }}</span>
                <span><strong>Data:</strong> {{ data_geracao }}</span>
            </div>
        </div>
        {% endif %}

        <div class="foto-grid">
            {% for linha in pagina %}
            <div class="foto-row">
                {% for foto in linha %}
                <div class="foto-item">
                    <div class="foto-container">
                        <img class="foto-imagem" src="data:image/jpeg;base64,{{ foto.imagem_base64 }}" alt="Foto {{ foto.numero }}">
                        <div class="foto-legenda">
                            <span class="foto-numero">{{ foto.numero }}.</span>
                            {{ foto.legenda or "-" }}
                        </div>
                    </div>
                </div>
                {% endfor %}
                {% if linha|length < 2 %}
                <div class="foto-item"></div>
                {% endif %}
            </div>
            {% endfor %}
        </div>

        {% if loop.last %}
        <div class="footer">
            Relatório gerado automaticamente pelo sistema PHOTO-REPORT
        </div>
        {% endif %}
    </div>
    {% endfor %}
</body>
</html>
"""


def _dividir_em_paginas(fotos: List[Dict[str, Any]]) -> List[List[List[Dict[str, Any]]]]:
    """
    Divide a lista de fotos em páginas com grid 2x3.

    Args:
        fotos: Lista de dicionários com dados das fotos

    Returns:
        Lista de páginas, onde cada página é uma lista de linhas,
        e cada linha é uma lista de até 2 fotos

    Example:
        >>> fotos = [{'imagem_base64': '...', 'legenda': 'Foto 1'}] * 8
        >>> paginas = _dividir_em_paginas(fotos)
        >>> len(paginas)  # 2 páginas
        2
        >>> len(paginas[0])  # 3 linhas na primeira página
        3
    """
    paginas = []
    fotos_numeradas = []

    # Adiciona número sequencial a cada foto
    for i, foto in enumerate(fotos, start=1):
        foto_com_numero = foto.copy()
        foto_com_numero['numero'] = i
        fotos_numeradas.append(foto_com_numero)

    # Divide em grupos de FOTOS_POR_PAGINA
    for i in range(0, len(fotos_numeradas), FOTOS_POR_PAGINA):
        fotos_pagina = fotos_numeradas[i:i + FOTOS_POR_PAGINA]

        # Divide cada página em linhas de COLUNAS_POR_LINHA fotos
        linhas = []
        for j in range(0, len(fotos_pagina), COLUNAS_POR_LINHA):
            linha = fotos_pagina[j:j + COLUNAS_POR_LINHA]
            linhas.append(linha)

        paginas.append(linhas)

    return paginas


def _imagem_para_base64(dados_imagem: bytes) -> str:
    """
    Converte bytes de imagem para string base64.

    Args:
        dados_imagem: Bytes da imagem

    Returns:
        String base64 da imagem
    """
    return base64.b64encode(dados_imagem).decode('utf-8')


def gerar_pdf(
    fotos: List[Dict[str, Any]],
    titulo: str = "Relatório Fotográfico",
    obra: str = "-",
    responsavel: str = "-"
) -> bytes:
    """
    Gera um PDF com as fotos processadas.

    Layout: A4 com 6 fotos por página (grid 2x3), cabeçalho com informações
    do relatório na primeira página.

    Args:
        fotos: Lista de dicionários com:
            - imagem_base64 (str): Imagem em base64 (obrigatório)
            - legenda (str): Legenda da foto (opcional)
        titulo: Título do relatório
        obra: Nome/identificação da obra
        responsavel: Nome do responsável técnico

    Returns:
        Bytes do arquivo PDF gerado

    Raises:
        ValueError: Se nenhuma foto for fornecida ou se o PDF não puder ser gerado

    Example:
        >>> from pdf_generator import gerar_pdf
        >>> fotos = [
        ...     {"imagem_base64": "...", "legenda": "Vista frontal"},
        ...     {"imagem_base64": "...", "legenda": "Detalhe fundação"}
        ... ]
        >>> pdf = gerar_pdf(fotos, titulo="Vistoria Obra X", obra="Obra 123")
        >>> with open("relatorio.pdf", "wb") as f:
        ...     f.write(pdf)
    """
    if not fotos:
        raise ValueError("Nenhuma foto fornecida para gerar o PDF")

    try:
        logger.info(f"Gerando PDF com {len(fotos)} fotos")

        # Data de geração formatada
        data_geracao = datetime.now().strftime("%d/%m/%Y %H:%M")

        # Divide fotos em páginas
        paginas = _dividir_em_paginas(fotos)
        logger.debug(f"PDF terá {len(paginas)} página(s)")

        # Renderiza template HTML
        template = Template(TEMPLATE_PDF)
        html_content = template.render(
            paginas=paginas,
            titulo=titulo,
            obra=obra,
            responsavel=responsavel,
            data_geracao=data_geracao
        )

        # Converte HTML para PDF com WeasyPrint
        html = HTML(string=html_content)

        # Gera PDF em memória
        buffer = BytesIO()
        html.write_pdf(buffer)
        buffer.seek(0)

        pdf_bytes = buffer.getvalue()
        logger.info(f"PDF gerado com sucesso: {len(pdf_bytes)} bytes, {len(paginas)} página(s)")

        return pdf_bytes

    except Exception as e:
        logger.error(f"Erro ao gerar PDF: {e}")
        raise ValueError(f"Não foi possível gerar o PDF: {e}")


def gerar_pdf_de_imagens(
    imagens: List[bytes],
    legendas: Optional[List[str]] = None,
    titulo: str = "Relatório Fotográfico",
    obra: str = "-",
    responsavel: str = "-"
) -> bytes:
    """
    Gera PDF a partir de lista de bytes de imagens.

    Versão simplificada que aceita bytes de imagens diretamente,
    convertendo-as para base64 internamente.

    Args:
        imagens: Lista de bytes de imagens JPEG/PNG
        legendas: Lista de legendas (mesma ordem das imagens)
        titulo: Título do relatório
        obra: Nome/identificação da obra
        responsavel: Nome do responsável técnico

    Returns:
        Bytes do arquivo PDF gerado

    Example:
        >>> with open("foto1.jpg", "rb") as f:
        ...     img1 = f.read()
        >>> with open("foto2.jpg", "rb") as f:
        ...     img2 = f.read()
        >>> pdf = gerar_pdf_de_imagens(
        ...     [img1, img2],
        ...     legendas=["Vista 1", "Vista 2"],
        ...     titulo="Vistoria"
        ... )
    """
    if not imagens:
        raise ValueError("Nenhuma imagem fornecida para gerar o PDF")

    # Prepara legendas
    if legendas is None:
        legendas = [""] * len(imagens)
    elif len(legendas) < len(imagens):
        # Preenche legendas faltantes com string vazia
        legendas = list(legendas) + [""] * (len(imagens) - len(legendas))

    # Converte imagens para formato esperado
    fotos = []
    for i, img_bytes in enumerate(imagens):
        fotos.append({
            "imagem_base64": _imagem_para_base64(img_bytes),
            "legenda": legendas[i] if i < len(legendas) else ""
        })

    return gerar_pdf(fotos, titulo, obra, responsavel)


def calcular_paginas(num_fotos: int) -> int:
    """
    Calcula o número de páginas necessárias para um número de fotos.

    Args:
        num_fotos: Número total de fotos

    Returns:
        Número de páginas no PDF

    Example:
        >>> calcular_paginas(5)
        1
        >>> calcular_paginas(7)
        2
        >>> calcular_paginas(12)
        2
    """
    if num_fotos <= 0:
        return 0
    return (num_fotos + FOTOS_POR_PAGINA - 1) // FOTOS_POR_PAGINA
