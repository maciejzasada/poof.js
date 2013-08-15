/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:34 AM
 */


/**
 * Import
 */
var Import,
    ImportUtils;


/**
 * Internal Import utility functions
 */
ImportUtils = {

    queue: [],
    imported: [],
    importTimeoutId: -1,
    resourcesByPath: {},
    constructorsByPath: {},

    isClassPath: function (path) {

        return !!path.match('.+' + CONFIG.CLASS_EXTENSION + '$');

    },

    resolveUrl: function (path) {

        return path.indexOf('/') === -1 ? (CONFIG.ROOT + path.split(CONFIG.CLASS_EXTENSION)[0].replace(/\./g, '/') + CONFIG.CLASS_EXTENSION) : path;

    },

    httpGet: function (url, script, successHandler, failureHandler) {

        if (script) {

            console.log('import script', url);

        } else {

            console.log('load text', url);

        }
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
            handler;

        if (this.queue.length !== 0) {

            resource = this.queue.splice(0, 1)[0];
            handler = function () {
                self.onImportComplete();
                if (typeof resource.handler === 'function') {
                    resource.handler();
                }
            };

            this.httpGet(resource.isClass ? this.resolveUrl(resource.path) : path, resource.isClass, handler);

        }

    },

    onImportComplete: function () {

    }

};


/**
 * Import
 * @param path
 * @constructor
 */
Import = function (path, handler) {

    var ref = null;

    // Check whether this resource has already been imported. If yes, simply return a reference to it.
    if (ImportUtils.imported.indexOf(path) === -1) {

        // Check if the imported resource most likely is a class.
        if (ImportUtils.isClassPath(path)) {

            // Create a temporary constructor until one is defined.
            ImportUtils.constructorsByPath[path] = function () {
                throw new Error('Class not ready yet.');
            };

            // Create a reference for the class.
            ref = function () {
                // As we do not know the constructor body yet, we need to call it by reference so we can override it later with actual implementation.
                ImportUtils.constructorsByPath[path].apply(this, arguments);
            };

            // Add the path to import queue.
            ImportUtils.queue.push({path: path, handler: handler, ref: ref, isClass: true});

        } else {

            // Add the path to import queue.
            ImportUtils.queue.push({path: path, handler: handler, ref: ref, isClass: false});

        }

        // Execute the import.
        ImportUtils.run();

    } else {

        // Return existing reference to the resouece.
        ref = ImportUtils.resourcesByPath[path];

    }

    return ref;

};


/**
 * Exports
 * @type {Function}
 */
window.Import = Import;
