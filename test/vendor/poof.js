/**
 * poof.js
 * @author Maciej Zasada maciejzsd@gmail.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.4
 * @date 2013/08/16 00:53:20
 */

/* ---------- Source: src/PoofObject.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:33 AM
 */

var PoofObject = function () {

};

PoofObject.prototype = {

};


/* ---------- Source: src/Poof.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:54 AM
 */


/**
 * Poof object
 * @type {{}}
 */
var Poof,
    CONFIG,
    domReady,
    initApp;


/**
 * Poof object
 * @type {{}}
 */
Poof = {};


/**
 * Version number,
 * replaced with actual value during build.
 */
Poof.__defineGetter__('VERSION', function () {
    return parseInt('0', 10);
});


/**
 * Revision number,
 * replaced with actual value during build.
 */
Poof.__defineGetter__('REVISION', function () {
    return parseInt('4', 10);
});


/**
 * Build number,
 * replaced with actual value during build.
 */
Poof.__defineGetter__('BUILD', function () {
    return parseInt('4', 10);
});


/**
 * Version string
 */
Poof.__defineGetter__('VERSION_STRING', function () {
    return Poof.VERSION + '.' + Poof.REVISION + '.' + Poof.BUILD;
});


/**
 * Internal Poof configuration
 * @type {{}}
 */
CONFIG = {
    MAIN_CLASS_ATTRIBUTE_NAME: 'main',
    CLASS_EXTENSION: '.poof.js',
    ROOT: ''
};


/**
 * Sets callback for when DOM is ready
 * @param callback
 */
domReady = function (callback) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback, false);
    } else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
        var domReadyIntervalId = setInterval(function () {
            if (/loaded|complete/i.test(document.readyState)) {
                callback();
                clearInterval(domReadyIntervalId);
            }
        }, 10);
    } else {
        window.onload = callback;
    }
};


/**
 * Initialises the application from main class
 */
initApp = function () {
    var scripts = document.getElementsByTagName('script'),
        i,
        mainPath,
        Main;

    // Iterate over included scripts to find the main poof.js script.
    for (i = 0; i < scripts.length; ++i) {

        // Check if the script has an attribute specifying the main poof.js class.
        if (scripts[i].hasAttribute(CONFIG.MAIN_CLASS_ATTRIBUTE_NAME)) {

            // Get the attribute value which is the path to the main class.
            mainPath = scripts[i].getAttribute(CONFIG.MAIN_CLASS_ATTRIBUTE_NAME);

            // Check if the file specified as a main class has appropriate extension.
            if (mainPath.match(CONFIG.CLASS_EXTENSION + '$')) {

                // Resolve root package URL.
                CONFIG.ROOT = mainPath.indexOf('/') === -1 ? '' : mainPath.substring(0, mainPath.lastIndexOf('/') + 1);

                // Initialise the main class (it is reference-less).
                Main = Import(mainPath, function () {
                    new Main();
                });

                return true;

            }

        }

    }

    return false;
};


/**
 * Initialise the application when DOM is ready
 */
domReady(function () {
    if (!initApp()) {
        console.warn('Poof.js main class not found');
    }
});


/**
 * Exports
 * @type {{}}
 */
window.Poof = Poof;


/* ---------- Source: src/Class.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:34 AM
 */


/**
 * Defines new class
 * @constructor
 */
var Class = function () {

};


/**
 * Exports
 * @type {Function}
 */
window.Class = Class;


/* ---------- Source: src/AbstractClass.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 8/14/13
 * Time: 1:49 AM
 */

var AbstractClass = function () {

};


/* ---------- Source: src/SingletonClass.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 8/14/13
 * Time: 1:49 AM
 */

var SingletonClass = function () {

};


/* ---------- Source: src/Interface.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 8/14/13
 * Time: 1:49 AM
 */

var Interface = function () {

};


/* ---------- Source: src/Import.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:34 AM
 */


/**
 * Import
 */
var Import,
    ImportUtils;


/**
 * Internal Import utility functions
 */
ImportUtils = {

    queue: [],
    imported: [],
    importTimeoutId: -1,
    resourcesByPath: {},
    constructorsByPath: {},

    isClassPath: function (path) {

        return !!path.match('.+' + CONFIG.CLASS_EXTENSION + '$');

    },

    resolveUrl: function (path) {

        return path.indexOf('/') === -1 ? (CONFIG.ROOT + path.split(CONFIG.CLASS_EXTENSION)[0].replace(/\./g, '/') + CONFIG.CLASS_EXTENSION) : path;

    },

    httpGet: function (url, script, successHandler, failureHandler) {

        if (script) {

            console.log('import script', url);

        } else {

            console.log('load text', url);

        }
    },

    run: function () {

        var self = this;

        clearTimeout(this.importTimeoutId);
        this.importTimeoutId = setTimeout(function () {
            self.importNext();
        }, 1);

    },

    importNext: function () {

        var self = this,
            resource,
            handler;

        if (this.queue.length !== 0) {

            resource = this.queue.splice(0, 1)[0];
            handler = function () {
                self.onImportComplete();
                if (typeof resource.handler === 'function') {
                    resource.handler();
                }
            };

            this.httpGet(resource.isClass ? this.resolveUrl(resource.path) : path, resource.isClass, handler);

        }

    },

    onImportComplete: function () {

    }

};


/**
 * Import
 * @param path
 * @constructor
 */
Import = function (path, handler) {

    var ref = null;

    // Check whether this resource has already been imported. If yes, simply return a reference to it.
    if (ImportUtils.imported.indexOf(path) === -1) {

        // Check if the imported resource most likely is a class.
        if (ImportUtils.isClassPath(path)) {

            // Create a temporary constructor until one is defined.
            ImportUtils.constructorsByPath[path] = function () {
                throw new Error('Class not ready yet.');
            };

            // Create a reference for the class.
            ref = function () {
                // As we do not know the constructor body yet, we need to call it by reference so we can override it later with actual implementation.
                ImportUtils.constructorsByPath[path].apply(this, arguments);
            };

            // Add the path to import queue.
            ImportUtils.queue.push({path: path, handler: handler, ref: ref, isClass: true});

        } else {

            // Add the path to import queue.
            ImportUtils.queue.push({path: path, handler: handler, ref: ref, isClass: false});

        }

        // Execute the import.
        ImportUtils.run();

    } else {

        // Return existing reference to the resouece.
        ref = ImportUtils.resourcesByPath[path];

    }

    return ref;

};


/**
 * Exports
 * @type {Function}
 */
window.Import = Import;
