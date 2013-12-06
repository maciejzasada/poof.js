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
    importUtils,
    currentLoadPath = null;


/**
 * Internal Import utility functions
 */
importUtils = {

    resourcesByPath: {},
    constructorsByPath: {},
    handlersByPath: {},
    importTimeoutId: -1,
    queue: [],
    callbacks: {},

    getResourceReference: function (path) {

        return this.resourcesByPath[path];

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
    
    createClassReference: function (path) {

        var ref,
            id = refIdSeed++;

        // Create a temporary constructor until one is defined.
        this.constructorsByPath[path] = this.createTemporaryConstructor();
        this.handlersByPath[path] = this.handlersByPath[path] || [];

        ref = function () {
            // As we do not know the constructor body yet, we need to call it by a dynamic reference so we can override it later with actual implementation.
            importUtils.constructorsByPath[path].apply(this, arguments);
        };

        ref.onReady$ = importUtils.generateOnReadyHandler(ref);
        
        ref.toString = function () {
            return '[Import @' + id + ']';
        };
        
        ref.__defineGetter__('id$', function () {
            return id;
        });
        
        ref.__defineGetter__('path$', function () {
            return path;
        });
        
        this.resourcesByPath[path] = ref;

        return ref;

    },
    
    createTemporaryConstructor: function () {

        return function () {
            throw new Error('Class not ready yet.');
        };

    },
    
    generateOnReadyHandler: function (ref) {
        return function (callback) {
            if (typeof callback === 'function') {
                if (ref.ready$) {
                    callback();
                } else {
                    importUtils.callbacks[ref.id$] = importUtils.callbacks[ref.id$] || [];
                    if (importUtils.callbacks[ref.id$].indexOf(callback) === -1) {
                        importUtils.callbacks[ref.id$].push(callback);
                    }
                }
            }
        };
    },

    registerDependent: function (ref, dependencies) {

        var i,
            numDependenciesLeft = dependencies.length,
            onDependendyLoaded = function () {
                if (--numDependenciesLeft <= 0) {
                    importUtils.notifyReady(ref);
                }
            };

        ref.__defineGetter__('ready$', function () {
            return false;
        });

        ref.onReady$ = importUtils.generateOnReadyHandler(ref);

        if (dependencies.length === 0) {
            throw new Error('This should never happen');
        } else {
            for (i = 0; i < dependencies.length; ++i) {
                dependencies[i].onReady$(onDependendyLoaded);
            }
        }

    },

    notifyReady: function (ref) {

        var i;
        
        if (ref.ready$) {
            return;
        }
        
        if (currentLoadPath) {
            importUtils.constructorsByPath[currentLoadPath] = function () {};
            currentLoadPath = null;
        }
        
        ref.__defineGetter__('ready$', function () {
            return true;
        });
        
        if (importUtils.callbacks[ref.id$]) {
            for (i = 0; i < importUtils.callbacks[ref.id$].length; ++i) {
                if (typeof importUtils.callbacks[ref.id$][i] === 'function') {
                    importUtils.callbacks[ref.id$][i]();
                }
            }
        }

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
                var url = path.replace(/\./g, '/') + '.js';
                this.xhr(url, callback);
                break;
            case 'script':
                break;

            case 'image':
                break;

            case 'other':
                break;

        }

    },
    
    xhr: function (url, callback) {
        var xobj = new XMLHttpRequest();
        // xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == '200') {
                if (typeof callback === 'function') {
                    callback(xobj.responseText);
                }
            }
        }.bind(this);
        xobj.send(null);
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
            callback = function (script) {
                currentLoadPath = resource.path;
                eval(script);
                importUtils.notifyReady(resource.ref);
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
