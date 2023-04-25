import { getNextNode } from "./data.js";
import { compose, doIfRandom, getRandomArray } from "./functionalUtils.js";
import { Observable, interval, Subject, mergeMap, tap, concatMap, from } from 'rxjs';

const generateBackendPromise = (topic) => (payload) => fetch(`http://10.90.6.2:3000/${topic}`,{
  method: 'post',
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  },
  body: payload
})


const mqttQueue = new Subject();
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

onmessage = function(e) {


    enqueueMqtt(e.data.type)(e.data.dataSensor);
  //  console.log('Worker: Message received from main script',e.data);
   /* const result = e.data[0] * e.data[1];
    if (isNaN(result)) {
      postMessage('Please write two numbers');
    } else {
      const workerResult = 'Result: ' + result;
      console.log('Worker: Posting message back to main script');
      postMessage(workerResult);
    }*/
  }