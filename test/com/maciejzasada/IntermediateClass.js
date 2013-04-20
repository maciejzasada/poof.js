(function (window, document) {

    Package('com.maciejzasada', [

        Import('com.maciejzasada.BaseClass'),

        Class('IntermediateClass', {type: Class.PUBLIC, extend: 'BaseClass'}, {

            intermediateVar: 15,

            IntermediateClass: function () {
            },

            intermediateMethod: function () {

                console.log('IntermediateClass method');

            }

        })

    ]);

}(window, document));
