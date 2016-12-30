'use strict';

const Maybe = require('maybe-baby');

const maybeName = Maybe.of({ foo: { baz: '123' } });

console.log(
    maybeName
        .prop('foo')
        .prop('baz')
        .join()
);

console.log(
    maybeName
        .prop('foo')
        .prop('baz')
        .prop('bar')
        .orElse('No Bar!')
        .join()
);
