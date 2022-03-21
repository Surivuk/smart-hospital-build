source .env

echo $REACT_APP_API_URL

settings_file="./public/settings.json"

if [[ ! -f "$settings_file" ]]; then
    touch "$settings_file"
fi

truncate -s 0 "$settings_file"

echo "{ \"REACT_APP_API_URL\": \"$REACT_APP_API_URL\" }" >> "$settings_file"