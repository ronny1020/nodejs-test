class Person {
    constructor(name = 'noname', age = 20) {
        this.name = name;
        this.age = age;
    }

    toJSON() {
        const obj = {
            name: this.name,
            age: this.age,
        };
        return JSON.stringify(obj);
    }
}

let func = a => a * a;
console.log(func(7));




module.exports = { func, Person };