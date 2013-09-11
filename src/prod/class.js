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
