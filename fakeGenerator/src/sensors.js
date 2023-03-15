import mqtt from "mqtt/dist/mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

import { Observable, interval, Subject, mergeMap, tap, concatMap, from } from 'rxjs';

import {getNextNode} from "./data.js";

export {generateMQTT,takePhoto,getSensorObject,getSensorStreetObject,getPoliceNotification};

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
})

const mqttQueue = new Subject();
let carsRemaining = 0;

const getNodeInfo = (car) => { 
  let node =  getNextNode(car.lastStreet)[0]; 
  return {latitude: node.latitude, longitude: node.longitude}
};

const getSensorObject = (car) => ({photo: car.img, enter: car.lastStreet, exit: car.currentStreet, time: Date.now(), ...getNodeInfo(car)});
const takePhoto = async (sensorObject) => ({...sensorObject,photo: await generatePhoto(sensorObject.photo)});
const generateMQTT = (type) => async (sensorPromise) => {
  let dataSensor = await sensorPromise;
  //console.log(carsRemaining);
 // console.log(dataSensor);
  carsRemaining++;
  mqttQueue.next({topic: `sensors/${type}`, payload: JSON.stringify(dataSensor)});
}

mqttQueue.pipe(
 // tap(message => console.log("pipe",message.payload)),
  concatMap(message => from(generatePublishPromise(message.topic)(message.payload))),
  tap(()=> {
    carsRemaining--; 
   // console.log(carsRemaining);
  })
).subscribe()
  

const getSensorStreetObject = (street) => ({
  noise: street.cars.reduce((previous,current)=> previous + current.noise,0), 
  pollution: street.cars.reduce((previous,current)=> previous + current.pollution,0),
  longitude: street.longitude, latitude: street.latitude
});


const getPoliceNotification = (car) => {}






  