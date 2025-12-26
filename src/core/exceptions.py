"""
Exceções customizadas para a API PHOTO-REPORT.

Este módulo define exceções específicas para validação de arquivos,
controle de rate limiting e erros gerais de validação.
Todas as mensagens são em português para feedback claro ao usuário.
"""

from typing import Optional, Dict, Any


class APIException(Exception):
    """
    Exceção base para erros da API.

    Attributes:
        status_code: Código HTTP de status
        code: Código de erro único para identificação
        mensagem: Mensagem de erro em português
        detalhes: Informações adicionais sobre o erro
    """

    status_code: int = 500
    code: str = "ERRO_INTERNO"
    mensagem: str = "Ocorreu um erro interno no servidor."

    def __init__(
        self,
        mensagem: Optional[str] = None,
        detalhes: Optional[Dict[str, Any]] = None
    ):
        self.mensagem = mensagem or self.__class__.mensagem
        self.detalhes = detalhes or {}
        super().__init__(self.mensagem)


class ValidationError(APIException):
    """
    Exceção para erros de validação genéricos.

    Levantada quando dados de entrada não atendem aos requisitos de validação.
    """

    status_code: int = 400
    code: str = "ERRO_VALIDACAO"
    mensagem: str = "Dados de entrada inválidos."


class FileTooLargeError(APIException):
    """
    Exceção para arquivos que excedem o tamanho máximo permitido.

    Levantada quando um arquivo enviado ultrapassa o limite de tamanho.
    """

    status_code: int = 413
    code: str = "ARQUIVO_MUITO_GRANDE"
    mensagem: str = "O arquivo enviado excede o tamanho máximo permitido."

    def __init__(
        self,
        mensagem: Optional[str] = None,
        tamanho_arquivo: Optional[int] = None,
        tamanho_maximo: Optional[int] = None
    ):
        detalhes = {}
        if tamanho_arquivo is not None:
            detalhes["tamanho_arquivo"] = tamanho_arquivo
        if tamanho_maximo is not None:
            detalhes["tamanho_maximo"] = tamanho_maximo

        if mensagem is None and tamanho_maximo is not None:
            tamanho_mb = tamanho_maximo / (1024 * 1024)
            mensagem = f"O arquivo enviado excede o tamanho máximo de {tamanho_mb:.0f}MB."

        super().__init__(mensagem=mensagem, detalhes=detalhes if detalhes else None)


class InvalidFileTypeError(APIException):
    """
    Exceção para tipos de arquivo não suportados.

    Levantada quando o tipo MIME ou extensão do arquivo não é aceito.
    """

    status_code: int = 415
    code: str = "TIPO_ARQUIVO_INVALIDO"
    mensagem: str = "Tipo de arquivo não suportado."

    def __init__(
        self,
        mensagem: Optional[str] = None,
        tipo_recebido: Optional[str] = None,
        tipos_aceitos: Optional[list] = None
    ):
        detalhes = {}
        if tipo_recebido is not None:
            detalhes["tipo_recebido"] = tipo_recebido
        if tipos_aceitos is not None:
            detalhes["tipos_aceitos"] = tipos_aceitos

        if mensagem is None and tipos_aceitos is not None:
            formatos = ", ".join(tipos_aceitos).upper()
            mensagem = f"Tipo de arquivo não suportado. Formatos aceitos: {formatos}."

        super().__init__(mensagem=mensagem, detalhes=detalhes if detalhes else None)


class RateLimitExceededError(APIException):
    """
    Exceção para quando o limite de requisições é excedido.

    Levantada quando um cliente ultrapassa o número máximo de requisições
    permitidas em uma janela de tempo.
    """

    status_code: int = 429
    code: str = "LIMITE_REQUISICOES_EXCEDIDO"
    mensagem: str = "Limite de requisições excedido. Tente novamente mais tarde."

    def __init__(
        self,
        mensagem: Optional[str] = None,
        retry_after: Optional[int] = None,
        limite: Optional[int] = None,
        janela_segundos: Optional[int] = None
    ):
        detalhes = {}
        if retry_after is not None:
            detalhes["retry_after"] = retry_after
        if limite is not None:
            detalhes["limite"] = limite
        if janela_segundos is not None:
            detalhes["janela_segundos"] = janela_segundos

        if mensagem is None and retry_after is not None:
            mensagem = f"Limite de requisições excedido. Tente novamente em {retry_after} segundos."

        super().__init__(mensagem=mensagem, detalhes=detalhes if detalhes else None)
