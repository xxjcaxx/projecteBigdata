import { nodes, streets } from "./data.js";

const arrayStreets = Object.keys(streets);

const cityEntries = [ 'CV-645', 'N-340',  'Beata Ines'];


const getStreetNodes = (nodes) => (street) => nodes.filter(node => node.entries.includes(street) )[0]
const getStreetThisNodes = getStreetNodes(nodes);



/**
 * Genera n rutes aleatories en la ciutat
 * @param {} n 
 * @param {*} nodes 
 * @param {*} arrayStreets 
 */
const generateRoutes = (n,nodes,arrayStreets) => {
    let home = arrayStreets[Math.floor(Math.random()*arrayStreets.length)];
    let homeNodes = getStreetThisNodes(home);
        
    for(let i =0; i< n; i++){
        let currentStreet = home;
        let route = [];
       //while(!cityEntries.includes(currentStreet))
       for(let j = 0; j <10 ; j++)
       {
            route.push(currentStreet);
            let availableNode =getStreetThisNodes(currentStreet);
            let nextNode = availableNode;
            let availableStreets = nextNode.exits.filter(s => !route.includes(s))
            currentStreet = availableStreets[Math.floor(Math.random()*availableStreets.length)];
            
        }
        console.log(route,currentStreet);
    }
}



const carGenerator = (img,id) => ({
    img, id,
    maxSpeed: Math.random()*100+20, 
    pollution: Math.random(), 
    noise: Math.random(),
    routes: generateRoutes(Math.random()*10,nodes,arrayStreets),
})

document.addEventListener('DOMContentLoaded',()=>{

    console.log(carGenerator('plate1.png',2));

});
