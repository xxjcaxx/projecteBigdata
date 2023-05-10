const express = require('express')
const mqtt = require('mqtt')
const fs = require('fs');
const cors = require('cors');
const app = express()
const port = 3000


app.use(express.json()) // for parsing application/json

app.use(cors(
  //{ origin: 'http://127.0.0.1:3000',}
  ))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function initCLientMQTT(){
  let client = mqtt.connect('mqtt://localhost:1883'); // create a client
  console.log("connected flag  "+client.connected);
  client.on("connect",function(){	
    console.log("connected");
  });
  client.on("error",function(error){ console.log("Can't connect"+error)});
  return client;
}

let client = initCLientMQTT();

function base64_encode(file) {
  return "data:image/gif;base64,"+fs.readFileSync(file, 'base64');
}

const generatePhoto = async (photoURL) => {
  /*let response = await fetch(`./cars/${photoURL}`);
  let photoBlob = await response.blob();
  let dataURL = await getReaderPromise(photoBlob);*/
 
  return base64_encode(photoURL);
}

app.post('/sensors/:type', async (req,res) => {
  //console.log(req.body);
 // res.send('Hello')
 let sensors = [req.body];

 for(let sensor of sensors){
  let sensorPhoto = {...sensor};
  if (sensor.photo) {
   sensorPhoto = {...sensor,photo: await generatePhoto(`./cars/cars${Math.ceil(Math.random()*5)}/${sensor.photo}`)};
  }
 
    //console.log(sensorPhoto);
    client.publish('sensors/'+req.params['type'], JSON.stringify(sensorPhoto),  ()=>{
       //console.log("publish");
     });
    // console.log(sensor);
   res.json(sensor)
 }

})


//app.post('/sensors/streets')

app.listen(port, () => {
  console.log(`Sensors app listening on port ${port}`)
})
