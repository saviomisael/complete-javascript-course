import {
  addToCart,
  cart,
  quantity,
  totalPrice as price,
} from './shopping-cart';

import cartFn, * as ShoppingCart from './shopping-cart';

console.log('Importing module');

addToCart('bread', 5);

console.log(price, quantity);

ShoppingCart.addToCart('bread', 3);

cartFn('bread', 6);

console.log(cart);

// const response = await fetch('https://jsonplaceholder.typicode.com/posts');

// const data = await response.json();

// console.log(data);

const getLastPost = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');

  const data = await response.json();

  console.log(data.at(-1).title, data.at(-1).body);
};

console.log('Start');

getLastPost();

console.log('Something');

import cloneDeep from 'lodash-es/cloneDeep';

cloneDeep();

const state = {
  cart: [
    { product: 'bread', quantity: 5 },
    { product: 'pizza', quantity: 5 },
  ],
  user: {
    loggedIn: true,
  },
};

// const stateClone = Object.assign({}, state);

const stateClone = structuredClone(state);

const stateClone2 = cloneDeep(state);

state.user.loggedIn = false;

console.log(stateClone, stateClone2);

Promise.resolve('TEST').then(x => console.log(x));

// Polyfill
import 'core-js/stable';

// Polyfill async functions
import 'regenerator-runtime/runtime';
