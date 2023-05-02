async function main(){
    let messages = await (await fetch('messagesPatterns.json')).json();
    let messagesTagged = messages.messages.map(m => ({message: m, car: "{{car}}", street: "{{street}}", sentiment: {}, confidence: 0}));
    console.log(messagesTagged);


    function countWords(words,message){
       return words.reduce((prev,current)=> message.split(current).length -1 + prev ,0)
    }


    // sad
      messagesTagged.forEach(m=> m.sentiment.sad = countWords(['sad','sad','unhappy','sorry','triste','desgracia','trist', 'depres'],m.message.toLowerCase()));
    console.log('sad',messagesTagged.filter(m => m.sentiment.sad > 0));
    messagesTagged.forEach(m=> m.sentiment.angry = countWords(['angry','angry','furious','fuck','honk','looking for him','wtf','drink','drunk','bebid','borrach','took off',' dam ', ' mad ',' bet ',' loco ','whore', 'worst','reckless','impruden','worse','junk','guys','complain','discu','inexplicable','protest','arrest','no me importa','intolerable','unbearable','inad',' why?','moron','indignant','idiot','gilipo','annoyed','indigna','irritated','enfad','disgust','!','sanction','respect','serious','fault','furious','furios','rabia','rabio','desperate','enraged','frenetic','violent'],m.message.toLowerCase()));
    messagesTagged.forEach(m => { if(/[A-Z]{5}/.test(m.message)) m.sentiment.angry += 5;});
    console.log('angry',messagesTagged.filter(m => m.sentiment.angry > 0));
   messagesTagged.forEach(m=> m.sentiment.worried = countWords(['worry','worry','worried',' hit ','damage','injured','ambulanc','scream','wrong direction','unconscious','inconsciente','excessive speed','victim','fatal','grita','risk','lost control','crush','urgent','emergency',' fire ','abrupt','without number plate','estrellado','forcing',' sos ','impact','colisión','collision','atrapado',' trap','estrellar','brake','flash','pistol','gun','shot','suddenly','warn','bothered','incident','issue','concerned','bad','accident','frightened','danger','peligr','fault','preocupa','asustad','susto','miedo','asap','crushed','terror','help','run','ran'],m.message.toLowerCase()));
   console.log('worried',messagesTagged.filter(m => m.sentiment.worried > 0));
   messagesTagged.forEach(m=> m.sentiment.happy = countWords(['happy','happy','happy','cheerful','glad','ayuda','agradecer','gracias','buena',' fine ','pleased','content','enjoy',' fun ',' hey ','feliz','luck','cool','thank','risa','hilarious'],m.message.toLowerCase()));
  console.log('happy',messagesTagged.filter(m => m.sentiment.happy > 0));
 messagesTagged.forEach(m=> m.sentiment.frustrated = countWords(['frustra','disappointed','thwarted','for hours','stuck','do anything','not justified','atasco','errada',' error ',' dañ','i do not understand',' pass ','obstruc','cannot','affecting',' slow','impossible','violation','paraliza','abandon','lack of','responsibility','every day','responsabilidad','retención','demora',' denso ',' lento ',' dense ','difficult','broken','reten','deten','sin carnet',' rato ','break','noise','wrong','not normal','delay','caused','no license','stuck','negligence','court','foiled','jam'],m.message.toLowerCase()));
 console.log('frustrated',messagesTagged.filter(m => m.sentiment.frustrated > 0));
  messagesTagged.forEach(m=> m.sentiment.positive = countWords(['resign','satisfied','enduring','passive','police','unlock',' duda ','slow down','rta','justif','should be',' please ','911','agree','inusual','compren','sign','red light','space','perhaps','council','rights','calm ','curio','report','license','reconcil','problem','need','good','better','solve'],m.message.toLowerCase()));
 console.log('positive',messagesTagged.filter(m => m.sentiment.positive > 0));
//messagesTagged.filter(m=> m.sentiment.length ==0).forEach(m => m.sentiment.push('neutral'));

messagesTagged.filter(m=> m.sentiment.sad == 0 && m.sentiment.angry == 0 && m.sentiment.worried ==0 && m.sentiment.happy == 0 && m.sentiment.frustrated == 0 && m.sentiment.positive == 0).forEach(m=> m.sentiment.neutral = 1);



    messagesTagged.forEach(m => {
        let sentiments = Object.entries(m.sentiment).sort((a,b)=> a[1] < b[1] ? 1 : -1);
        let firstSentiment = sentiments[0][0];
        let sumSentiments = sentiments.reduce((prev,current)=> prev + current[1],0);
        let confidence = sentiments[0][1] * 100 / sumSentiments;
        m.confidence = confidence;
        m.firstSentiment = firstSentiment;
    })
   
    //messagesTagged.forEach(m=> m.confidence = 100 - m.sentiment.length*14)

    console.log(messagesTagged)



  /*  let n = 0;
    let streets = [
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
        "Republica Argentina"
      ];
    let trainingMessages = [];
    for(let i = 0; i < 1000 ; i ++){
        for(let street of streets){
            let plate = `AC${('000'+i).slice(-3)}KS`;
            let message = messagesTagged[n%messagesTagged.length];
            let m = message.message;
            m = m.replaceAll('{{street}}',street);
            m = m.replaceAll(`{{carplate}}`,plate);
            trainingMessages.push({message: m, street: street, car: plate, sentiment: message.firstSentiment, confidence: message.confidence})
            let message2 = messagesTagged[(n+777)%messagesTagged.length];
            let m2 = message2.message;
            m2 = m2.replaceAll('{{street}}',street);
            m2 = m2.replaceAll(`{{carplate}}`,plate);
            trainingMessages.push({message: m2, street: street, car: plate, sentiment: message2.firstSentiment, confidence: message2.confidence})
            n++;
        }
    }
    console.log(trainingMessages);
    console.log(trainingMessages.filter(m => m.confidence > 85))
*/
}




main();