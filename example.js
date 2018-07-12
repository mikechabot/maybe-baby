
const Maybe = require('maybe-baby');

// Data object
const person = {
  firstName: 'John',
  lastName: null,
};

// Create Maybe
const mPerson = Maybe.of(person);

// Access properties
const firstName = mPerson.prop('firstName');
const lastName = mPerson.prop('lastName');
const address = mPerson.prop('address');

console.log(firstName.isJust());
console.log(firstName.join());

console.log(lastName.isJust());
console.log(lastName.join());

console.log(address.isJust());
console.log(address.join());
