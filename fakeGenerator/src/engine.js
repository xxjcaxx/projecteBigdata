import { nodes, streets, cityEntries, cityExits, staticCars } from "./data.js";
import { compose, MAP, log, FILTER, getRandomArray, doIfRandom } from "./functionalUtils.js";
import { createCarsTable, createStreetsTable } from "./views.js";
import { generateMQTT, takePhoto, getSensorObject, getSensorStreetObject, getPoliceNotification } from "./sensors.js";
import "./style.css";
import { interval, Subject } from "rxjs";
import {initializeStreets,assignCarsToStreets,removeExitCars,crossCar,getCarsCanCross,reenterCar,generateOriginalCars,regenerateCarList,generateIncident,getCandidateToEnter,getCandidatesToEnter,incidentSubject} from "./dataGeneration.js";

// Start of app

document.addEventListener('DOMContentLoaded', () => {

    let streetsState = initializeStreets(streets);
    // Start the array of cars with starting route and street
    const OriginalCars = staticCars;  
    //const OriginalCars =  generateOriginalCars(999);
    compose(assignCarsToStreets(streetsState), removeExitCars)(OriginalCars);
    console.log("Original Cars: ", OriginalCars);

    interval(5000).subscribe(function mainIntervalCallback(step) {
        // Cross cars
        // We get the first car of every street and, if can cross, it cross
        let carsThatCanCross = getCarsCanCross(streetsState);
        carsThatCanCross.forEach(crossCar(streetsState));
        // We Regenerate the street states based on the cars streets after cross
        regenerateCarList(OriginalCars);

        //Some of the exited cars can return to the circuit in the same street they finished
        let candidateToEnter = getCandidateToEnter(OriginalCars);
        if (candidateToEnter) {
            compose(
                car => (streetsState[car.currentStreet].cars.push(car)),
                reenterCar)(candidateToEnter)
        }

        // There is a small probability of incident where a car increase the time to can exit a lot
        doIfRandom(0.01)(generateIncident)(Object.values(streetsState));
        

        // We show the result
        document.querySelector('#streetList table').innerHTML = createStreetsTable(Object.entries(streetsState));
        document.querySelector('#totalCars').innerHTML = `Total Cars: ${999 - getCandidatesToEnter(OriginalCars).length}`;
        document.querySelector('#carList table').innerHTML = createCarsTable(OriginalCars);

        /// Sensors Turn
        // Every node has a camera that takes a photo when pass a car
        carsThatCanCross.filter(car => car.currentStreet != -1).forEach(compose(
            generateMQTT('cars'),
            takePhoto,
            getSensorObject
        ));

        console.log(carsThatCanCross.filter(car => car.currentStreet != -1).length)

        // Every street has a sensor of noise, pollution, temperature
        Object.values(streetsState).forEach(
            compose(
                generateMQTT('streets'),
                //log,
                getSensorStreetObject)
        );

    });

    incidentSubject.subscribe(compose(
        getPoliceNotification,
        log
        ));


});

