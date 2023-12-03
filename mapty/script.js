'use strict';

// TOPIC: HOW TO PLAN A WEB PROJECT (231)

// 1) USER STORIES - Description of the application's funciona-
//                   lity from the user's perspective. All user
//    stories put together describe the entire application.
//       ↓
// 2) FEATURES
//       ↓
// 3) FLOWCHART - It's where we put all our features. This is
//                all necessary for knowing WHAT we will build.
//       ↓
// 4) ARCHITECTURE - Organizing the code and deciding which JS
//                   features we'll use, so that we have an
//    answer on HOW we will build our app.
//       ↓
//----------------------PLANNING STEP--------------------------
//                            ↓
//--------------------DEVELOPMENT STEP-------------------------
// Which is basically implementation of our plan using code

// USER STORIES:
//      Common format: As a [type of user], I want [an action]
//                     so that [a benefit].
// Example: 1. As a user, I want to log my running workouts
//             with location, distance, time, pace and steps/
//             minute, so I can keep a log of all my running.
//          2. As a user, I want to log my cycling workouts
//             with location, distance, time, speed and eleva-
//             tion gain, so I can keep a log of all my cycling
//          3. As a user, I want to see all my workouts at a
//             glance, so I can easily track my progress over
//             time.
//          4. As a user, I want to also see my workouts on a
//             map, so I can easily check where I work out the
//             most.
//          5. As a user, I want to see all my workouts when I
//             leave the app and come back later, so that I can
//             keep using the app over time.

// FEATURES:
// Example (based on the previous one):
//      1. → Map where user clicks to add new workout (best way
//           to get location coordinates)
//         → Geolocation to display map at current location
//           (more user friendly)
//         → Form to input distance, time, pace, steps/minute
//      2. → Form to input distance, time, speed, elevation
//           gain
//      3. → Display all workouts in a list
//      4. → Display all workouts on the map
//      5. → Store workout data in the browser using local sto-
//           rage API
//         → On page load, read the saved data from local sto-
//           rage and display
//

// FLOWCHART:
// Example: (check the flowchart for Mapty app)

// ARCHITECTURE:
// Let's just start coding!

///////////////////////////////////////////////////////////////
///////////////////////// MAPTY ///////////////////////////////

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Mapty-architecture-part-1.png

class Workout {
  date = new Date();
  // Unique identifier (in the real world we usually use some
  // kind of library to create good and unique id numbers, so
  // we don't actually do that on our own, but here we are
  // improvising):
  id = (Date.now() + '').slice(-10); // should be unique enough
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // in min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;

    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycle1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycle1);

///////////////////////////////////////////////////////////////
//////////////// APPLICATION ARCHITECTURE /////////////////////
class App {
  #map;
  #mapZoomLevel = 15;
  #mapEvent;
  #workouts = [];

  constructor() {
    // 1) Get user's position:
    // So that the map is presented as soon as we make an
    // instance of our class:
    this._getPosition();

    // Get data from local storage:
    this._getLocalStorage();

    // Attach event handlers:
    // 'bind' so that the first 'this' keyword doesn't point to
    // the 'form' but the 'app' object:
    form.addEventListener('submit', this._newWorkout.bind(this));

    // No need for binding since the function itself doesn't
    // use the 'this' keyword:
    inputType.addEventListener('change', this._toggleElevationField);

    // 'bind' so that the first 'this' keyword doesn't point to
    // the 'containerWorkouts' but the 'app' object:
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    // First callback is for the success, and the other one is
    // for the error:
    if (navigator.geolocation) {
      // 'bind' so that we can use 'this' keyword in _loadMap
      // (and not get undefined):
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position!');
        }
      );
    }
  }

  _loadMap(position) {
    // console.log(position);

    // This gives me coordinates of Valjevo, which are
    // not quite correct:
    // const { latitude } = position.coords;
    // const { longitude } = position.coords;
    const latitude = 44.811642;
    const longitude = 20.481308;
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    // We've already added some code to our html file,
    // copied from https://leafletjs.com/download.html ...

    const coords = [latitude, longitude];

    // Next code is copied from https://leafletjs.com/index.html :
    // 'map' === div id from html
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    // Let's change to style of our map:
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker(coords)
    //  .addTo(this.#map)
    //  .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //  .openPopup();

    // Handling clicks on map:
    this.#map.on('click', this._showForm.bind(this));

    // Why put it here and not in the '_getLocalStorage'?
    // - Asynchronous JavaScript. We call '_getLocalStorage' as
    // soon as we create an app object. But there is actually
    // a lot going on before the map is officially created.
    // Therefore, if we were to call '_renderWorkoutMarker' on
    // map that is yet to be created, we would most certainly
    // get an error.
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;

    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Empty the inputs:
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // 1) Get data from the form:
    const type = inputType.value;
    const distance = +inputDistance.value; // Number convertion
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // 2) Check if data is valid:
    const validInputs = (...inputs) => inputs.every(i => Number.isFinite(i));
    const allPositive = (...inputs) => inputs.every(i => i > 0);

    // 3) If selected workout is running, create running object:
    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // 4) If selected workout is cycling, create cycling object:
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // 5) Add new object to the workout array:
    this.#workouts.push(workout);
    // console.log(workout);

    // 6) Render workout on map as marker:
    this._renderWorkoutMarker(workout);

    // 7) Render workout on the list:
    this._renderWorkout(workout);

    // 8) Hide form and clear input fields:
    this._hideForm();

    // 9) Set local storage to all workouts:
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // Just an example:
    // L.marker([lat, lng]).addTo(map).bindPopup('Workout').openPopup();
    // For more specific usage, Leaflet Documentation: UI
    // Layers:
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          // Check CSS file for class names:
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout.type === 'running') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === 'cycling') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    // console.log(workoutEl);

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    // console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // Using the public interface:
    // workout.click();
  }

  _setLocalStorage() {
    // 'localStorage' is an API that the browser provides for
    // us and that we can use:
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    // This is a very simple API that is adviced to use only
    // for small amounts of data, because it's actually blo-
    // cking. Large amounts of data would certainly slow down
    // the application.
  }

  _getLocalStorage() {
    // Basically the oposite of JSON.stringify:
    const data = JSON.parse(localStorage.getItem('workouts'));
    // console.log(data);

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
// setTimeout(app.reset, 300000);
