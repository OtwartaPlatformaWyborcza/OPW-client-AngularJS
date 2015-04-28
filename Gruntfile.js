/*global require, module*/
'use strict';

var config = {
    app: 'src', //app sources
    dist: 'dist', // builded app
    livereloadPort: 35729,
    backendProxy: '91.250.114.134'
};

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt); //automatyczne ladowanie modulow grunt
    require('time-grunt')(grunt);
    var modRewrite = require('connect-modrewrite');

    grunt.initConfig({
        config: config,
        bower: grunt.file.readJSON('./bower.json'),

        watch: {

            js: {
                files: ['<%= config.app %>/assets/js/{,*/}*.js',
                    '<%= config.app %>/app/{,*/}{,*/}{,*/}*.js'
                ],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= config.livereloadPort %>'
                }
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
                    '<%= config.app %>app/*.html',
                    '<%= config.app %>/app/components/{,*/}*.html',
                    '<%= config.app %>/assets/css/{,*/}*.css',
                    '.tmp/css/{,*/}*.css',
                    '<%= config.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        jshint: {
            options: {
                globalstrict: true,
                reporter: require('jshint-stylish'),
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
                config: '.jscsrc'
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
                src: ['<%= config.dist %>/css/*.css',
                    '<%= config.dist %>/scripts/*.js',
                    '<%= config.dist %>/css/*bootstrap.min.css'
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
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.dist %>',
                flow: {
                    html: {
                        steps: {
                            css: ['concat', 'cssmin'],
                            js: ['concat']
                        },
                        post: {}
                    }
                }
            }
        },
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            //css: ['<%= config.dist %>/css/*.css'],
            options: {
                assetsDirs: ['<%= config.dist %>']
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/js',
                    src: ['myapp.js', 'vendors.min.js'],
                    dest: '<%= config.dist %>/js'
                }]
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
            fonts:{
                files: {
                    '<%= config.dist %>/fonts':'bootstrap/dist/fonts/*'
                }
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
                context: '/rest-api',
                host: config.backendProxy,
                port: 8080,
                https: false,
                xforward: false,
                rewrite: {
                    '^(\/rest-api\/)(.*)$': '/opw/$2'
                }
            }]

        },

    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'jshint', 'jscs', 'copy', 'bowercopy', 'wiredep',
        'useminPrepare', 'concat', 'uglify', 'cssmin', 'filerev', 'usemin', 'htmlmin'
    ]);

    grunt.registerTask('server-dev', ['configureProxies', 'connect:livereload', 'watch']);
    grunt.registerTask('server-prod', ['configureProxies', 'connect:prod:keepalive']);

};
