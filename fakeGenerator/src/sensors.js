import { Observable, interval, Subject, of, mergeMap, concatMap, tap, delay, auditTime, from } from 'rxjs';

import { getNextNode } from "./data.js";
import { compose, doIfRandom, getRandomArray } from "./functionalUtils.js";

export { getSensorObject, getSensorStreetObject, sendSensorStreet, sendSensorCar, getPoliceNotification, enqueueMqtt, addNoiseToSensorStreet };

import { Bot } from "./jsbot.js";

const sensorsWorker = new Worker(new URL('sensorsWorker.js', import.meta.url));

const getNodeInfo = (car) => {
  let node = getNextNode(car.lastStreet)[0];
  return node ? { latitude: node.latitude, longitude: node.longitude } : { latitude: 0, longitude: 0 };
};

const getSensorObject = (ambientState) => (car) => ({ photo: car.img, enter: car.lastStreet, exit: car.currentStreet, date: ambientState.hour, ...getNodeInfo(car) });

const enqueueMqtt = (type) => (dataSensor) => {
  sensorsWorker.postMessage({ type, dataSensor })
}


const getSensorStreetObject = (ambientState) => (street) => ({
  noise: street.cars.reduce((previous, current) => previous + current.noise, 0) / street.long,
  pollution: street.cars.reduce((previous, current) => previous + current.pollution, 0) / street.long,
  longitude: street.longitude, latitude: street.latitude,
  date: ambientState.hour,
  // humidity: ambientState.humidity + (Math.random()* 2 - 1),
  light: ambientState.light + (Math.random() * 2 - 1),
  raining: ambientState.raining + (Math.random() * 2 - 1),
  streetLong: street.long
});

const addNoiseToSensorStreet = (street) => {
  let sensorStreetCopy = { ...street };
  doIfRandom(0.0001)(() => sensorStreetCopy.light = Math.random() > 0.5 ? 0 : 1000);
  doIfRandom(0.0001)(() => sensorStreetCopy.raining = Math.random() > 0.5 ? -100 : 1000);
  doIfRandom(0.0001)(() => sensorStreetCopy.noise = Math.random() > 0.5 ? 0 : 1000);
  doIfRandom(0.0001)(() => sensorStreetCopy.pollution = Math.random() > 0.5 ? 0 : 1000);
  return sensorStreetCopy;
}



let SNetworkMessages = [];
//fetch('./messagesPatterns.json').then(response => response.json()).then(data => SNetworkMessages=data.messages);
fetch('./messagesTagged.json').then(response => response.json()).then(data => SNetworkMessages = data);



//6002727154:AAHqofuHXQ9o0MhxS-1bpUezxnUrkM_YesU
const bot = new Bot("6002727154:AAHqofuHXQ9o0MhxS-1bpUezxnUrkM_YesU");

const PoliceNotificationSubject = new Subject();

PoliceNotificationSubject.pipe(
  concatMap(x => of(x)
    .pipe(
      delay(5000))
  )
).subscribe(message => bot.sendMessage(message, "-529232276", null, true).catch(e => console.error(e)))


const getPoliceNotification = (ambient) => (car) => {
  // console.log(date);
  //date = date.date;
  let street = car.currentStreet;
  let plate = `AC${('000' + car.id).slice(-3)}KS`;
  let severity = car.secondsToCanCross;
  let trafficjam = car.secondsNotCrossing;
  let sentiment = severity < 400 && trafficjam < 10 ? 'happy' :
    severity < 500 && trafficjam < 60 ? 'neutral' :
      severity < 600 && trafficjam < 100 ? 'frustrated' :
        severity < 700 && trafficjam < 120 ? 'worried' :
          'angry';

  for (let i = 0; i < 4; i++) { 

    let message = getRandomArray(SNetworkMessages.filter(m => m.firstSentiment == sentiment)).message;
    message = message.replaceAll(`{{street}}`, street);
    message = message.replaceAll(`{{carplate}}`, plate);
    let dateAfter = new Date(ambient.hour.getTime() + i * 10000);
    message = dateAfter.toLocaleDateString('en-GB') + " " + dateAfter.toLocaleTimeString('en-GB') + " " + message;
    console.log(message, sentiment);
    PoliceNotificationSubject.next(message);
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




