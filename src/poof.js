/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:54 AM
 */


/**
 * poof object
 * @type {{}}
 */
var poof,
    CONFIG,
    domReady,
    initApp;


/**
 * poof object
 * @type {{}}
 */
poof = {};


/**
 * Version number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('VERSION', function () {
    return parseInt('{{VERSION}}', 10);
});


/**
 * Revision number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('REVISION', function () {
    return parseInt('{{REVISION}}', 10);
});


/**
 * Build number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('BUILD', function () {
    return parseInt('{{BUILD}}', 10);
});


/**
 * Version string
 */
poof.__defineGetter__('VERSION_STRING', function () {
    return poof.VERSION + '.' + poof.REVISION + '.' + poof.BUILD;
});


/**
 * Internal poof configuration
 * @type {{}}
 */
CONFIG = {
    MAIN_CLASS_ATTRIBUTE_NAME: 'data-main',
    CLASS_EXTENSION: '.poof',
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
                Main = import$(mainPath, function () {
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
        console.warn('poof.js main class not found');
    }
});


/**
 * Exports
 * @type {{}}
 */
window.poof = poof;
