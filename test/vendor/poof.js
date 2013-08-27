/**
 * poof.js
 * @author Maciej Zasada maciejzsd@gmail.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.0
 * @date 2013/08/27 02:21:39
 */

/* ---------- Source: src/poof.js ---------- */

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
    return parseInt('0', 10);
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


/* ---------- Source: src/class.js ---------- */

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

var STATIC = 1,
    INSTANCE = 2,
    PUBLIC = 1,
    PROTECTED = 2,
    PRIVATE = 3,

    classIdSeed = 1,
    constructorsById,
    transcribeProperty,
    defineClass,
    class$,
    duringSingletonInstantiation = false;

/**
 * Keeps constructors by class ID.
 */
constructorsById = {};

transcribeProperty = function (ref, name, prop, value, visibility, scope) {

    if (prop.toUpperCase() === prop) {

        // Constant
        if (typeof value === 'function') {
            throw new Error('Function cannot be constant. Evaluating definition of ' + prop + ' in ' + name);
        }

        ref.__defineGetter__(prop, function () {
            return value;
        });

        ref.__defineSetter__(prop, function () {
            throw new Error('Illegal attempt to assign value to a constant property ' + name + (scope === INSTANCE ? ':' : '::') + prop);
        });

    } else {

        // Variable
        ref[prop] = value;
    }

};

/**
 * Defines class.
 * @param id
 * @param ref
 * @param name
 * @param meta
 * @param definition
 */
defineClass = function (id, ref, name, meta, definition) {

    var BaseConstructor,
        Constructor,
        interfaceMethod,
        prop,
        i,
        j;

    // Verify interface implementation.
    if (meta && meta.implements$) {
        for (i = 0; i < meta.implements$.length; ++i) {
            for (j = 0; j < meta.implements$[i].length; ++j) {
                interfaceMethod = meta.implements$[i][j];
                if (!definition.instance$ || !definition.instance$.public$ || typeof definition.instance$.public$[interfaceMethod.name] !== 'function') {
                    throw new Error('Missing implementation of instance method ' + interfaceMethod.name + ' in definition of class ' + name);
                }
                if (definition.instance$.public$[interfaceMethod.name].length !== interfaceMethod.length) {
                    throw new Error('Number of arguments in definition of method ' + interfaceMethod.name + ' in definition of class ' + name + ' does not match the interface');
                }
            }
        }
    }

    // Static properties.
    if (definition.static$) {

        // Public properties.
        if (definition.static$.public$) {
            for (prop in definition.static$.public$) {
                transcribeProperty(ref, name, prop, definition.static$.public$[prop], PUBLIC, STATIC);
            }
        }

        // Protected properties.
        if (definition.static$.protected$) {
            for (prop in definition.static$.protected$) {
                transcribeProperty(ref, name, prop, definition.static$.protected$[prop], PROTECTED, STATIC);
            }
        }

        // Private properties.
        if (definition.static$.private$) {
            for (prop in definition.static$.private$) {
                transcribeProperty(ref, name, prop, definition.static$.private$[prop], PRIVATE, STATIC);
            }
        }
    }

    // Instance properties.
    if (definition.instance$) {

        // Public properties.
        if (definition.instance$.public$) {
            for (prop in definition.instance$.public$) {
                transcribeProperty(ref.prototype, name, prop, definition.instance$.public$[prop], PUBLIC, INSTANCE);
            }
        }

        // Protected properties.
        if (definition.instance$.protected$) {
            for (prop in definition.instance$.protected$) {
                transcribeProperty(ref.prototype, name, prop, definition.instance$.protected$[prop], PROTECTED, INSTANCE);
            }
        }

        // Private properties.
        if (definition.instance$.private$) {
            for (prop in definition.instance$.private$) {
                transcribeProperty(ref.prototype, name, prop, definition.instance$.private$[prop], PRIVATE, INSTANCE);
            }
        }
    }

    // Define constructor.
    BaseConstructor = function () {
//        Object.preventExtensions(this);
    };

    if (!meta.type$ || meta.type$ === class$.PUBLIC) {

        Constructor = function () {
            BaseConstructor.call(this);
        };

    } else if (meta.type$ === class$.ABSTRACT) {

        Constructor = function () {
            throw new Error('Illegal attempt to directly instantiate an abstract class ' + name);
        };

    } else if (meta.type$ === class$.SINGLETON) {

        var instance;

        Constructor = function () {
            if (!duringSingletonInstantiation) {
                throw new Error('Invalid attempt to directly instantiate a Singleton class ' + name);
            }
            BaseConstructor.call(this);
        };

        ref.__defineGetter__('instance', function () {
            if (!instance) {
                duringSingletonInstantiation = true;
                instance = new Constructor();
                duringSingletonInstantiation = false;
            }
            return instance;
        });

    }

    constructorsById[id] = Constructor;

};

/**
 * Initialises class definition.
 * @param name
 * @param meta
 * @param definition
 * @returns {Function}
 */
class$ = function (name, meta, definition) {

    var id,
        ref,
        ready = true,
        i;

    // Check if class name has been specified.
    if (typeof name !== 'string' || name.length === 0) {
        throw new Error('Invalid class name: ' + name);
    }

    // Check if meta object has been specified.
    if (typeof meta !== 'object') {
        throw new Error('Invalid or no meta object specified for class ' + name);
    }

    // Check if definition has been specified.
    if (typeof definition !== 'object') {
        throw new Error('Invalid or no definition specified for class ' + name);
    }

    // Check if there are any dependencies that are not loaded yet.
    if (meta.extends$ && !meta.extends$.ready) {
        ready = false;
    }
    if (meta.implements$) {
        for (i = 0; i < meta.implements$.length; ++i) {
            if (!meta.implements$[i].ready) {
                ready = false;
                break;
            }
        }
    }

    // Generate class unique ID.
    id = classIdSeed++;

    // Prepare temporary reference.
    ref = function () {
        constructorsById[id].apply(this, arguments);
    };

    if (ready) {
        // Dependencies are ready, define the class now.
        defineClass(id, ref, name, meta, definition);
    } else {
        // Dependencies are not ready. Prepare temporary constructor and register.
        constructorsById[id] = function () {
            throw new Error('Class ' + name + ' not ready.');
        };
        // TODO: ImportUtils.registerDependent(ref, meta, define);
    }

    return ref;

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
window.class$ = class$;


/* ---------- Source: src/interface.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
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

    var meta = [],
        prop;

    // Check if interface has a name.
    if (typeof name !== 'string' || name.length === 0) {
        throw new Error('Invalid interface name ' + name);
    }

    // Parse the interface.
    for (prop in definition) {
        if (typeof definition[prop] === 'function') {
            meta.push({name: prop, length: definition[prop].length});
        } else {
            throw new Error('An interface can only define methods. Invalid property ' + name + ':' + prop);
        }
    }

    meta.ready = true;

    return meta;

};

window.interface$ = interface$;


/* ---------- Source: src/import.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
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
window.import$ = import$;
