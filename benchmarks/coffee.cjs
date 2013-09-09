(function() {
  var TestClassCoffee;

  TestClassCoffee = (function() {
    TestClassCoffee.prototype.variable = 15;

    function TestClassCoffee() {
      this.variable = 30;
    }

    return TestClassCoffee;

  })();

  module.exports = module.exports || {};

  module.exports.constructor = {
    run: function() {
      return new TestClassCoffee();
    }
  };

}).call(this);

(function() {
  var BaseClass, SubClass,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseClass = (function() {
    BaseClass.prototype.variable = 0;

    function BaseClass() {
      this.variable = 30;
    }

    return BaseClass;

  })();

  SubClass = (function(_super) {
    __extends(SubClass, _super);

    function SubClass() {
      this.variable = 20;
    }

    return SubClass;

  })(BaseClass);

  module.exports = module.exports || {};

  module.exports.inheritance = {
    run: function() {
      return new SubClass();
    }
  };

}).call(this);
