import { getNextNode } from "./data.js";
import { compose, doIfRandom, getRandomArray } from "./functionalUtils.js";
import { Observable, interval, Subject, mergeMap, tap, concatMap, from } from 'rxjs';

const urlServer = `http://10.90.6.2:3000`;
//const urlServer = `http://localhost:3000`;

const generateBackendPromise = (topic) => (payload) => fetch(`${urlServer}/${topic}`,{
  method: 'post',
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  },
  body: JSON.stringify(payload)
})


const mqttQueue = new Subject();
const enqueueMqtt = (type) => (dataSensor) => {
    mqttQueue.next({topic: `sensors/${type}`, payload: dataSensor})
  }

mqttQueue.pipe(
    // tap(message => console.log("pipe",message.payload)),
     concatMap(message => from(generateBackendPromise(message.topic)(message.payload))),
     tap(()=> {
      // console.log(carsRemaining);
     })
   ).subscribe()  

onmessage = function(e) {
    enqueueMqtt(e.data.type)(e.data.dataSensor);
  }
