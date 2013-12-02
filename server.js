/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright 2013 Maciej Zasada
 * Date: 7/4/13
 * Time: 12:08 AM
 */

var connect = require('connect'),
    port = process.env.PORT || 8080,
    host = process.env.IP || '0.0.0.0';
    
console.log('Server started on port ' + port + '\nGo to http://localhost:' + port + '/test/[dev|prod].html to run unit tests with QUnit GUI.');
connect.createServer(
    connect.static(__dirname)
).listen(port, host);