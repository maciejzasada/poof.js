/**
 * poof.js
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * @version 0.4.14
 * @date 2013/12/08 18:34:21
 */

/* ---------- Source: src/dev/poof.js ---------- */

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
    poof,
    CONFIG;


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
 * Version type,
 * replaced with actual value during build.
 */
poof.__defineGetter__('VERSION_TYPE', function () {
    return 'Alpha';
});


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
    return parseInt('14', 10);
});


/**
 * Version string
 */
poof.__defineGetter__('VERSION_STRING', function () {
    return poof.VERSION_TYPE + ' ' + poof.VERSION + '.' + poof.REVISION + '.' + poof.BUILD;
});


/**
 * Exports
 * @type {{}}
 */
module.exports.poof = poof;


/* ---------- Source: src/dev/class.js ---------- */

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
        ERROR_ACCESSIBILITY_1_2: 'Illegal attempt to access protected static property {prop} from outside {name}\'s inheritance chain',
        ERROR_ACCESSIBILITY_1_3: 'Illegal attempt to access private static property {prop} from outside class {name}',
        ERROR_ACCESSIBILITY_2_2: 'Illegal attempt to access protected property {prop} from outside {name}\'s inheritance chain',
        ERROR_ACCESSIBILITY_2_3: 'Illegal attempt to access private property {prop} from outside class {name}',
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

    refIdSeed = 1,
    constructorsById,
    duringSingletonInstantiation = false,
    duringExtension = false,
    callStack = [],
    isInProtectedScope,
    isInPrivateScope,
    isInScope,
    createIdentifiableFunction,
    createAccessibleProperty,
    transcribeProperty,
    overrideProperty,
    defineClass,
    class$;

/**
 * Keeps constructors by class ID.
 */
constructorsById = {};

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
 * Checks whether the current call is being made withing ref's protected scope.
 * @param ref
 * @returns {boolean}
 */
isInProtectedScope = function (ref) {
    return callStack.length !== 0 && (ref === callStack[callStack.length - 1] || callStack[callStack.length - 1] instanceof ref.constructor);
};

/**
 * Checks whether the current call is being made withing ref's private scope.
 * @param ref
 * @returns {boolean}
 */
isInPrivateScope = function (ref) {
    return callStack.length !== 0 && ref === callStack[callStack.length - 1];
};

/**
 * Checks whether the current call is being made within a given accessibility scope.
 * @param ref
 * @param scope
 * @returns {*}
 */
isInScope = function (ref, scope) {

    switch (scope) {
    case PROTECTED:
        return isInProtectedScope(ref);
    case PRIVATE:
        return isInPrivateScope(ref);
    }

};

/**
 * Creates property limited to specific accessibility.
 * @param ref
 * @param prop
 * @param value
 * @param accessibility
 */
createAccessibleProperty = function (ref, name, prop, value, accessibility, scope, constant) {
    switch (accessibility) {
    case PUBLIC:
        if (constant) {
            ref.__defineGetter__(prop, function () {
                return value;
            });
            ref.__defineSetter__(prop, function () {
                throw new Error(STRINGS.ERROR_CONSTANT_MODIFICATION.replace('{prop}', prop).replace('{name}', name));
            });
        } else {
            ref[prop] = value;
        }
        break;
    case PROTECTED:
    case PRIVATE:
        ref.__defineGetter__(prop, function () {
            if (isInScope(ref, accessibility)) {
                return value;
            } else {
                throw new Error(STRINGS['ERROR_ACCESSIBILITY_' + scope.toString() + '_' + accessibility.toString()].replace('{prop}', prop).replace('{name}', name));
            }
        });
        if (constant) {
            ref.__defineSetter__(prop, function () {
                throw new Error(STRINGS.ERROR_CONSTANT_MODIFICATION.replace('{prop}', prop).replace('{name}', name));
            });
        } else {
            ref.__defineSetter__(prop, function (value) {
                if (isInScope(ref, accessibility)) {
                    ref.__defineGetter__(prop, function () {
                        if (isInScope(ref, accessibility)) {
                            return value;
                        } else {
                            throw new Error(STRINGS['ERROR_ACCESSIBILITY_' + scope.toString() + '_' + accessibility.toString()].replace('{prop}', prop).replace('{name}', name));
                        }
                    });
                } else {
                    throw new Error(STRINGS['ERROR_ACCESSIBILITY_' + scope.toString() + '_' + accessibility.toString()].replace('{prop}', prop).replace('{name}', name));
                }
            });
        }
        break;
    }
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

    // Skip constructor.
    if (name === prop) {
        return;
    }

    // Prevent accidental overriding.
    if (!override && ref[prop] !== undefined) {
        if (typeof ref[prop] === 'function') {
            // The function has already been defined on the base class but is not marked with override$.
            throw new Error(STRINGS.ERROR_IMPLICIT_OVERRIDE.replace('{prop}', prop).replace('{name}', name));
        } else {
            // Attempt to redefine a property.
            throw new Error(STRINGS.ERROR_PROPERTY_REDEFINE.replace('{prop}', prop).replace('{name}', name));
        }
    }

    // Check if it is a constant (UPPER_CASE_WITH_UNDERSCORES).
    if (prop.toUpperCase() === prop) {
        // Constant.
        if (typeof value === 'function') {
            // Functions cannot be constant.
            throw new Error(STRINGS.ERROR_CONSTANT_METHOD.replace('{prop}', prop).replace('{name}', name));
        }
        // Create the constant property with accessibility restrictions.
        createAccessibleProperty(ref, name, prop, value, accessibility, scope, true);
    } else {
        // Not a constant.
        if (typeof value === 'function') {
            // Function.
            if (override) {
                // Marked as override.
                if (ref[prop]) {
                    // Implementation in the base class exists, so it's fine.
                    // Save a reference to the base class implementation before it's overridden.
                    var baseMethod = ref[prop];
                    // Create the new method using identifiable scope wrapper with accessibility restrictions.
                    createAccessibleProperty(ref, name, prop, createIdentifiableFunction(ref, value), accessibility, scope, false);
                    // Create a super$ property on the overridden method.
                    ref[prop].super$ = function () {
                        return baseMethod.apply(this, arguments);
                    };
                } else {
                    // The method marked as override has not been implemented in the base class.
                    throw new Error(STRINGS.ERROR_OVERRIDE_NOT_EXISTING.replace('{prop}', prop).replace('{name}', name));
                }
            } else {
                // Create the method using identifiable scope wrapper with accessibility restrictions.
                createAccessibleProperty(ref, name, prop, createIdentifiableFunction(ref, value), accessibility, scope, false);
            }
        } else {
            // Create the variable property with accessibility restrictions.
            createAccessibleProperty(ref, name, prop, value, accessibility, scope, false);
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
    // Check if the property being overridden is a function.
    if (typeof value === 'function') {
        // It is a function so override.
        transcribeProperty(ref, name, prop, value, visibility, INSTANCE, true);
    } else {
        // Properties cannot be overridden.
        throw new Error(STRINGS.ERROR_OVERRIDE_PROPERTY.replace('{prop}', prop).replace('{name}', name));
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
                    throw new Error(STRINGS.ERROR_INTERFACE_MISSING_IMPLEMENTATION.replace('{prop}', interfaceMethod.name).replace('{name}', name));
                }
                if (definition.instance$.public$[interfaceMethod.name].length !== interfaceMethod.length) {
                    throw new Error(STRINGS.ERROR_INTERFACE_ARGUMENTS_NUM.replace('{prop}', interfaceMethod.name).replace('{name}', name));
                }
            }
        }
    }

    // Inheritance.
    if (BaseClass) {
        if (typeof BaseClass === 'function') {
            if (BaseClass.final$) {
                throw new Error(STRINGS.ERROR_EXTEND_FINAL.replace('{base}', BaseClass.name$).replace('{name}', name));
            }
            try {
                duringExtension = true;
                ref.prototype = new BaseClass();
                duringExtension = false;
            } catch (e) {
                throw new Error(STRINGS.ERROR_EXTEND_CONSTRUCTOR_EXCEPTION.replace('{name}', name) + e.toString() + '\n' + e.stack);
            }
        } else {
            throw new Error(STRINGS.ERROR_EXTEND_INVALID_TYPE.replace('{name}', name));
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
                                throw new Error(STRINGS.ERROR_OVERRIDE_STATIC.replace('{name}', name));
                            } else {
                                for (prop2 in definition[scope.field][accessibility.field].override$) {
                                    overrideProperty(ref.prototype, name, prop2, definition[scope.field][accessibility.field][prop][prop2], accessibility.type);
                                }
                            }
                        } else {
                            if (defined.indexOf(prop) === -1) {
                                transcribeProperty(scope.type === STATIC ? ref : ref.prototype, name, prop, definition[scope.field][accessibility.field][prop], accessibility.type, scope.type);
                                defined.push(prop);
                            } else {
                                throw new Error(STRINGS.ERROR_DEFINITION_DUPLICATE);
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
            if (!duringExtension) {
                throw new Error(STRINGS.ERROR_INSTANTIATION_DIRECT_ABSTRACT.replace('{name}', name));
            }
        };

    } else if (meta.type$ === class$.SINGLETON || meta.type$ === (class$.SINGLETON | class$.FINAL)) {

        var instance;

        Constructor = function () {
            if (!duringSingletonInstantiation) {
                throw new Error(STRINGS.ERROR_INSTANTIATION_DIRECT_SINGLETON.replace('{name}', name));
            }
            BaseConstructor.apply(this, arguments);
        };

        ref.__defineGetter__('instance', function () {
            if (!instance) {
                duringSingletonInstantiation = true;
                instance = new ref();
                duringSingletonInstantiation = false;
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

    // Handle async callbacks.
    ref.onReady$ = importUtils.generateOnReadyHandler(ref);

    // Override the temporary constructor that was created earlier.
    constructorsById[id] = createIdentifiableFunction(ref.prototype, Constructor);
    
    // In case we were being loaded.
    if (currentLoadPath) {
        importUtils.constructorsByPath[currentLoadPath] = Constructor;
        currentLoadPath = null;
    }

    // Inform dependent classes that we're ready.
    importUtils.notifyReady(ref);

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
        dependencies,
        i;

    // Check if class name has been specified.
    if (typeof name !== 'string' || name.length === 0) {
        throw new Error(STRINGS.ERROR_DEFINITION_INVALID_CLASS_NAME.replace('{name}', name));
    }

    // Check if meta object has been specified.
    if (typeof meta !== 'object') {
        throw new Error(STRINGS.ERROR_DEFINITION_INVALID_META.replace('{name}', name));
    }

    // Check if definition has been specified.
    if (typeof definition !== 'object') {
        throw new Error(STRINGS.ERROR_DEFINITION_INVALID_DEFINITION.replace('{name}', name));
    }

    // Generate class unique ID.
    if (!currentLoadPath) {
        id = refIdSeed++;
    }

    // Prepare temporary reference.
    // In case we were being loaded.
    if (currentLoadPath) {
        ref = importUtils.getResourceReference(currentLoadPath);
        id = ref.id$;
    } else {
        ref = function () {
            constructorsById[id].apply(this, arguments);
        };
    }
    
    ref.__defineGetter__('id$', function () {
        return id;
    });
    
    ref.toString = function () {
        return '[Class ' + name + ' @' + id + ']';
    };

    // Check if there are any dependencies that are not loaded yet.
    dependencies = [];

    if (meta.extends$ && !meta.extends$.ready$) {
        dependencies.push(meta.extends$);
    }

    if (meta.implements$) {
        for (i = 0; i < meta.implements$.length; ++i) {
            if (!meta.implements$[i].ready$) {
                dependencies.push(meta.implements$[i]);
            }
        }
    }

    if (dependencies.length === 0) {
        // Dependencies are ready, define the class now.
        defineClass(id, ref, name, meta, definition);
    } else {
        // Dependencies are not ready. Prepare temporary constructor and register.
        constructorsById[id] = function () {
            throw new Error('Class ' + name + ' not ready.');
        };

        importUtils.registerDependent(ref, dependencies);

        ref.onReady$(function () {
            defineClass(id, ref, name, meta, definition);
        });
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


/* ---------- Source: src/dev/interface.js ---------- */

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

module.exports.interface$ = interface$;


/* ---------- Source: src/dev/import.js ---------- */

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
    importUtils,
    currentLoadPath = null;


/**
 * Internal Import utility functions
 */
importUtils = {

    resourcesByPath: {},
    constructorsByPath: {},
    handlersByPath: {},
    importTimeoutId: -1,
    queue: [],
    callbacks: {},

    getResourceReference: function (path) {

        return this.resourcesByPath[path];

    },

    createClassReference: function (path) {

        var ref,
            id = refIdSeed++;

        // Create a temporary constructor until one is defined.
        this.constructorsByPath[path] = this.createTemporaryConstructor();
        this.handlersByPath[path] = this.handlersByPath[path] || [];

        ref = function () {
            // As we do not know the constructor body yet, we need to call it by a dynamic reference so we can override it later with actual implementation.
            importUtils.constructorsByPath[path].apply(this, arguments);
        };

        ref.onReady$ = importUtils.generateOnReadyHandler(ref);
        
        ref.toString = function () {
            return '[Import @' + id + ']';
        };
        
        ref.__defineGetter__('id$', function () {
            return id;
        });
        
        ref.__defineGetter__('path$', function () {
            return path;
        });
        
        this.resourcesByPath[path] = ref;

        return ref;

    },
    
    createTemporaryConstructor: function () {

        return function () {
            throw new Error('Class not ready yet.');
        };

    },
    
    generateOnReadyHandler: function (ref) {
        return function (callback) {
            if (typeof callback === 'function') {
                if (ref.ready$) {
                    callback();
                } else {
                    importUtils.callbacks[ref.id$] = importUtils.callbacks[ref.id$] || [];
                    if (importUtils.callbacks[ref.id$].indexOf(callback) === -1) {
                        importUtils.callbacks[ref.id$].push(callback);
                    }
                }
            }
        };
    },

    registerDependent: function (ref, dependencies) {

        var i,
            numDependenciesLeft = dependencies.length,
            onDependendyLoaded = function () {
                if (--numDependenciesLeft <= 0) {
                    importUtils.notifyReady(ref);
                }
            };

        ref.__defineGetter__('ready$', function () {
            return false;
        });

        ref.onReady$ = importUtils.generateOnReadyHandler(ref);

        if (dependencies.length === 0) {
            throw new Error('This should never happen');
        } else {
            for (i = 0; i < dependencies.length; ++i) {
                dependencies[i].onReady$(onDependendyLoaded);
            }
        }

    },

    notifyReady: function (ref) {

        var i;
        
        if (ref.ready$) {
            return;
        }
        
        if (currentLoadPath) {
            importUtils.constructorsByPath[currentLoadPath] = function () {};
            currentLoadPath = null;
        }
        
        ref.__defineGetter__('ready$', function () {
            return true;
        });
        
        if (importUtils.callbacks[ref.id$]) {
            for (i = 0; i < importUtils.callbacks[ref.id$].length; ++i) {
                if (typeof importUtils.callbacks[ref.id$][i] === 'function') {
                    importUtils.callbacks[ref.id$][i]();
                }
            }
        }

    },

    add: function (path, ref, callback) {

        this.queue.push({path: path, ref: ref, callback: callback});

    },

    resolveUrl: function (path) {

        return path.indexOf('/') === -1 ? (CONFIG.ROOT + path.split(CONFIG.CLASS_EXTENSION)[0].replace(/\./g, '/') + CONFIG.CLASS_EXTENSION) : path;

    },

    load: function (path, callback) {
        if (path.indexOf('/') === -1) {
            path = path.replace(/\./g, '/') + '.js';
        }
        this.xhr(path, callback);
    },
    
    xhr: function (url, callback) {
        var xobj = new XMLHttpRequest();
        // xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == '200') {
                if (typeof callback === 'function') {
                    callback(xobj.responseText);
                }
            }
        }.bind(this);
        xobj.send(null);
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
            callback = function (script) {
                currentLoadPath = resource.path;
                eval(script);
                importUtils.notifyReady(resource.ref);
                if (typeof resource.callback === 'function') {
                    resource.callback();
                }
                importUtils.importNext();
            };

            this.load(resource.path, callback);

        }

    }

};


/**
 * import$
 * @param path
 * @constructor
 */
import$ = function (path, callback) {

    console.log('import', path);
    var ref = importUtils.getResourceReference(path);

    // Check whether this resource has already been imported. If yes, simply return a reference to it.
    if (!ref) {

        // Create a temporary reference to the imported resource.
        ref = importUtils.createClassReference(path);

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
