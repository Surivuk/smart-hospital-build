FROM nginx:stable-alpine

WORKDIR /usr/src/app

COPY start.sh/ ./
COPY create-settings.sh/ ./

COPY build/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

RUN chmod +x ./start.sh
RUN chmod +x ./create-settings.sh

# EXPOSE 80

CMD ./start.sh