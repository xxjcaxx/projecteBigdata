import { streets } from "../data.js";

const streetNames = Object.keys(streets);

const  getMessages = async (street,i) => {
    console.log(street,i);
    const form = new FormData();
    form.append('text', `Mensaje en redes sociales quejándose de un indicente de tráfico en la calle ${street} con un coche de matrícula ${i}`); 
    let message = await fetch('https://api.deepai.org/api/text-generator', {
        method: 'POST',
    body: form,    
    headers: {
            "api-key": "quickstart-QUdJIGlzIGNvbWluZy4uLi4K"
        }
        
    } ); 
    message = await message.text();
    console.log(message);
    return [message];

}

document.addEventListener("DOMContentLoaded",async ()=>{

    let container = document.querySelector('#container');
    let messages = {};
    for(let street in streetNames){
        let cars =  (new Array(1000)).fill(0).map((n,i) => ([i]));
        messages[street] = cars;
    }

    let streetIndex = 0;
    let carIndex = 0;
    let interval = setInterval(async ()=>{
        messages[streetNames[streetIndex]][carIndex] = await getMessages(streetNames[streetIndex],carIndex);
        console.log(messages);
        carIndex++;
        if (carIndex >= 999) { streetIndex++; carIndex = 0; }
        if (streetIndex > streetNames.length) { clearInterval(interval); }
        container.innerHTML += JSON.stringify(messages[streetNames[streetIndex]][carIndex]); 
    },60000)


    

})