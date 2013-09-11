/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright Maciej Zasada
 * Date: 9/6/13
 * Time: 2:11 AM
 */

(function () {

    'use strict';

    var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
        instance$: {
            public$: {
                variable: 15,
                TestClass: function () {
                    this.variable = 30;
                }
            }
        }
    });

    module.exports = module.exports || {};
    module.exports.constructor = {
        run: function () {
            new TestClass();
        }
    };

}());
