/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:08 AM
 */

var connect = require('connect');
console.log('Server started on port 8081\nGo to http://localhost:8081/test/[dev|prod].html to run unit tests with QUnit GUI.');
connect.createServer(
    connect.static(__dirname)
).listen(8081);