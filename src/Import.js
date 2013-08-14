/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:34 AM
 */


var Import,
    ImportUtils;


ImportUtils = {

    queuedImports: [],

    httpGet: function (url, successHandler, failureHandler) {
        console.log('httpGet', url);
    }

};


Import = function (path) {
    ImportUtils.httpGet(path);
};


/**
 * Exports
 * @type {Function}
 */
window.Import = Import;