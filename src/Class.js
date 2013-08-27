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
