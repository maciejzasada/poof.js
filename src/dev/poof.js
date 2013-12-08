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
    return '{{VERSION_TYPE}}';
});


/**
 * Version number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('VERSION', function () {
    return parseInt('{{VERSION}}', 10);
});


/**
 * Revision number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('REVISION', function () {
    return parseInt('{{REVISION}}', 10);
});


/**
 * Build number,
 * replaced with actual value during build.
 */
poof.__defineGetter__('BUILD', function () {
    return parseInt('{{BUILD}}', 10);
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
