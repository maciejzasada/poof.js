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
