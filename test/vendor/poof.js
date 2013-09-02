/**
 * poof.js
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.0
 * @date 2013/09/02 02:09:33
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
    createIdentifiableFunction,
    transcribeProperty,
    overrideProperty,
    defineClass,
    class$,
    duringSingletonInstantiation = false,
    callStack = [];

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
 * Creates a function that can be identified in terms of owner class.
 * @param ref
 * @param value
 * @returns {Function}
 */
createIdentifiableFunction = function (ref, value) {
    return function () {
        var retValue;
        callStack.push(ref);
        retValue = value.apply(this, arguments);
        callStack.pop();
        return retValue;
    };
};

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

    // Skip constructor
    if (name === prop) {
        return;
    }

    // Prevent accidental overriding.
    if (!override && ref[prop] !== undefined) {
        if (typeof ref[prop] === 'function') {
            throw new Error('Illegal attempt to implicitly override method ' + prop + ' originally defined in the base class by class ' + name + '. Overriding has to be marked explicitly by defining the new implementation within the override$ tag.');
        } else {
            throw new Error('Illegal attempt to redefine property ' + prop + ' already defined in the base class.');
        }
    }

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

        if (typeof value === 'function') {
            if (override) {
                if (ref[prop]) {
                    var baseMethod = ref[prop];
                    ref[prop] = createIdentifiableFunction(ref, value);
                    ref[prop].super$ = function () {
                        return baseMethod.apply(this, arguments);
                    };
                } else {
                    throw new Error('Attempt to override method ' + prop + ' that has not been defined by the base class by class ' + name);
                }
            } else {
                ref[prop] = createIdentifiableFunction(ref, value);
            }
        } else {
            switch (accessibility) {
                case PUBLIC:
                    ref[prop] = value;
                    break;

                case PROTECTED:
                    ref.__defineGetter__(prop, function () {
                        if (callStack.length !== 0 && ref === callStack[callStack.length - 1] || callStack[callStack.length - 1] instanceof ref.constructor) {
                            return value;
                        } else {
                            throw new Error('Illegal attempt to access protected property ' + prop + ' from outside ' + name + '\'s inheritance chain');
                        }
                    });
                    ref.__defineSetter__(prop, function (value) {
                        if (callStack.length !== 0 && ref === callStack[callStack.length - 1] || callStack[callStack.length - 1] instanceof ref.constructor) {
                            ref.__defineGetter__(prop, function () {
                                if (callStack.length !== 0 && ref === callStack[callStack.length - 1] || callStack[callStack.length - 1] instanceof ref.constructor) {
                                    return value;
                                } else {
                                    throw new Error('Illegal attempt to access protected property ' + prop + ' from outside ' + name + '\'s inheritance chain');
                                }
                            });
                        } else {
                            throw new Error('Illegal attempt to access protected property ' + prop + ' from outside ' + name + '\'s inheritance chain');
                        }
                    });
                    break;

                case PRIVATE:
                    ref.__defineGetter__(prop, function () {
                        if (callStack.length !== 0 && ref === callStack[callStack.length - 1]) {
                            return value;
                        } else {
                            throw new Error('Illegal attempt to access private property ' + prop + ' from outside class ' + name);
                        }
                    });
                    ref.__defineSetter__(prop, function (value) {
                        if (callStack.length !== 0 && ref === callStack[callStack.length - 1]) {
                            ref.__defineGetter__(prop, function () {
                                if (callStack.length !== 0 && ref === callStack[callStack.length - 1]) {
                                    return value;
                                } else {
                                    throw new Error('Illegal attempt to access private property ' + prop + ' from outside class ' + name);
                                }
                            });
                        } else {
                            throw new Error('Illegal attempt to access private property ' + prop + ' from outside class ' + name);
                        }
                    });
                    break;
            }
        }
    }

};

/**
 * Overrides property originally defined on the base class.
 * @param ref
 * @param name
 * @param prop
 * @param value
 * @param visibility
 */
overrideProperty = function (ref, name, prop, value, visibility) {

    if (typeof value === 'function') {
        // Override.
        transcribeProperty(ref, name, prop, value, visibility, INSTANCE, true);
    } else {
        throw new Error('Illegal attempt to override property ' + prop + ' by class ' + name + '. Only methods can be overridden.');
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
        prop2,
        defined,
        scope,
        accessibility,
        BaseClass = meta && meta.extends$ ? meta.extends$ : null,
        final,
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

    // Inheritance.
    if (BaseClass) {
        if (typeof BaseClass === 'function') {
            if (BaseClass.final$) {
                throw new Error('Invalid attempt to extend a final class ' + BaseClass.name$ + ' by class ' + name);
            }
            try {
                ref.prototype = new BaseClass();
            } catch (e) {
                throw new Error('Error during establishing inheritance for class ' + name + '. Base class constructor has raised an exception when invoked with no arguments.');
            }
        } else {
            throw new Error('Base class for ' + name + ' is of invalid type');
        }
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
                            if (scope.type === STATIC) {
                                throw new Error('Illegal attempt to override static properties by class ' + name);
                            } else {
                                for (prop2 in definition[scope.field][accessibility.field]['override$']) {
                                    overrideProperty(ref.prototype, name, prop2, definition[scope.field][accessibility.field][prop][prop2], accessibility.type);
                                }
                            }
                        } else {
                            if (defined.indexOf(prop) === -1) {
                                transcribeProperty(scope.type === STATIC ? ref : ref.prototype, name, prop, definition[scope.field][accessibility.field][prop], accessibility.type, scope.type);
                                defined.push(prop);
                            } else {
                                throw new Error('Illegal attempt to redefine property ' + prop + ' on class ' + name);
                            }
                        }
                    }
                }
            }
        }
    }

    // Define constructor.
    if (definition.instance$ && definition.instance$.public$ && definition.instance$.public$[name]) {
        BaseConstructor = function () {
            definition.instance$.public$[name].apply(this, arguments);
        };
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

        Constructor = function () {
            BaseConstructor.apply(this, arguments);
        };

    } else if (meta.type$ === class$.ABSTRACT) {

        Constructor = function () {
            throw new Error('Illegal attempt to directly instantiate an abstract class ' + name);
        };

    } else if (meta.type$ === class$.SINGLETON || meta.type$ === (class$.SINGLETON | class$.FINAL)) {

        var instance;

        Constructor = function () {
            if (!duringSingletonInstantiation) {
                throw new Error('Invalid attempt to directly instantiate a Singleton class ' + name);
            }
            BaseConstructor.apply(this, arguments);
        };

        ref.__defineGetter__('instance', function () {
            if (!instance) {
                duringSingletonInstantiation = true;
                instance = new Constructor();
                duringSingletonInstantiation = false;
            }
            return instance;
        });

    } else {
        throw new Error('Invalid type specified for class ' + name);
    }

    // Mark class as final if needed.
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

    meta.ready$ = true;

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
window.import$ = import$;
