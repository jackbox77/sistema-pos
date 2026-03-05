#!/bin/bash

# Verifica si existe docker-compose.yml
if [ -f docker-compose.yml ]; then
    echo "Usando docker-compose para el despliegue..."
    docker-compose down
    docker-compose up -d --build
else
    echo "Construyendo la imagen Docker..."
    docker build -t sistema-pos:latest .

    echo "Deteniendo contenedores anteriores..."
    docker stop sistema-pos || true
    docker rm sistema-pos || true

    echo "Ejecutando el contenedor..."
    docker run -d --name sistema-pos -p 4001:4001 --restart unless-stopped sistema-pos:latest
fi
