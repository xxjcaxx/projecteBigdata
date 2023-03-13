export {generateMQTT,takePhoto,getSensorObject};
import pica from 'pica';

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



const getSensorObject = (car) => ({photo: car.img, enter: car.lastStreet, exit: car.currentStreet});
const takePhoto = async (sensorObject) => ({...sensorObject,photo: await generatePhoto(sensorObject.photo)});
const generateMQTT = async (sensorPromise) => ({...(await sensorPromise)})

const getSensorStreetObject = (street) => ({});