/**
 * poof.js
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.6
 * @date 2013/11/06 21:47:23
 */

/* ---------- Source: src/prod/poof.js ---------- */

/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 7/4/13
 * Time: 12:54 AM
 */


/**
 * poof object
 * @type {{}}
 */
var module = module || {},
    window = window || {},
    document = document || {},
    navigator = navigator || {},
    poof,
    CONFIG,
    domReady,
    initApp;


/**
 * node.js compatibility
 * @type {*|window|window|{}}
 */
module.exports = typeof global === 'undefined' ? (window || {}) : global;

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
    return parseInt('0', 10);
});


/**
 * Revision number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('REVISION', function () {
    return parseInt('4', 10);
});


/**
 * Build number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('BUILD', function () {
    return parseInt('6', 10);
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
module.exports.poof = poof;


/* ---------- Source: src/prod/class.js ---------- */

/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 7/4/13
 * Time: 12:34 AM
 */


/**
 * Defines new class
 * @constructor
 */

var STATIC = 1,
    INSTANCE = 2,

    PUBLIC = 1,
    PROTECTED = 2,
    PRIVATE = 3,

    SCOPES = [
        {field: 'static$', type: STATIC},
        {field: 'instance$', type: INSTANCE}
    ],

    ACCESSIBILITIES = [
        {field: 'public$', type: PUBLIC},
        {field: 'protected$', type: PROTECTED},
        {field: 'private$', type: PRIVATE}
    ],

    classIdSeed = 1,
    constructorsById,
    callbacksById,
    transcribeProperty,
    defineClass,
    class$;

/**
 * Keeps constructors by class ID.
 */
constructorsById = {};

/**
 * Callbacks when class finishes asynchronous initialisation.
 * @type {{}}
 */
callbacksById = {};

/**
 * Transcribes property from class definition onto the class object.
 * @param ref
 * @param name
 * @param prop
 * @param value
 * @param accessibility
 * @param scope
 * @param override
 */
transcribeProperty = function (ref, name, prop, value, accessibility, scope, override) {

    // Skip constructor.
    if (name === prop) {
        return;
    }

    if (override) {
        // Marked as override.
        if (ref[prop]) {
            // Implementation in the base class exists, so it's fine.
            // Save a reference to the base class implementation before it's overridden.
            var baseMethod = ref[prop];
            // Create the new method using identifiable scope wrapper with accessibility restrictions.
            ref[prop] = value;
            // Create a super$ property on the overridden method.
            value.super$ = function () {
                return baseMethod.apply(this, arguments);
            };
        }
    } else {
        ref[prop] = value;
    }

};

/**
 * Defines class.
 * @param id
 * @param name
 * @param meta
 * @param definition
 */
defineClass = function (id, name, meta, definition) {

    var Constructor,
        prop,
        prop2,
        defined,
        scope,
        accessibility,
        BaseClass = meta && meta.extends$ ? meta.extends$ : null,
        final,
        i,
        j;

    // Define constructor.
    if (definition.instance$ && definition.instance$.public$ && definition.instance$.public$[name]) {
        Constructor = definition.instance$.public$[name];
        if (BaseClass) {
            Constructor.super$ = function () {
                BaseClass.apply(this, arguments);
            }
        }
    } else {
        Constructor = function () {
        };
    }

    if (meta.type$ === class$.SINGLETON || meta.type$ === (class$.SINGLETON | class$.FINAL)) {
        var instance;
        Constructor.__defineGetter__('instance', function () {
            if (!instance) {
                instance = new Constructor();
            }
            return instance;
        });
    }

    // Inheritance.
    if (BaseClass) {
        Constructor.prototype = new BaseClass();
    }

    // Transcribe properties
    for (i = 0; i < SCOPES.length; ++i) {
        scope = SCOPES[i];
        defined = [];
        if (definition[scope.field]) {
            for (j = 0; j < ACCESSIBILITIES.length; ++j) {
                accessibility = ACCESSIBILITIES[j];
                if (definition[scope.field][accessibility.field]) {
                    for (prop in definition[scope.field][accessibility.field]) {
                        if (prop === 'override$') {
                            for (prop2 in definition[scope.field][accessibility.field].override$) {
                                transcribeProperty(Constructor.prototype, name, prop2, definition[scope.field][accessibility.field][prop][prop2], accessibility.type, INSTANCE, true);
                            }
                        } else {
                            transcribeProperty(scope.type === STATIC ? Constructor : Constructor.prototype, name, prop, definition[scope.field][accessibility.field][prop], accessibility.type, scope.type);
                        }
                    }
                }
            }
        }
    }

    // Add a final$ flag to the class.
    final = !!(meta.type$ && (meta.type$ & class$.FINAL));
    Constructor.__defineGetter__('final$', function () {
        return final;
    });

    // Define class name.
    Constructor.__defineGetter__('name$', function () {
        return name;
    });

    // Mark class are ready.
    Constructor.ready$ = true;

    return Constructor;

};

/**
 * Initialises class definition.
 * @param name
 * @param meta
 * @param definition
 * @returns {Function}
 */
class$ = function (name, meta, definition) {

    return defineClass(classIdSeed++, name, meta, definition);

};

/**
 * Class types.
 * @type {number}
 */
class$.PUBLIC = 1;
class$.ABSTRACT = 2;
class$.SINGLETON = 4;
class$.FINAL = 8;


/**
 * Exports
 * @type {Function}
 */
module.exports.class$ = class$;


/* ---------- Source: src/prod/interface.js ---------- */

/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 8/14/13
 * Time: 1:49 AM
 */


/**
 * Defines new interface
 * @param name interface name
 * @param definition interface definition
 * @constructor
 */
var interface$ = function (name, definition) {

    return [name, definition];

};

module.exports.interface$ = interface$;


/* ---------- Source: src/prod/import.js ---------- */

/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 7/4/13
 * Time: 12:34 AM
 */


/**
 * Import
 */
var import$,
    importUtils;


/**
 * Internal Import utility functions
 */
importUtils = {

    resourcesByPath: {},
    constructorsByPath: {},
    importTimeoutId: -1,
    queue: [],
    dependent: [],

    getResourceReference: function (path) {

        return this.resourcesByPath[path];

    },

    createReference: function (path) {

        switch (this.guessResourceType(path)) {

            case 'class':
                return this.createClassReference(path);

            case 'script':
                break;

            case 'image':
                break;

            case 'other':
                return {};

        }

    },

    guessResourceType: function (path) {

        if (!!path.match('.+' + CONFIG.CLASS_EXTENSION + '$')) {
            return 'class';
        } else if (!!path.match('.+\\.js$')) {
            return 'script';
        } else if (!!path.match('.+\\.[jpg|jpeg|png]$')) {
            return 'image';
        } else {
            return 'other';
        }

    },

    registerDependend: function (id, ref, name, meta, definition) {

        var pending = [],
            i;
        if (meta && meta.extends$ && !meta.extends$.ready$) {
            pending.push(meta.extends$);
        }
        if (meta && meta.implements$) {
            for (i = 0; i < meta.implements$.length; ++i) {
                if (!meta.implements$[i].ready$) {
                    pending.push(meta.implements$[i]);
                }
            }
        }
        this.dependent.push({id: id, ref: ref, name: name, definition: definition, pending: pending});

    },

    createClassReference: function (path) {

        // Create a temporary constructor until one is defined.
        this.constructorsByPath[path] = this.createTemporaryConstructor();

        return function () {
            // As we do not know the constructor body yet, we need to call it by a dynamic reference so we can override it later with actual implementation.
            importUtils.constructorsByPath[path].apply(this, arguments);
        };

    },

    createTemporaryConstructor: function () {

        return function () {
            throw new Error('Class not ready yet.');
        };

    },

    add: function (path, ref, callback) {

        this.queue.push({path: path, ref: ref, callback: callback});

    },

    resolveUrl: function (path) {

        return path.indexOf('/') === -1 ? (CONFIG.ROOT + path.split(CONFIG.CLASS_EXTENSION)[0].replace(/\./g, '/') + CONFIG.CLASS_EXTENSION) : path;

    },

    load: function (path, callback) {

        switch (this.guessResourceType(path)) {

            case 'class':
                console.log('loading class');
            case 'script':
                console.log('loading script', path);
                break;

            case 'image':
                break;

            case 'other':
                break;

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
            callback;

        if (this.queue.length !== 0) {

            resource = this.queue.splice(0, 1)[0];
            callback = function () {
                self.onImportComplete();
                if (typeof resource.callback === 'function') {
                    resource.callback();
                }
            };

            this.load(resource.path, callback)

        }

    },

    onImportComplete: function () {

    }

};


/**
 * import$
 * @param path
 * @constructor
 */
import$ = function (path, callback) {

    var ref = importUtils.getResourceReference(path);

    // Check whether this resource has already been imported. If yes, simply return a reference to it.
    if (ref) {

        // TODO: check if it is imported and if yes, invoke the callback

    } else {

        // Create a temporary reference to the imported resource.
        ref = importUtils.createReference(path);

        // Add the path to import queue.
        importUtils.add(path, ref, callback);

        // Execute the import.
        importUtils.run();

    }

    return ref;

};


/**
 * Exports
 * @type {Function}
 */
module.exports.import$ = import$;
