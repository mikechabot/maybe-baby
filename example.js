'use strict';

const Maybe = require('maybe-baby');

const maybeName = Maybe.of({
    foo: {
        bar: {
            qux: 456
        },
        baz: '123'
    }
});

console.log(
    maybeName
        .prop('foo')
        .prop('baz')
        .join()
);

console.log(
    maybeName.props('foo', 'bar', 'qux').join())
;

console.log(
    maybeName
        .prop('foo')
        .prop('baz')
        .prop('bar')
        .orElse('No Bar!')
        .join()
);
