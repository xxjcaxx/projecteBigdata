//import { Observable, interval, Subject, mergeMap, tap, concatMap, from } from 'rxjs';

import {getNextNode} from "./data.js";
import { compose, doIfRandom, getRandomArray } from "./functionalUtils.js";

export {getSensorObject,getSensorStreetObject, sendSensorStreet, sendSensorCar, getPoliceNotification,enqueueMqtt,addNoiseToSensorStreet};

import { Bot } from "./jsbot.js";

const sensorsWorker = new Worker(new URL('sensorsWorker.js', import.meta.url));

const getNodeInfo = (car) => { 
  let node = getNextNode(car.lastStreet)[0] ; 
  return node ? {latitude: node.latitude, longitude: node.longitude} : {latitude: 0, longitude: 0};
};

const getSensorObject =(ambientState)=> (car) => ({photo: car.img, enter: car.lastStreet, exit: car.currentStreet, date: ambientState.hour, ...getNodeInfo(car)});

const enqueueMqtt = (type) => (dataSensor) => {
 sensorsWorker.postMessage({type,dataSensor})
}
  

const getSensorStreetObject = (ambientState) => (street) => ({
  noise: street.cars.reduce((previous,current)=> previous + current.noise,0) / street.long, 
  pollution: street.cars.reduce((previous,current)=> previous + current.pollution,0) / street.long,
  longitude: street.longitude, latitude: street.latitude,
  date: ambientState.hour, 
 // humidity: ambientState.humidity + (Math.random()* 2 - 1),
  light: ambientState.light + (Math.random()* 2 - 1),
  raining: ambientState.raining+ (Math.random()* 2 - 1),
  streetLong: street.long
});

const addNoiseToSensorStreet = (street) => {
  let sensorStreetCopy = {...street};
  doIfRandom(0.0001)(()=> sensorStreetCopy.light = Math.random()> 0.5 ? 0 : 1000);
  doIfRandom(0.0001)(()=> sensorStreetCopy.raining = Math.random()> 0.5 ? -100 : 1000);
  doIfRandom(0.0001)(()=> sensorStreetCopy.noise = Math.random()> 0.5 ? 0 : 1000);
  doIfRandom(0.0001)(()=> sensorStreetCopy.pollution = Math.random()> 0.5 ? 0 : 1000);
  return sensorStreetCopy;
}



let SNetworkMessages = [];
fetch('./messagesPatterns.json').then(response => response.json()).then(data => SNetworkMessages=data.messages);

//6002727154:AAHqofuHXQ9o0MhxS-1bpUezxnUrkM_YesU
const bot = new Bot("6002727154:AAHqofuHXQ9o0MhxS-1bpUezxnUrkM_YesU")

const getPoliceNotification = (date) => (car) => {
  
  let street = car.currentStreet;
  let plate = `AC${('000'+car.id).slice(-3)}KS`;
  for(let i=0; i<Math.random()*4;i++){
    let message = getRandomArray(SNetworkMessages);
    message = message.replaceAll(`{{street}}`,street);
    message = message.replaceAll(`{{carplate}}`,plate);
    let dateAfter = new Date(date.getTime()+i*10000);
    message = dateAfter.toLocaleDateString('en-GB')+" "+dateAfter.toLocaleTimeString('en-GB')+" "+message;
    console.log(message);
    //bot.sendMessage(message, "-529232276", null, true).catch(e=> console.error(e));
  }
}

const sendSensorStreet = (ambientState) => (street) => {
  return compose(
    enqueueMqtt('streets'),
    addNoiseToSensorStreet,
    getSensorStreetObject(ambientState))(street)
}

const sendSensorCar = (ambientState) => (car) => {
 // sensorsWorkerCars.postMessage(car);
  return compose(
    enqueueMqtt('cars'),
    getSensorObject(ambientState))(car)
}



  