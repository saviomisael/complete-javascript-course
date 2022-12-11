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

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    const {
      coords: { latitude, longitude },
    } = await getPosition();

    const request = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );

    if (!request.ok) throw new Error('Too many requests');

    const {
      address: { country, city },
    } = await request.json();

    console.log(`You are in ${city}, ${country}`);

    getCountryData(country);
  } catch (error) {
    console.error(`${error.message}`);
  }
};

btn.addEventListener('click', () => {
  // getCountryData('saasassa');
  whereAmI();
});

// (async () => {
//   await whereAmI();
// })();

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

// const lotteryPromise = new Promise((resolve, reject) => {
//   console.log('Lottery draw is happening');

//   setTimeout(() => {
//     if (Math.random() >= 0.5) {
//       resolve('You WIN');
//     } else {
//       reject(new Error('You lost your money'));
//     }
//   }, 2000);
// });

// lotteryPromise.then(x => console.log(x)).catch(err => console.error(err));

// const sleep = seconds => {
//   return new Promise(resolve => {
//     setTimeout(resolve, 1000 * seconds);
//   });
// };

// sleep(3)
//   .then(() => {
//     console.log('I waited for 3 seconds');

//     return sleep(1);
//   })
//   .then(() => console.log('I waited for 1 second.'));

// navigator.geolocation.getCurrentPosition(
//   position => console.log(position),
//   error => console.error(error)
// );

// Promisifying
// const getPosition = () => {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// // getPosition().then(position => console.log(position));

// const whereAmI = async function () {
//   try {
//     const {
//       coords: { latitude, longitude },
//     } = await getPosition();

//     const request = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//     );

//     if (!request.ok) throw new Error('Too many requests');

//     const {
//       address: { country, city },
//     } = await request.json();

//     console.log(`You are in ${city}, ${country}`);

//     getCountryData(country);
//   } catch (error) {
//     console.error(`${error.message}`);
//   }
// };

// btn.addEventListener('click', () => {
//   whereAmI();
// });

// Coding Challenge #2

// const createImage = function (imgPath) {
//   return new Promise((resolve, reject) => {
//     const image = document.createElement('img');
//     image.src = imgPath;

//     image.addEventListener('load', () => {
//       document.querySelector('.images').append(image);
//       resolve(image);
//     });

//     image.addEventListener('error', e => {
//       reject(new Error(`Image ${e.target.src} not found`));
//     });
//   });
// };

// const sleep = seconds => {
//   return new Promise(resolve => {
//     setTimeout(resolve, 1000 * seconds);
//   });
// };

// const hideImage = async image => {
//   await sleep(2);

//   image.style.display = 'none';
// };

// createImage('/img/img-1.jpg')
//   .then(hideImage)
//   .then(() => {
//     return createImage('/img/img-2.jpg');
//   })
//   .then(hideImage);

// const get3Countries = async (country1, country2, country3) => {
//   try {
//     // const [dataCountry1] = await getJSON(
//     //   `https://restcountries.com/v3.1/name/${country1}`
//     // );

//     // const [dataCountry2] = await getJSON(
//     //   `https://restcountries.com/v3.1/name/${country2}`
//     // );

//     // const [dataCountry3] = await getJSON(
//     //   `https://restcountries.com/v3.1/name/${country3}`
//     // );

//     const [[dataCountry1], [dataCountry2], [dataCountry3]] = await Promise.all([
//       getJSON(`https://restcountries.com/v3.1/name/${country1}`),
//       getJSON(`https://restcountries.com/v3.1/name/${country2}`),
//       getJSON(`https://restcountries.com/v3.1/name/${country3}`),
//     ]);

//     console.log(
//       dataCountry1.capital,
//       dataCountry2.capital,
//       dataCountry3.capital
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

// get3Countries('portugal', 'canada', 'tanzania');

// Coding challenge #3
const createImage = function (imgPath) {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.src = imgPath;

    image.addEventListener('load', () => {
      document.querySelector('.images').append(image);
      resolve(image);
    });

    image.addEventListener('error', e => {
      reject(new Error(`Image ${e.target.src} not found`));
    });
  });
};

const sleep = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 * seconds);
  });
};

const hideImage = async image => {
  await sleep(2);

  image.style.display = 'none';
};

const loadAll = async (...imgArr) => {
  const imgs = imgArr.map(async x => await createImage(x));

  const imagesPromises = await Promise.allSettled(imgs);

  imagesPromises.forEach(x => {
    if (x.value) x.value.classList.add('parallel');
  });
};

loadAll('/img/img-1.jpg', '/img/img-2.jpg', '/img/img-3.jpg');

// const loadImageAndHide = async img => {
//   const image = await createImage(img);

//   await hideImage(image);
// };

// (async () => {
//   await loadImageAndHide('/img/img-1.jpg');

//   await loadImageAndHide('/img/img-2.jpg');
// })();
