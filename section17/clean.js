'use strict';

let budget = Object.freeze([
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
]);

const spendingLimits = Object.freeze({
  jonas: 1500,
  matilda: 100,
});

const getLimit = (user, limits) => limits[user] ?? 0;

const addExpense = function (
  state,
  limits,
  value,
  description,
  user = 'jonas'
) {
  const cleanUser = user.toLowerCase();

  if (value <= getLimit(cleanUser, limits)) {
    return [
      ...state,
      { value: -value, description: description, user: cleanUser },
    ];
  }

  return [...state];
};
budget = addExpense(budget, spendingLimits, 10, 'Pizza 🍕');
budget = addExpense(
  budget,
  spendingLimits,
  100,
  'Going to movies 🍿',
  'Matilda'
);
budget = addExpense(budget, spendingLimits, 200, 'Stuff', 'Jay');

const checkExpenses = function (state, limits) {
  return state.map(x => {
    if (x.value < -getLimit(x.user, limits)) x.flag = 'limit';
    return x;
  });
};
budget = checkExpenses(budget, spendingLimits);

const logBigExpenses = function (state, bigLimit) {
  const output = state
    .filter(x => x.value <= -bigLimit)
    .map(x => x.description.slice(-2))
    .join(' / ');

  console.log(output);
};

console.log(budget);

logBigExpenses(budget, 1000);
