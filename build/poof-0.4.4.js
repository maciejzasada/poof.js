/**
 * poof.js
 * @author Maciej Zasada maciejzsd@gmail.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.4
 * @date 2013/08/14 02:03:25
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
    CLASS_EXTENSION: '.poof'
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
        i;

    for (i = 0; i < scripts.length; ++i) {
        if (scripts[i].hasAttribute(CONFIG.MAIN_CLASS_ATTRIBUTE_NAME) && scripts[i].getAttribute(CONFIG.MAIN_CLASS_ATTRIBUTE_NAME).match(CONFIG.CLASS_EXTENSION + '$')) {
            Import(scripts[i].getAttribute(CONFIG.MAIN_CLASS_ATTRIBUTE_NAME));
            return true;
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


var Import,
    ImportUtils;


ImportUtils = {

    queuedImports: [],

    httpGet: function (url, successHandler, failureHandler) {
        console.log('httpGet', url);
    }

};


Import = function (path) {
    ImportUtils.httpGet(path);
};


/**
 * Exports
 * @type {Function}
 */
window.Import = Import;