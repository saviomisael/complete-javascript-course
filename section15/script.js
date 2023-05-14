'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputs = {
  inputDistance: document.querySelector('.form__input--distance'),
  inputDuration: document.querySelector('.form__input--duration'),
  inputCadence: document.querySelector('.form__input--cadence'),
  inputElevation: document.querySelector('.form__input--elevation'),
};

class Workout {
  date = new Date();
  id = Math.random().toString();

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; //in min
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calculatePace();
  }

  calculatePace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calculateSpeed();
  }

  calculateSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #lat;
  #lng;
  #key = 'maptyAppWorkouts';
  #workouts = JSON.parse(localStorage.getItem(this.#key)) || [];

  constructor() {
    this._loadMap().then(() => this._init());
  }

  _getPositionAsync() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve(coords),
          reject
        );
      } else {
        reject('Geolocation not available.');
      }
    });
  }

  _init() {
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField.bind(this));

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    this.#workouts
      .map(x => ({
        ...x,
        date: new Date(x.date),
      }))
      .forEach(x => this.loadWorkout(x));
  }

  async _loadMap() {
    try {
      const position = await this._getPositionAsync();

      const coords = [position.latitude, position.longitude];

      this.#map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.#map);

      this.#map.on('click', this._showForm.bind(this));
    } catch (error) {
      alert('Could not get your position');
    }
  }

  _showForm({ latlng }) {
    form.classList.remove('hidden');
    inputs.inputDistance.focus();
    this.#lat = latlng.lat;
    this.#lng = latlng.lng;
  }

  _toggleElevationField() {
    inputs.inputCadence.parentElement.classList.toggle('form__row--hidden');
    inputs.inputElevation.parentElement.classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();

    const type = inputType.value;

    let isValid = false;

    if (type === 'cycling') {
      isValid = this._hasPositiveInputs([
        inputs.inputDistance,
        inputs.inputDuration,
        inputs.inputElevation,
      ]);
    } else {
      isValid = this._hasPositiveInputs([
        inputs.inputDuration,
        inputs.inputDistance,
        inputs.inputCadence,
      ]);
    }

    if (!isValid) {
      this._clearInputs();

      alert('Inputs must have positive values.');
      return;
    }

    const workout =
      type === 'cycling'
        ? new Cycling(
            [this.#lat, this.#lng],
            +inputs.inputDistance.value,
            +inputs.inputDuration.value,
            +inputs.inputElevation.value
          )
        : new Running(
            [this.#lat, this.#lng],
            +inputs.inputDistance.value,
            +inputs.inputDuration.value,
            +inputs.inputCadence.value
          );

    this._addWorkout(workout);

    this._clearInputs();

    this.loadWorkout(workout);

    this._hideForm();
  }

  _addWorkout(workout) {
    this.#workouts.push(workout);

    localStorage.setItem(this.#key, JSON.stringify(this.#workouts));
  }

  _renderWorkouts(workout) {
    let title = workout.type === 'running' ? `Running on` : `Cycling on`;

    title = `${workout.type[0].toUpperCase()}${workout.type.slice(1)} on ${
      months[workout.date.getMonth()]
    } ${workout.date.getDate()}`;
    const icon = workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️';

    let htmlWorkout = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${title}</h2>
          <div class="workout__details">
            <span class="workout__icon">${icon}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    const dynamicHtml =
      workout.type === 'running'
        ? `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
        : `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>`;

    htmlWorkout += dynamicHtml;

    form.insertAdjacentHTML('afterend', htmlWorkout);
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className:
            workout.type === 'running' ? 'running-popup' : 'cycling-popup',
        })
      )
      .setPopupContent(
        `${months[workout.date.getMonth()]} ${workout.date.getDate()}`
      )
      .openPopup();
  }

  _hasPositiveInputs(inputs) {
    return inputs.every(x => Number(x.value) > 0);
  }

  _clearInputs() {
    Object.values(inputs).forEach(x => (x.value = ''));
  }

  _hideForm() {
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _moveToPopup(event) {
    const workoutEl = event.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(x => x.id === workoutEl.dataset.id);

    this.#map.setView(workout.coords, 17, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  loadWorkout(workout) {
    this._renderWorkouts(workout);
    this._renderWorkoutMarker(workout);
  }
}

new App();
