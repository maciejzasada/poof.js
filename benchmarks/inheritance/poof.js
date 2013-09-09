/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 9/6/13
 * Time: 2:33 AM
 */

var poof = require('../../../build/dev/poof-dev-latest.js');

var BaseClass = poof.class$('BaseClass', {type$: poof.class$.PUBLIC, extends$: null, implements$: []}, {

    instance$: {

        public$: {

            variable: 0,

            BaseClass: function () {
                this.variable = 30;
            }

        }

    }

});

var SubClass = poof.class$('SubClass', {type$: poof.class$.PUBLIC, extends$: BaseClass, implements$: []}, {

    instance$: {

        public$: {

            SubClass: function () {
                this.variable = 20;
            }

        }

    }

});

module.exports = {
    inheritance: {
        run: function () {
            new SubClass();
        }
    }
}
