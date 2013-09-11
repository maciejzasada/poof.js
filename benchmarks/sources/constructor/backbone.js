/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 9/11/13
 * Time: 5:46 PM
 */

(function () {

    'use strict';

    var backbone = require('backbone');

    var TestClass = backbone.Model.extend({
        variable: 15,
        constructor: function () {
            this.variable = 30;
        }
    });

    module.exports = module.exports || {};
    module.exports.constructor = {
        run: function () {
            new TestClass();
        }
    };

}());
