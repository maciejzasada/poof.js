class BaseClass
  variable: 0
  constructor: () ->
    @variable = 30

class SubClass extends BaseClass
  constructor: () ->
    @variable = 20

module.exports = module.exports || {}
module.exports.inheritance = {
  run: () ->
    new SubClass()
}