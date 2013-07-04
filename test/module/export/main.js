/**
 * @author Maciej Zasada maciej@unit9.com
 * @copyright 2013 UNIT9 Ltd.
 * Date: 7/4/13
 * Time: 12:27 AM
 */

test('Export', function () {

    ok(Package, 'Package is exported to global scope');
    ok(Class, 'Class is exported to global scope');
    ok(Import, 'Import is exported to global scope');

});