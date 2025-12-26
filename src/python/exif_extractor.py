# -*- coding: utf-8 -*-
"""
PHOTO-REPORT - Módulo de Extração EXIF
Extrai metadados EXIF de imagens: data/hora, coordenadas GPS e direção da bússola.

Autor: auto-claude
Data: 2025-12-26
"""

import logging
from typing import Optional, Dict, Any
from io import BytesIO
from exif import Image as ExifImage

# Configuração de logging
logger = logging.getLogger(__name__)


def dms_para_decimal(dms: tuple, ref: str) -> Optional[float]:
    """
    Converte coordenadas de graus/minutos/segundos (DMS) para decimal.

    Args:
        dms: Tupla com (graus, minutos, segundos)
        ref: Referência cardinal ('N', 'S', 'E', 'W')

    Returns:
        Coordenada em formato decimal ou None se falhar

    Example:
        >>> dms_para_decimal((23, 33, 1.2), 'S')
        -23.55033333
    """
    if not dms:
        return None
    try:
        graus, minutos, segundos = dms
        decimal = float(graus) + float(minutos) / 60 + float(segundos) / 3600
        if ref in ['S', 'W']:
            decimal = -decimal
        return round(decimal, 8)
    except Exception as e:
        logger.warning(f"Erro ao converter DMS para decimal: {e}")
        return None


def graus_para_cardeal(graus: float) -> str:
    """
    Converte graus de bússola (0-360) para direção cardeal.

    Args:
        graus: Ângulo em graus (0 = Norte, 90 = Leste, etc.)

    Returns:
        Direção cardeal com ícone (ex: "N ↑", "NE ↗", "E →")

    Example:
        >>> graus_para_cardeal(45)
        'NE ↗'
        >>> graus_para_cardeal(180)
        'S ↓'
    """
    if graus is None:
        return "-"

    try:
        graus = float(graus) % 360

        # Direções cardeais com ícones de seta
        direcoes = [
            ("N", "↑"),      # 0° - 22.5°
            ("NE", "↗"),     # 22.5° - 67.5°
            ("E", "→"),      # 67.5° - 112.5°
            ("SE", "↘"),     # 112.5° - 157.5°
            ("S", "↓"),      # 157.5° - 202.5°
            ("SW", "↙"),     # 202.5° - 247.5°
            ("W", "←"),      # 247.5° - 292.5°
            ("NW", "↖"),     # 292.5° - 337.5°
            ("N", "↑"),      # 337.5° - 360°
        ]

        # Calcula o índice baseado em segmentos de 45°
        indice = int((graus + 22.5) / 45) % 8
        direcao, seta = direcoes[indice]

        return f"{direcao} {seta}"
    except Exception as e:
        logger.warning(f"Erro ao converter graus para cardeal: {e}")
        return "-"


def extrair_exif(dados_imagem: bytes) -> Dict[str, Any]:
    """
    Extrai metadados EXIF de uma imagem.

    Args:
        dados_imagem: Bytes da imagem JPEG

    Returns:
        Dicionário com metadados extraídos:
        {
            "data_hora": str ou None,
            "latitude": float ou None,
            "longitude": float ou None,
            "gps_string": str (coordenadas formatadas ou "-"),
            "direcao_graus": float ou None,
            "direcao_cardeal": str (direção com seta ou "-"),
            "tem_gps": bool,
            "tem_direcao": bool
        }

    Raises:
        Não levanta exceções - retorna valores padrão em caso de erro
    """
    resultado = {
        "data_hora": None,
        "latitude": None,
        "longitude": None,
        "gps_string": "-",
        "direcao_graus": None,
        "direcao_cardeal": "-",
        "tem_gps": False,
        "tem_direcao": False
    }

    try:
        # Carrega imagem para extração EXIF
        img = ExifImage(dados_imagem)

        if not img.has_exif:
            logger.info("Imagem não possui dados EXIF")
            return resultado

        # Extrai data/hora original
        try:
            if hasattr(img, 'datetime_original'):
                resultado["data_hora"] = str(img.datetime_original)
            elif hasattr(img, 'datetime'):
                resultado["data_hora"] = str(img.datetime)
        except Exception as e:
            logger.debug(f"Não foi possível extrair data/hora: {e}")

        # Extrai coordenadas GPS
        try:
            if hasattr(img, 'gps_latitude') and hasattr(img, 'gps_longitude'):
                lat_ref = getattr(img, 'gps_latitude_ref', 'N')
                lon_ref = getattr(img, 'gps_longitude_ref', 'E')

                latitude = dms_para_decimal(img.gps_latitude, lat_ref)
                longitude = dms_para_decimal(img.gps_longitude, lon_ref)

                if latitude is not None and longitude is not None:
                    resultado["latitude"] = latitude
                    resultado["longitude"] = longitude
                    resultado["tem_gps"] = True
                    resultado["gps_string"] = f"{latitude:.6f}, {longitude:.6f}"
                    logger.debug(f"GPS extraído: {latitude}, {longitude}")
        except Exception as e:
            logger.debug(f"Não foi possível extrair GPS: {e}")

        # Extrai direção da bússola (gps_img_direction)
        try:
            if hasattr(img, 'gps_img_direction'):
                direcao = float(img.gps_img_direction)
                resultado["direcao_graus"] = round(direcao, 2)
                resultado["direcao_cardeal"] = graus_para_cardeal(direcao)
                resultado["tem_direcao"] = True
                logger.debug(f"Direção extraída: {direcao}° ({resultado['direcao_cardeal']})")
        except Exception as e:
            logger.debug(f"Não foi possível extrair direção: {e}")

        logger.info(f"EXIF extraído - GPS: {resultado['tem_gps']}, Direção: {resultado['tem_direcao']}")

    except Exception as e:
        logger.warning(f"Erro ao extrair EXIF: {e}")

    return resultado


def formatar_data_hora(data_hora: Optional[str]) -> str:
    """
    Formata data/hora EXIF para exibição amigável.

    Args:
        data_hora: String no formato EXIF (YYYY:MM:DD HH:MM:SS)

    Returns:
        String formatada (DD/MM/YYYY HH:MM) ou "-" se inválido

    Example:
        >>> formatar_data_hora("2025:12:26 14:30:00")
        '26/12/2025 14:30'
    """
    if not data_hora:
        return "-"

    try:
        # Formato EXIF: "YYYY:MM:DD HH:MM:SS"
        partes = data_hora.split(" ")
        if len(partes) >= 2:
            data = partes[0].replace(":", "/")
            # Converte de YYYY/MM/DD para DD/MM/YYYY
            ano, mes, dia = data.split("/")
            data_formatada = f"{dia}/{mes}/{ano}"

            # Hora sem segundos
            hora_partes = partes[1].split(":")
            hora_formatada = f"{hora_partes[0]}:{hora_partes[1]}"

            return f"{data_formatada} {hora_formatada}"
        return data_hora
    except Exception as e:
        logger.debug(f"Erro ao formatar data/hora: {e}")
        return data_hora if data_hora else "-"
