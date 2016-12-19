'use strict';

const Maybe = require('./index');

function prop (value) {
    return function (monad) {
        return monad[value];
    };
}

const maybeName = Maybe.of({ foo: { baz: '123' } });

console.log(
    maybeName
        .map(prop('foo'))
        .map(prop('baz'))
        .join()
);

console.log(
    maybeName
        .map(prop('foo'))
        .map(prop('baz'))
        .map(prop('bar'))
        .orElse('No Bar!')
        .join()
);
