/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 9/6/13
 * Time: 1:35 AM
 */

var poof = require('./constructor/poof.js'),
    coffee = require('./coffee.cjs');

// A test suite
module.exports = {
    name: 'Constructor',
    tests: {
        'Coffee Script': coffee.constructor.run,
        'poof.js dev': poof.constructor.run.dev,
        'poof.js prod': poof.constructor.run.prod
    }
};
