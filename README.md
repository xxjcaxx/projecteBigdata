# projecteBigdata

## Instal·lar i provar Mosquitto: 

sudo apt install mosquitto mosquitto-clients
sudo systemctl enable mosquitto
sudo systemctl status mosquitto

En una terminal:

mosquitto_sub -h localhost -t "#" -v

En altra terminal

mosquitto_pub -h localhost -t "sensors/streets" -m "hola mundo"

Topico (-t) Mensaje (-m)


## Frontend:

En el directori fakegenerator: 

npm run start

## Backend:

En el directori backend: 

node sensors.js

Modificar les IP del servidor del backend en el fitxer sensorsWorker.js

