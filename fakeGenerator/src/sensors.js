import mqtt from "mqtt/dist/mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

import { Observable, interval, Subject, mergeMap, tap, concatMap, from } from 'rxjs';

import {getNextNode} from "./data.js";

export {generateMQTT,takePhoto,getSensorObject,getSensorStreetObject,getPoliceNotification,enqueueMqtt};

let client = mqtt.connect('mqtt://10.90.6.2:9001') // create a client
//client.subscribe(`sensors/cars`);

const getReaderPromise = (blob) => new Promise((resolve)=>{
  let reader = new FileReader();
  reader.addEventListener('load',()=> resolve(reader.result));
  reader.readAsDataURL(blob);
});

const generatePhoto = async (photoURL) => {
    let response = await fetch(`./cars/${photoURL}`);
    let photoBlob = await response.blob();
    let dataURL = await getReaderPromise(photoBlob);
   
    return dataURL;
}

const generatePublishPromise = (topic) => (payload) => new Promise((resolve)=>{
  //console.log("Start",payload);
  client.publish(topic, payload,  { qos: 2, retain: false }, ()=>{
  //  console.log("publish", payload);
    resolve();
  });
});


const generateBackendPromise = (topic) => (payload) => fetch(`http://10.90.6.2:3000/${topic}`,{
  method: 'post',
  headers: {
    "Content-type": "application/json; charset=UTF-8"

  },
  body: payload
})

const mqttQueue = new Subject();

const getNodeInfo = (car) => { 
  let node = getNextNode(car.lastStreet)[0] ; 
  return node ? {latitude: node.latitude, longitude: node.longitude} : {latitude: 0, longitude: 0};
};

const getSensorObject =(ambientState)=> (car) => ({photo: car.img, enter: car.lastStreet, exit: car.currentStreet, time: ambientState.hour, ...getNodeInfo(car)});
const takePhoto = async (sensorObject) => ({...sensorObject,photo: await generatePhoto(sensorObject.photo)});
const generateMQTT = (type) => async (sensorPromise) => {
  let dataSensor = await sensorPromise;
  //console.log(carsRemaining);
 // console.log(dataSensor);
  mqttQueue.next({topic: `sensors/${type}`, payload: JSON.stringify(dataSensor)});
}

const enqueueMqtt = (type) => (dataSensor) => {
  mqttQueue.next({topic: `sensors/${type}`, payload: JSON.stringify(dataSensor)})
}


mqttQueue.pipe(
 // tap(message => console.log("pipe",message.payload)),
  concatMap(message => from(generateBackendPromise(message.topic)(message.payload))),
  tap(()=> {
   // console.log(carsRemaining);
  })
).subscribe()
  

const getSensorStreetObject = (ambientState) => (street) => ({
  noise: street.cars.reduce((previous,current)=> previous + current.noise,0), 
  pollution: street.cars.reduce((previous,current)=> previous + current.pollution,0),
  longitude: street.longitude, latitude: street.latitude,
  date: ambientState.hour, 
  humidity: ambientState.humidity + (Math.random()* 2 - 1),
  light: ambientState.light,
  raining: ambientState.raining
});


const getPoliceNotification = (car) => {}






  