(function (window, document) {

//    'use strict';

    Poof.configure({

        scope: window,
        root: '/test/',
        extension: '.js'

    });

    Poof.Package('com.maciejzasada', [

        Poof.Import('com.maciejzasada.BaseClass'),
        Poof.Import('com.maciejzasada.utils.UtilsClass'),

        Poof.Class('App', {type: Poof.Class.PUBLIC/*, extend: 'BaseClass'*/}, {

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
