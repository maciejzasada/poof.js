poof.js
=======

### JavaScript Programmer's Object Oriented Framework. ###

### Version info ###
Current version: 0.1 (Alpha)  
Release date: 2013/01/11  
Version authors: Maciej Zasada ([@maciejzasada](https://twitter.com/maciejzasada))  
Original author: Maciej Zasada ([@maciejzasada](https://twitter.com/maciejzasada))  

### Description ###
Poof lets you program in JavaScript using most of the object-orieted features known from languages like Java or C#.
In particular, Poof provides:
* packages
* classes
* abstract classes
* "native" singleton classes
* extension mechanisms
* overriding
* member variables declaration
* static variables declaration
* member methods declaration
* static methods declaration
* dependency class imports
* on-demand class imports
* libraries loading
* asynchronous code execution context retainment
* runtime error checking

Furthermore, Poof is prepared to work both with separate .js class files and code minified and concatenated to a single file with almost no additional effort.

### Usage ###
1. Download the minified poof.js framework and include it in your HTML
2. Create a folder that will be your classes' root package
3. Specify that root folder in Poof `<script root="rootPath">` include
3. Specify a suffix for your JS classes (e.g. .js or .min.js) in Poof `<script suffix=".filesuffix">` include
3. Create a main class JS file for your application
4. Reference that main class in Poof `<script main="package.MainClass">` include
5. Create your main class (/javascripts/min/packageMainClass.js)

``` html
<script type="text/javascript" src="/javascripts/min/lib/poof.min.js" root="/javascripts/min/" suffix=".min.js" main="packagename.MainClass" minified="true" debug="true"></script>
```

``` js
/*global Package */
/*global Class */
  
Package('packagename',
[
  /* Load libraries */
  Load('/m/javascripts/min/lib/jquery-1.8.3.min.js'),
  
  /* import classes */
  Import('anotherpackage.MyBaseClass'),
    
  Class('public singleton MainClass extends MyBaseClass',
  {
    _public_static:
    {
      staticDo : function()
      {
        console.log('I\'m a static function');
      }
    },
      
    _public:
    {
      myPublicVariable : 'something',
        
      OzMobileApplication : function()
      {
        this._super();
        console.log('I\'m MainClass\'s constructor');
        
        this.run();
        MainClass.staticDo();
      },
      
      run : function()
      {
        console.log('running');
      }
    }
  })
]);
```

### Examples ###
Examples are available in the "examples" folder.
Run on an HTTP server to get live core preview.
In order to see full source code, check the files in each individual example folder.

### Revision history ###
2013/01/11 - **v. 0.1** (21.08 KB)
* Alpha release