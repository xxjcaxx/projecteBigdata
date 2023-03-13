export {compose,MAP,log,FILTER,getRandomArray,doIfRandom};

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const MAP = (funct) => (array) => array.map(funct);
const FILTER = (func) => (array) => array.filter(func);
const log = (ob) => (console.log(ob), ob);
const getRandomArray = (array) => array[Math.floor(Math.random()*array.length)];
const doIfRandom = (probability) => (func) => (args) => Math.random()<probability && func(args) || args;