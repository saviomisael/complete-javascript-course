const poll = {
  question: 'What is favorite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  answers: new Array(4).fill(0),
  setAnswerChoosed(answer) {
    this.answers[answer]++;
  },
  registerNewAnswer() {
    const answer = Number(
      prompt(`${this.question}\n${this.options.join(
        '\n',
      )}\n(Write option number)
    `),
    );
    console.log(answer);

    // Register the answer
    const isAValidNumber =
      !isNaN(answer) &&
      answer < this.answers.length &&
      this.setAnswerChoosed(answer); // short circuit

    this.displayResults();
  },
  displayResults(type = 'array') {
    if (type === 'array') {
      console.log(this.answers);
    } else if (type === 'string') {
      console.log(`Poll results are ${this.answers.join(', ')}`);
    }
  },
};

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

poll.displayResults.call({ answers: [5, 2, 3] }, 'string'); // call generates a new this keyword - the call method first the this after the arguments of the function
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] });

//[5, 2, 3];
// Bonus Test [1, 5, 3, 9, 6, 1]

// IIFE -Immediately Invoked Function Expression
const runOnce = function (params) {
  console.log('This will never run again');
};

(function () {
  console.log('This will never run again - IIFE');
})(); // transform this in a expression

(() => console.log('This will never run again - IIFE - arrow function'))();

// With scope we can create data privacy (encapsulation)

// Closure
//A closure is the closed-over variable environment of the execution context in which a function was created,
// even after that execution context is gone

// A closure makes sure that a function doesn't loose connection to variables that existed at the parent function

// A closure is the same as an backpack which carries all the variables that were present in the environment where the function was created.
const secureBooking = function () {
  let passengerCount = 0;

  const getPassengerCount = function () {
    return console.log(`${passengerCount} passengers`);
  };

  const incrementPassengerCount = function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };

  return [getPassengerCount, incrementPassengerCount];
};

const [getCount, booker] = secureBooking();

booker();
booker();
booker();

getCount();

console.dir(booker);

// This also is a closure
let f;

const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};

const h = function () {
  const b = 777;
  f = function () {
    console.log(b * 2);
  };
};

g();
f();

// Re-assigning f function
h();
f();

// Example 2
const boardPassengers = function (numberOfPassengers, waitTimeInSeconds) {
  const perGroup = numberOfPassengers / 3;

  setTimeout(function () {
    console.log(`We are now boarding all ${numberOfPassengers} passengers`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, waitTimeInSeconds * 1000);

  console.log(`Will start boarding in ${waitTimeInSeconds} seconds`);
};

// if perGroup is commented on line 115 the callback of setTimeout will use this variable
const perGroup = 1000;

boardPassengers(180, 3);
(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';

  header.parentElement.addEventListener('click', () => {
    const actualColor = header.style.color;

    if (actualColor === 'red') {
      header.style.color = 'blue';
    } else {
      header.style.color = 'red';
    }
  });
})();
