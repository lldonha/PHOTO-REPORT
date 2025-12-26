# -*- coding: utf-8 -*-
"""
PHOTO-REPORT - Módulo de Geração de Mini-Mapas
Gera mini-mapas estáticos com py-staticmaps mostrando localização GPS e direção.

Autor: auto-claude
Data: 2025-12-26
"""

import logging
import math
from typing import Optional
from io import BytesIO

import staticmaps

# Configuração de logging
logger = logging.getLogger(__name__)

# Configurações do mini-mapa
TAMANHO_MAPA = 150  # Largura e altura em pixels
ZOOM_LEVEL = 17  # Zoom padrão (maior = mais detalhes)
COR_MARKER = staticmaps.RED  # Cor do marcador de localização
TAMANHO_MARKER = 10  # Tamanho do marcador


def gerar_minimapa(
    latitude: float,
    longitude: float,
    direcao_graus: Optional[float] = None,
    tamanho: int = TAMANHO_MAPA,
    zoom: int = ZOOM_LEVEL
) -> Optional[bytes]:
    """
    Gera um mini-mapa estático com marcador de localização.

    Cria uma imagem de mapa centrada nas coordenadas GPS fornecidas,
    com um marcador vermelho indicando a posição. Opcionalmente, pode
    incluir uma seta indicando a direção da bússola.

    Args:
        latitude: Latitude em formato decimal (ex: -23.550520)
        longitude: Longitude em formato decimal (ex: -46.633308)
        direcao_graus: Direção da bússola em graus (0-360), opcional
        tamanho: Tamanho do mapa em pixels (largura = altura)
        zoom: Nível de zoom (1-19, maior = mais detalhes)

    Returns:
        Bytes da imagem PNG do mapa, ou None se falhar

    Example:
        >>> from map_generator import gerar_minimapa
        >>> mapa = gerar_minimapa(-23.550520, -46.633308, direcao_graus=45)
        >>> if mapa:
        ...     with open("mapa.png", "wb") as f:
        ...         f.write(mapa)
    """
    if latitude is None or longitude is None:
        logger.warning("Coordenadas GPS não fornecidas, não é possível gerar mapa")
        return None

    try:
        logger.info(f"Gerando mini-mapa para {latitude}, {longitude}")

        # Cria contexto do mapa
        context = staticmaps.Context()

        # Define o tile provider (OpenStreetMap)
        context.set_tile_provider(staticmaps.tile_provider_OSM)

        # Cria localização central
        localizacao = staticmaps.create_latlng(latitude, longitude)

        # Adiciona marcador no ponto
        marker = staticmaps.Marker(
            localizacao,
            color=COR_MARKER,
            size=TAMANHO_MARKER
        )
        context.add_object(marker)

        # Se tiver direção, adiciona linha indicando a direção
        if direcao_graus is not None:
            try:
                linha_direcao = _criar_linha_direcao(
                    latitude, longitude, direcao_graus
                )
                if linha_direcao:
                    context.add_object(linha_direcao)
                    logger.debug(f"Linha de direção adicionada: {direcao_graus}°")
            except Exception as e:
                logger.warning(f"Não foi possível adicionar linha de direção: {e}")

        # Centraliza e define zoom
        context.set_center(localizacao)
        context.set_zoom(zoom)

        # Renderiza o mapa
        imagem = context.render_cairo(tamanho, tamanho)

        # Converte para bytes PNG
        buffer = BytesIO()
        imagem.write_to_png(buffer)
        buffer.seek(0)

        logger.info(f"Mini-mapa gerado com sucesso: {tamanho}x{tamanho}px")
        return buffer.getvalue()

    except Exception as e:
        logger.error(f"Erro ao gerar mini-mapa: {e}")
        return None


def _criar_linha_direcao(
    latitude: float,
    longitude: float,
    direcao_graus: float,
    distancia_metros: float = 50.0
) -> Optional[staticmaps.Line]:
    """
    Cria uma linha indicando a direção da bússola a partir do ponto.

    Args:
        latitude: Latitude do ponto inicial
        longitude: Longitude do ponto inicial
        direcao_graus: Direção em graus (0 = Norte, 90 = Leste)
        distancia_metros: Comprimento da linha em metros

    Returns:
        Objeto Line do staticmaps ou None se falhar
    """
    try:
        # Converte direção para radianos
        direcao_rad = math.radians(direcao_graus)

        # Calcula ponto final usando aproximação simples
        # (funciona bem para distâncias curtas)
        # 1 grau de latitude ≈ 111km
        # 1 grau de longitude ≈ 111km * cos(latitude)
        delta_lat = (distancia_metros / 111000) * math.cos(direcao_rad)
        delta_lon = (distancia_metros / (111000 * math.cos(math.radians(latitude)))) * math.sin(direcao_rad)

        lat_final = latitude + delta_lat
        lon_final = longitude + delta_lon

        # Cria pontos da linha
        ponto_inicio = staticmaps.create_latlng(latitude, longitude)
        ponto_fim = staticmaps.create_latlng(lat_final, lon_final)

        # Cria linha azul para indicar direção
        linha = staticmaps.Line(
            [ponto_inicio, ponto_fim],
            color=staticmaps.BLUE,
            width=3
        )

        return linha

    except Exception as e:
        logger.warning(f"Erro ao criar linha de direção: {e}")
        return None


def gerar_mapa_multiplos_pontos(
    pontos: list,
    tamanho: int = 300
) -> Optional[bytes]:
    """
    Gera um mapa com múltiplos pontos marcados.

    Útil para visualizar todas as fotos de um relatório em um único mapa.

    Args:
        pontos: Lista de dicts com 'latitude', 'longitude' e opcionalmente 'label'
        tamanho: Tamanho do mapa em pixels

    Returns:
        Bytes da imagem PNG do mapa, ou None se falhar

    Example:
        >>> pontos = [
        ...     {"latitude": -23.55, "longitude": -46.63, "label": "Foto 1"},
        ...     {"latitude": -23.56, "longitude": -46.64, "label": "Foto 2"}
        ... ]
        >>> mapa = gerar_mapa_multiplos_pontos(pontos)
    """
    if not pontos:
        logger.warning("Nenhum ponto fornecido para gerar mapa")
        return None

    # Filtra pontos válidos
    pontos_validos = [
        p for p in pontos
        if p.get('latitude') is not None and p.get('longitude') is not None
    ]

    if not pontos_validos:
        logger.warning("Nenhum ponto com coordenadas válidas")
        return None

    try:
        logger.info(f"Gerando mapa com {len(pontos_validos)} pontos")

        context = staticmaps.Context()
        context.set_tile_provider(staticmaps.tile_provider_OSM)

        # Adiciona marcador para cada ponto
        cores = [staticmaps.RED, staticmaps.BLUE, staticmaps.GREEN]
        for i, ponto in enumerate(pontos_validos):
            localizacao = staticmaps.create_latlng(
                ponto['latitude'],
                ponto['longitude']
            )
            cor = cores[i % len(cores)]
            marker = staticmaps.Marker(localizacao, color=cor, size=8)
            context.add_object(marker)

        # Renderiza com auto-fit (centraliza e ajusta zoom para mostrar todos os pontos)
        imagem = context.render_cairo(tamanho, tamanho)

        buffer = BytesIO()
        imagem.write_to_png(buffer)
        buffer.seek(0)

        logger.info(f"Mapa com múltiplos pontos gerado: {tamanho}x{tamanho}px")
        return buffer.getvalue()

    except Exception as e:
        logger.error(f"Erro ao gerar mapa com múltiplos pontos: {e}")
        return None
