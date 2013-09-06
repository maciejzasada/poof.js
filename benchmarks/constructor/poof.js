/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright Maciej Zasada
 * Date: 9/6/13
 * Time: 2:11 AM
 */

var poof = require('../../build/poof-0.4.0.js');

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

module.exports = {
    constructor: {
        run: function () {
            new TestClassPoof();
        }
    }
}