/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 9/6/13
 * Time: 2:32 AM
 */

var poof = require('./inheritance/poof.js'),
    coffee = require('./coffee.cjs');

// A test suite
module.exports = {
    name: 'Inheritance',
    tests: {
        'poof.js': poof.inheritance.run,
        'Coffee Script': coffee.inheritance.run
    }
};