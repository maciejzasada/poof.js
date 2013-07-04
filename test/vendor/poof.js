/**
 * poof.js
 * @author Maciej Zasada maciejzsd@gmail.com
 * @copyright 2013 Maciej Zasada
 * @version 0.3.1
 * @date 2013/07/04 02:37:10
 */

/* ---------- Source: src/PoofObject.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:33 AM
 */

var PoofObject = function () {

};

PoofObject.prototype = {

};

/* ---------- Source: src/Poof.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:54 AM
 */

var Poof = function () {

};

Poof.__defineGetter__('VERSION', function () {
    return parseInt('0', 10);
});

Poof.__defineGetter__('REVISION', function () {
    return parseInt('3', 10);
});

Poof.__defineGetter__('BUILD', function () {
    return parseInt('1', 10);
});

Poof.__defineGetter__('VERSION_STRING', function () {
    return Poof.VERSION + '.' + Poof.REVISION + '.' + Poof.BUILD;
});

Poof.prototype = new PoofObject();

/* ---------- Source: src/Package.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:32 AM
 */

var Package = function () {

};

Package.prototype = new PoofObject();

/* ---------- Source: src/Class.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:34 AM
 */

var Class = function () {

};

Class.prototype = new PoofObject();

/* ---------- Source: src/Import.js ---------- */

/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:34 AM
 */

var Import = function () {

};

Import.prototype = new PoofObject();