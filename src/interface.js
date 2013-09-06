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
