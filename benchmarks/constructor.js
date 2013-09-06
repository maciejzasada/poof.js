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
        'poof.js': poof.constructor.run,
        'Coffee Script': coffee.constructor.run
    }
};