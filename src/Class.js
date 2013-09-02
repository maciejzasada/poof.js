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
