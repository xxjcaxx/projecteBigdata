import mqtt from "mqtt/dist/mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

import { Observable, interval, Subject, mergeMap, tap, concatMap, from } from 'rxjs';

import {getNextNode} from "./data.js";
import { compose, doIfRandom, getRandomArray } from "./functionalUtils.js";

export {generateMQTT,getSensorObject,getSensorStreetObject, sendSensorStreet, sendSensorCar, getPoliceNotification,enqueueMqtt,addNoiseToSensorStreet};

import { Bot } from "./jsbot.js";

const sensorsWorker = new Worker(new URL('sensorsWorker.js', import.meta.url));

//let client = mqtt.connect('mqtt://10.90.6.2:9001') // create a client
//client.subscribe(`sensors/cars`);
/*
const getReaderPromise = (blob) => new Promise((resolve)=>{
  let reader = new FileReader();
  reader.addEventListener('load',()=> resolve(reader.result));
  reader.readAsDataURL(blob);
});*/
/*
const generatePhoto = async (photoURL) => {
    let response = await fetch(`./cars/${photoURL}`);
    let photoBlob = await response.blob();
    let dataURL = await getReaderPromise(photoBlob);
   
    return dataURL;
}
*/
/*const generatePublishPromise = (topic) => (payload) => new Promise((resolve)=>{
  //console.log("Start",payload);
  client.publish(topic, payload,  { qos: 2, retain: false }, ()=>{
  //  console.log("publish", payload);
    resolve();
  });
});*/


/*const generateBackendPromise = (topic) => (payload) => fetch(`http://10.90.6.2:3000/${topic}`,{
  method: 'post',
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  },
  body: payload
})*/

//const mqttQueue = new Subject();

const getNodeInfo = (car) => { 
  let node = getNextNode(car.lastStreet)[0] ; 
  return node ? {latitude: node.latitude, longitude: node.longitude} : {latitude: 0, longitude: 0};
};

const getSensorObject =(ambientState)=> (car) => ({photo: car.img, enter: car.lastStreet, exit: car.currentStreet, date: ambientState.hour, ...getNodeInfo(car)});
//const takePhoto = async (sensorObject) => ({...sensorObject,photo: await generatePhoto(sensorObject.photo)});
const generateMQTT = (type) => async (sensorPromise) => {
  let dataSensor = await sensorPromise;
  //console.log(carsRemaining);
 // console.log(dataSensor);
  mqttQueue.next({topic: `sensors/${type}`, payload: JSON.stringify(dataSensor)});
}

const enqueueMqtt = (type) => (dataSensor) => {
 // mqttQueue.next({topic: `sensors/${type}`, payload: JSON.stringify(dataSensor)})
 sensorsWorker.postMessage({type,dataSensor})
}


/*mqttQueue.pipe(
 // tap(message => console.log("pipe",message.payload)),
  concatMap(message => from(generateBackendPromise(message.topic)(message.payload))),
  tap(()=> {
   // console.log(carsRemaining);
  })
).subscribe()*/
  

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
  let message = getRandomArray(SNetworkMessages);
  message = message.replaceAll(`{{street}}`,street);
  message = message.replaceAll(`{{carplate}}`,plate);
  message = date.toLocaleDateString('en-GB')+" "+date.toLocaleTimeString('en-GB')+" "+message;
  console.log(message);
  //bot.sendMessage(message, "-529232276", null, true).catch(e=> console.error(e));
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



  