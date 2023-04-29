'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nikhil Kumar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1366,
};

const account2 = {
  owner: 'Vaibhav Saxena',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Shivang Maurya',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sherya Srivastava',
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

// MAIN LOGIC

const updateUI = currentAccount => {
  displayMovement(currentAccount.movements);

  calcDisplayBalance(currentAccount);

  totalDesposits(currentAccount);
};

const displayMovement = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((val1, val2) => val1 + val2, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const euroToUSD = 1.1;

const totalDesposits = acc => {
  const balance = acc.movements
    .filter(val1 => val1 > 0)
    .reduce((val1, val2) => val1 + val2, 0);
  labelSumIn.textContent = `${Math.trunc(balance)} €`;

  const balance1 = acc.movements
    .filter(val1 => val1 < 0)
    .reduce((val1, val2) => val1 + val2);
  labelSumOut.textContent = `${Math.abs(balance1)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${Math.abs(interest)} €`;
};

const totalWithdrawal = mov => {};

totalWithdrawal(account1.movements);

let currentAccount; //this is now a global object

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    containerApp.style.opacity = 100;
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Wrong Credentials, Login Again`;
  }

  currentAccount && updateUI(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAccount);

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance > amount &&
    receiverAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //adding movement to UI
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete Account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI);
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
