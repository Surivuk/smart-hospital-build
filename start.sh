#!/bin/bash
# set -xg
set -e

create_folder_if_no_exists() {
    if [[ ! -d "$1" ]]; then
        mkdir -p "$1"
    fi
}

create_folder_if_no_exists "./volumes/eventstore-data"
create_folder_if_no_exists "./volumes/eventstore-logs"

chmod 777 "./volumes/eventstore-data"
chmod 777 "./volumes/eventstore-logs"

docker-compose down | true
docker-compose build
docker-compose up