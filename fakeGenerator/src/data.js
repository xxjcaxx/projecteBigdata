export const nodes = [
    {name: 'Rotonda Alkimia', 
    entries: ['CV-645A','Corts Valencianes 1A','PalasietB'],
    exits: ['CV-645B','Corts Valencianes 1B','PalasietA'],
    longitude: 38.985252,
    latitude: -0.537441
},
{name: 'Rotonda Simarro', 
    entries: ['Alfons MagnanimA','Aben FerriA','Corts Valencianes 1B','Corts Valencianes 2A'],
    exits: ['Alfons MagnanimB','Aben FerriB','Corts Valencianes 1A','Corts Valencianes 2B'],
    longitude: 38.986084, 
    latitude: -0.534517
},
{name: 'Palasiet - Aben Ferri', 
    entries: ['PalasietA','Aben FerriB','ArgenteriaA'],
    exits: ['PalasietB','Aben FerriA'],
    longitude: 38.985489, 
    latitude: -0.534157
},
{name: 'Rotonda Simarro - 9 Octubre', 
    entries: ['Alfons MagnanimB', '9 OctubreA'],
    exits: ['Alfons MagnanimA', '9 OctubreB'],
    longitude: 38.987144, 
    latitude:  -0.535236
},
{name: 'Rotonda Adexa', 
    entries: ['Corts Valencianes 2B', '9 OctubreB', 'Abu MasaifaB','Ausias MarchA', 'Beata InesA'],
    exits: ['Corts Valencianes 2A', 'ArgenteriaA' ,'9 OctubreA','Reina','Ausias MarchB', 'Beata InesB'],
    longitude: 38.987684, 
    latitude:  -0.530610
},
{name: 'Rotonda Estacio', 
    entries: ['Ausias MarchB', 'Ximen ToviaA'],
    exits: ['Ausias MarchA', 'Baixada estacio 1', 'Ximen ToviaB'],
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
    entries: ['Ximen ToviaB', 'Maulets', 'N-340A'],
    exits: [ 'Ximen ToviaA', 'Gregorio Molina', 'Carme 1' , 'N-340B' ],
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
    entries: ['Albereda 2', 'N-340A'],
    exits: [ 'Cosmografo', 'N-340B' ],
    longitude: 38.990742,
    latitude:  -0.513000
}
];


export const streets = {
    'CV-645A':  {long: 574}, 'CV-645B':  {long: 574},
    'Corts Valencianes 1A':  {long: 194}, 'Corts Valencianes 1B':  {long: 194},
    'Corts Valencianes 2A':  {long: 357}, 'Corts Valencianes 2B':  {long: 357},
    'PalasietA':  {long: 275}, 'PalasietB':  {long: 275},
    'Alfons MagnanimA':  {long: 98},  'Alfons MagnanimB':  {long: 98},
    'Aben FerriA':  {long: 47}, 'Aben FerriB':  {long: 47},
    'Argenteria':  {long: 492},
    '9 OctubreA':  {long: 489}, '9 OctubreB':  {long: 489},
    'Abu Masaifa':  {long: 1000},
    'Ausias MarchA':  {long: 656}, 'Ausias MarchB':  {long: 656},
    'Beata InesA':  {long: 391}, 'Beata InesB':  {long: 391},
    'Reina':  {long: 632},
    'Ximen ToviaA':  {long: 520},  'Ximen ToviaB':  {long: 520},
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
    'N-340A': {long: 1000}, 'N-340B': {long: 1000},
    'Republica Argentina' : {long:335}
};

export const cityEntries = [ 'CV-645A', 'N-340A',  'Beata InesA'];
export const cityExits = [ 'CV-645B', 'N-340B',  'Beata InesB'];