'use strict';

const Maybe = require('maybe-baby');

const FLAT_PROPS = {
    FIRST_NAME: 'firstName',
    LAST_NAME : 'lastName',
    ACCT_DTLS : 'accountDetails',
    INSR_CODE : 'insuranceCode',
    ADDRESS   : 'address',
    ZIP_CODE  : 'zipCode'
};

/**
 * Example domain service that implements maybe-baby to
 * safely retrieve values from the object
 */
let svc = {};
const PersonService = svc = {
    getFirsName (person) {
        return Maybe
            .of(person)
            .prop(FLAT_PROPS.FIRST_NAME);
    },
    getLastName (person) {
        return Maybe
            .of(person)
            .prop(FLAT_PROPS.LAST_NAME);
    },
    getAccountDetails (person) {
        return Maybe
            .of(person)
            .prop(FLAT_PROPS.ACCT_DTLS);
    },
    getInsuranceCode (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .prop(FLAT_PROPS.INSR_CODE);
    },
    getAddress (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .prop(FLAT_PROPS.ADDRESS);
    },
    getZipCode (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .chain(svc.getAddress)
            .prop(FLAT_PROPS.ZIP_CODE);
    }
};

const person = {
    firstName     : 'John',
    lastName      : null,
    accountDetails: {
        insuranceCode: 'BDX2321',
        address      : null
    }
};

const firstName = PersonService.getFirsName(person);
const lastName = PersonService.getLastName(person);
const accountDetails = PersonService.getAccountDetails(person);
const insuranceCode = PersonService.getInsuranceCode(person);
const address = PersonService.getAddress(person);
const zipCode = PersonService.getZipCode(person);

console.log(firstName.join());
console.log(lastName.join());
console.log(accountDetails.join());
console.log(insuranceCode.join());
console.log(address.join());
console.log(zipCode.join());
