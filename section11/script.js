'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith Davis',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const allButtons = document.querySelectorAll('button');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;

  movs.forEach(function (x, index) {
    const type = isDepositOrWithdrawal(x);

    const htmlContent = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${x}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', htmlContent); // with afterbegin all new child appear on the top of the container
  });
};

function isDepositOrWithdrawal(movement) {
  return movement > 0 ? 'deposit' : 'withdrawal';
}

const createSingleUsername = username => {
  return username
    .toLowerCase()
    .split(' ')
    .map(x => x.charAt(0))
    .join('');
};

const createUsernames = ([...accounts]) => {
  accounts.forEach(x => {
    const username = createSingleUsername(x.owner);
    x.username = username;
  }); // modify on reference
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, x) => acc + x, 0);

  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function ({ ...account }) {
  const incomes = account.movements
    .filter(x => x > 0)
    .reduce((acc, x) => acc + x, 0);

  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(x => x < 0)
    .reduce((acc, x) => acc + x, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = movements
    .filter(x => x > 0)
    .map(x => (x * account.interestRate) / 100)
    .filter(x => x >= 1)
    .reduce((acc, x) => acc + x, 0); // Manter a logica separada - Muitos encadeamentos causam problemas de performance - Nao encadear métodos que modificam o array na referencia

  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = currentAccount => {
  displayMovements(currentAccount.movements);

  calcDisplayBalance(currentAccount);

  calcDisplaySummary(currentAccount);
};

createUsernames(accounts);

// Event handlers
let currentAccount;

allButtons.forEach(x => x.addEventListener('click', e => e.preventDefault())); // when press enter on a input inside a form the form is submitted - this event is call

btnLogin.addEventListener('click', event => {
  currentAccount = accounts.find(
    x =>
      x.username === inputLoginUsername.value &&
      x.pin === inputLoginPin.valueAsNumber
  );

  if (currentAccount) {
    // Display UI -movements -balance -summary
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.classList.add('app--show');

    updateUI(currentAccount);
  } else {
    containerApp.classList.remove('app--show'); // if credentials are wrong
  }
});

btnTransfer.addEventListener('click', e => {
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(x => x.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', () => {
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(x => x >= 0.1 * amount)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.username === inputCloseUsername.value
  ) {
    const accountToDeleteIndex = accounts.findIndex(
      x =>
        x.pin === Number(inputClosePin.value) &&
        x.username === inputCloseUsername.value
    );
    accounts.splice(accountToDeleteIndex, 1);
    containerApp.classList.remove('app--show');
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

let isSorted = false;

btnSort.addEventListener('click', () => {
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

/* let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE modify the reference of the array
console.log('reference');
console.log(arr.splice(2));
console.log(arr);

// REVERSE modify the reference of the array
console.log('REVERSE');
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);
console.log([...arr2.reverse()]);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); // does not mutate the reference

// JOIN
console.log(letters.join(' - '));

const arr3 = [23, 11, 64];
console.log(arr3.at(0));
console.log(arr3.at(-1));
console.log('savio'.at(0));

for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

// forEach
console.log('forEach');

movements.forEach(function (x) {
  if (x > 0) {
    console.log(`You deposited ${x}`);
  } else {
    console.log(`You withdrew ${Math.abs(x)}`);
  }
});

// forEach Maps and Sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUniques = new Set(['USD', 'EUR', 'GBP', 'EUR']);

console.log(currenciesUniques); // a Set doesn't have keys or indexes

currenciesUniques.forEach(function (value, _, map) {
  console.log(`${_}: ${value}`);
}); */

// Coding Challenge #1
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);

//   // dogsJulia.slice(1, 3);

//   const dogs = dogsJuliaCorrected.concat(dogsKate);

//   dogs.forEach((x, index) => {
//     const indexCorrected = index++;

//     if (x >= 3) {
//       console.log(
//         `Dog number ${indexCorrected} is an adult, and is ${x} years old`
//       );
//     } else {
//       console.log(`Dog number ${indexCorrected} is still a puppy`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log('Test 2');
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(x => x > 0);

const withdrawals = movements.filter(x => x < 0);
// console.log(movements, deposits, withdrawals);

// Accumulator is like SNOWBALL
const balance = movements.reduce((acc, x) => acc + x, 0);

// console.log(balance);

// Maximum value
const max = movements.reduce((acc, x) => {
  return acc > x ? acc : x;
}, movements[0]); // always use the first value when searching for the max or minimum value

// console.log(max);

// console.log(Math.max(...movements));

// Coding challenge #2
// function calcAverageHumanAge([...dogsAges]) {
//   let humanAges = [];

//   dogsAges.forEach(x => {
//     if (x <= 2) {
//       humanAges.push(2 * x);
//     }

//     if (x > 2) {
//       humanAges.push(16 + x * 4);
//     }
//   });

//   humanAges = humanAges.filter(x => x >= 18);

//   const average = humanAges.reduce((acc, x) => acc + x, 0) / humanAges.length;

//   const average2 = humanAges.reduce(
//     (acc, x, index, array) => acc + x / array.length,
//     0
//   );

//   console.log('average 2', average2);

//   return average;
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// PIPELINE
// const eurToUSD = 1.1;
// const totalDepositsInUSD = movements
//   .filter(x => x > 0)
//   .map(x => x * eurToUSD)
//   .reduce((acc, x) => acc + x, 0);

// const totalWithdrawalsInUSD = movements
//   .filter(x => x < 0)
//   .map(x => Math.abs(x) * eurToUSD)
//   .reduce((acc, x) => acc + x, 0);

// console.log(totalDepositsInUSD, totalWithdrawalsInUSD);

// Coding challenge #3
// const calcAverageHumanAge = ([...dogsAges]) => {
//   let humanAges = dogsAges
//     .map(x => {
//       if (x <= 2) return 2 * x;
//       if (x > 2) return 16 + x * 4;
//     })
//     .filter(x => x >= 18);

//   const average = humanAges.reduce((acc, x) => acc + x, 0) / humanAges.length;

//   const average2 = humanAges.reduce(
//     (acc, x, index, array) => acc + x / array.length,
//     0
//   );

//   console.log('average 2', average2);

//   return average;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

const firstWithdrawal = movements.find(x => x < 0); //loop like filter - returns the first element that satisfy the condition
// console.log(firstWithdrawal);

const account = accounts.find(x => x.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);
// EQUALITY
// console.log(movements.includes(-130));

// SOME - CONDITION
// console.log(movements.some(x => x === -130));
// const anyDeposits = movements.some((x) => x > 0);
// console.log(anyDeposits);

// EVERY
// console.log(movements.every(x => x > 0));
// console.log(account4.movements.every(x => x > 0));

// Separate callback
// const deposit = mov => mov > 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// FLAT
// const arr = [1, 2, 3, [4, 5, 6], 7, 8];
// const arrDeep = [[[1, 2], 3,], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// console.log(arrDeep.flat(2));

// const accountsMovements = accounts.map(x => x.movements);
// console.log(accountsMovements);

// const allMovements = accountsMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, x) => acc + x, 0);
// console.log(overallBalance);

// const overallBalance2 = accounts.map(x => x.movements).flat().reduce((acc, x) => acc + x, 0);

// FLATMAP
// const overallBalance3 = accounts.flatMap(x => x.movements).reduce((acc, x) => acc + x, 0);

// Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort()); // Mutate the array
// console.log(owners);

// Numbers
// console.log(movements);
// return < 0 A, B (keep order)
// return > 0 B, A (switch order)
// ASCENDING
// console.log(
//   movements.sort((a, b) => {
//     return a - b;
//   })
// );

// DESCENDING
// console.log(
//   movements.sort((a, b) => {
//     return b - a;
//   })
// );
// console.log(movements);
// const x = new Array(7);
// x.fill(1);
// x.fill(1, 3, 4);
// console.log(x);
// const arr = [1, 2, 3, 4, 5, 6, 7];
// arr.fill(23, 4, 6);
// console.log(arr);

// Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', e => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     x => Number(x.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

// const bankDepositSum = accounts
//   .flatMap(x => x.movements)
//   .filter(x => x > 0)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(bankDepositSum);

// const numDeposits1000 = accounts
//   .flatMap(x => x.movements)
//   .filter(x => x >= 1000).length;
// console.log(numDeposits1000);

// const sums = accounts
//   .flatMap(x => x.movements)
//   .reduce(
//     (acc, cur) => {
//       const property = cur > 0 ? 'deposits' : 'withdrawals';
//       acc[property] += cur;
//       return acc;
//     },
//     { withdrawals: 0, deposits: 0 }
//   );

// console.log(sums);

// const capitalizeWord = word =>
//   word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

// const capitalizeTitle = title => {
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   return title
//     .split(' ')
//     .map(x => (exceptions.some(y => y === x) ? x : capitalizeWord(x)))
//     .join(' ');
// };

// console.log(capitalizeTitle('this is a nice title'));
// console.log(capitalizeTitle('this is a LONG title but not too long'));
// console.log(capitalizeTitle('and here is another title with an EXAMPLE'));

// CODING CHALLENGE 4
// const recommendedFood = weight ** 0.75 * 28

const dogs = [
  {
    weight: 22,
    curFood: 250,
    owners: ['Alice', 'Bob'],
  },
  {
    weight: 8,
    curFood: 200,
    owners: ['Matilda'],
  },
  {
    weight: 13,
    curFood: 275,
    owners: ['Sarah', 'John'],
  },
  {
    weight: 32,
    curFood: 340,
    owners: ['Michael'],
  },
];

dogs.forEach(x => {
  x.recommendedFood = Math.trunc(x.weight ** 0.75 * 28);

  x.rangeFoodMessage =
    x.curFood < x.recommendedFood * 0.9
      ? 'Eating too little.'
      : x.curFood > x.recommendedFood * 1.1
      ? 'Eating too much.'
      : 'The food is in the range.';

  if (x.owners.includes('Sarah')) {
    console.log(x.rangeFoodMessage);
  }
});

const ownersEatTooMuch = dogs
  .filter(x => x.rangeFoodMessage === 'Eating too much.')
  .flatMap(x => x.owners);

const ownersEatTooLittle = dogs
  .filter(x => x.rangeFoodMessage === 'Eating too little.')
  .flatMap(x => x.owners);

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much.`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little.`);

const isSomeDogEatingExactly = dogs.some(x => x.curFood === x.recommendedFood);

console.log(isSomeDogEatingExactly);

const okayAmount = dog => dog.rangeFoodMessage === 'The food is in the range.';

const isSomeDogEatingOkayAmount = dogs.some(x => okayAmount(x));

console.log(isSomeDogEatingOkayAmount);

const dogsEatingOkayAmount = dogs.filter(x => okayAmount(x));
console.log(dogsEatingOkayAmount);

const dogsSorted = [...dogs].sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);

console.log(dogs, dogsSorted);
