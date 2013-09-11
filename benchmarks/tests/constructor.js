/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 9/6/13
 * Time: 1:35 AM
 */

var poofDev = require('./../vendor/poof-dev.js'),
    poofProd = require('./../vendor/poof-prod.js'),
    coffee = require('./../vendor/coffee.js'),
    backbone = require('./../sources/constructor/backbone.js');

// A test suite
module.exports = {
    name: 'Constructor',
    tests: {
        'poof.js prod': poofProd.constructor.run,
        'poof.js dev': poofDev.constructor.run,
        'Coffee Script': coffee.constructor.run,
        'Backbone': backbone.constructor.run
    }
};
