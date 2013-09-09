class TestClassCoffee
  variable: 15

  constructor: () ->
    @variable = 30

module.exports = module.exports || {}
module.exports.constructor = {
  run: () ->
    new TestClassCoffee()
}