#!/bin/bash
# set -x
set -e

HOME_FOLDER=$(pwd)

BUILD_FOLDER="$HOME_FOLDER/build"
ASSETS_FOLDER="$HOME_FOLDER/assets"
SERVICES_FOLDER="$HOME_FOLDER/services"

SMART_HOSPITA="smart-hospital"
SMART_HOSPITA_UI="smart-hospital-ui"
FAKE_MONITORING="fake-monitoring"

SMART_HOSPITA_GIT="git@github.com:Surivuk/smart-hospital.git"
SMART_HOSPITA_UI_GIT="git@github.com:Surivuk/smart-hospital-ui.git"
FAKE_MONITORING_GIT="git@github.com:Surivuk/fake-monitoring.git"

build_project() {
    cd "$BUILD_FOLDER"
    local FOLDER="$1"
    local GIT="$2"
    echo "$FOLDER, $GIT"
    if [[ -d "$FOLDER" ]]; then
        rm -rf "$FOLDER"
    fi
    git clone "$GIT"
    cd "$FOLDER"
    npm i
    npm run build
    cd "$HOME_FOLDER"
}

make_smart_hospital() {
    local SOURCE="$BUILD_FOLDER/$SMART_HOSPITA"
    local DESTINATION="$SERVICES_FOLDER/$SMART_HOSPITA"
    if [[ -d "$DESTINATION" ]]; then
        rm -rf "$DESTINATION"
    fi
    mkdir -p "$DESTINATION"
    cd "$DESTINATION"
    cp -r "$SOURCE/migrations" ./
    cp -r "$SOURCE/dist" ./
    cp "$SOURCE/package.json" ./
    cp "$SOURCE/package-lock.json" ./
    cp "$SOURCE/dist/knexfile.js" ./
    cp "$SOURCE/loadEnv.js" ./
    cd "$HOME_FOLDER"
}
make_smart_hospital_ui() {
    local SOURCE="$BUILD_FOLDER/$SMART_HOSPITA_UI"
    local DESTINATION="$SERVICES_FOLDER/$SMART_HOSPITA_UI"
    if [[ -d "$DESTINATION" ]]; then
        rm -rf "$DESTINATION"
    fi
    mkdir -p "$DESTINATION"
    cd "$DESTINATION"
    cp -r "$SOURCE/build" ./
    cp "$SOURCE/create-settings.sh" ./
    cd "$HOME_FOLDER"
}
make_fake_monitoring() {
    local SOURCE="$BUILD_FOLDER/$FAKE_MONITORING"
    local DESTINATION="$SERVICES_FOLDER/$FAKE_MONITORING"
    if [[ -d "$DESTINATION" ]]; then
        rm -rf "$DESTINATION"
    fi
    mkdir -p "$DESTINATION"
    cd "$DESTINATION"
    cp -r "$SOURCE/dist" ./
    cp -r "$SOURCE/src/pages" ./dist/src/pages
    cp -r "$SOURCE/public" ./
    cp "$SOURCE/package.json" ./
    cp "$SOURCE/package-lock.json" ./
    cp "$SOURCE/settings.json" ./
    cp "$SOURCE/loadEnv.js" ./
    cd "$HOME_FOLDER"
}

# BUILD
build_project "$SMART_HOSPITA" "$SMART_HOSPITA_GIT"
build_project "$BUILD_FOLDER/$SMART_HOSPITA_UI" "$SMART_HOSPITA_UI_GIT"
build_project "$BUILD_FOLDER/$FAKE_MONITORING" "$FAKE_MONITORING_GIT"

make_smart_hospital
make_smart_hospital_ui
make_fake_monitoring

# COPY ASSETS
# Smart Hospital
cp "$ASSETS_FOLDER/Dockerfile.smarthospital" "$SERVICES_FOLDER/$SMART_HOSPITA/Dockerfile"
cp "$ASSETS_FOLDER/start.smarthospital.sh" "$SERVICES_FOLDER/$SMART_HOSPITA/start.sh"

# Smart Hospital UI
cp "$ASSETS_FOLDER/default.conf" "$SERVICES_FOLDER/$SMART_HOSPITA_UI/default.conf"
cp "$ASSETS_FOLDER/Dockerfile.smarthospitalui" "$SERVICES_FOLDER/$SMART_HOSPITA_UI/Dockerfile"
cp "$ASSETS_FOLDER/start.smarthospitalui.sh" "$SERVICES_FOLDER/$SMART_HOSPITA_UI/start.sh"

# Fake Monitoring
cp "$ASSETS_FOLDER/Dockerfile.fakemonitoring" "$SERVICES_FOLDER/$FAKE_MONITORING/Dockerfile"
cp "$ASSETS_FOLDER/start.fakemonitoring.sh" "$SERVICES_FOLDER/$FAKE_MONITORING/start.sh"