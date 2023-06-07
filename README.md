# projecteBigdata

Aquest és un simulador de tràfic per a obtindre dades sintètiques de sensors relacionats amb el tràfic en la ciutat de Xàtiva.


No preten ser realista ni útil per a cap cas real. Les dades que envia a un broker **MQTT** poden ser capturades amb ferramentes de Big Data com **nifi** i enviades a una base de dades, fitxers Parquet, csv... després poden ser analitzades per detectar patrons amb tècniques d'IA o amb BI.  


El comportament dels cotxes està determinat per les seues dades, expressades en un .json. Aquestes dades indiquen la velocitat, soroll o contaminació; així com els hàbits del conductor. També està determinat per la hora del dia i dia de la setmana i del clima.


Quan hi ha un incident, el simulador envia un missatge a un grup de telegram. Aquest missatge està generat amb un sentiment per **LLaMa** i indica també el cotxe i el carrer. Per no saturar el servidor, s'han generat uns 12000 missatges. Fer un bot que escolte el grup també pot servir per fer anàlisi de sentiments o detectar accidents i relacionar-los amb les dades dels sensors amb IA o BI.


Per fer-ho anar es necessita manualment instal·lar i configurar un broker MQTT i executar els projectes. Hi ha un servici fet en **Nodejs** que escolta missatges i els enviar a Mosquitto. Hi ha un altre que simula el tràfic. També tenim una web que es pot arrancar que mostra el que està passant en el servidor.


> No està pensat com un programa acabat per posar en producció. És un programa educatiu i el fet de posar-ho en funcionament forma part del procés. 

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

En el directori frontend: 

    npm run start

## Backend:

En el directori backend: 

    node sensors.js

Modificar les IP del servidor del backend en el fitxer sensorsWorker.js

En el directori simulator:

    node engine.js

## Generació dels missatges: 

Instal·lar LLaMa segons aquest tutorial: https://github.com/cocktailpeanut/dalai

Executar el fitxer generate.py del directori training_messages


Les dades de uns 10 mesos de simulació estan en aquest Kaggle: https://www.kaggle.com/datasets/xxjcaxx/trafficsimulator 

