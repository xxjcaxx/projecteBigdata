import { debounceTime, interval, Subject, throttleTime } from "rxjs";
import "./style.css";
import { createCarsTable, createStreetsTable } from "./views.js";

document.addEventListener('DOMContentLoaded', () => {

    let intervalMillisecons = 1000;
    interval(intervalMillisecons).subscribe(function mainIntervalCallback(step) {


        fetch('http://localhost:3100').then(response => response.json()).then(changes => {


        const {streetsState,ambientState,OriginalCars,timeDifference} = changes;
        let hour = new Date(ambientState.hour)
        // We show the result
        document.querySelector('#streetList table').innerHTML = createStreetsTable(Object.entries(streetsState));
        document.querySelector('#totalCars').innerHTML = `Hour: ${hour.getDay()} ${hour.toLocaleString()} Cars: ${1000 - OriginalCars.filter(c => c.currentStreet == -1).length} <br> L: ${Math.round(ambientState.light)} Cloudy: ${Math.round(ambientState.cloudy)} ${Math.round(ambientState.ambientStateTendency.toCloudy * 100)} Raining: ${Math.round(ambientState.raining)} <br/> Danger: ${ ambientState.dangerFactor } <br/>Time Frame: ${timeDifference}`;
        document.querySelector('#carList table').innerHTML = createCarsTable(OriginalCars);
        });

    });

});