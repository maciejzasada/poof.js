/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:08 AM
 */

var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8081);