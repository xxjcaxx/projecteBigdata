export {compose,MAP,log,FILTER,getRandomArray,doIfRandom,hashCode,intToRGB};

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