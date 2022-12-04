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
  const request = await fetch(`https://restcountries.com/v3.1/name/${country}`);

  const [data] = await request.json();

  renderCountry(data);
};

const formatPopulation = function (population) {
  if (population / 1000000 >= 1) return `${(population / 1000000).toFixed(1)}M`;

  if (population / 1000 >= 1) return `${(population / 1000).toFixed(1)}K`;

  return population;
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
  countriesContainer.style.opacity = 1;
};

getCountryData('brasil');
getCountryData('usa');
getCountryData('germany');
getCountryData('monaco');
