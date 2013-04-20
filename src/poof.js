(function (window) {

//    'use strict';
    var poofConfig,
        poofPriv,
        Object,
        Poof,
        Package,
        Import,
        Class,
        ClassDefinition,
        Utils;

    /*
     Object class
     */
    Object = function () {

        this.handlers = {};
        this.options = {};

    };

    Object.prototype = {

        on: function (eventType, handler, one) {

            this.handlers[eventType] = this.handlers[eventType] || [];

            if (this.handlers[eventType].indexOf(handler) === -1) {

                this.handlers[eventType].push(handler);
                this.options[eventType] = this.options[eventType] || {};
                this.options[eventType][handler] = {one: one === true};

            }

        },

        one: function (eventType, handler) {

            this.on(eventType, handler, true);

        },

        off: function (eventType, handler) {

            var handlerIndex;

            if (this.handlers[eventType] !== undefined) {

                if (handler === undefined) {

                    this.handlers[eventType] = [];
                    this.options[eventType] = {};

                } else {

                    handlerIndex = this.handlers[eventType].indexOf(handler);
                    if (handlerIndex !== -1) {

                        delete this.options[eventType][this.handlers[eventType][handlerIndex]];
                        this.handlers[eventType].splice(handlerIndex, 1);

                    }

                }

            }

        },

        dispatch: function (eventType, data) {

            var self = this, i, toOff = [], toDispatch = [];

            if (this.handlers[eventType] !== undefined) {

                for (i = 0; i < this.handlers[eventType].length; ++i) {

                    toDispatch.push(self.handlers[eventType][i]);

                    if (this.options[eventType][this.handlers[eventType][i]].one) {

                        toOff.push({eventType: eventType, handler: this.handlers[eventType][i]});

                    }

                }

                for (i = 0; i < toOff.length; ++i) {

                    this.off(toOff[i].eventType, toOff[i].handler);

                }

                if (data === undefined) {

                    for (i = 0; i < toDispatch.length; ++i) {

                        toDispatch[i]();

                    }

                } else {

                    for (i = 0; i < toDispatch.length; ++i) {

                        toDispatch[i](data);

                    }

                }

            }

        }

    };

    /*
     Poof class
     */
    Poof = function () {

        var config, priv, exportClasses;

        config = {

            scope: Poof,
            root: '',
            extension: '.js'

        };

        priv = {

            exportClasses: function (scope) {

                scope.Object = Object;
                scope.Package = Package;
                scope.Import = Import;
                scope.Class = Class;

            },

            packages: {

                initialisationQueue: [],
                exceptionalInitialisationAllowed: false,
                expectedName: null,

                addToInitialisationQueue: function (initObject) {

                    poofPriv.packages.initialisationQueue.push(initObject);

                },

                tryInitialisingNext: function () {

                    if (poofPriv.packages.initialisationQueue.length === 1 || (poofPriv.packages.exceptionalInitialisationAllowed && poofPriv.packages.initialisationQueue.length !== 0)) {

                        var initObject = poofPriv.packages.initialisationQueue[poofPriv.packages.exceptionalInitialisationAllowed ? (poofPriv.packages.initialisationQueue.length - 1) : 0];
                        poofPriv.packages.exceptionalInitialisationAllowed = false;

                        setTimeout(function () {

                            initObject.initialiser();

                        }, 0);

                    }

                },

                onInitialised: function (initObject) {

                    poofPriv.packages.initialisationQueue.splice(poofPriv.packages.initialisationQueue.indexOf(initObject), 1);
                    window.Poof.dispatch('packageReady_' + initObject.name + '.' + initObject.classes[0].name);

                }

            },

            classes: {

                expectedName: null,
                beingDefined: false,

                register: function (name, classObject) {

                    if (poofConfig.scope[name]) {

                        if (poofConfig.scope[name].__proto__ === [].__proto__) {

                            poofConfig.scope[name].push(classObject);

                        } else {

                            poofConfig.scope[name] = [poofConfig.scope[name], classObject];

                        }

                    } else {

                        poofConfig.scope[name] = classObject;

                    }

                },

                transcribers: [

                /**
                 * Function transcriber
                 * Transcribes functions adding a __class__ property to them which allows determining scope later.
                 */
                    {
                        test: function (name, scope, definition, constructor) {

                            return typeof definition[name] === 'function';

                        },

                        transcribe: function (name, scope, definition, constructor) {

                            scope[name] = definition[name];
                            scope[name].__class__ = constructor;

                        }
                    },

                /**
                 * Private and protected transcriber
                 * Transcribes private and protected members.
                 */
                    {
                        test: function (name, scope, definition, constructor) {

                            return name.match(/^_[_]?[a-zA-Z]+/) != null;

                        },

                        transcribe: function (name, scope, definition, constructor) {

                            var isPrivate = name.charAt(1) === '_'; // TODO: implement protected methods

                            var generateGetter = function (value) {

                                return function getter () {

                                    if (getter.caller.__class__ === constructor || poofPriv.classes.beingDefined) {

                                        return value;

                                    } else {

                                        throw new Error('Illegal attempt to access ' + (isPrivate ? 'private' : 'protected') + ' member \'' + name + '\'');

                                    }

                                };

                            };

                            function setter (value) {

                                if (setter.caller.__class__ === constructor || poofPriv.classes.beingDefined) {

                                    scope.__defineGetter__(name, generateGetter(value));

                                } else {

                                    throw new Error('Illegal attempt to access private member \'' + name + '\'');

                                }

                            };

                            scope.__defineGetter__(name, generateGetter(definition[name]));
                            scope.__defineSetter__(name, setter);

                        }
                    },

                /**
                 * Default transcriber
                 * Transcribes whatever is left.
                 */
                    {
                        test: function (name, scope, definition, constructor) {

                            return true;

                        },

                        transcribe: function(name, scope, definition, constructor) {

                            scope[name] = definition[name];

                        }
                    },

                /**
                 * Constant transcriber
                 * Transcribes constants.
                 */
                    {
                        test: function (name, scope, definition) {

                            return name.toUpperCase() === name;

                        },

                        transcribe: function(name, scope, definition) {

                            var value = definition[name];

                            scope.__defineGetter__(name, function () {

                                return value;

                            });

                            scope.__defineSetter__(name, function (value) {

                                throw new Error('Illegal attempt to alter constant variable \'' + name + '\'');

                            });

                        }
                    }

                ]

            }

        };

        this.configure = function (options) {

            config = Utils.extend(config, options);
            poofConfig = config;
            poofPriv.exportClasses(poofConfig.scope);

        };

        poofConfig = config;
        poofPriv = priv;

    };

    Poof.prototype = {

        Utils: {

            extend: function (object1, object2, options) {

                options = options || {};

                var field,
                    ignore = options.ignore || [],
                    wrapper = options.wrapper || function (value) {
                        return value;
                    },
                    inPlace = options.inPlace || false,
                    extendedObject = inPlace ? object1 : {};

                if (!inPlace) {

                    for (field in object1) {

                        extendedObject[field] = wrapper(object1[field]);

                    }

                }

                for (field in object2) {

                    if (ignore.indexOf(field) === -1) {

                        extendedObject[field] = wrapper(object2[field]);

                    }
                }

                return extendedObject;

            }

        }

    };

    Poof.prototype = Poof.prototype.Utils.extend(new Object(), Poof.prototype, {inPlace: true});
    Poof.prototype.constructor = Poof;

    /*
     Package class
     */
    Package = function (name, contents) {

        var define, init, analyseComponents, importDependencies, importNextDependency, onDependencyImportComplete, register, initClasses, imports = [], classDefinitions = [], currentDependencyImportIndex = -1, eventDispatcher = new Object(), initObject, packageObject;

        if (poofPriv.packages.expectedName && name !== poofPriv.packages.expectedName) {

            throw ('Invalid package name ' + name + '. Expected ' + poofPriv.packages.expectedName + '.');

        }

        define = function () {

            poofPriv.packages.expectedName = null;
            initObject = {name: name, classes: classDefinitions, initialiser: init};
            poofPriv.packages.addToInitialisationQueue(initObject);
            poofPriv.packages.tryInitialisingNext();

        };

        init = function () {

            analyseComponents(contents);
            importDependencies(function () {

                register();
                initClasses();

            });

        };

        analyseComponents = function (contents) {

            var i;

            for (i = 0; i < contents.length; ++i) {

                switch (contents[i].__proto__) {

                    case Import.prototype:
                        imports.push(contents[i]);
                        break;

                    case ClassDefinition.prototype:
                        classDefinitions.push(contents[i]);
                        break;

                }

            }

        };

        importDependencies = function (handler) {

            eventDispatcher.one('allDependenciesImportComplete', handler);
            importNextDependency();

        };

        importNextDependency = function () {

            if (++currentDependencyImportIndex >= imports.length) {

                eventDispatcher.dispatch('allDependenciesImportComplete');

            } else {

                var importObject = imports[currentDependencyImportIndex];

                importObject.one(Import.EVENT_COMPLETE, function () {

                    onDependencyImportComplete();

                });

                importObject.execute();

            }

        };

        onDependencyImportComplete = function () {

            importNextDependency();

        };

        register = function () {

            var nameComponents = name.split('.'),
                holder = poofConfig.scope,
                packageName = '',
                i;

            for (i = 0; i < nameComponents.length; ++i) {

                packageName += (i === 0 ? '' : '.') + nameComponents[i];

                if (holder[nameComponents[i]] === undefined) {

                    holder[nameComponents[i]] = new Package(packageName);

                }

                packageObject = holder = holder[nameComponents[i]];

            }

        };

        initClasses = function () {

            var i, classObject;
            console.log(name, classDefinitions[0].name, 'all dependencies imported, initialising classes');
            for(i = 0; i < classDefinitions.length; ++i) {

                classObject = new Class(classDefinitions[i].name, classDefinitions[i].options, classDefinitions[i].definition);
                packageObject[classObject.name] = classObject.constructor;
                poofPriv.classes.register(classObject.name, packageObject[classObject.name]);

            }

            poofPriv.packages.onInitialised(initObject);

        };

        if (this instanceof Package) {

            /* constructor */
            Object.call(this);

            this.name = name;

        } else {

            /* function call */
            console.log('\t[P] initialising package', name);
            define();

        }

    };

    Package.prototype = Poof.prototype.Utils.extend(new Object(), {

    }, {inPlace: true});
    Package.prototype.constructor = Package;

    /*
     Class Definition class
     */
    ClassDefinition = function (name, options, definition) {

        if (poofPriv.classes.expectedName && poofPriv.classes.expectedName !== name) {

            throw new Error('Invalid class name ' + name + '. Expected ' + poofPriv.classes.expectedName + '.');

        }

        this.name = name;
        this.options = options;
        this.definition = definition;

        poofPriv.classes.expectedName = null;

    };

    /*
     Class class
     */
    Class = function (name, options, definition) {

        if (this instanceof Class) {

            var self = this, define, setType, shouldTranscribeMember, getScopeForMember, transcribeMember, extend, constructor;

            define = function(definition) {

                constructor = definition[name] || function() {};
                self.constructor = constructor;

            };

            setType = function(type) {

            };

            shouldTranscribeMember = function (memberName) {

                return memberName !== name;

            };

            getScopeForMember = function (memberName) {

                return typeof definition[memberName] === 'function' ? constructor.prototype : constructor.prototype;    // TODO: make sure variables are re-set for each instance. Either constructor or something here.

            };

            transcribeMember = function (memberName, scope) {

                var i;

                for (i = 0; i < poofPriv.classes.transcribers.length; ++i) {

                    if (poofPriv.classes.transcribers[i].test(memberName, scope, definition, constructor)) {

                        poofPriv.classes.transcribers[i].transcribe(memberName, scope, definition, constructor);

                    }

                }

            };

            extend = function(baseClassName) {

                var baseClass = Class.getByName(baseClassName) || Object,
                    memberName;

                constructor.prototype = new baseClass();
                constructor.prototype.constructor = constructor;

                for (memberName in definition) {

                    if (shouldTranscribeMember(memberName)) {

                        transcribeMember(memberName, getScopeForMember(memberName));

                    }

                }

            };

            /* constructor */
            Object.call(this);

            this.name = name;
            poofPriv.classes.beingDefined = true;
            define(definition);
            setType(options.type);
            extend(options.extend);
            poofPriv.classes.beingDefined = false;

        } else {

            /* function call */
            console.log('\t\t[C] defining class', name);
            return new ClassDefinition(name, options, definition);

        }

    };

    Class.prototype = Poof.prototype.Utils.extend(new Object(), {

        name: null,
        qualifiedName: null,
        packageName: null,
        packageObject: null,
        constructor: null

    }, {inPlace: true});
    Class.prototype.constructor = Class;

    Class.getByName = function (name) {

        if(!name) {

            return undefined;

        }

        if(name.indexOf('.') === -1) {

            return poofConfig.scope[name];

        } else {

            var nameComponents = name.split('.'),
                classObject = poofConfig.scope,
                i;

            for (i = 0; i < nameComponents.length; ++i) {

                classObject = classObject[nameComponents[i]];

                if (!classObject) {

                    return undefined;

                }

            }

            return classObject;

        }

    };

    Class.PUBLIC = 0x001;
    Class.ABSTRACT = 0x010;
    Class.SINGLETON = 0x100;

    /*
     Import class
     */
    Import = function (resource, preventCaching) {

        if (this instanceof Import) {

            /* constructor */
            Object.call(this);

            this.type = null;
            this.url = null;
            this.packageName = null;
            this.className = null;
            this.preventCaching = preventCaching;

            this.resolveInfo(resource);

        } else {

            /* function call */
            return new Import(resource, preventCaching);

        }

    };

    Import.prototype = Poof.prototype.Utils.extend(new Object(), {

        type: null,
        url: null,
        packageName: null,
        className: null,

        resolveInfo: function (resource) {

            this.type = resource.indexOf('/') === -1 ? Import.TYPE_CLASS : Import.TYPE_OTHER;
            this.url = this.type === Import.TYPE_CLASS ? (poofConfig.root + ((poofConfig.root !== '' && poofConfig.root.substr(poofConfig.root.length - 1, 1) !== '/') ? '/' : '') + resource.replace(/\./g, '/') + poofConfig.extension) : resource;
            this.packageName = this.type === Import.TYPE_CLASS ? resource.substring(0, resource.lastIndexOf('.')) : null;
            this.className = this.type === Import.TYPE_CLASS ? resource.substring(resource.lastIndexOf('.') + 1, resource.length) : null;

        },

        execute: function () {

            var self = this, script, head, loadHandler;

            loadHandler = function () {

                script.onload = null;
                script.onreadystatechange = null;

                if (self.type === Import.TYPE_CLASS) {

                    /*
                     Check whether the imported file contained any package definition.
                     Package definition clears the expectedName variable.
                     Checking against correct package name is handled within the package definition itself.
                     */
                    if (poofPriv.packages.expectedName) {

                        throw ('Imported class file ' + self.url + ' did not contain expected package definition.');

                    }

                    /*
                     Check whether the imported file contained any class definition.
                     Class definition clears the expectedName variable.
                     Checking against correct class name is handled within the class definition itself.
                     */
                    if (poofPriv.classes.expectedName) {

                        throw ('Imported class file ' + self.url + ' did not contain expected class definition.');

                    }

                    /*
                     The Import does not dispatch completion event for classes immediately after the file is loaded.
                     It has to wait for the class to finish loading its dependencies.
                     */

                } else {

                    /*
                     Only non-class imports dispatch completion event after they're loaded.
                     Classes may have dependency imports only after which are completed, the class itself
                     can dispatch completion event.
                     */
                    self.dispatch(Import.EVENT_COMPLETE);

                }

            };

            /*
             Set up the script element
             */
            script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', this.url + (this.preventCaching ? ('?t=' + new Date().getTime()) : ''));

            /*
             Add script load completion listeners
             */
            script.onload = loadHandler;
            script.onreadystatechange = function () {

                if (this.readyState === 'complete') {

                    loadHandler();

                }

            };

            /*
             Distinguish between loading a class and any other dependency file
             */
            if (this.type === Import.TYPE_CLASS) {

                poofPriv.packages.exceptionalInitialisationAllowed = true;
                poofPriv.packages.expectedName = self.packageName;
                poofPriv.classes.expectedName = self.className;

                window.Poof.one('packageReady_' + self.packageName + '.' + self.className, function () {

                    self.dispatch(Import.EVENT_COMPLETE);

                });

            } else {

                poofPriv.packages.expectedName = null;
                poofPriv.classes.expectedName = null;

            }

            console.log('[I] importing', this.url);
            /*
             Load the file
             */
            head = document.getElementsByTagName('head')[0];
            head.insertBefore(script, head.firstChild);

        }


    }, {inPlace: true});
    Import.prototype.constructor = Import;

    Import.TYPE_OTHER = 'other';
    Import.TYPE_CLASS = 'class';
    Import.EVENT_COMPLETE = 'complete';

    /* Exports */
    window.Poof = new Poof();
    poofPriv.exportClasses(Poof.prototype);

    /* Minification enabler and shortcuts */
    Utils = window.Poof.Utils;

}(window));
