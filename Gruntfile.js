/*global require, module*/
'use strict';

var config = {
    app: 'src', //app sources
    dist: 'dist', // builded app
    livereloadPort: 35729,
    backendProxy: /*'k.dev.otwartapw.pl',*/'91.250.114.134',
    backendPort:8080
};

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt); //automatyczne ladowanie modulow grunt
    require('time-grunt')(grunt);
    var modRewrite = require('connect-modrewrite');

    grunt.initConfig({
        config: config,
        bower: grunt.file.readJSON('./bower.json'),

        watch: {
            options: {
                livereload: '<%= config.livereloadPort %>'
            },
            js: {
                files: ['<%= config.app %>/assets/js/{,*/}*.js',
                    '<%= config.app %>/app/{,*/}{,*/}{,*/}*.js'
                ],
                tasks: ['newer:jshint:all', 'newer:jscs', 'beep:error']
            },
            sass: {
                files: [
                    '<%= config.app %>/assets/sass/**/*.scss'
                ],
                tasks: ['sass', 'beep:error']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= config.livereloadPort %>',
                    spawn: true
                },
                files: [
                    '<%= config.app %>/index.html',
                    '<%= config.app %>/app/**/*.html',
                    '<%= config.app %>/assets/css/**/*.css',
                    '.tmp/css/{,*/}*.css',
                    '<%= config.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        jshint: {
            options: {
                globalstrict: true,
                jshintrc: '.jshintrc',
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= config.app %>/assets/js/{,*/}*.js',
                    '<%= config.app %>/app/components/{,*/}{,*/}{,*/}*.js',
                    '<%= config.app %>/app/shared/{,*/}{,*/}{,*/}*.js',
                    '<%= config.app %>/app/*.js'
                ]
            },
        },
        jscs: {
            src: [
                'Gruntfile.js',
                '<%= config.app %>/assets/js/{,*/}*.js',
                '<%= config.app %>/app/components/{,*/}{,*/}{,*/}*.js',
                '<%= config.app %>/app/shared/{,*/}{,*/}{,*/}*.js',
                '<%= config.app %>/app/*.js'
            ],
            options: {
                config: '.jscsrc',
                force: true
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/{,*/}*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        copy: {
            dist: {
                files: [{
                    // includes files within path
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: ['.htaccess', 'index.html', 'app/components/{,*/}{,*/}{,*/}*.html',
                        'assets/resources/*', 'app/shared/{,*/}{,*/}{,*/}*.html',
                    ],
                    dest: '<%= config.dist %>',
                    filter: 'isFile',
                    nonull: true
                }],
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: ['*.html', 'app/components/{,*/}{,*/}*.html'],
                    dest: '<%= config.dist %>'
                }]
            }
        },
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/css/*.css',
                    '<%= config.dist %>/js/*.js'
                ]
            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= config.dist %>/css',
                    ext: '.min.css'
                }]
            }
        },
        sass: {
            options: {
                sourceMap: false,
                outputStyle: 'compressed',
                precision: 5,
                imagePath: '../images'
            },
            'build': {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/assets/sass',
                    src: ['**/*.scss'],
                    dest: '<%= config.app %>/assets/css',
                    ext: '.css'
                }]
            }
        },
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            options: {
                assetsDirs: ['<%= config.dist %>']
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= config.app %>/index.html'],
                ignorePath: /\.\.\//
            }
        },
        bowercopy: {
            options: {
                // Bower components folder will be removed afterwards
                clean: false
            },
            dev:{
                files: {
                    '<%= config.app %>/assets/fonts/bootstrap':'bootstrap-sass/assets/fonts/bootstrap/*'
                }
            },
            prod:{
                files: {
                    '<%= config.dist %>/fonts/bootstrap':'bootstrap-sass/assets/fonts/bootstrap/*'
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat',
                    src: '**/*.js',
                    dest: '.tmp/concat'
                }]
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729,
                base: '/'
            },
            livereload: {
                options: {
                    open: true,
                    base: [config.app, '.tmp'],
                    middleware: function(connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        var middlewares = [];

                        // 1. mod-rewrite behavior
                        middlewares = [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            connect().use('/bower_components', connect.static('./bower_components'))
                        ];

                        options.base.forEach(function(base) {
                            middlewares.push(connect().use(base, connect.static(base)));
                            middlewares.push(connect.static(base));
                        });

                        var directory = options.directory || options.base[options.base.length - 1];
                        middlewares.push(connect.directory(directory));
                        return middlewares;

                    },
                }
            },
            prod: {
                options: {
                    port: 8088,
                    open: false,
                    livereload: false,
                    base: '/',

                    middleware: function(connect, options) {
                        var middlewares = [];

                        middlewares = [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            connect().use('/', connect.static(config.dist))
                        ];

                        return middlewares;

                    },
                }
            },
            proxies: [{
                context: '/opw',
                host: config.backendProxy,
                port: config.backendPort,
                https: false,
                xforward: false,
                rewrite: {
                    '^(\/opw\/)(.*)$': '/opw-ws-obwodowa/$2'
                }
            }]

        },

    });

    grunt.registerTask('default', ['dev', 'watch']);
    grunt.registerTask('dev', ['wiredep', 'bowercopy:dev', 'sass']);
    grunt.registerTask('build', ['clean', 'jshint', 'jscs', 'copy', 'bowercopy:prod', 'wiredep',
        'sass', 'useminPrepare', 'concat', 'ngAnnotate', 'uglify', 'cssmin', 'filerev', 'usemin', 'htmlmin'
    ]);

    grunt.registerTask('server-dev', ['configureProxies', 'dev', 'connect:livereload', 'watch']);
    grunt.registerTask('server-prod', ['configureProxies', 'connect:prod:keepalive']);

};
