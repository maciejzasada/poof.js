/**
 * poof.js
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.2
 * @date 2013/09/11 02:25:54
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
module.exports = window || {};


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
    return parseInt('2', 10);
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

    STRINGS = {
        ERROR_INTERFACE_MISSING_IMPLEMENTATION: 'Missing implementation of instance method {prop} in definition of class {name}',
        ERROR_INTERFACE_ARGUMENTS_NUM: 'Number of arguments in definition of method {prop} in definition of class {name} does not match the interface',
        ERROR_IMPLICIT_OVERRIDE: 'Illegal attempt to implicitly override method {prop} originally defined in the base class by class {name}. Overriding has to be marked explicitly by defining the new implementation within the override$ tag.',
        ERROR_OVERRIDE_NOT_EXISTING: 'Attempt to override method {prop} that has not been defined in {class}\'s base class',
        ERROR_OVERRIDE_PROPERTY: 'Illegal attempt to override property {prop} by class {name}. Only methods can be overridden.',
        ERROR_OVERRIDE_STATIC: 'Illegal attempt to override a static property by class {name}',
        ERROR_PROPERTY_REDEFINE: 'Illegal attempt to redefine property {prop} by class {name}. Property already defined in the base class.',
        ERROR_ACCESSIBILITY_1_2: 'Illegal attempt to access protected property {prop} from outside {name}\'s inheritance chain',
        ERROR_ACCESSIBILITY_1_3: 'Illegal attempt to access private property {prop} from outside class {name}',
        ERROR_ACCESSIBILITY_2_2: 'Illegal attempt to access protected static property {prop} from outside {name}\'s inheritance chain',
        ERROR_ACCESSIBILITY_2_3: 'Illegal attempt to access private static property {prop} from outside class {name}',
        ERROR_CONSTANT_MODIFICATION: 'Illegal attempt to modify constant property {prop} on class {name}',
        ERROR_CONSTANT_METHOD: 'Function cannot be constant. Evaluating definition of {prop} in definition of class {class}',
        ERROR_EXTEND_FINAL: 'Invalid attempt to extend a final class {base} by class {name}',
        ERROR_EXTEND_CONSTRUCTOR_EXCEPTION: 'Error during establishing inheritance for class {name}. Base class constructor has raised an exception when invoked with no arguments.',
        ERROR_EXTEND_INVALID_TYPE: 'Base class for class {name} is of invalid type',
        ERROR_DEFINITION_INVALID_CLASS_NAME: 'Invalid class name: {name}',
        ERROR_DEFINITION_INVALID_CLASS_TYPE: 'Invalid class type specified for class {name}',
        ERROR_DEFINITION_INVALID_META: 'Invalid or no meta object specified for class {name}',
        ERROR_DEFINITION_INVALID_DEFINITION: 'Invalid or no definition specified for class {name}',
        ERROR_DEFINITION_DUPLICATE: 'Illegal attempt to redefine property {prop} on class {name}',
        ERROR_INSTANTIATION_DIRECT_ABSTRACT: 'Illegal attempt to directly instantiate an abstract class {name}',
        ERROR_INSTANTIATION_DIRECT_SINGLETON: 'Illegal attempt to directly instantiate a Singleton class {name}'
    },

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
 * @param ref
 * @param name
 * @param meta
 * @param definition
 */
defineClass = function (id, ref, name, meta, definition) {

    var BaseConstructor,
        Constructor,
        prop,
        prop2,
        defined,
        scope,
        accessibility,
        BaseClass = meta && meta.extends$ ? meta.extends$ : null,
        final,
        i,
        j;

    // Inheritance.
    if (BaseClass) {
        ref.prototype = new BaseClass();
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
                                transcribeProperty(ref.prototype, name, prop2, definition[scope.field][accessibility.field][prop][prop2], accessibility.type, INSTANCE, true);
                            }
                        } else {
                            transcribeProperty(scope.type === STATIC ? ref : ref.prototype, name, prop, definition[scope.field][accessibility.field][prop], accessibility.type, scope.type);
                        }
                    }
                }
            }
        }
    }

    // Define constructor.
    if (definition.instance$ && definition.instance$.public$ && definition.instance$.public$[name]) {
        BaseConstructor = definition.instance$.public$[name];
        if (BaseClass) {
            BaseConstructor.super$ = function () {
                BaseClass.apply(this, arguments);
            }
        }
    } else {
        BaseConstructor = function () {
        };
    }

    if (!meta.type$ || meta.type$ === class$.PUBLIC || meta.type$ === (class$.PUBLIC | class$.FINAL)) {

        Constructor = BaseConstructor;

    } else if (meta.type$ === class$.ABSTRACT) {

        Constructor = function () {
            throw new Error(STRINGS.ERROR_INSTANTIATION_DIRECT_ABSTRACT.replace('{name}', name));
        };

    } else if (meta.type$ === class$.SINGLETON || meta.type$ === (class$.SINGLETON | class$.FINAL)) {

        var instance;

        Constructor = BaseConstructor;

        ref.__defineGetter__('instance', function () {
            if (!instance) {
                instance = new Constructor();
            }
            return instance;
        });

    } else {
        throw new Error(STRINGS.ERROR_DEFINITION_INVALID_CLASS_TYPE.replace('{name}', name));
    }

    // Add a final$ flag to the class.
    final = !!(meta.type$ && (meta.type$ & class$.FINAL));
    ref.__defineGetter__('final$', function () {
        return final;
    });

    // Define class name.
    ref.__defineGetter__('name$', function () {
        return name;
    });

    // Mark class are ready.
    ref.ready$ = true;

    // Override the temporary constructor that was created earlier.
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

    // Check if there are any dependencies that are not loaded yet.
    if (meta.extends$ && !meta.extends$.ready$) {
        ready = false;
    }
    if (meta.implements$) {
        for (i = 0; i < meta.implements$.length; ++i) {
            if (!meta.implements$[i].ready$) {
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

        ref.onReady$ = function (callback) {
            if (typeof callback === 'function') {
                if (ref.ready$) {
                    callback();
                } else {
                    callbacksById[id] = callbacksById[id] || [];
                    callbacksById[id].push(callback);
                }
            }
        };

        importUtils.registerDependend(id, ref, name, meta, definition);
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
