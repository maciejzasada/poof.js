/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright Maciej Zasada
 * Date: 9/6/13
 * Time: 2:11 AM
 */

var poofDev = require('../../build/dev/poof-dev-latest.js'),
    poofProd = require('../../build/prod/poof-latest.js'),

    defineTest = function (poof) {

        var TestClassPoof = poof.class$('TestClass', {type$: poof.class$.PUBLIC, extends$: null, implements$: []}, {

            instance$: {

                public$: {

                    variable: 15,

                    TestClass: function () {
                        this.variable = 30;
                    }

                }

            }

        });

        return function () {
            new TestClassPoof();
        }

    };

module.exports = {
    constructor: {
        run: {
            dev: defineTest(poofDev),
            prod: defineTest(poofProd)
        }
    }
}
