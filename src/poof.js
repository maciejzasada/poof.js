/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:54 AM
 */

var Poof = function () {

};

Poof.__defineGetter__('VERSION', function () {
    return parseInt('{{VERSION}}', 10);
});

Poof.__defineGetter__('REVISION', function () {
    return parseInt('{{REVISION}}', 10);
});

Poof.__defineGetter__('BUILD', function () {
    return parseInt('{{BUILD}}', 10);
});

Poof.__defineGetter__('VERSION_STRING', function () {
    return Poof.VERSION + '.' + Poof.REVISION + '.' + Poof.BUILD;
});

Poof.prototype = new PoofObject();