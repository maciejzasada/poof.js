/**
 * @author Maciej Zasada hello@maciejzasada.com
 * @copyright Maciej Zasada hello@maciejzasada.com
 * Date: 2013/07/04
 */

module.exports = function (grunt) {
    'use strict';

    var NAME = 'poof.js',
        VERSION_TYPE = 'Alpha',
        VERSION = 0,
        REVISION = 4,
        BUILD = 12,
        VERSION_STRING = VERSION + '.' + REVISION + '.' + BUILD,
        AUTHOR = 'Maciej Zasada hello@maciejzasada.com',
        COPYRIGHT = '2013 Maciej Zasada',

        $jsClassesDev = [
            'src/dev/poof.js',
            'src/dev/class.js',
            'src/dev/interface.js',
            'src/dev/import.js'
        ],
        $jsClassesProd = [
            'src/prod/poof.js',
            'src/prod/class.js',
            'src/prod/interface.js',
            'src/prod/import.js'
        ];

    grunt.initConfig({

        clean: {
            dev: ['build/dev'],
            prod: ['build/prod']
        },

        jslint: {
            dev: {
                options: {
                    junit: 'log/dev/junit.xml',
                    log: 'log/dev/lint.log',
                    jslintXml: 'log/dev/jslint_xml.xml',
                    errorsOnly: false,
                    failOnError: false,
                    shebang: true,
                    checkstyle: 'log/dev/checkstyle.xml'
                },
                directives: {
                    bitwise: true,
                    browser: true,
                    debug: false,
                    node: false,
                    nomen: true,
                    plusplus: true,
                    sloppy: true,
                    predef: ['console']
                },
                src: ['src/dev/**/*.js']
            },
            prod: {
                options: {
                    junit: 'log/prod/junit.xml',
                    log: 'log/prod/lint.log',
                    jslintXml: 'log/prod/jslint_xml.xml',
                    errorsOnly: false,
                    failOnError: false,
                    shebang: true,
                    checkstyle: 'log/prod/checkstyle.xml'
                },
                directives: {
                    bitwise: true,
                    browser: true,
                    debug: false,
                    node: false,
                    nomen: true,
                    plusplus: true,
                    sloppy: true,
                    predef: ['console']
                },
                src: ['src/prod/**/*.js']
            }
        },

        jshint: {
            gruntfile: ['Gruntfile.js']
        },

        concat: {
            options: {
                separator: '\n\n',
                banner: '/**' +
                    '\n * ' +
                    NAME +
                    '\n * @author ' + AUTHOR +
                    '\n * @copyright ' + COPYRIGHT +
                    '\n * @version ' + VERSION_STRING +
                    '\n * @date ' + '<%= grunt.template.today("yyyy/mm/dd HH:MM:ss") %>' +
                    '\n */\n\n',
                process: function (src, filepath) {
                    return '/* ---------- Source: ' + filepath + ' ---------- */\n\n' + src.replace(/\{\{VERSION_TYPE\}\}/g, VERSION_TYPE).replace(/\{\{VERSION\}\}/g, VERSION).replace(/\{\{REVISION\}\}/g, REVISION).replace(/\{\{BUILD\}\}/g, BUILD);
                }
            },
            devVersion: {
                src: $jsClassesDev,
                dest: 'build/dev/poof-dev-' + VERSION_STRING + '.js'
            },
            devLatest: {
                src: $jsClassesDev,
                dest: 'build/dev/poof-dev-latest.js'
            },
            prodVersion: {
                src: $jsClassesProd,
                dest: 'build/prod/poof-' + VERSION_STRING + '.js'
            },
            prodLatest: {
                src: $jsClassesProd,
                dest: 'build/prod/poof-latest.js'
            },
            benchmarkDev: {
                src: $jsClassesDev.concat(['benchmarks/sources/**/poof.js']),
                dest: 'benchmarks/vendor/poof-dev.js'
            },
            benchmarkProd: {
                src: $jsClassesProd.concat(['benchmarks/sources/**/poof.js']),
                dest: 'benchmarks/vendor/poof-prod.js'
            }
        },

        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/dev',
                        src: ['poof-dev-latest.js'],
                        dest: 'test/vendor'
                    }
                ]
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/prod',
                        src: ['poof-latest.js'],
                        dest: 'test/vendor'
                    }
                ]
            }
        },

        uglify: {
            options: {
                wrap: true
            },
            dev: {
                files: {
                    'build/dev/poof-dev.min.js': ['build/dev/poof-dev-' + VERSION_STRING + '.js']
                }
            },
            prod: {
                files: {
                    'build/prod/poof.min.js': ['build/prod/poof-' + VERSION_STRING + '.js']
                }
            }
        },

        exec: {
            increment_build_number: {
                command: '[[ `cat Gruntfile.js` =~ (BUILD = ([0-9]+)) ]] && sed "s/BUILD = [[:digit:]]*,/BUILD = $((${BASH_REMATCH[2]} + 1)),/g" Gruntfile.js > Gruntfile.tmp && cat Gruntfile.tmp > Gruntfile.js && rm Gruntfile.tmp && echo BUILD = $((${BASH_REMATCH[2]} + 1))',
                stdout: true,
                stderr: true
            }
        },

        coffee: {
            compile: {
                files: {
                    'benchmarks/vendor/coffee.js': 'benchmarks/sources/**/coffee.coffee'
                }
            }
        },

        benchmark: {
            all: {
                src: ['benchmarks/tests/*.js'],
                dest: 'benchmarks/results.csv'
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['debug']
            },
            dev: {
                files: ['src/dev/**/*.js'],
                tasks: ['dev']
            },
            prod: {
                files: ['src/prod/**/*.js'],
                tasks: ['prod']
            }
        },
        
        qunit: {
            all: {
                options: {
                    timeout: 5000,
                    urls: [
                      'test/dev.html?phantom',
                      'test/prod.html?phantom'
                    ]
                }
            }
        }
    });

    // Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-benchmark');

    grunt.registerTask('dev', ['jshint', 'clean:dev', 'jslint:dev', 'concat:devVersion', 'concat:devLatest', 'copy:dev']);
    grunt.registerTask('prod', ['jshint', 'clean:prod', 'jslint:prod', 'concat:prodVersion', 'concat:prodLatest', 'copy:prod']);
    grunt.registerTask('release', ['clean', 'dev', 'prod', 'uglify', 'exec:increment_build_number']);
    grunt.registerTask('test', 'qunit');
    grunt.registerTask('bench', ['dev', 'prod', 'concat:benchmarkDev', 'concat:benchmarkProd', 'coffee', 'benchmark']);
    grunt.registerTask('default', ['dev', 'prod']);

};
