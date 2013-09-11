class BaseClass
  variable: 15

class SubClass extends BaseClass
  constructor: () ->
    @variable = 50

module.exports.inheritance = {
  run: () ->
    new SubClass()
}
