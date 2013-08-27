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
    callbacksById,
    transcribeProperty,
    overrideProperty,
    defineClass,
    class$,
    duringSingletonInstantiation = false;

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
 * @param visibility
 * @param scope
 * @param override
 */
transcribeProperty = function (ref, name, prop, value, visibility, scope, override) {

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
                    ref[prop] = value;
                    ref[prop].super$ = function () {
                        return baseMethod.apply(this, arguments);
                    };
                } else {
                    throw new Error('Attempt to override method ' + prop + ' that has not been defined by the base class by class ' + name);
                }
            } else {
                ref[prop] = value;
            }
        } else {
            ref[prop] = value;
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

    // Instance properties.
    if (definition.instance$) {

        // Public properties.
        if (definition.instance$.public$) {

            // New properties.
            for (prop in definition.instance$.public$) {
                transcribeProperty(ref.prototype, name, prop, definition.instance$.public$[prop], PUBLIC, INSTANCE);
            }

            // Overridden properties.
            if (definition.instance$.public$.override$) {
                for (prop in definition.instance$.public$.override$) {
                    overrideProperty(ref.prototype, name, prop, definition.instance$.public$.override$[prop], PUBLIC);
                }
            }
        }

        // Protected properties.
        if (definition.instance$.protected$) {

            // New properties.
            for (prop in definition.instance$.protected$) {
                transcribeProperty(ref.prototype, name, prop, definition.instance$.protected$[prop], PROTECTED, INSTANCE);
            }

            // Overridden properties.
            if (definition.instance$.protected$.override$) {
                for (prop in definition.instance$.protected$.override$) {
                    overrideProperty(ref.prototype, name, prop, definition.instance$.protected$.override$[prop], PROTECTED);
                }
            }
        }

        // Private properties.
        if (definition.instance$.private$) {

            // New properties.
            for (prop in definition.instance$.private$) {
                transcribeProperty(ref.prototype, name, prop, definition.instance$.private$[prop], PRIVATE, INSTANCE);
            }

            // Overridden properties.
            if (definition.instance$.private$.override$) {
                throw new Error('Illegal attempt to override private properties by class ' + name);
            }
        }
    }

    // Define constructor.
    BaseConstructor = function () {
    };

    if (!meta.type$ || meta.type$ === class$.PUBLIC || meta.type$ === (class$.PUBLIC | class$.FINAL)) {

        Constructor = function () {
            BaseConstructor.call(this);
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
