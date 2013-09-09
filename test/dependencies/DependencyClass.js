/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 8/27/13
 * Time: 12:16 AM
 */

(function () {

    'use strict';

    class$('BaseClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {

        instance$: {

            public$: {

                testMethod: function () {
                    return 'test';
                }

            }

        }

    });

}());
