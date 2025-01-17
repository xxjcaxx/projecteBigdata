import { nodes, streets, cityEntries, cityExits, staticCars } from "./data.js";
import { compose, MAP, log, FILTER, getRandomArray, doIfRandom } from "./functionalUtils.js";
import { createCarsTable, createStreetsTable } from "./views.js";
import { generateMQTT, takePhoto, getSensorObject, getSensorStreetObject, getPoliceNotification, enqueueMqtt, addNoiseToSensorStreet, sendSensorStreet, sendSensorCar } from "./sensors.js";
import "./style.css";
import { debounceTime, interval, Subject, throttleTime } from "rxjs";
import {initializeStreets,assignCarsToStreets,removeExitCars,crossCar,getCarsCanCross,reenterCar,generateOriginalCars,regenerateCarList,generateIncident,getCandidateToEnter,getCandidatesToEnter,incidentSubject} from "./dataGeneration.js";
import suncalc from "suncalc"

const incrementAmbientState = (ambientState) => {

    let ambientStateTendency = {...ambientState.ambientStateTendency};

    let cloudy =  ambientState.cloudy + ambientStateTendency.toCloudy;
    cloudy = cloudy <= 0 ? 0 : cloudy;
    cloudy = cloudy <= 100 ? cloudy : 100;
    let raining = cloudy > 95 ? ambientState.raining + ambientStateTendency.toCloudy : 0;
   // let humidity = raining > 0 ? 100 : ambientState.humidity + (Math.random() * (cloudy/100) - 0.5);
    let light = (suncalc.getPosition(ambientState.hour,38.985471,-0.536866).altitude * 180 / Math.PI) / 90 * 100 - (cloudy * 0.1);
    light = light < 1 ? 1 : light;
    let dangerFactor = (3*raining + 2*(100/light)) / 4;
    dangerFactor = dangerFactor < 5 ? 0.005 : dangerFactor  * 0.0002 + 0.01 ;

    doIfRandom(0.001)(()=> { ambientStateTendency.toCloudy = (Math.random() - 0.7)*0.1; console.log("Cambio climatico"); } )(); 

    return {
        hour: new Date(ambientState.hour.getTime()+10*1000),
        //humidity: humidity,
        light: light,
        cloudy: cloudy,
        raining: raining <= 100 ? raining : 100,
        dangerFactor: dangerFactor,
        ambientStateTendency: ambientStateTendency,
    }
}


const activityHours = [
                    [20, 20, 20, 20, 10, 20, 50, 70, 100, 100, 80, 60, 90, 90, 90, 80, 60, 90, 100, 100, 90, 70, 50, 60, 40],
                    [50, 40, 30, 20, 10, 20, 50, 60, 900, 100, 90, 60, 90, 90, 90, 80, 60, 90, 100, 100, 90, 70, 50, 40, 40],
                    [50, 40, 30, 20, 10, 20, 50, 60, 100, 100, 80, 60, 90, 90, 90, 80, 60, 90, 100, 100, 90, 70, 50, 40, 40],
                    [50, 40, 30, 20, 10, 20, 50, 60, 100, 100, 80, 60, 90, 90, 90, 80, 60, 90, 100, 100, 90, 70, 50, 40, 40],
                    [60, 60, 40, 30, 30, 20, 50, 60, 100, 100, 90, 70, 90, 90, 90, 80, 50, 90, 100, 100, 90, 70, 60, 50, 40],
                    [70, 60, 40, 20, 30, 30, 50, 50, 50,  50,  70, 60, 90, 90, 90, 80, 60, 90, 100, 100, 100, 100, 90, 90, 40],
                    [80, 70, 50, 20, 10, 20, 50, 20, 20,  20, 30, 40,  60, 90, 90, 80, 60, 90, 100, 100, 40, 30, 20, 10, 40]];
//                   0   1    2  3   4   5   6   7   8    9   10   11  12  13  14 15  16   17  18   19  20  21    22  23  24

let ambientState = {
    hour: new Date(),
   // humidity: 50,
    light: 50,
    cloudy: 94,
    raining: 0,
    dangerFactor: 50,
    ambientStateTendency : { 
        toCloudy : 0.1 // speed to cloudy
    }
}


const changesSubject = new Subject();

// Start of app

document.addEventListener('DOMContentLoaded', () => {


    let intervalMillisecons = 100;

    let lastTime = new Date().getTime();

    let streetsState = initializeStreets(streets);
    // Start the array of cars with starting route and street
    const OriginalCars = staticCars.filter(c => c.id >= 0);  
    //const OriginalCars =  generateOriginalCars(999);
    compose(assignCarsToStreets(streetsState), removeExitCars)(OriginalCars);
    console.log("Original Cars: ", OriginalCars);

    interval(intervalMillisecons).subscribe(function mainIntervalCallback(step) {


        let currentTime = new Date().getTime();
        let timeDifference = currentTime - lastTime;
        lastTime = currentTime;


        ambientState = incrementAmbientState(ambientState);
        //console.log(ambientState,ambientStateTendency);
        // Cross cars
        // We get the first car of every street and, if can cross, it cross

         // There is a small probability of incident where a car increase the time to can exit a lot
        doIfRandom(ambientState.dangerFactor)(generateIncident)(Object.values(streetsState));


        let carsThatCanCross = getCarsCanCross(streetsState);
        carsThatCanCross.forEach(crossCar(streetsState,ambientState));
       // console.log(carsThatCanCross.filter(c=>c.currentStreet === -1).length);
        // We Regenerate the street states based on the cars streets after cross
        regenerateCarList(OriginalCars);

        //Some of the exited cars can return to the circuit in the same street they finished
        let candidateToEnter = activityHours[ambientState.hour.getDay()][ambientState.hour.getHours()]/100 >= Math.random() ? getCandidateToEnter(OriginalCars,ambientState.hour) : [];
        candidateToEnter.map(c => {
            compose(
                car => (streetsState[car.currentStreet].cars.push(car)),
                reenterCar)(c)
        });


        changesSubject.next({streetsState,ambientState,OriginalCars,timeDifference})

        /// Sensors Turn
        // Every node has a camera that takes a photo when pass a car
        carsThatCanCross.filter(car => car.currentStreet != -1).forEach(sendSensorCar(ambientState));
            
        // Every street has a sensor of noise, pollution, temperature
        Object.values(streetsState).forEach(sendSensorStreet(ambientState));

    });

});

incidentSubject.subscribe(compose(
    //()=>console.log(ambientState.hour),
   // log,
    (car)=> getPoliceNotification(ambientState)(car),
    //log
    ));

changesSubject.pipe(
    throttleTime(1000)
).subscribe(changes => {
        //console.log(changes);
        const {streetsState,ambientState,OriginalCars,timeDifference} = changes;
        // We show the result
        document.querySelector('#streetList table').innerHTML = createStreetsTable(Object.entries(streetsState));
        document.querySelector('#totalCars').innerHTML = `Hour: ${ambientState.hour.getDay()} ${ambientState.hour.toLocaleString()} Cars: ${1000 - getCandidatesToEnter(OriginalCars).length} <br> L: ${Math.round(ambientState.light)} Cloudy: ${Math.round(ambientState.cloudy)} ${Math.round(ambientState.ambientStateTendency.toCloudy * 100)} Raining: ${Math.round(ambientState.raining)} <br/> Danger: ${ ambientState.dangerFactor } <br/>Time Frame: ${timeDifference}`;
        document.querySelector('#carList table').innerHTML = createCarsTable(OriginalCars);
})