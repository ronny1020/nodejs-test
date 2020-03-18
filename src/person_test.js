const { func, Person } = require('./person.js');

const p1 = new Person('Bill', 26);
const p2 = new Person('David', 30);

console.log(p1.toString());
console.log(p1.toJSON());
console.log(p2.toString());
console.log(p2.toJSON());