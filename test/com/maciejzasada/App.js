(function (window, document) {

//    'use strict';

    Poof.configure({

        scope: window,
        root: '/test/',
        extension: '.js',
        main: 'com.maciejzasada.App'

    });

    Package('com.maciejzasada', [

        Import('com.maciejzasada.IntermediateClass'),
        Import('com.maciejzasada.utils.UtilsClass'),

        Class('App', {type: Class.PUBLIC, extend: 'IntermediateClass'}, {

            CONSTANT: 'you won\'t change me!',

            age: 23,

            App: function () {

                console.log('I am App constructor');

            },

            __privateVariable: 'I know you are an instance of App!',

            __privateFunction: function () {

                console.log('I am a private function');
                console.log('I can access public variables:', this.age);
                console.log('I can access private variables:', this.__privateVariable);

            },

            test: function () {

                console.log('the private var says:', this.__privateVariable);

            },

            test2: function () {

                this.__privateFunction();

            },

            modPrivate: function () {

                this.__privateVariable = 'new value';

            }

        })

    ]);

}(window, document));
