/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 8/26/13
 * Time: 5:58 PM
 */

/*global module, test, asyncTest, expect, ok, equal, import$, class$, interface$, super$ */

(function () {

    'use strict';

    /**
     * Tests simple defining classes.
     */
    function testDefiningClasses() {

        module('Defining classes');

        test('class$ function is accessible', function () {
            equal(typeof class$, 'function');
        });

        test('class$ function accepts three arguments', function () {
            equal(class$.length, 3);
        });

        test('class$ function return type is a function (JavaScript class)', function () {
            var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            });
            equal(typeof TestClass, 'function');
        });

        test('Creating instances of classes using new keyword', function () {
            var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            }),
                instance = new TestClass();
            ok(instance);
            ok(instance instanceof TestClass);
        });

    }

    /**
     * Tests defining instance variables.
     */
    function testDefiningInstanceVariables() {

        module('Defining instance variables');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            instance$: {
                public$: {
                    testVariable1: 'string',
                    testVariable2: 15,
                    testVariable3: true,
                    testVariable4: {some: 'object'}
                }
            }
        });

        test('Instance variables are present on the instance object', function () {
            var instance = new TestClass();
            ok(instance.testVariable1 !== undefined);
            ok(instance.testVariable2 !== undefined);
            ok(instance.testVariable3 !== undefined);
            ok(instance.testVariable4 !== undefined);
        });

    }

    /**
     * Tests defining instance methods.
     */
    function testDefiningInstanceMethods() {

        module('Defining instance methods');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            instance$: {
                public$: {
                    testMethod: function () {
                        return 'correct';
                    }
                }
            }
        });

        test('Instance methods are present on the instance object', function () {
            var instance = new TestClass();
            equal(typeof instance.testMethod, 'function', 'function exists');
            equal(instance.testMethod(), 'correct', 'function returns correct value');
        });

    }

    /**
     * Tests defining static variables.
     */
    function testDefiningStaticVariables() {

        module('Defining static variables');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            static$: {
                public$: {
                    testVariable1: 'string',
                    testVariable2: 15,
                    testVariable3: true,
                    testVariable4: {some: 'object'}
                }
            }
        });

        test('Static variables are present on the class object', function () {
            ok(TestClass.testVariable1 !== undefined);
            ok(TestClass.testVariable2 !== undefined);
            ok(TestClass.testVariable3 !== undefined);
            ok(TestClass.testVariable4 !== undefined);
        });

    }

    /**
     * Tests defining static methods.
     */
    function testDefiningStaticMethods() {

        module('Defining static methods');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            static$: {
                public$: {
                    testMethod: function () {
                        return 'correct';
                    }
                }
            }
        });

        test('Static methods are present on the class object', function () {
            equal(typeof TestClass.testMethod, 'function', 'function exists');
            equal(TestClass.testMethod(), 'correct', 'function returns correct value');
        });

    }

    /**
     * Tests constructors.
     */
    function testConstructors() {

        module('Constructors');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            instance$: {
                public$: {
                    constructorDefinedProperty: 'default',
                    TestClass: function () {
                        this.constructorDefinedProperty = 'constructor';
                    }
                }
            }
        }),
            instance = new TestClass();

        test('Constructor is invoked when instantiating the class', function () {
            equal(instance.constructorDefinedProperty, 'constructor');
        });

    }

    /**
     * Tests default variable value transcription.
     */
    function testDefaultVariableValueTranscription() {

        module('Default variable value transcription');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            static$: {
                public$: {
                    testVariable1: 'string',
                    testVariable2: 15,
                    testVariable3: true,
                    testVariable4: {some: 'object'}
                }
            },
            instance$: {
                public$: {
                    testVariable1: 'string',
                    testVariable2: 15,
                    testVariable3: true,
                    testVariable4: {some: 'object'}
                }
            }
        });

        test('Instance variables maintain value defined as default', function () {
            var instance = new TestClass(),
                instance2;

            instance.testVariable1 = 'modified';
            instance.testVariable2 = 20;
            instance.testVariable3 = false;
            instance.testVariable4 = null;

            instance2 = new TestClass();

            equal(instance2.testVariable1, 'string');
            equal(instance2.testVariable2, 15);
            equal(instance2.testVariable3, true);
            equal(typeof instance2.testVariable4, 'object');
            equal(TestClass.testVariable1, 'string');
            equal(TestClass.testVariable2, 15);
            equal(TestClass.testVariable3, true);
            equal(typeof TestClass.testVariable4, 'object');
        });

    }

    /**
     * Tests constants.
     */
    function testConstants() {

        module('Constants');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            static$: {
                public$: {
                    CONSTANT_ONE: 'string',
                    CONSTANT2: 15,
                    CONSTANT_TH_REE: true,
                    ANOTHER_NAME: {some: 'object'}
                }
            },
            instance$: {
                public$: {
                    CONSTANT_ONE: 'string',
                    CONSTANT2: 15,
                    CONSTANT_TH_REE: true,
                    ANOTHER_NAME: {some: 'object'}
                }
            }
        });

        test('Constants have value assigned during definition.', function () {

            var instance = new TestClass();

            equal(TestClass.CONSTANT_ONE, 'string');
            equal(TestClass.CONSTANT2, 15);
            equal(TestClass.CONSTANT_TH_REE, true);
            equal(typeof TestClass.ANOTHER_NAME, 'object');

            equal(instance.CONSTANT_ONE, 'string');
            equal(instance.CONSTANT2, 15);
            equal(instance.CONSTANT_TH_REE, true);
            equal(typeof instance.ANOTHER_NAME, 'object');

        });

        test('Trying to change value of a constant results in exception being thrown', function () {

            var instance = new TestClass();

            try {
                TestClass.CONSTANT_ONE = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                TestClass.CONSTANT2 = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                TestClass.CONSTANT_TH_REE = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                TestClass.ANOTHER_NAME = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                instance.CONSTANT_ONE = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                instance.CONSTANT2 = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                instance.CONSTANT_TH_REE = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

            try {
                instance.ANOTHER_NAME = null;
                ok(false, 'Exception not raised when trying to change value of a constant');
            } catch (e) {
                ok(true, 'Exception raised when trying to change value of a constant.');
            }

        });

    }

    /**
     * Tests member accessibility implementation.
     */
    function testMemberAccessibility() {

        module('Accessibility implementation');

        var TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
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

        test('Public variables accessible', function () {
            var instance = new TestClass();
            equal(TestClass.publicVar, 'public');
            equal(instance.publicVar, 'public');
        });

        test('Accessing protected members from outside the class', function () {
            var instance = new TestClass();
            equal(TestClass.protectedVar, undefined);
            equal(instance.protectedVar, undefined);
        });

        test('Accessing private members from outside the class', function () {
            var instance = new TestClass();
            equal(TestClass.privateVar, undefined);
            equal(instance.privateVar, undefined);
        });

        test('Accessing private members from within the class', function () {
            var instance = new TestClass();
            equal(TestClass.publicMethod(), 'private');
            equal(instance.publicMethod(), 'private');
        });

    }

    /**
     * Tests defining interfaces.
     */
    function testDefiningInterfaces() {

        module('Defining interfaces');

        test('interface$ function is accessible', function () {
            equal(typeof interface$, 'function');
        });

        test('interface$ function accepts two arguments', function () {
            equal(interface$.length, 2);
        });

        test('interface$ function return type is an array', function () {
            var TestInterface = interface$('TestInterface', {
            });
            equal(Object.prototype.toString.call(TestInterface), '[object Array]');
        });

    }

    /**
     * Tests implementing interfaces.
     */
    function testImplementingInterfaces() {

        module('Implementing interfaces');

        var TestInterface = interface$('TestInterface', {
            methodOne: function () {
                return [];
            },
            methodTwo: function (arg1, arg2) {
                return [arg1, arg2];
            }
        });

        test('Possible to implement interface', function () {
            var TestClass;

            try {
                TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: [TestInterface]}, {
                    instance$: {
                        public$: {
                            methodOne: function () {
                                return;
                            },
                            methodTwo: function (arg1, arg2) {
                                return arg1 + arg2;
                            }
                        }
                    }
                });
                ok(true, 'successfully implemented an interface');
            } catch (e) {
                console.error(e.stack);
                ok(false, 'exception raised when implementing an interface');
            }

        });

        test('Exception raised when class does not implement interface methods', function () {
            var TestClass;

            try {
                TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: [TestInterface]}, {
                    instance$: {
                        public$: {
                            methodTwo: function (arg1, arg2) {
                                return arg1 + arg2;
                            }
                        }
                    }
                });
                ok(false, 'exception not raised when class does not implement all interface methods');
            } catch (e) {
                ok(true, 'exception raised when class does not implement all interface methods');
            }

        });

        test('Exception raised when class does not implement interface methods correctly (wrong number of arguments)', function () {
            var TestClass;

            try {
                TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: null, implements$: [TestInterface]}, {
                    instance$: {
                        public$: {
                            methodOne: function () {

                            },
                            methodTwo: function (arg1) {
                                return arg1;
                            }
                        }
                    }
                });
                ok(false, 'exception not raised when class does not implement all interface methods correctly');
            } catch (e) {
                ok(true, 'exception raised when class does not implement all interface methods correctly');
            }

        });

    }

    /**
     * Tests defining interfaces.
     */
    function testSingleInheritance() {

        module('Single inheritance');

        var BaseClass,
            SubClass,
            instance;

        BaseClass = class$('BaseClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            instance$: {
                public$: {
                    testVariable1: 'string',
                    testMethod1: function () {
                        return 'base class method';
                    }
                }
            }
        });

        test('Possible to extend a class', function () {
            try {
                SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                    instance$: {
                        public$: {
                            testVariable2: 'string',
                            testMethod2: function () {
                                return 'sub class method';
                            }
                        }
                    }
                });
                ok(true, 'no exception raised when extending a class');
            } catch (e) {
                ok(false, 'exception raised when extending a class');
            }
        });

        test('Subclass derives from base class', function () {
            SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                instance$: {
                    public$: {
                        testVariable2: 'string',
                        testMethod2: function () {
                            return 'sub class method';
                        }
                    }
                }
            });
            instance = new SubClass();
            equal(instance.testVariable1, 'string');
            equal(instance.testVariable2, 'string');
            equal(typeof instance.testMethod1, 'function');
            equal(typeof instance.testMethod2, 'function');
        });

    }

    /**
     * Tests overriding instance methods.
     */
    function testOverridingInstanceMethods() {

        module('Overriding instance methods');

        var BaseClass,
            SubClass,
            instance;

        BaseClass = class$('BaseClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            instance$: {
                public$: {
                    testVariable1: 'string',
                    testMethod1: function () {
                        return 'base class method';
                    }
                }
            }
        });

        test('impossible to override a variable', function () {
            try {
                SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                    instance$: {
                        public$: {
                            override$: {
                                testVariable1: 'string'
                            }
                        }
                    }
                });
                ok(false, 'no exception raised when overriding a variable');
            } catch (e) {
                ok(true, 'exception raised when accidentally overriding a method');
            }
        });

        test('Prevent accidental overriding', function () {
            try {
                SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                    instance$: {
                        public$: {
                            testMethod1: function () {
                                return 'sub class method';
                            }
                        }
                    }
                });
                ok(false, 'no exception raised when accidentally overriding a method');
            } catch (e) {
                ok(true, 'exception raised when accidentally overriding a method');
            }
        });

        test('Explicit overriding possible', function () {
            try {
                SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                    instance$: {
                        public$: {
                            override$: {
                                testMethod1: function () {
                                    return 'sub class method';
                                }
                            }
                        }
                    }
                });
                ok(true, 'no exception raised when explicitly overriding a method');
            } catch (e) {
                ok(true, 'exception raised when explicitly overriding a method');
            }
        });

        test('Overridden method has overridden functionality', function () {
            SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                instance$: {
                    public$: {
                        override$: {
                            testMethod1: function () {
                                return 'sub class method';
                            }
                        }
                    }
                }
            });
            instance = new SubClass();
            equal(instance.testMethod1(), 'sub class method');
        });

    }

    /**
     * Tests super$.
     */
    function testSuper() {

        module('Super');

        var BaseClass,
            SubClass,
            instance;

        BaseClass = class$('BaseClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
            instance$: {
                public$: {
                    testVariable1: 'string',
                    testMethod1: function () {
                        return 'base class method';
                    }
                }
            }
        });

        test('super$ reference is defined', function () {
            SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                instance$: {
                    public$: {
                        override$: {
                            testMethod1: function () {
                                equal(typeof this.testMethod1.super$, 'function');
                            }
                        }
                    }
                }
            });
            instance = new SubClass();
            instance.testMethod1();
        });

        test('possible to run base class implementation of overridden method', function () {
            SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                instance$: {
                    public$: {
                        override$: {
                            testMethod1: function () {
                                return this.testMethod1.super$();
                            }
                        }
                    }
                }
            });
            instance = new SubClass();
            equal(instance.testMethod1(), 'base class method');
        });

    }

    /**
     * Tests public classes.
     */
    function testPublicClasses() {

        module('Public classes');

        var BaseClass;

        test('possible to define a public class', function () {
            try {
                BaseClass = class$('BaseClass', {type$: class$.PUBLIC, extends$: null, implements$: []}, {
                });
                ok(true, 'possible to define a public class');
            } catch (e) {
                ok(false, 'exception raised when trying to define a public class');
            }
        });

    }

    /**
     * Tests abstract classes.
     */
    function testAbstractClasses() {

        module('Abstract classes');

        var TestClass,
            instance;

        test('possible to define an abstract class', function () {
            try {
                TestClass = class$('TestClass', {type$: class$.ABSTRACT, extends$: null, implements$: []}, {
                });
                ok(true, 'possible to define an abstract class');
            } catch (e) {
                ok(false, 'exception raised when trying to define an abstract class');
            }
        });

        test('impossible to instantiate abstract class', function () {
            try {
                instance = new TestClass();
                ok(false, 'no exception raised when trying to instantiate an abstract class');
            } catch (e) {
                ok(true, 'exception raised when trying to instantiate an abstract class');
            }
        });

    }

    /**
     * Tests Singleton classes.
     */
    function testSingletonClasses() {

        module('Singleton classes');

        var TestClass,
            instance;

        test('possible to define a Singleton class', function () {
            try {
                TestClass = class$('TestClass', {type$: class$.SINGLETON, extends$: null, implements$: []}, {
                });
                ok(true, 'possible to define a Singleton class');
            } catch (e) {
                ok(false, 'exception raised when trying to define a Singleton class');
            }
        });

        test('Singleton class has a static instance getter', function () {
            TestClass = class$('TestClass', {type$: class$.SINGLETON, extends$: null, implements$: []}, {
            });
            equal(typeof TestClass.__lookupGetter__('instance'), 'function');
        });

        test('Impossible to directly instantiate a Singleton class', function () {
            TestClass = class$('TestClass', {type$: class$.SINGLETON, extends$: null, implements$: []}, {
            });
            try {
                instance = new TestClass();
                ok(false, 'no exception raised when trying to instantiate a Singleton class');
            } catch (e) {
                ok(true, 'exception raised when trying to instantiate a Singleton class');
            }
        });

        test('Singleton instance getter always returns the same instance', function () {
            TestClass = class$('TestClass', {type$: class$.SINGLETON, extends$: null, implements$: []}, {
            });
            equal(TestClass.instance, TestClass.instance);
        });

    }

    /**
     * Tests final classes.
     */
    function testFinalClasses() {

        module('Final classes');

        var BaseClass,
            SubClass;

        test('possible to define a final class', function () {
            try {
                BaseClass = class$('BaseClass', {type$: class$.PUBLIC | class$.FINAL, extends$: null, implements$: []}, {
                });
                ok(true, 'possible to define a final class');
            } catch (e) {
                ok(false, 'exception raised when trying to define a final class');
            }
        });

        test('Impossible to inherit from a final class', function () {
            try {
                BaseClass = class$('BaseClass', {type$: class$.PUBLIC | class$.FINAL, extends$: null, implements$: []}, {
                });
                SubClass = class$('SubClass', {type$: class$.PUBLIC, extends$: BaseClass, implements$: []}, {
                });
                ok(false, 'no exception raised when trying to extend a final class');
            } catch (e) {
                ok(true, 'exception raised when trying to extend a final class');
            }
        });

    }

    /**
     * Tests dependency imports.
     */
    function testDependencyImports() {

        module('Dependency imports');

        var DependencyClass = import$('dependencies.DependencyClass'),
            TestClass,
            instance;

        TestClass = class$('TestClass', {type$: class$.PUBLIC, extends$: DependencyClass, implements$: []}, {
        });

        asyncTest('extended from an imported dependency class', function () {
            expect(1);
            TestClass.onReady$(function () {
                instance = new TestClass();
                equal(instance.testMethod(), 'test');
            });
        });

    }

    /**
     * Runs the series of unit tests.
     */
    function run() {

        testDefiningClasses();
        testDefiningInstanceVariables();
        testDefiningInstanceMethods();
        testDefiningStaticVariables();
        testDefiningStaticMethods();
        testConstructors();
        testDefaultVariableValueTranscription();
        testConstants();
//        testMemberAccessibility();
        testDefiningInterfaces();
        testImplementingInterfaces();
        testSingleInheritance();
        testOverridingInstanceMethods();
        testSuper();
        testPublicClasses();
        testAbstractClasses();
        testSingletonClasses();
        testFinalClasses();
//        testDependencyImports();

    }

    run();

}());
