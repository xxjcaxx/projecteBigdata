export {compose,MAP,log,FILTER,getRandomArray,doIfRandom,hashCode,intToRGB,getNormallyDistributedRandomNumber};

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const MAP = (funct) => (array) => array.map(funct);
const FILTER = (func) => (array) => array.filter(func);
const log = (ob) => (console.log(ob), ob);
const getRandomArray = (array) => array[Math.floor(Math.random()*array.length)];
const doIfRandom = (probability) => (func) => (args) => Math.random()<probability && func(args) || args;


function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

// https://mika-s.github.io/javascript/random/normal-distributed/2019/05/15/generating-normally-distributed-random-numbers-in-javascript.html
function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    
    return { z0, z1 };
}

function getNormallyDistributedRandomNumber(mean, stddev) {
    const { z0, _ } = boxMullerTransform();
    let greatAccident = Math.random()< 0.001 ? 15 : 0;  // 1/1000 of chance of an accident
    return z0 * stddev + mean + greatAccident;
}
