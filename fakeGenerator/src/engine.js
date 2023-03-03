import { nodes, streets } from "./data.js";

const arrayStreets = Object.keys(streets);

const cityEntries = [ 'CV-645', 'N-340',  'Beata Ines'];

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);


const getStreetNodes = (nodes) => (street) => nodes.filter(node => node.entries.includes(street) )[0]
const getStreetThisNodes = getStreetNodes(nodes);

const getRandomStreet = (arrayStreets) => arrayStreets[Math.floor(Math.random()*arrayStreets.length)];
const getAvailableStreets = (route) => (node) => node.exits.filter(s => !route.includes(s));

/**
 * Genera n rutes aleatories en la ciutat
 * @param {} n 
 * @param {*} nodes 
 * @param {*} arrayStreets 
 */
const generateRoutes = (n,nodes,arrayStreets) => {
    let home = getRandomStreet(arrayStreets);
    //let homeNodes = getStreetThisNodes(home);
    let routes = [];    
    for(let i =0; i< n; i++){
        let currentStreet = home;
        let route = [];
       while(!cityEntries.includes(currentStreet) && currentStreet)
       {
            route = [...route,currentStreet];
            currentStreet = compose(getRandomStreet,getAvailableStreets(route),getStreetThisNodes)(currentStreet);
        }
        route = [...route,currentStreet];
        if(route.at(-1)) {routes.push(route)}
        route = Math.random() < 0.5 ? route.reverse() : route;
    }
    return routes;
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
