'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// https://restcountries.com/v3.1

// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);
//   });
// };

const getCountryData = async function (country) {
  const [data] = await getJSON(
    `https://restcountries.com/v3.1/name/${country}`
  );

  renderCountry(data);
  getNeighbours(data.borders);
};

const getNeighbours = function (neighbours) {
  if (!neighbours || !neighbours.length) return;

  neighbours.forEach(async x => {
    const [data] = await getJSON(`https://restcountries.com/v3.1/alpha/${x}`);

    renderCountry(data, 'neighbour');
  });
};

const getJSON = async function (url) {
  try {
    const request = await fetch(url);

    if (!request.ok)
      throw new Error(
        `Status: ${request.status}. Message: ${request.statusText}.`
      );

    return await request.json();
  } catch (error) {
    console.error(`${error.message} 🚫🚫🚫`);
    renderErrorMessage(`Something went wrong 🚫🚫🚫 ${error.message}`);
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

const renderErrorMessage = function (message) {
  countriesContainer.insertAdjacentHTML(
    'beforeend',
    `<p class="error-message">${message}</p>`
  );
  countriesContainer.style.textAlign = 'center';
};

const renderCountry = function (data, className = '') {
  const htmlContent = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${formatPopulation(
          data.population
        )} people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        }</p>
      </div>
    </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', htmlContent);
};

const formatPopulation = function (population) {
  if (population / 1000000 >= 1) return `${(population / 1000000).toFixed(1)}M`;

  if (population / 1000 >= 1) return `${(population / 1000).toFixed(1)}K`;

  return population;
};

btn.addEventListener('click', () => {
  // getCountryData('saasassa');
  getCountryData('brasil');
});

// Coding Challenge #1
// const whereAmI = async function (latitude, longitude) {
//   try {
//     const request = await fetch(
//       `https://geocode.xyz/${latitude},${longitude}?geoit=json`
//     );

//     if (!request.ok) throw new Error('Too many requests');

//     const { city, country } = await request.json();

//     console.log(`You are in ${city}, ${country}`);

//     getCountryData(country);
//   } catch (error) {
//     console.error(`${error.message}`);
//   }
// };

// whereAmI('52.508', '13.381');
// whereAmI('19.037', '72.873');
// whereAmI('-33.933', '18.474');

// Event Loop practice - promises have priority
// console.log('Test start');
// setTimeout(() => console.log('0 sec timer'), 0);
// Promise.resolve('Resolved promise 1').then(res => console.log(res));
// Promise.resolve('Resolved promise 2').then(res => {
//   for (let index = 0; index < 1000_000_000; index++) {}
//   console.log(res);
// });
// console.log('Test end');

const lotteryPromise = new Promise((resolve, reject) => {
  console.log('Lottery draw is happening');

  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve('You WIN');
    } else {
      reject(new Error('You lost your money'));
    }
  }, 2000);
});

lotteryPromise.then(x => console.log(x)).catch(err => console.error(err));

const sleep = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 * seconds);
  });
};

sleep(3)
  .then(() => {
    console.log('I waited for 3 seconds');

    return sleep(1);
  })
  .then(() => console.log('I waited for 1 second.'));
