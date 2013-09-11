/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright Maciej Zasada
 * Date: 9/6/13
 * Time: 2:11 AM
 */

(function () {

    'use strict';

    var BaseClass = class$('BaseClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
        instance$: {
            public$: {
                variable: 15,
            }
        }
    }),

        SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
            instance$: {
                public$: {
                    SubClass: function () {
                        this.variable = 50;
                    }
                }
            }
        });

    module.exports = module.exports || {};
    module.exports.inheritance = {
        run: function () {
            new SubClass();
        }
    };

}());
