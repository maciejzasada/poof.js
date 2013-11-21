/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 7/4/13
 * Time: 12:34 AM
 */


/**
 * Import
 */
var import$,
    importUtils;


/**
 * Internal Import utility functions
 */
importUtils = {

    resourcesByPath: {},
    constructorsByPath: {},
    handlersByPath: {},
    importTimeoutId: -1,
    queue: [],
    dependentByDependencies: {},
    dependenciesByDependent: {},
    callbacks: {},

    getResourceReference: function (path) {

        return this.resourcesByPath[path];

    },

    createReference: function (path) {

        switch (this.guessResourceType(path)) {

            case 'class':
                return this.createClassReference(path);

            case 'script':
                break;

            case 'image':
                break;

            case 'other':
                return {};

        }

    },

    guessResourceType: function (path) {

        if (!!path.match('\\.[A-Z]+.*$')) {
            return 'class';
        } else if (!!path.match('.+\\.js$')) {
            return 'script';
        } else if (!!path.match('.+\\.[jpg|jpeg|png]$')) {
            return 'image';
        } else {
            return 'other';
        }

    },

    registerDependent: function (ref, dependencies) {

        var i;

        ref.ready$ = false;

        ref.onReady$ = function (callback) {
            console.log('registering onReady$ callback');
            if (typeof callback === 'function') {
                if (ref.ready$) {
                    callback();
                } else {
                    importUtils.callbacks[ref] = importUtils.callbacks[ref] || [];
                    if (importUtils.callbacks[ref].indexOf(callback) === -1) {
                        importUtils.callbacks[ref].push(callback);
                    }
                }
            }
        };

        for (i = 0; i < dependencies.length; ++i) {
            this.dependentByDependencies[dependencies[i]] = this.dependentByDependencies[dependencies[i]] || [];
            this.dependentByDependencies[dependencies[i]].push(ref);
        }

        this.dependenciesByDependent[ref] = dependencies;

    },

    notifyReady: function (ref) {

        // TODO: implement
        console.log('[READY]', ref);

    },

    createClassReference: function (path) {

        var ref;

        // Create a temporary constructor until one is defined.
        this.constructorsByPath[path] = this.createTemporaryConstructor();
        this.handlersByPath[path] = this.handlersByPath[path] || [];

        ref = function () {
            // As we do not know the constructor body yet, we need to call it by a dynamic reference so we can override it later with actual implementation.
            importUtils.constructorsByPath[path].apply(this, arguments);
        };

        ref.onReady$ = function (callback) {
            console.log('registering callback for', path);
            this.handlersByPath[path].push(callback);
        };

        return ref;

    },

    createTemporaryConstructor: function () {

        return function () {
            throw new Error('Class not ready yet.');
        };

    },

    add: function (path, ref, callback) {

        this.queue.push({path: path, ref: ref, callback: callback});

    },

    resolveUrl: function (path) {

        return path.indexOf('/') === -1 ? (CONFIG.ROOT + path.split(CONFIG.CLASS_EXTENSION)[0].replace(/\./g, '/') + CONFIG.CLASS_EXTENSION) : path;

    },

    load: function (path, callback) {

        switch (this.guessResourceType(path)) {

            case 'class':
                console.log('loading class');
            case 'script':
                console.log('loading script', path);
                break;

            case 'image':
                break;

            case 'other':
                break;

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
            callback;

        if (this.queue.length !== 0) {

            resource = this.queue.splice(0, 1)[0];
            callback = function () {
                self.onImportComplete();
                if (typeof resource.callback === 'function') {
                    resource.callback();
                }
            };

            this.load(resource.path, callback);

        }

    }

};


/**
 * import$
 * @param path
 * @constructor
 */
import$ = function (path, callback) {

    var ref = importUtils.getResourceReference(path);

    // Check whether this resource has already been imported. If yes, simply return a reference to it.
    if (ref) {

        // TODO: check if it is imported and if yes, invoke the callback

    } else {

        console.log('Importing');
        // Create a temporary reference to the imported resource.
        ref = importUtils.createReference(path);

        // Add the path to import queue.
        importUtils.add(path, ref, callback);

        // Execute the import.
        importUtils.run();

    }

    return ref;

};


/**
 * Exports
 * @type {Function}
 */
module.exports.import$ = import$;
