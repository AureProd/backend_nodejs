#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo "${YELLOW}Lancement du script pour l'initialisation du projet${RESET}"

if [ not -f ".env" ]; then
    echo "${GREEN}Création du fichier .env (veuillez le remplir avec vos données)${RESET}"
    cp .env.example .env
fi