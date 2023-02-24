# projecteBigdata

sudo apt install mosquitto mosquitto-clients
sudo systemctl enable mosquitto
sudo systemctl status mosquitto


En una terminal:

mosquitto_sub -h localhost -t "#" -v

En otra terminal

mosquitto_pub -h localhost -t "sensores/semaforos/semaforo1" -m "hola mundo"

Topico (-t) Mensaje (-m)
