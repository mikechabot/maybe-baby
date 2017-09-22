'use strict';

const Maybe = require('maybe-baby');

/**
 * Example domain service that implements maybe-baby to
 * safely retrieve values from the object
 */
let svc = {};
const PersonService = svc = {
    getFirsName (person) {
        return Maybe
            .of(person)
            .prop('firstName');
    },
    getAccountDetails (person) {
        return Maybe
            .of(person)
            .prop('accountDetails');
    },
    getInsuranceCode (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .prop('insuranceCode');
    },
    getAddress (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .prop('address');
    },
    getZipCode (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .chain(svc.getAddress)
            .prop('zipCode');
    }
};

const person = {
    firstName     : 'John',
    lastName      : null,
    accountDetails: {
        insuranceCode: 'BDX2321'
    }
};

const firstName = PersonService.getFirsName(person);
const accountDetails = PersonService.getAccountDetails(person);
const insuranceCode = PersonService.getInsuranceCode(person);
const address = PersonService.getAddress(person);
const zipCode = PersonService.getZipCode(person);

console.log(firstName.join()); // 'John'
console.log(accountDetails.join()); // { insuranceCode: 'BDX2321' }
console.log(insuranceCode.join()); // BDX2321
console.log(address.join()); // undefined
console.log(zipCode.join()); // undefined
