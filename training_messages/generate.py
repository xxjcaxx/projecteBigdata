from nomic.gpt4all import GPT4All
from nomic.gpt4all import prompt

import random

streets = [
  "CV-645A",
  "CV-645B",
  "Corts Valencianes 1A",
  "Corts Valencianes 1B",
  "Corts Valencianes 2A",
  "Corts Valencianes 2B",
  "PalasietA",
  "PalasietB",
  "Alfons MagnanimA",
  "Alfons MagnanimB",
  "Aben FerriA",
  "Aben FerriB",
  "Argenteria",
  "9 OctubreA",
  "9 OctubreB",
  "Abu Masaifa",
  "Ausias MarchA",
  "Ausias MarchB",
  "Beata InesA",
  "Beata InesB",
  "Reina",
  "Ximen ToviaA",
  "Ximen ToviaB",
  "Baixada estacio 1",
  "Baixada estacio 2",
  "Gregorio Molina",
  "Albereda 1",
  "Albereda 2",
  "Carme 1",
  "Carme 2",
  "Academic Maravall",
  "Cosmografo",
  "Maulets",
  "N-340A",
  "N-340B",
  "Republica Argentina"]

for s in streets:
    for c in range(0,1000):
        #m.open()
        tipo = random.choice(['mensaje','post','artículo','queja','aviso','mensaje'])
        red = random.choice(['twitter','facebook','instagram','red social','telegram','mensajería instantánea','correo'])
        verbo = random.choice(['quejándose','avisando','advirtiendo','informando','maldiciendo'])
        incidente = random.choice(['incidente','accidente','atasco','retención','problema','retraso'])
        sensacion = random.choice(['preocupado','enfadado','furioso','frustrado','resignado','contento','rabioso'])
        promptm = 'Escribe un '+tipo+' '+ sensacion +' en '+red+' '+verbo+' sobre un '+incidente+' en la calle '+str(s)+'. El causante del '+incidente+ ' es el coche de matrícula "AC'+str(c)+'KS".' 
        message= prompt(promptm)
        print(promptm,message)
        f = open("./messages.json", "a")
        f.write('{"street": "'+s+'", "car":"'+str(c)+'","message":"'+message+'"},')
        f.close()
        #m.close()
