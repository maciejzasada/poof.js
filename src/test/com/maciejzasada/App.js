(function (window, document) {

    'use strict';

    Poof.configure({

        scope: window,
        root: '/test/',
        extension: '.js'

    });

    Poof.Package('com.maciejzasada', [

        Poof.Import('com.maciejzasada.BaseClass'),
        Poof.Import('com.maciejzasada.utils.UtilsClass'),

        Poof.Class('App', {type: Poof.Class.PUBLIC/*, extend: 'BaseClass'*/}, {

            age: 23,

            App: function () {

                console.log('I am App constructor');

            },

            test: function() {

                console.log('Hey man! I\'m ' + this.age + ' years old.');
                return this.age;

            }

        })

    ]);

}(window, document));
