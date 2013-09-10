poof.js
=======

[![Build Status](https://travis-ci.org/maciejzasada/poof.js.png)](https://travis-ci.org/maciejzasada/poof.js)

### JavaScript Programmer's Object Oriented Framework. ###

### Version info ###
Current version: 0.4.1 (RC)
Release date: 2013/09/02
Version authors: Maciej Zasada ([@maciejzasada](https://twitter.com/maciejzasada))  
Original author: Maciej Zasada ([@maciejzasada](https://twitter.com/maciejzasada))  

### Description ###
Poof is a lightweight framework that transforms JavaScript into a truly object-oriented language with clean and familiar syntax.
It also enforces good programming style thanks to the proposed pattern.
Poof works at runtime - it does not require compilation. Yet, it stays fast and does not slow down the website.

In particular, Poof provides:
* dependency imports
* classes
* interfaces
* public members
* private members
* protected members
* instance and static members
* constants
* abstract classes
* Singleton classes
* final classes
* runtime error checking

### Example code using poof.js ###
```javascript
var SomeOtherClass = import$('package.sub.SomeOtherClass'),
    IInterfaceOne = import$('another.package.IInterfaceOne'),
    IInterfaceTwo = import$('another.package.IInterfaceTwo');
    
var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: SomeOtherClass, implements$: [IInterfaceOne, IInterfaceTwo]}, {
    static$: {
        public$: {
            publicVar: 'public',
            publicMethod: function () {
                return TestClass.privateVar;
            }
        },
        protected$: {
            protectedVar: 'protected'
        },
        private$: {
            privateVar: 'private'
        }
    },
    instance$: {
        public$: {
            publicVar: 'public',
            publicMethod: function () {
                return this.privateVar;
            }
        },
        protected$: {
            protectedVar: 'protected'
        },
        private$: {
            privateVar: 'private'
        }
    }
});
```

### dev vs prod ###
There are two versions of poof.js. Dev and prod.
* dev: this version performs sanity checks on the code. It will notify, for example, whether there is an attempt to access a private member from outside the class or if there is an attempt to implicitly override a method already defined in the base class.
* prod: this version skips all the verification steps and just makes your code work. For use in production.

### Revision history ###
2013/09/02 - **v. 0.4.1**
* finalised syntax, dev implementation 99%, unit tests 80%, benchmarks 20%, prod implementation 0%

2013/04/20 - **v. 0.2.1**
* started work on Beta version, from scratch (not using anything from version 0.1 (Alpha))
