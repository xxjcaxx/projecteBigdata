import {compose,MAP,log} from "./functionalUtils.js"
export {createCarsTable,createStreetsTable};


const createRows = ($creator) => (array) => array.map($creator).join('');
const createTable = ($creator) => (array) => compose(createRows($creator))(array);

const createCarRow = (car) => `<tr>
<td><img src="./cars/${car.img}"/></td>
<td>${car.id}</td>
<td>${car.currentStreet}</td>
</tr>`;
const createCarsTable = (cars) => createTable(createCarRow)(cars);

const generateGaps = (street) => Array(Math.ceil(street.cars[0].secondsToCanCross)).fill(0).map(()=> `<span></span>`).join('')

const createStreetRow = (street) => `
<tr>
<td>${street[0]}</td>
<td>${street[1].cars.length > 0 ? generateGaps(street[1]): ''}${street[1].cars.map(c=> `<span style="background-color : rgb(${c.secondsNotCrossing > 1 ? 255 : 0},${c.secondsNotCrossing > 1 ? 0 : 150},50)">${Math.floor(c.id)}</span>`).join('')}</td>
</tr>
`;
const createStreetsTable = (streets) => createTable(createStreetRow)(streets);


