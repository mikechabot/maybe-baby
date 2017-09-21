'use strict';

const Maybe = require('./lib');

const maybeName = Maybe.of({
    foo: {
        bar: {
            qux: 456
        },
        baz: '123'
    }
});

function chainIt (bar) {
    return Maybe.of(bar).prop('qux');
}

console.log(
    maybeName
        .prop('foo')
        .prop('bar')
        .chain(chainIt)
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
