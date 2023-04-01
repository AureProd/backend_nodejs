#!/bin/bash

RED="\e[1;31m"
GREEN="\e[1;32m"
YELLOW="\e[1;33m"
RESET="\e[0m"

# get project folder path
PROJECT_PATH=$(readlink -f $0)
PROJECT_PATH=$(echo $PROJECT_PATH | sed 's/\/[^\/]*$//')

# if PROJECT_PATH contain a space 
if [[ $PROJECT_PATH = *" "* ]]; then
    echo -e "${RED}The project path contain a space. Please move the project in a path without space.${RESET}"
    exit 1
fi

if [ ! -f $PROJECT_PATH/.env ]; then
    cp $PROJECT_PATH/.env.example $PROJECT_PATH/.env
    echo -e "${RED}Before starting the Connect instance. Please initialized the Connect instance.${RESET}"
    exit 1
fi

# count the number of line in .env and .env.example for check if their files are different
env_line=$(wc -l $PROJECT_PATH/.env | cut -d' ' -f1)
env_example_line=$(wc -l $PROJECT_PATH/.env.example | cut -d' ' -f1)

if [ $env_line -ne $env_example_line ]; then
    echo -e "${RED}The .env file and docker-compose.yml must be updated because the .env has changed${RESET}"
    exit 1
fi

PROJECT_NAME=$(grep "PROJECT_NAME" $PROJECT_PATH/.env | cut -d '=' -f2)

start_instance() {
    docker-compose --project-name api-$PROJECT_NAME -f $PROJECT_PATH/docker-compose.yml --env-file $PROJECT_PATH/.env up -d --build
}

stop_instance() {
    docker-compose --project-name api-$PROJECT_NAME -f $PROJECT_PATH/docker-compose.yml --env-file $PROJECT_PATH/.env down
}

if [ "$(docker ps -q -f name=$PROJECT_NAME-backend)" ]; then
    echo -e "${YELLOW}The Connect instance '$PROJECT_NAME' is already started${RESET}"
    
    echo -e "${YELLOW}Do you want to stop or restart the project (stop/restart)${RESET}"
    read USER_INPUT

    if [ "$USER_INPUT" = "stop" ]; then
        echo -e "${YELLOW}Stop the instance '$PROJECT_NAME'${RESET}"

        stop_instance

        echo -e "${GREEN}The instance of '$PROJECT_NAME' stopped with success${RESET}"
    elif [ "$USER_INPUT" = "restart" ]; then
        echo -e "${YELLOW}Restart the instance '$PROJECT_NAME'${RESET}"
        
        stop_instance
        sleep 1
        start_instance

        echo -e "${GREEN}The instance of '$PROJECT_NAME' restarted with success${RESET}"

        docker logs test-backend -f
    else
        echo -e "${RED}You did not answer the question correctly (only stop or restart)${RESET}"
        echo -e "${RED}The instance of '$PROJECT_NAME' has not been stopped or restarted${RESET}"
        exit 1
    fi
else
    echo -e "${YELLOW}The instance of '$PROJECT_NAME' is not started${RESET}"
    echo -e "${YELLOW}You want to start it ? (y/n)${RESET}"
    read USER_INPUT

    if [ "$USER_INPUT" = "y" ] || [ "$USER_INPUT" = "Y" ] || [ "$USER_INPUT" = "o" ] || [ "$USER_INPUT" = "O" ]; then
        echo -e "${YELLOW}Start the instance '$PROJECT_NAME'${RESET}"

        start_instance

        echo -e "${GREEN}The instance of '$PROJECT_NAME' started with success${RESET}"

        docker logs test-backend -f
    else
        echo -e "${RED}The instance of '$PROJECT_NAME' has not been started${RESET}"
        exit 1
    fi
fi



