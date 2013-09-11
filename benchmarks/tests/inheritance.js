/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 9/11/13
 * Time: 5:35 PM
 */

var poofDev = require('./../vendor/poof-dev.js'),
    poofProd = require('./../vendor/poof-prod.js'),
    coffee = require('./../vendor/coffee.js');

// A test suite
module.exports = {
    name: 'Inheritance',
    tests: {
        'poof.js prod': poofProd.inheritance.run,
        'poof.js dev': poofDev.inheritance.run,
        'Coffee Script': coffee.inheritance.run
    }
};
