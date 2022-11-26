'use strict';

// const Person = function (firstName, birthYear) {
//   this.firstName = firstName;
//   this.birthYear = birthYear;

//   // Never do this - bad performance
//   // this.calcAge = function () {
//   //   console.log(2037 - this.birthYear);
//   // };
// };

// Person.prototype.calcAge = function () {
//   console.log(2037 - this.birthYear);
// };

// const Student = function (firstName, birthYear, course) {
//   Person.call(this, firstName, birthYear);
//   this.course = course;
// };

// Student.prototype = Object.create(Person.prototype);

// Student.prototype.constructor = Student;

// Student.prototype.introduce = function () {
//   console.log(`My name is ${this.firstName} and I study ${this.course}`);
// };

// const mike = new Student('Mike', 2020, 'Computer Science');

// console.log(mike);
// mike.introduce();
// mike.calcAge();

// console.log(mike instanceof Student);
// console.log(mike instanceof Person);
// console.log(mike instanceof Object);

// // Static method
// Person.hey = function () {
//   console.log('Hey there 😎');
// };

// const person = new Person('Savio', 1999);
// Person.hey();
// person.hey(); // is not a function

// // New empty object is created

// // function is called, this = {}
// // {} linked to prototype
// // function automatically return {}
// console.log(person);

// const matilda = new Person('Matilda', 2017);
// const jack = new Person('Jack', 1975);
// console.log(matilda, jack);

// console.log(person instanceof Person);
// console.log('person' instanceof Person);

// person.calcAge();
// matilda.calcAge();
// jack.calcAge();

// console.log(Person.prototype.isPrototypeOf(person));
// console.log(Person.__proto__ === Person.prototype);

// Person.prototype.species = 'Homo Sapiens';
// console.log(person.species);

// // Object.prototype
// console.log(person.__proto__.__proto__);
// console.log(person.__proto__.__proto__.__proto__);

// console.dir(Person.prototype.constructor);

// const arr = [3, 4, 5, 6, 7, 8, 9, 3];
// console.log(arr.__proto__);
// console.log(arr.__proto__ === Array.prototype);
// console.log(arr.__proto__.__proto__ === Object.prototype);

// Array.prototype.unique = function () {
//   return [...new Set(this)];
// };

// const h1 = document.querySelector('h1');
// console.dir(x => x + 1);
// console.dir(function (x) {
//   return x + 1;
// });
// console.dir(function add(x) {
//   return x + 1;
// });

// Coding Challenge #1
// const Car = function (make, speed) {
//   this.make = make;
//   this.speed = speed;
// };

// Car.prototype.logSpeed = function () {
//   console.log(`${this.make} is going at ${this.speed} km/h`);
// };

// Car.prototype.accelerate = function () {
//   this.speed += 10;
//   this.logSpeed();
// };

// Car.prototype.brake = function () {
//   this.speed -= 5;
//   this.logSpeed();
// };

// const bmw = new Car('BMW', 120);

// const mercedes = new Car('Mercedes', 95);

// bmw.accelerate();

// mercedes.brake();

// const PersonCl = class {};

// class PersonCl {
//   constructor(fullName, birthYear) {
//     this.fullName = fullName; // setter
//     this.birthYear = birthYear;
//   }

//   calcAge() {
//     console.log(2037 - this.birthYear);
//   }

//   static hey() {
//     console.log('Hey there 😎');
//   }

//   get age() {
//     return 2037 - this.birthYear;
//   }

//   set fullName(name) {
//     if (name.includes(' ')) this._fullName = name;
//     else alert(`${name} is not a full name!`);
//   }

//   get fullName() {
//     return this._fullName;
//   }
// }

// const jessica = new PersonCl('Jessica Davis', 1996);

// // const walter = new PersonCl('Walter', 1997);

// console.log(jessica);
// jessica.calcAge();
// console.log(jessica.age);
// PersonCl.hey();

// // Classes are NOT hoisted
// // Class are first-class citizen
// // Classes are executed in strict mode

// const account = {
//   owner: 'jonas',
//   movements: [200, 530, 120, 300],
//   get latest() {
//     return this.movements.slice(-1).pop();
//   },

//   set latest(movement) {
//     this.movements.push(movement);
//   },
// };

// console.log(account.latest);

// account.latest = 50;

// console.log(account.movements);

// // Object.create
// const PersonProto = {
//   calcAge() {
//     console.log(2037 - this.birthYear);
//   },
// };

// const steven = Object.create(PersonProto);
// console.log(steven);
// steven.name = 'Steven';
// steven.birthYear = 2002;

// steven.calcAge();

// Coding Challenge #2
// class Car {
//   constructor(make, speed) {
//     this.make = make;
//     this.speed = speed;
//   }

//   logSpeed() {
//     console.log(`${this.make} is going at ${this.speed} km/h`);
//   }

//   accelerate() {
//     this.speed += 10;
//     this.logSpeed();
//   }

//   brake() {
//     this.speed -= 5;
//     this.logSpeed();
//   }

//   get speedUS() {
//     return this.speed / 1.6;
//   }

//   set speedUS(speed) {
//     this.speed = speed * 1.6;
//   }
// }

// const ford = new Car('Ford', 120);

// console.log(ford.speedUS);
// ford.accelerate();
// ford.brake();
// console.log(ford.speedUS);
// ford.speedUS = 80;
// console.log(ford.speedUS);
// ford.accelerate();

// Coding Challenge #3
// const Car = function (make, speed) {
//   this.make = make;
//   this.speed = speed;
// };

// Car.prototype.logSpeed = function () {
//   console.log(`${this.make} is going at ${this.speed} km/h`);
// };

// Car.prototype.accelerate = function () {
//   this.speed += 10;
//   this.logSpeed();
// };

// Car.prototype.brake = function () {
//   this.speed -= 5;
//   this.logSpeed();
// };

// const ElectricCar = function (make, speed, charge) {
//   Car.call(this, make, speed);
//   this.charge = charge;
// };

// ElectricCar.prototype = Object.create(Car.prototype);

// ElectricCar.prototype.chargeBattery = function (chargeTo) {
//   this.charge = chargeTo;
// };

// ElectricCar.prototype.accelerate = function () {
//   this.speed += 20;
//   this.charge -= 1;
//   this.logSpeed();
// };

// ElectricCar.prototype.logSpeed = function () {
//   console.log(
//     `${this.make} going at ${this.speed} km/h, with a charge of ${this.charge}%`
//   );
// };

// const tesla = new ElectricCar('Tesla', 120, 23);
// tesla.accelerate();
// tesla.brake();
// tesla.chargeBattery(100);
// tesla.brake();

// class PersonCl {
//   constructor(fullName, birthYear) {
//     this.fullName = fullName; // setter
//     this.birthYear = birthYear;
//   }

//   calcAge() {
//     console.log(2037 - this.birthYear);
//   }

//   static hey() {
//     console.log('Hey there 😎');
//   }

//   get age() {
//     return 2037 - this.birthYear;
//   }

//   set fullName(name) {
//     if (name.includes(' ')) this._fullName = name;
//     else alert(`${name} is not a full name!`);
//   }

//   get fullName() {
//     return this._fullName;
//   }
// }

// class Student extends PersonCl {
//   constructor(fullName, birthYear, course) {
//     super(fullName, birthYear);
//     this.course = course;
//   }

//   introduce() {
//     console.log(`My name is ${this.fullName} and I study ${this.course}`);
//   }

//   calcAge() {
//     console.log(
//       `I'm ${
//         2037 - this.birthYear
//       } years old, but as a student I feel more like ${
//         2037 - this.birthYear + 10
//       }`
//     );
//   }
// }

// const martha = new Student('Martha Jones', 2012, 'Computer Science');
// martha.calcAge();
// martha.introduce();

// class Account {
//   locale = navigator.language;
//   // Private class fields
//   #movements = [];
//   #pin;

//   constructor(ownerName, currency, pin) {
//     this.ownerName = ownerName;
//     this.currency = currency;
//     this.#pin = pin;
//   }

//   get movements() {
//     return this.#movements;
//   }

//   deposit(value) {
//     this.#movements.push(value);

//     return this;
//   }

//   withdraw(value) {
//     this.deposit(-value);

//     return this;
//   }

//   // Private method
//   #approveLoan(value) {
//     return true;
//   }

//   requestLoan(value) {
//     if (this.#approveLoan(value)) {
//       this.deposit(value);
//       console.log(`Loan approved.`);
//       return this;
//     }
//   }
// }

// const account1 = new Account('Jonas', 'EUR', 1111);
// console.log(account1);

// // account1.movements.push(250);
// // account1.movements.push(-140);

// account1.deposit(250);
// account1.withdraw(140);
// account1.requestLoan(1000);
// console.log(account1);
// console.log(account1.movements);
// account1.deposit(300).deposit(500).withdraw(400);
// console.log(account1);
