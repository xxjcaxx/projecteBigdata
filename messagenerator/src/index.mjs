import { GPT4All } from 'gpt4all';

const streets = {
    'CV-645A': {
        long: 574, 
        latitude: 38.984920,
        longitude: -0.538044,
        dangerous: 0.5
    }, 'CV-645B': {
        long: 574, 
        latitude: 38.982627,
        longitude: -0.543217,
        dangerous: 0.5
    },
    'Corts Valencianes 1A': {
        long: 194, 
        latitude: 38.985471,
        longitude: -0.536866,
        dangerous: 0.7
    }, 
    'Corts Valencianes 1B': {
        long: 194, 
        latitude: 38.985988,
        longitude: -0.534956,
        dangerous: 0.7
    },
    'Corts Valencianes 2A': {
        long: 357, 
        latitude: 38.986305,
        longitude: -0.534194,
        dangerous: 0.1
    }, 'Corts Valencianes 2B': {
        long: 357, 
        latitude: 38.987231,
        longitude: -0.530804,
        dangerous: 0.1
    },
    'PalasietA': {
        long: 275, 
        latitude: 38.985502,
        longitude: -0.534316,
        dangerous: 0.3
    }, 'PalasietB': {
        long: 275, 
        latitude: 38.984985,
        longitude: -0.536807,
        dangerous: 0.3
    },
    'Alfons MagnanimA': {
        long: 98, 
        latitude: 38.986383,
        longitude: -0.534718,
        dangerous: 0.8
    }, 
    'Alfons MagnanimB': {
        long: 98, 
        latitude: 38.986983,
        longitude: -0.535119,
        dangerous: 0.8
    },
    'Aben FerriA': {
        long: 47, 
        latitude: 38.985794,
        longitude: -0.534332,
        dangerous: 0.1
    }, 
    'Aben FerriB': {
        long: 47, 
        latitude: 38.985556,
        longitude: -0.534174,
        dangerous: 0.1
    },
    'Argenteria': {
        long: 492, 
        latitude: 38.985583,
        longitude: -0.533428,
        dangerous: 0.3
    },
    '9 OctubreA': {
        long: 489, 
        latitude: 38.987338,
        longitude: -0.534790,
        dangerous: 0.2
    }, '9 OctubreB': {
        long: 489, 
        latitude: 38.988756,
        longitude: -0.531561,
        dangerous: 0.2
    },
    'Abu Masaifa': {
        long: 1000, 
        latitude: 38.988443,
        longitude: -0.529512,
        dangerous: 0.9
    },
    'Ausias MarchA': {
        long: 656, 
        latitude: 38.989335,
        longitude: -0.530273,
        dangerous: 0.8
    }, 
    'Ausias MarchB': {
        long: 656, 
        latitude: 38.991605,
        longitude: -0.524827,
        dangerous: 0.8
    },
    'Beata InesA': {
        long: 391, 
        latitude: 38.988569,
        longitude: -0.530786,
        dangerous: 0.1
    }, 
    'Beata InesB': {
        long: 391, 
        latitude: 38.991154,
        longitude: -0.532326,
        dangerous: 0.1
    },
    'Reina': {
        long: 632, 
        latitude: 38.989562,
        longitude: -0.524381,
        dangerous: 0.8
    },
    'Ximen ToviaA': {
        long: 520, 
        latitude: 38.992171,
        longitude: -0.523674,
        dangerous: 0.5
    }, 'Ximen ToviaB': {
        long: 520, 
        latitude: 38.993376,
        longitude: -0.521071,
        dangerous: 0.5
    },
    'Baixada estacio 1': {
        long: 90, 
        latitude: 38.991341,
        longitude: -0.523865,
        dangerous: 0.7
    },
    'Baixada estacio 2': {
        long: 90, 
        latitude: 38.990171,
        longitude: -0.523578,
        dangerous: 0.8
    },
    'Gregorio Molina': {
        long: 332, 
        latitude: 38.991335,
        longitude: -0.523112,
        dangerous: 0.5
    },
    'Albereda 1': {
        long: 333, 
        latitude: 38.990063,
        longitude: -0.520171,
        dangerous: 0.2
    },
    'Albereda 2': {
        long: 556, 
        latitude: 38.990272,
        longitude: -0.513876,
        dangerous: 0.2
    },
    'Carme 1': {
        long: 100, 
        latitude: 38.991235,
        longitude: -0.519896,
        dangerous: 0.5
    },
    'Carme 2': {
        long: 90, latitude: 38.990233,
        longitude: -0.519624, dangerous: 0.5
    },
    'Academic Maravall': {
        long: 90, latitude: 38.991190,
        longitude: -0.518935, dangerous: 0.5
    },
    'Cosmografo': {
        long: 492, latitude: 38.991222,
        longitude: -0.518098, dangerous: 0.5
    },
    'Maulets': {
        long: 90, latitude: 38.992126,
        longitude: -0.519033 ,dangerous: 0.5
    },
    'N-340A': {
        long: 1000, latitude: 38.992605,
        longitude: -0.519749 ,dangerous: 0.1
    }, 'N-340B': {
        long: 1000, latitude: 38.995415,
        longitude: -0.520752, dangerous: 0.1
    },
    'Republica Argentina': {
        long: 335, latitude: 38.990853,
        longitude: -0.520577, dangerous: 0.7
    }
};
const streetNames = Object.keys(streets);


/*
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
*/

const gpt4all = new GPT4All('gpt4all-lora-quantized', true); // Default is 'gpt4all-lora-quantized' model
  



const  getMessages = async (street,i) => {
    console.log(street,i);
  /*  const form = new FormData();
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
    return [message];*/
 
    console.log("before open");
    // Open the connection with the model
    await gpt4all.open();
    console.log("before prompt");
    // Generate a response using a prompt
    const prompt = 'Tell me about how Open Access to AI is going to help humanity.';
    const response = await gpt4all.prompt(prompt);
    console.log(`Prompt: ${prompt}`);
    console.log(`Response: ${response}`);
  
    const prompt2 = 'Explain to a five year old why AI is nothing to be afraid of.';
    const response2 = await gpt4all.prompt(prompt2);
    console.log(`Prompt: ${prompt2}`);
    console.log(`Response: ${response2}`);
  
    // Close the connection when you're done
    gpt4all.close();

    

}




   

    const main = async ()=> {
        // Initialize and download missing files
await gpt4all.init();
        let messages = {};
        for(let street of streetNames){
            let cars =  (new Array(1000)).fill(0).map((n,i) => i);
            messages[street] = cars;
            for(let car of cars){
                messages[street][car] = await getMessages(street,car);
                console.log(messages[street][car]);
            }
        }
    }
    

    main();
 

    

