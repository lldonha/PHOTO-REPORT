# -*- coding: utf-8 -*-
"""
PHOTO-REPORT - Módulo de Geração de Overlay
Aplica overlay com metadados EXIF e legenda customizável em imagens usando Pillow.

Autor: auto-claude
Data: 2025-12-26
"""

import logging
from typing import Optional, Dict, Any
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

# Configuração de logging
logger = logging.getLogger(__name__)

# Configurações do overlay
ALTURA_BARRA = 100  # Altura da barra inferior em pixels
COR_FUNDO = (0, 0, 0, 200)  # Preto semi-transparente (RGBA)
COR_TEXTO = "white"
COR_LEGENDA = "yellow"
MARGEM = 15  # Margem horizontal
TAMANHO_FONTE_NORMAL = 14
TAMANHO_FONTE_LEGENDA = 16
MAX_CARACTERES_LEGENDA = 80


def carregar_fonte(tamanho: int) -> ImageFont.FreeTypeFont:
    """
    Carrega uma fonte TrueType para desenho de texto.

    Args:
        tamanho: Tamanho da fonte em pixels

    Returns:
        Objeto de fonte Pillow

    Note:
        Tenta carregar fontes do sistema, fallback para fonte padrão.
    """
    fontes_sistema = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
    ]

    for fonte_path in fontes_sistema:
        try:
            return ImageFont.truetype(fonte_path, tamanho)
        except (OSError, IOError):
            continue

    # Fallback para fonte padrão do Pillow
    logger.warning("Nenhuma fonte TrueType encontrada, usando fonte padrão")
    return ImageFont.load_default()


def truncar_legenda(legenda: str, max_chars: int = MAX_CARACTERES_LEGENDA) -> str:
    """
    Trunca legenda se exceder o limite de caracteres.

    Args:
        legenda: Texto da legenda
        max_chars: Número máximo de caracteres

    Returns:
        Legenda truncada com "..." se necessário

    Example:
        >>> truncar_legenda("Texto muito longo...", 10)
        'Texto m...'
    """
    if not legenda:
        return ""

    legenda = legenda.strip()

    if len(legenda) <= max_chars:
        return legenda

    return legenda[:max_chars - 3] + "..."


def criar_barra_overlay(
    largura: int,
    data_hora: str,
    gps_string: str,
    direcao_cardeal: str,
    legenda: str
) -> Image.Image:
    """
    Cria a barra de overlay com informações.

    Args:
        largura: Largura da imagem em pixels
        data_hora: Data/hora formatada para exibição
        gps_string: Coordenadas GPS formatadas
        direcao_cardeal: Direção cardeal com ícone
        legenda: Texto da legenda customizada

    Returns:
        Imagem PIL da barra de overlay (RGBA)
    """
    # Cria barra semi-transparente
    barra = Image.new('RGBA', (largura, ALTURA_BARRA), COR_FUNDO)
    draw = ImageDraw.Draw(barra)

    # Carrega fontes
    fonte_normal = carregar_fonte(TAMANHO_FONTE_NORMAL)
    fonte_legenda = carregar_fonte(TAMANHO_FONTE_LEGENDA)

    # Posições Y para cada linha
    y_linha1 = 8   # Data/hora
    y_linha2 = 28  # GPS
    y_linha3 = 48  # Direção
    y_linha4 = 72  # Legenda

    # Desenha informações com emojis
    # Linha 1: Data/hora
    texto_data = f"📅 {data_hora}" if data_hora and data_hora != "-" else "📅 -"
    draw.text((MARGEM, y_linha1), texto_data, fill=COR_TEXTO, font=fonte_normal)

    # Linha 2: Coordenadas GPS
    texto_gps = f"📍 {gps_string}" if gps_string and gps_string != "-" else "📍 -"
    draw.text((MARGEM, y_linha2), texto_gps, fill=COR_TEXTO, font=fonte_normal)

    # Linha 3: Direção da bússola
    texto_direcao = f"🧭 {direcao_cardeal}" if direcao_cardeal and direcao_cardeal != "-" else "🧭 -"
    draw.text((MARGEM, y_linha3), texto_direcao, fill=COR_TEXTO, font=fonte_normal)

    # Linha 4: Legenda (em amarelo para destaque)
    legenda_truncada = truncar_legenda(legenda)
    if legenda_truncada:
        draw.text((MARGEM, y_linha4), legenda_truncada, fill=COR_LEGENDA, font=fonte_legenda)

    return barra


def aplicar_mascara(
    dados_imagem: bytes,
    data_hora: Optional[str] = None,
    gps_string: Optional[str] = None,
    direcao_cardeal: Optional[str] = None,
    legenda: Optional[str] = None,
    mini_mapa: Optional[bytes] = None
) -> bytes:
    """
    Aplica overlay/máscara com informações na imagem.

    Adiciona uma barra semi-transparente na parte inferior da imagem
    contendo data/hora, coordenadas GPS, direção da bússola e legenda.
    Opcionalmente, adiciona um mini-mapa no canto superior direito.

    Args:
        dados_imagem: Bytes da imagem original (JPEG/PNG)
        data_hora: Data/hora formatada para exibição
        gps_string: Coordenadas GPS formatadas (ex: "-23.550000, -46.630000")
        direcao_cardeal: Direção cardeal com ícone (ex: "N ↑")
        legenda: Texto customizado da legenda
        mini_mapa: Bytes do mini-mapa (opcional, 150x150px)

    Returns:
        Bytes da imagem com overlay aplicado (JPEG)

    Raises:
        ValueError: Se a imagem não puder ser processada

    Example:
        >>> from overlay_generator import aplicar_mascara
        >>> with open("foto.jpg", "rb") as f:
        ...     dados = f.read()
        >>> resultado = aplicar_mascara(
        ...     dados,
        ...     data_hora="26/12/2025 14:30",
        ...     gps_string="-23.550000, -46.630000",
        ...     direcao_cardeal="N ↑",
        ...     legenda="Vista frontal da obra"
        ... )
    """
    try:
        logger.info("Aplicando overlay na imagem")

        # Abre a imagem original
        imagem_original = Image.open(BytesIO(dados_imagem))

        # Converte para RGB se necessário (para salvar como JPEG)
        if imagem_original.mode in ('RGBA', 'P'):
            # Cria fundo branco para imagens com transparência
            fundo = Image.new('RGB', imagem_original.size, (255, 255, 255))
            if imagem_original.mode == 'P':
                imagem_original = imagem_original.convert('RGBA')
            fundo.paste(imagem_original, mask=imagem_original.split()[-1] if imagem_original.mode == 'RGBA' else None)
            imagem_original = fundo
        elif imagem_original.mode != 'RGB':
            imagem_original = imagem_original.convert('RGB')

        largura, altura = imagem_original.size
        logger.debug(f"Imagem original: {largura}x{altura}")

        # Cria nova imagem com espaço para a barra
        nova_altura = altura + ALTURA_BARRA
        imagem_final = Image.new('RGB', (largura, nova_altura), (0, 0, 0))

        # Cola imagem original no topo
        imagem_final.paste(imagem_original, (0, 0))

        # Cria e cola barra de overlay
        barra = criar_barra_overlay(
            largura=largura,
            data_hora=data_hora or "-",
            gps_string=gps_string or "-",
            direcao_cardeal=direcao_cardeal or "-",
            legenda=legenda or ""
        )

        # Converte barra RGBA para RGB para colar
        barra_rgb = Image.new('RGB', barra.size, (0, 0, 0))
        barra_rgb.paste(barra, mask=barra.split()[3])  # Usa canal alpha como máscara
        imagem_final.paste(barra_rgb, (0, altura))

        # Adiciona mini-mapa no canto superior direito (se fornecido)
        if mini_mapa:
            try:
                mapa = Image.open(BytesIO(mini_mapa))

                # Garante tamanho 150x150
                if mapa.size != (150, 150):
                    mapa = mapa.resize((150, 150), Image.Resampling.LANCZOS)

                # Converte para RGB se necessário
                if mapa.mode != 'RGB':
                    if mapa.mode == 'RGBA':
                        fundo_mapa = Image.new('RGB', mapa.size, (255, 255, 255))
                        fundo_mapa.paste(mapa, mask=mapa.split()[3])
                        mapa = fundo_mapa
                    else:
                        mapa = mapa.convert('RGB')

                # Adiciona borda ao mini-mapa
                borda = 3
                mapa_com_borda = Image.new('RGB', (150 + 2*borda, 150 + 2*borda), (255, 255, 255))
                mapa_com_borda.paste(mapa, (borda, borda))

                # Posição: canto superior direito com margem
                margem_mapa = 10
                pos_x = largura - 150 - 2*borda - margem_mapa
                pos_y = margem_mapa

                imagem_final.paste(mapa_com_borda, (pos_x, pos_y))
                logger.debug(f"Mini-mapa adicionado em ({pos_x}, {pos_y})")

            except Exception as e:
                logger.warning(f"Erro ao adicionar mini-mapa: {e}")

        # Salva resultado em bytes
        buffer = BytesIO()
        imagem_final.save(buffer, format='JPEG', quality=90, optimize=True)
        buffer.seek(0)

        logger.info(f"Overlay aplicado com sucesso. Tamanho final: {largura}x{nova_altura}")
        return buffer.getvalue()

    except Exception as e:
        logger.error(f"Erro ao aplicar overlay: {e}")
        raise ValueError(f"Não foi possível processar a imagem: {e}")


def criar_thumbnail(dados_imagem: bytes, tamanho: tuple = (300, 300)) -> bytes:
    """
    Cria thumbnail da imagem.

    Args:
        dados_imagem: Bytes da imagem original
        tamanho: Tupla (largura, altura) máxima do thumbnail

    Returns:
        Bytes do thumbnail em JPEG

    Example:
        >>> thumb = criar_thumbnail(dados_foto, (200, 200))
    """
    try:
        imagem = Image.open(BytesIO(dados_imagem))

        # Converte para RGB se necessário
        if imagem.mode != 'RGB':
            imagem = imagem.convert('RGB')

        # Cria thumbnail mantendo proporção
        imagem.thumbnail(tamanho, Image.Resampling.LANCZOS)

        buffer = BytesIO()
        imagem.save(buffer, format='JPEG', quality=85)
        buffer.seek(0)

        return buffer.getvalue()

    except Exception as e:
        logger.error(f"Erro ao criar thumbnail: {e}")
        raise ValueError(f"Não foi possível criar thumbnail: {e}")
