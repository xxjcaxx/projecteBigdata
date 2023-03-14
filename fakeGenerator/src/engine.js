import { nodes, streets, cityEntries, cityExits } from "./data.js";
import {compose,MAP,log, FILTER,getRandomArray, doIfRandom} from "./functionalUtils.js";
import { createCarsTable, createStreetsTable } from "./views.js";
import {generateMQTT,takePhoto,getSensorObject} from "./sensors.js";
import "./style.css";

const arrayStreets = Object.keys(streets);

// Get the node that have this street as an entry
const getStreetNodes = (nodes) => (street) => nodes.filter(node => node.entries.includes(street) )[0]
const getStreetThisNodes = getStreetNodes(nodes);

// From a route and a node, get the streets this node can exit, can´t be an existing street in the route
const getAvailableStreets = (route) => (node) => node.exits.filter(s => !route.includes(s));



// Functions to generate random routes
const generateSingleRoute = (cityExits) => (home) => {
    let currentStreet = home;
        let route = [];
       while(!cityExits.includes(currentStreet) && currentStreet)
       {
            route = [...route,currentStreet];
            currentStreet = compose(getRandomArray,getAvailableStreets(route),getStreetThisNodes)(currentStreet);
        }
        route = [...route,currentStreet];
        return route;
}


/**
 * Generate n random routes
 * @param {} n 
 * @param {*} nodes 
 * @param {*} arrayStreets 
 */
const generateRoutes = (n,nodes,arrayStreets) => {
    let home = getRandomArray(arrayStreets);
    let routes = [];    
    //for(let i =0; i< n; i++){
    while(routes.length < n) {
        let route = generateSingleRoute(cityExits)(home);
        if(route.at(-1)) {
            routes.push(route);
            routes.push([...route].reverse());
        }
        
    }
    return routes;
}

// Factory of cars
const carGenerator = (img,id) => ({
    img, id,
    maxSpeed: Math.random()*100+20, 
    pollution: Math.random(), 
    noise: Math.random(),
    routes: generateRoutes(Math.random()*8+2,nodes,arrayStreets),
    secondsToCanCross : 0,
    secondsNotCrossing : 0,
    lastStreet: '',
    routeStepNumber :0
});

// Remove cars that had exited the city
const removeExitCars = (cars) => cars.filter(car=> car.currentStreet !== -1);
// Assign a route to a car
const addStartRoute = (car) => (route) => (car.route = route, car);
// Add first street of the route to a car. 
const carCurrentStreet = (car) => (car.currentStreet = car.route[0], car);
// Inizialize a car with a random route and the start of the route
const carStartRoute = (car) => compose(doIfRandom(0.5)(car => (car.lastStreet = car.currentStreet, car.currentStreet = -1,car)),carCurrentStreet,addStartRoute(car),getRandomArray)(car.routes);

// 
const assignCarsToStreets = (streets) => 
                            (cars) => cars.map(car=>(streets[car.currentStreet]
                                .cars.push(car), car))

const getSecondsToCanCross = (currentStreetLong) => (car) => currentStreetLong / (car.maxSpeed * (Math.random()+0.2))
const updateSecondsToCanCross = (cars) => {cars.forEach(car=> { 
    car.secondsToCanCross = car.secondsToCanCross > 0 ? car.secondsToCanCross -1 : 0;
    car.secondsNotCrossing = car.secondsToCanCross <=0 ? car.secondsNotCrossing +1 : 0;
});
    return cars;
}

/*const updateNextnode = (cars) => {
    cars.forEach(car => {
        car.nextNode = nodes.filter(node=>)
});
}*/

const crossCar = (streets) => (car) => {

    streets[car.currentStreet].cars = streets[car.currentStreet].cars.slice(1);
    car.lastStreet = car.currentStreet;
    if (car.route.indexOf(car.currentStreet) < car.route.length -1){
        car.currentStreet = car.route[car.route.indexOf(car.currentStreet)+1];
        car.secondsToCanCross =  getSecondsToCanCross(streets[car.currentStreet].long)(car);
        streets[car.currentStreet].cars.push(car);
    } else {
        car.currentStreet = -1;
        car.secondsToCanCross = 0;
    }
    car.routeStepNumber ++;
    car.secondsNotCrossing =0;
    //console.log(car.secondsToCanCross);
    
    return car
}


const getCarsCanCross = (streets) => compose(
    FILTER(car => car.secondsToCanCross <= 0), // Some first cars are not yet in node
    //log,
    FILTER(item => item),
    MAP(street => street.cars[0]), // Get first car
    Object.values)
    (streets);
    



const reenterCar = (car) => {
    car.currentStreet = car.lastStreet;
    car.routeStepNumber = 0;
    car.secondsNotCrossing =0;
    car.route = cityEntries.includes(car.currentStreet) ? compose(
        getRandomArray,
        FILTER(r => cityEntries.includes(r[0])),
        c => c.routes
        )(car) : compose(
            getRandomArray,
            FILTER(r => r[0] == car.currentStreet),
            c => c.routes
            )(car) 
        
    return car;
}

const generateOriginalCars = (number) => compose(
    MAP(carStartRoute),
    MAP((n,i)=> carGenerator(`car${i}.jpg`,i))
    )((new Array(number)).fill(null));

const regenerateCarList = (cars) => compose(
 //   removeExitCars,
 //   updateNextnode,
    updateSecondsToCanCross
    )(cars);



const getCandidatesToEnter = (OriginalCars) => OriginalCars.filter(car => car.currentStreet === -1 && car.lastStreet);

const getCandidateToEnter = (OriginalCars) => compose(
    getRandomArray,
    getCandidatesToEnter
    //FILTER(car => car.currentStreet === -1 && car.lastStreet)
)(OriginalCars);








// Start of app

document.addEventListener('DOMContentLoaded',()=>{

    let streetsState = Object.fromEntries(Object.keys(streets).map(s => ([s,{...streets[s],cars: []}])));

    // Start the array of cars with starting route and street
    const OriginalCars = generateOriginalCars(999);
    compose(assignCarsToStreets(streetsState),removeExitCars)(OriginalCars);
   

    console.log("Original Cars: ",OriginalCars);

   // let cars = [...OriginalCars];

    //Remove comments
     //   document.querySelector('#carList table').innerHTML = createCarsTable(cars);
  
     let step = 0;
    setInterval(function mainIntervalCallback() {
        // Cross cars
        // We get the first car of every street and, if can cross, it cross
            let carsThatCanCross = getCarsCanCross(streetsState);
            carsThatCanCross.forEach(doIfRandom(0.5)(crossCar(streetsState)));
            // We Regenerate the street states based on the cars streets after cross
         regenerateCarList(OriginalCars);
            // We show the result
        document.querySelector('#streetList table').innerHTML = createStreetsTable(Object.entries(streetsState));
        document.querySelector('#totalCars').innerHTML = `Total Cars: ${999-getCandidatesToEnter(OriginalCars).length}`
            //Some of the exited cars can return to the circuit in the same street they finished
            let candidateToEnter = getCandidateToEnter(OriginalCars);

            if (candidateToEnter) {
                compose (
                car => (streetsState[car.currentStreet].cars.push(car)),
                reenterCar)(candidateToEnter)
            }

            /// Sensors Turn
            // Every node has a camera that takes a photo when pass a car
            carsThatCanCross.map(compose(
                generateMQTT('cars'),
                takePhoto,
                getSensorObject));

            // Every 
            
        },1000);


    });

