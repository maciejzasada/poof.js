POOF.js [![Build Status](https://travis-ci.org/maciejzasada/poof.js.png?branch=master)](http://travis-ci.org/maciejzasada/poof.js)
===

###Professional Object Oriented Framework for web JavaScript and Node.js###
***POOF.js is a step towards higher quality, faster, cleaner and more maintainable JavaScript object-oriented code.***

===

### About
POOF.js is not a new language. It does not require compilation. It is a JavaScript framework providing advanced, powerful and highly efficient features known from other object-oriented languages like Java or C#, such as classes, interfaces, inheritance, accessibility specifiers, constants, static fields and many more. It enforces a clean syntax to help keeping the code maintainable even when large team works on it and provides runtime error checking for those who don't obey.

### Release info
POOF.js is currently in Alpha stage. It has gone through numerous iterations and all its functionality is implemented. It is not recommended to be used on projects with strict deadline yet until it goes Beta, but it is surely high time for all developers to start getting familiar with it.

### Links
Official website: [www.poofjs.org](http://www.poofjs.org)  
Download (dev): [poof-dev.min.js](https://raw.github.com/maciejzasada/poof.js/master/build/dev/poof-dev.min.js)  
Download (prod): [poof.min.js](https://raw.github.com/maciejzasada/poof.js/master/build/prod/poof.min.js)  

### Contact
Maciej Zasada <[hello@maciejzasada.com](mailto:hello@maciejzasada.com)>

===


Table of contents
---

- [Documentation](#documentation)
    - [class$](#class)
    - [interface$](#interface)
    - [import$](#import)
    - [p.js optimizer](#pjs-optimizer)
- [Examples](#examples)
    - [Defining classes](#defining-classes)
    - [Using constructors](#using-constructors)
    - [Defining instance fields](#defining-instance-fields)
    - [Defining static fields](#defining-static-fields)
    - [Using accessibility specifiers](#using-accessibility-specifiers)
    - [Defining constants](#defining-constants)
    - [Extending classes](#extending-classes)
    - [Overriding methods](#overriding-methods)
    - [Defining Final classes](#defining-final-classes)
    - [Defining Abstract classes](#defining-abstract-classes)
    - [Defining Singleton classes](#defining-singleton-classes)
    - [Defining interfaces](#defining-interfaces)
    - [Implementing interfaces](#implementing-interfaces)
    - [Using RequireJS](#using-requirejs)


Documentation
---

### class$
```javascript
class$(name, options, definition);
```

---

**name**: *string*, required  
Specifies class name. Should begin with capital letter. Should only contain letters and digits.  

---

**options**: *object*, required  
Class options. Class type, base class, interfaces.  
Structure:  
```javascript
{
    type$: int,
    extends$: class,
    implements$: Array
}
```

***type$***  
Class type. Use one of:
* class$.PUBLIC: *default*, public class
* class$.SINGLETON: Singleton class
* class$.ABSTRACT: abstract class
* class$.FINAL: final class. Can only be used in conjunction with one of the primary types above. E.g. class$.PUBLIC | class$.FINAL

***extends$***  
Reference to base class.

***implements$***  
Array of references to interfaces.

---

**definition**: *object*, required  
Actual class implementation. See examples for more details.  
Structure:
```javascript
{
    static$: {
        public$: {
            override$: {
            }
        },
        protected$: {
            override$: {
            }
        },
        private$: {
            override$: {
            }
        }
    },
    instance$: {
        public$: {
            override$: {
            }
        },
        protected$: {
            override$: {
            }
        },
        private$: {
            override$: {
            }
        }
    }
}
```

***static$***  
Static scope. All methods and properties defined within the *static$* scope will be assigned to the class object.

***instance$***  
Instance scope. All methods and properties defined within the *instance$* scope will be assigned to the instance object.

***public$***  
Public scope. All methods and properties defined within the *public$* scope will be accessible from inside and outside of the class's scope as well as its inheritance chain.

***protected$***  
Protected scope. All methods and properties defined within the *protected$* scope will be accessible from inside and of the class's scope as well as its inheritance chain. They will not be accessible from outside though.

***private$***  
Private scope. All methods and properties defined within the *private$* scope will be accessible only from inside of the class's scope.

---

### interface$
```javascript
interface$(name, definition);
```

---

**name**: *string*, required  
Specifies interface name. Should begin with capital 'I'. Should only contain letters and digits.  

---

**definition**: *object*, required  
Actual interface definition. See examples for more details.  
Structure:
```javascript
{
    methodOne: function () {
    },
    methodTwo: function (arg1, arg2) {
    }
}
```

---

### import$
Import dependency classes and interfaces.  
**WIP. We recommend using RequireJS for now.**

### p.js optimizer
Concatenates, minifies and optimises imported files into one.  
**Soon available!**


Examples
---

### Defining classes
Create new instances of defined class.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC}, {
});

var instance = new ClassName();
```

### Using constructors
A public instance method named by the class will become the class's constructor.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC}, {
    instance$: {
        public$: {
            ClassName: function () {
                // constructor
            }
        }
    }
});
```

### Defining instance fields
Instance fields are being defined within the *instance$* scope.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC}, {
    instance$: {
        public$: {
            iBelongToInstance: function () {
            }
        }
    }
});

var instance = new ClassName();
instance.iBelongToInstance();
```

### Defining static fields
Static fields are being defined within the *static$* scope.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC}, {
    static$: {
        public$: {
            iBelongToTheClass: function () {
            }
        }
    }
});

ClassName.iBelongToTheClass();
```

### Using accessibility specifiers
Have full control over your methods and properties thanks to accessibility specifiers.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC}, {
    static$: {
        public$: {
            iAmAPublicField: 'public',
            iAmPublic: function () {
                // public
            }
        },
        protected$: {
            iAmAProtectedField: 'protected',
            iAmProtected: function () {
                // protected
            }
        },
        private$: {
            iAmAPrivateField: 'private',
            iAmPrivate: function () {
                // private
            }
        }
    },
    instance$: {
        public$: {
            iAmAPublicField: 'public',
            iAmPublic: function () {
                // public
            }
        },
        protected$: {
            iAmAProtectedField: 'protected',
            iAmProtected: function () {
                // protected
            }
        },
        private$: {
            iAmAPrivateField: 'private',
            iAmPrivate: function () {
                // private
            }
        }
    }
});
```

### Defining constants
Any variable named with only upper-case-with-underscores name will be considered constant.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC}, {
    instance$: {
        public$: {
            I_AM_CONSTANT: 'can not change me'
        }
    }
});
```

### Extending classes
Extend from other classes.
```javascript
var BaseClass = class$('BaseClass', {type$: class$.PUBLIC}, {
    instance$: {
        public$: {
            iBelongToBaseClass: function () {
            }
        }
    }
});

var SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass}, {
});

var instance = new SubClass();
instance.iBelongToBaseClass();
```

### Overriding methods
Methods have to be overridden explicitly. Attempts to override a method implicitly will result in an error.
Implementations from the base class can be accessed via *public$* reference on the method itself.
```javascript
var BaseClass = class$('BaseClass', {type$: class$.PUBLIC}, {
    instance$: {
        public$: {
            iBelongToBaseClass: function () {
            }
        }
    }
});

var SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass}, {
    instance$: {
        public$: {
            override$: {
                iBelongToBaseClass: function () {
                    // explicit override
                    this.iBelongToBaseClass.super$();   // call super
                }
            }
        }
});

var instance = new SubClass();
instance.iBelongToBaseClass();
```

### Defining Final classes
Final classes cannot be extended.
```javascript
var ClassName = class$('ClassName', {type$: class$.PUBLIC | class$.FINAL}, {
});
```

### Defining Abstract classes
Abstract classes can only be extended, but cannot be instantiated directly.
```javascript
var ClassName = class$('ClassName', {type$: class$.ABSTRACT}, {
});
```

### Defining Singleton classes
Singleton classes have only one instance across your entire application. They cannot be instantiated directly. Instead, *instance* field is used to reference the class's instance.
```javascript
var ClassName = class$('ClassName', {type$: class$.SINGLETON}, {
});

var instance = ClassName.instance;
```

### Defining interfaces
You can define interfaces in the following way.
```javascript
var IInterface = interface$('IInterface', {
    methodOne: function (arg1, arg2) {
    },
    methodTwo: function () {
    }
});
```

### Implementing interfaces.
Use interfaces to enable class definition validation against missing methods.
```javascript
var IInterface = interface$('IInterface', {
    methodOne: function (arg1, arg2) {
    },
    methodTwo: function () {
    }
});

var ClassName = class$('ClassName', {type$: class$.PUBLIC, implements$: [IInterface]}, {
    instance$: {
        public$: {
            methodOne: function (arg1, arg2) {
            },
            methodTwo: function (arg2, arg2) {
            }
        }
    }
});
```

### Using RequireJS
You can use POOF.js with RequireJS very easily.
```javascript
define([], function () {
    var BaseClass = class$('BaseClass', {type$: class$.PUBLIC}, {
    });
    
    return BaseClass;
});

define(['BaseClass'], function (BaseClass) {
    var SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass}, {
    });
    
    return SubClass;
});
```
