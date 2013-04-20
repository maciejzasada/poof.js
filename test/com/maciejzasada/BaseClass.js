(function (window, document) {

    'use strict';

    Package('com.maciejzasada', [

        Import('com.maciejzasada.utils.MathUtils'),

        Class('BaseClass', {type: Class.ABSTRACT}, {

            baseVar: 'I belong to BaseClass',

            BaseClass: function () {

                console.log('I am BaseClass constructor');

            },

            baseMethod: function () {

                console.log('I am some base class method');

            }

        })

    ]);

}(window, document));
