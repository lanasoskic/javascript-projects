'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-05-28T09:15:04.904Z',
    '2023-08-01T10:17:24.185Z',
    '2023-09-08T14:11:59.604Z',
    '2023-11-07T17:01:17.194Z',
    '2023-11-08T23:36:17.929Z',
    '2023-11-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,

//   movementsDates: [
//     '2023-01-01T13:15:33.035Z',
//     '2023-02-30T09:48:16.867Z',
//     '2023-03-25T06:04:23.907Z',
//     '2023-03-25T14:18:46.235Z',
//     '2023-05-05T16:33:06.386Z',
//     '2023-06-10T14:43:26.374Z',
//     '2023-06-25T18:49:59.371Z',
//     '2023-07-26T12:01:20.894Z',
//   ],
//   currency: 'EUR',
//   locale: 'de-DE',
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,

//   movementsDates: [
//     '2022-12-18T21:31:17.178Z',
//     '2022-12-23T07:42:02.383Z',
//     '2023-04-28T09:15:04.904Z',
//     '2023-07-01T10:17:24.185Z',
//     '2023-08-08T14:11:59.604Z',
//     '2023-10-07T17:01:17.194Z',
//     '2023-11-08T23:36:17.929Z',
//     '2023-11-12T10:51:36.790Z',
//   ],
//   currency: 'USD',
//   locale: 'en-US',
// };

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

// TOPIC: MY FUNCTIONS FROM PREVIOUS SECTION

// Comment out the 'opacity = 0' line in .app (style.css)

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();

    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  // If we comment out the next line and scroll down the page,
  // we'll see two 'old' values, the one that were already
  // there, before any changes made, because all that we are
  // doing is adding new additional elements to the container
  // (but we are not overriding anything).
  // Therefore, that should be the first thing that we do -
  // emptying the entire container, so that we can add new
  // elements.
  containerMovements.innerHTML = '';

  // 'sort' changes the original array, therefore we need a
  // shallow copy via 'slice'
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);

    // TOPIC: MATH AND ROUNDING
    //        ADDING DATES
    //        INTERNATIONALIZING NUMBERS (INTL)

    const formattedMovement = formatCurrency(
      mov,
      account.locale,
      account.currency
    );

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
      </div>
    `;

    // Also try 'beforeend' and see the difference on the page:
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  // TOPIC: MATH AND ROUNDING
  // labelBalance.textContent = `${account.balance.toFixed(2)}€`;

  // TOPIC: INTERNATIONALIZING NUMBERS (INTL)
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};
// calcDisplayBalance(account1.movements);

// First we'll do just the test, and then we'll generalize it
// in the function.
// const user = 'Steven Thomas Williams'; // stw
// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name.charAt(0))
//   .join('');
// console.log(username);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // TOPIC: MATH AND ROUNDING
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // TOPIC: INTERNATIONALIZING NUMBERS (INTL)
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // TOPIC: MATH AND ROUNDING
  // labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  // TOPIC: INTERNATIONALIZING NUMBERS (INTL)
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  // const interest = movements
  //   .filter(mov => mov > 0)
  //   .map(deposit => (deposit * 1.2) / 100)
  //   .reduce((acc, int) => acc + int, 0);

  // Now, let's say that the bank introduced a new rule. The
  // bank only pays an interest if that interest is at least
  // 1€.
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  // TOPIC: MATH AND ROUNDING
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;

  // TOPIC: INTERNATIONALIZING NUMBERS (INTL)
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};
// calcDisplaySummary(account1.movements);

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.charAt(0))
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

// TOPIC: IMPLEMENTING A COUNTDOWN TIMER

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 600;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

// FAKE ALWAYS LOGGED IN (to make testing our app easier)
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting:
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    // currentAccount?.pin === Number(inputLoginPin.value)
    currentAccount?.pin === +inputLoginPin.value
  ) {
    // Display UI and a welcome message:
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    // TOPIC: ADDING DATES TO "BANKIST" APP

    // Create the current date and time:
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Experimenting API:
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // long / 2-digit
      year: 'numeric', // 2-digit
      // weekday: 'short',
    };
    // const locale = navigator.language;
    // console.log(locale);

    // labelDate.textContent = now;
    // ISO language code table:
    // labelDate.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
    // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
    //   now
    // );
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer:
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI:
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // const amount = Number(inputTransferAmount.value);
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAccount &&
    amount <= currentAccount.balance &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add transfer date (so we don't get NAN/NAN/NAN):
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // Update UI:
    updateUI(currentAccount);

    // Reset the timer:
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // const amount = Number(inputLoanAmount.value);
  // const amount = +inputLoanAmount.value;
  // TOPIC: MATH AND ROUNDING
  const amount = Math.floor(inputLoanAmount.value);

  // See the conditions on 'Bankist-flowchart'
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // TOPIC: TIMERS

    setTimeout(function () {
      // Add the movement:
      currentAccount.movements.push(amount);

      // Add loan date:
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI:
      updateUI(currentAccount);

      // Reset the timer:
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('Delete');

  if (
    // inputCloseUsername.value === currentAccount.username &&
    // Number(inputClosePin.value) === currentAccount.pin
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    console.log(index);

    // Delete account:
    accounts.splice(index, 1);

    // Hide UI:
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// So that we can see changes everytime we click 'sort' button
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// TOPIC: CONVERTING AND CHECKING NUMBERS
/*
console.log(23 === 23.0);
console.log('\n');

// Running joke in JS world:
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log('\n');

// Conversion:
// Old way:
console.log(Number('23'));
// New way:
console.log(+'23');
console.log('\n');

// Parsing:
// The string must begin with a number:
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));
console.log(Number.parseFloat('2.5rem'));
// space does not affect the result:
console.log(Number.parseInt('  2.5rem'));
console.log('\n');

// Checking id value is NaN:
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20x'));
console.log(Number.isNaN(23 / 0));
console.log('\n');

// Best way of checking if a value is the number:
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));
console.log(Number.isFinite(23 / 0));
console.log('\n');

console.log(Number.isInteger(20));
console.log(Number.isInteger(20.0));
console.log(Number.isInteger(23 / 0));
*/

// TOPIC: MATH AND ROUNDING
/*
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));
console.log('\n');

console.log(Math.max(3, 18, 22, 11, 2));
console.log(Math.max(3, 18, '22', 11, 2));
console.log(Math.max(3, 18, '22px', 11, 2));
console.log(Math.min(3, 18, 22, 11, 2));
console.log('\n');

console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log('\n');

console.log(Math.trunc(Math.random() * 6) + 1); // dice roll

// Generalization:
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(10, 20));
// console.log(randomInt(10, 20));
// console.log(randomInt(10, 20));
// console.log(randomInt(10, 20));
// console.log(randomInt(10, 20));
console.log('\n');

// Rounding integers:
console.log(Math.trunc(2.3));

console.log(Math.round(2.3));
console.log(Math.round(2.9));

console.log(Math.ceil(2.3));
console.log(Math.ceil(2.9));

console.log(Math.floor(2.3));
console.log(Math.floor(2.9));

console.log(Math.trunc(-2.3));
console.log(Math.floor(-2.3));
console.log('\n');

// Rounding:
console.log((2.7).toFixed(0)); // actually returns a string
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(3)); // it's a number now

// Let's go back to our app!!!
*/

// TOPIC: THE REMAINDER OPERATOR
/*
console.log(5 % 2); // mod
console.log(5 / 2);
console.log(8 % 2);
console.log(8 % 3);
console.log('\n');

console.log(6 % 2 ? 'not even' : 'even');
console.log(7 % 2 ? 'not even' : 'even');

const isEven = n => n % 2 === 0;
console.log(isEven(6));
console.log(isEven(7));
console.log('\n');

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
*/

// TOPIC: NUMERIC SEPARATORS
/*
// Diameter of solar system:
//               287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

console.log(Number('230000'));
console.log(Number('230_000'));
*/

// TOPIC: WORKING WITH BIGINT
/*
// The biggest number that JS can safely represent:
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log('\n');

// Unsafe numbers:
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
console.log('\n');

// Unsafe:
console.log(5646456432121545414351531324513213153);
// BigInt = Safe:
console.log(5646456432121545414351531324513213153n);
console.log('\n');

console.log(BigInt(365464312135454));
console.log('\n');

// Operators:
console.log(10000n + 10000n);
const huge = 16351335456634565154n;
const num = 23;
// console.log(huge * num);
console.log(huge * BigInt(num));
console.log('\n');

console.log(20n > 15);
console.log(20n === 20);
console.log(20n == 20);
console.log(20n == '20');
console.log(typeof 20n);
console.log('\n');

// Won't work:
// console.log(hige + ' is REALLY big!');
// console.log(Math.sqrt(16n));

// Division:
console.log(10n / 3n);
console.log(11n / 3n);
console.log(12n / 3n);
console.log(10 / 3);
*/

// TOPIC: CREATING DATES
/*
// Create a date:
// 1)
const now = new Date();
console.log(now);
console.log('\n');

// 2)
console.log(new Date('Nov 09 2023'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));
console.log('\n');

// 3)
console.log(new Date(2023, 10, 19, 15, 23, 5));
// Months are zero-based!
console.log(new Date(2023, 10, 31));
console.log('\n');

// 4)
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
console.log('\n');

// Working with dates:
const future = new Date(2037, 10, 19, 15, 23, 5);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log('\n');

console.log(future.toISOString());
console.log('\n');

console.log(future.getTime());
console.log('\n');

console.log(new Date(2142253385000)); // timestamp
console.log('\n');

console.log(Date.now());
console.log('\n');

future.setFullYear(2040);
console.log(future);
*/

// TOPIC: OPERATIONS WITH DATES
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);
console.log('\n');

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);
console.log('\n');

// Let's go back to our app!!!
*/

// TOPIC: INTERNATIONALIZING NUMBERS (INTL)
/*
const num = 3885524.23;

const options = {
  style: 'currency', // unit / percent
  unit: 'celsius', // miles-per-hour
  currency: 'EUR', // only when the style is 'currency'
  // useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
console.log('DE: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('SY: ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  'Browser: ',
  new Intl.NumberFormat(navigator.language, options).format(num)
);

// Let's go back to our app!!!
*/

// TOPIC: TIMERS (SETTIMEOUT AND SETINTERVAL)
/*
// setTimeout
const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}!`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// Let's go back to our app!!!

// setInterval
setInterval(function () {
  const now = new Date();
  const hours = `${now.getHours()}`.padStart(2, 0);
  const minutes = `${now.getMinutes()}`.padStart(2, 0);
  const seconds = `${now.getSeconds()}`.padStart(2, 0);
  console.log(`${hours}:${minutes}:${seconds}`);
}, 5000);
*/
