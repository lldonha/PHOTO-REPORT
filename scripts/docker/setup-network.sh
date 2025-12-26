#!/bin/bash
# Script para criar rede Docker coletor_default
# Verifica se existe e cria se necessario

echo "Verificando rede Docker coletor_default..."

if docker network ls | grep -q coletor_default; then
    echo "[OK] Rede coletor_default ja existe."
else
    echo "Criando rede coletor_default..."
    if docker network create coletor_default; then
        echo "[OK] Rede coletor_default criada com sucesso."
    else
        echo "[ERRO] Falha ao criar rede coletor_default."
        exit 1
    fi
fi

echo ""
echo "Redes Docker disponiveis:"
docker network ls
