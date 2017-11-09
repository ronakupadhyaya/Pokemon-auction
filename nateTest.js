// let states = [
//   "AK",
//   "AL",
//   "AR",
//   "AS",
//   "AZ",
//   "CA",
//   "CO",
//   "CT",
//   "DC",
//   "DE",
//   "FL",
//   "GA",
//   "GU",
//   "HI",
//   "IA",
//   "ID",
//   "IL",
//   "IN",
//   "KS",
//   "KY",
//   "LA",
//   "MA",
//   "MD",
//   "ME",
//   "MI",
//   "MN",
//   "MO",
//   "MS",
//   "MT",
//   "NC",
//   "ND",
//   "NE",
//   "NH",
//   "NJ",
//   "NM",
//   "NV",
//   "NY",
//   "OH",
//   "OK",
//   "OR",
//   "PA",
//   "PR",
//   "RI",
//   "SC",
//   "SD",
//   "TN",
//   "TX",
//   "UT",
//   "VA",
//   "VI",
//   "VT",
//   "WA",
//   "WI",
//   "WV",
//   // "WY"
// ];
// console.log(states.map(state => {
//   return '<option>'+state+'</option>';
// }));
var pokemon = require('./data/pokemon.json');
var count = 0;
const mon = pokemon.map(mon=>{
  count++;
  return (`<option value="${count}">${mon.name}</option>`);
}).join('\n');
console.log(mon);
