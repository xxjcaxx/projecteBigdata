export {initializeStreets,assignCarsToStreets,removeExitCars,crossCar,getCarsCanCross,reenterCar,generateOriginalCars,regenerateCarList,generateIncident,getCandidateToEnter, getCandidatesToEnter,incidentSubject};
import { interval, Subject } from "rxjs";
import { compose, MAP, log, FILTER, getRandomArray, doIfRandom } from "./functionalUtils.js";
import { nodes, streets, cityEntries, cityExits, staticCars, INTERVAL, routines } from "./data.js";

const arrayStreets = Object.keys(streets);



// Get the node that have this street as an entry
const getStreetNodes = (nodes) => (street) => nodes.filter(node => node.entries.includes(street))[0]


// From a route and a node, get the streets this node can exit, can´t be an existing street in the route
const getAvailableStreets = (route) => (node) => node.exits.filter(s => !route.includes(s));

// Long streets are better to use, so we can expand the probability
const expandArrayAvailableStreets = (filteredStreets) => filteredStreets.map(s => (new Array(streets[s].long)).fill(s)).flat()

// Functions to generate random routes
const generateSingleRoute = (cityExits) => (cityEntries) => (home) => {
    let currentStreet = home;
    let route = [];
    while (!cityExits.includes(currentStreet) && currentStreet) {
        route = [...route, currentStreet];
        currentStreet = compose(getRandomArray,  expandArrayAvailableStreets, getAvailableStreets(route), getStreetNodes(nodes))(currentStreet);
    }
    route = [...route, currentStreet];
    return route;
}

const generateSingleRouteToHome = (cityExits) => (cityEntries) => (home) => {
    let currentStreet = getRandomArray(cityEntries);
    let route = [];
    while (currentStreet !== home && currentStreet && !cityExits.includes(currentStreet)) {
        route = [...route, currentStreet];
        currentStreet = compose(getRandomArray, getAvailableStreets(route), getStreetNodes(nodes))(currentStreet);
    }
    route = [...route, currentStreet];
    return route;
}


/**
 * Generate n random routes
 * @param {} n 
 * @param {*} nodes 
 * @param {*} arrayStreets 
 */
const generateRoutes = (n, nodes, arrayStreets) => {
    let home = getRandomArray(arrayStreets.filter(s => !cityEntries.includes(s) && !cityExits.includes(s)));
    let routes = [];
    //for(let i =0; i< n; i++){
    while (routes.length < n) {
        let route = generateSingleRoute(cityExits)(cityEntries)(home);
        if (route.at(-1)) {
            routes.push(route);
        }
    }
    while (routes.length < n * 2) {
        let route = generateSingleRouteToHome(cityExits)(cityEntries)(home);
        if (route.at(-1) && route.at(-1) == home) {
            routes.push(route);
        }
    }

    return routes;
}

// Factory of cars
const carGenerator = (img, id) => {
    
    let driverIResponsability = Math.random();
    let carAge = driverIResponsability + (Math.random()*0.3) ;
    let electric = Math.random() > 0.90 && carAge < 0.3 ? true : false; 

    return {
    img, id,
    electric,
    age: Math.round(carAge * 20),
    maxSpeed: Math.round((driverIResponsability + (Math.random()*0.3)) * 100 + 20),
    pollution: electric ? 1 : Math.round((carAge + (Math.random()*0.3))*100),
    noise: electric ? 1 : Math.round((carAge + (Math.random()*0.3))*100),
    routes: generateRoutes(Math.random() * 8 + 2, nodes, arrayStreets),
    secondsToCanCross: 0,
    secondsNotCrossing: 0,
    lastStreet: '',
    routeStepNumber: 0,
    routine: getRandomArray(routines)  // 0-6 , 6-10, 10-14, 14-19, 19-23
}};

// Remove cars that had exited the city
const removeExitCars = (cars) => cars.filter(car => car.currentStreet !== -1);
// Assign a route to a car
const addStartRoute = (car) => (route) => (car.route = route, car);
// Add first street of the route to a car. 
const carCurrentStreet = (car) => (car.currentStreet = car.route[0], car);
// Inizialize a car with a random route and the start of the route
const carStartRoute = (car) => compose(doIfRandom(0.6)(car => (car.lastStreet = car.currentStreet, car.currentStreet = -1, car)), carCurrentStreet, addStartRoute(car), getRandomArray)(car.routes);
 
// 
const assignCarsToStreets = (streets) =>
    (cars) => cars.map(car => (streets[car.currentStreet]
        .cars.push(car), car))

const getSecondsToCanCross = (currentStreetLong) => (car) => 2 * currentStreetLong / (car.maxSpeed * (Math.random() + 0.2))
const updateSecondsToCanCross = (cars) => {
    cars.forEach(car => {
        car.secondsToCanCross = car.secondsToCanCross > 1 ? car.secondsToCanCross - INTERVAL : 0;
        car.secondsNotCrossing = car.secondsToCanCross <= 0 ? car.secondsNotCrossing + INTERVAL : 0;
    });
    return cars;
}

/*const updateNextnode = (cars) => {
    cars.forEach(car => {
        car.nextNode = nodes.filter(node=>)
});
}*/

const crossCar = (streets,ambientState) => (car) => {
    streets[car.currentStreet].cars = streets[car.currentStreet].cars.slice(1);
    car.lastStreet = car.currentStreet;
    if (car.route.indexOf(car.currentStreet) < car.route.length -1) {
        car.currentStreet = car.route[car.route.indexOf(car.currentStreet) + 1];
        car.secondsToCanCross = getSecondsToCanCross(streets[car.currentStreet].long + ambientState.raining)(car);
        streets[car.currentStreet].cars.push(car);
    } else {
        car.currentStreet = -1;
        car.secondsToCanCross = 0;
    }
    car.routeStepNumber++;
    car.secondsNotCrossing = 0;
    //console.log(car.secondsToCanCross);

    return car
}


const nexStreetIsEmpty = (streets,car) => {
   // console.log(car.routeStepNumber, car.route.length);
   if (car.routeStepNumber < car.route.length -1) {
    let isEmpty = streets[car.route[car.routeStepNumber+1]].cars.length < streets[car.route[car.routeStepNumber+1]].carCapacity
    /*if(!isEmpty) {
        console.log("No is empty",car);
    }*/
    return isEmpty;
   } else
   return true;
 }

const getCarsCanCross = (streets) => compose(
    FILTER(car =>
        car.secondsToCanCross <= 0 // Is at the end 
        && ( 
           car.routeStepNumber >= car.route.length -1 ||         
           ( Math.random() > 0.5 
            && (nexStreetIsEmpty(streets,car) || Math.random() < 0.009)) // Not interblock
        )
        ), // Some first cars are not yet in node
    //log,
    FILTER(item => item),
    MAP(street => street.cars[0]), // Get first car
    Object.values)
    (streets);




const reenterCar = (car) => {
    car.currentStreet = car.lastStreet;
    car.routeStepNumber = 0;
    car.secondsNotCrossing = 0;


    car.route = cityExits.includes(car.currentStreet) ? compose(
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
    MAP((n, i) => carGenerator(`car${i}.jpg`, i))
)((new Array(number)).fill(null));

const regenerateCarList = (cars) => compose(
    //   removeExitCars,
    //   updateNextnode,
    updateSecondsToCanCross
)(cars);

const getHourInterval = (hour) => [0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,3,4,4,4,4,4][hour.getHours()]
const carCanEnter = (hour) => (car) => car.routine[getHourInterval(hour)] >= Math.random()*100;

const getCandidatesToEnter =(OriginalCars) => OriginalCars.filter(car => car.currentStreet === -1 && car.lastStreet);

const getCandidateToEnter = (OriginalCars,hour) => compose(
    FILTER(s=>s),
    (candidatesArray) => ([... new Set([getRandomArray(candidatesArray),getRandomArray(candidatesArray)])]),
    FILTER(carCanEnter(hour)),
    getCandidatesToEnter
    //FILTER(car => car.currentStreet === -1 && car.lastStreet)
)(OriginalCars);



const initializeStreets = (originalStreets) => {
    return Object.fromEntries(Object.keys(originalStreets).map(street => {
        let streetData = { ...originalStreets[street] }
        streetData.cars = [];
        streetData.carCapacity = streetData.long / 4;
        return [street, streetData];
    }
    ));
}

const incidentSubject = new Subject();


const getWorstStreets = (streets) => {
    return streets.sort((a,b) => {
        let aFactor = a.cars.length / a.carCapacity + a.dangerous + Math.random();
        let bFactor = b.cars.length / b.carCapacity + b.dangerous + Math.random();
        return a > b ? 1 : -1;
    }).splice(0,10).filter(s => s);
}

const getWorsCars = (cars) => [...cars].sort((a,b) => a.maxSpeed > b.maxSpeed ? 1 : -1).splice(0,10).filter(s => s);

const generateIncident = (streets) => {
    compose(
      //  log,
        car => {incidentSubject.next(car); return car}, 
        car => { car.secondsToCanCross = Math.round(Math.random()*200)+100; return car},
       // log,
               
        getRandomArray,
        getWorsCars,
        s => s.cars,
       // log,
        getRandomArray,
        getWorstStreets,
        FILTER(s=> s.cars.length > 1),
        )(streets)
}

