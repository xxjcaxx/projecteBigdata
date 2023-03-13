export const nodes = [
    {name: 'Rotonda Alkimia', 
    entries: ['CV-645','CV-645','Corts Valencianes 1','Palasiet'],
    exits: ['CV-645','CV-645','Corts Valencianes 1','Palasiet'],
    longitude: 38.985252,
    latitude: -0.537441
},
{name: 'Rotonda Simarro', 
    entries: ['Alfons Magnanim','Aben Ferri','Corts Valencianes 1','Corts Valencianes 2'],
    exits: ['Alfons Magnanim','Aben Ferri','Corts Valencianes 1','Corts Valencianes 2'],
    longitude: 38.986084, 
    latitude: -0.534517
},
{name: 'Palasiet - Aben Ferri', 
    entries: ['Palasiet','Aben Ferri','Argenteria'],
    exits: ['Palasiet','Aben Ferri'],
    longitude: 38.985489, 
    latitude: -0.534157
},
{name: 'Rotonda Simarro - 9 Octubre', 
    entries: ['Alfons Magnanim', '9 Octubre'],
    exits: ['Alfons Magnanim', '9 Octubre'],
    longitude: 38.987144, 
    latitude:  -0.535236
},
{name: 'Rotonda Adexa', 
    entries: ['Corts Valencianes 2', '9 Octubre', 'Abu Masaifa','Ausias March', 'Beata Ines'],
    exits: ['Corts Valencianes 2', 'Argenteria' ,'9 Octubre','Reina','Ausias March', 'Beata Ines'],
    longitude: 38.987684, 
    latitude:  -0.530610
},
{name: 'Rotonda Estacio', 
    entries: ['Ausias March', 'Ximen Tovia'],
    exits: ['Ausias March', 'Baixada estacio 1', 'Ximen Tovia'],
    longitude: 38.991913,  
    latitude:  -0.524291
},
{name: 'Reina - Albereda', 
    entries: ['Reina', 'Baixada estacio 2'],
    exits: [ 'Republica Argentina' , 'Albereda 1' ],
    longitude: 38.989955,
    latitude:  -0.523503
},
{name: 'Baixada - Gregorio', 
    entries: ['Gregorio Molina', 'Baixada estacio 1'],
    exits: [ 'Baixada estacio 2' , 'Abu Masaifa' ],
    longitude: 38.991213, 
    latitude: -0.523787
},
{name: 'Font Lleo', 
    entries: ['Albereda 1', 'Carme 2'],
    exits: [ 'Albereda 2' ],
    longitude: 38.990122, 
    latitude:  -0.519633
},
{name: 'Cine Saetavis', 
    entries: ['Carme 1','Republica Argentina'],
    exits: [ 'Carme 2' , 'Academic Maravall' ],
    longitude: 38.991050, 
    latitude:  -0.519778
},
{name: 'Rotonda Arc', 
    entries: ['Ximen Tovia', 'Maulets', 'N-340'],
    exits: [ 'Ximen Tovia', 'Gregorio Molina', 'Carme 1' , 'N-340' ],
    longitude: 38.992357,
    latitude:  -0.519858
},
{name: 'Gozalbes Vera', 
    entries: ['Academic Maravall','Cosmografo'],
    exits: [ 'Maulets' ],
    longitude: 38.991249,
    latitude:  -0.518678
},
{name: 'Placa Espanya', 
    entries: ['Albereda 2', 'N-340'],
    exits: [ 'Cosmografo', 'N-340' ],
    longitude: 38.990742,
    latitude:  -0.513000
}
];


export const streets = {
    'CV-645':  {long: 574},
    'Corts Valencianes 1':  {long: 194},
    'Corts Valencianes 2':  {long: 357},
    'Palasiet':  {long: 275},
    'Alfons Magnanim':  {long: 98},
    'Aben Ferri':  {long: 47},
    'Argenteria':  {long: 492},
    '9 Octubre':  {long: 489},
    'Abu Masaifa':  {long: 1000},
    'Ausias March':  {long: 656},
    'Beata Ines':  {long: 391},
    'Reina':  {long: 632},
    'Ximen Tovia':  {long: 520},
    'Baixada estacio 1':  {long: 90},
    'Baixada estacio 2':  {long: 90},
    'Gregorio Molina':  {long: 332},
    'Albereda 1':  {long: 333},
    'Albereda 2':  {long: 556},
    'Carme 1' : {long: 100},
    'Carme 2' : {long: 90},
    'Academic Maravall': {long: 90},
    'Cosmografo': {long: 492},
    'Maulets': {long: 90},
    'N-340': {long: 1000},
    'Republica Argentina' : {long:335}
};

export const cityEntries = [ 'CV-645', 'N-340',  'Beata Ines'];