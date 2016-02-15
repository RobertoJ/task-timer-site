/*jshint*/
/*global*/
module.exports = function (grunt) {
    'use strict';
    
    var SOURCE_DIR = 'source';
    var BUILD_DIR = 'build';
    
    var configuration = {
        pkg: grunt.file.readJSON('package.json'),
        /*
         * grunt-contrib-clean configuration.
         */
        clean: {
            remove: [BUILD_DIR],
            unnecessary: [BUILD_DIR + '/**/*.js', '!' + BUILD_DIR + '/**/*.min.js']
        },
        /*
         * grunt-contrib-connect configuration.
         */
        connect: {
            server: {
                options: {
                    port: 8080,
                    protocol: 'http',
                    base: BUILD_DIR,
                    livereload: true
                }
            }
        },
        /**
         * grunt-contrib-copy configuration.
         */
        copy: {
            main: {
                encoding: 'utf8',
                expand: true,
                cwd: SOURCE_DIR,
                src: '**/*',
                dest: BUILD_DIR + '/'
            }
        },
        /*
         * grunt-contrib-htmlmin configuration.
         */
        htmlmin: {
            prd: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeIgnored: true
                },
                files: null // Defined in a task below.
            }
        },
        /*
         * grunt-contrib-jshint configuration.
         */
        jshint: {
            source: {
                src: ['package.json', 'gruntfile.js', SOURCE_DIR + '/**/*.js', '!' + SOURCE_DIR + '/**/third-party/**/*.js']
            }
        },
        /*
         * grunt-contrib-sass configuration.
         */
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    unixNewlines: true,
                    trace: true
                },
                files: {
                    'index.css': 'index.scss'
                }
            }
        },
        /*
         * grunt-contrib-uglify configuration.
         */
        uglify: {
            dev: {
                files: {
                    'build/js/main.min.js': [
                        BUILD_DIR + '/js/third-party/**/*.js',
                        BUILD_DIR + '/js/**/*.js'
                    ]
                },
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                }
            },
            prd: {
                files: {
                    'build/js/main.min.js': [
                        BUILD_DIR + '/js/third-party/**/*.js',
                        BUILD_DIR + '/js/**/*.js'
                    ]
                }
            }
        },
        /*
         * grunt-contrib-watch configuration.
         */
        watch: {
            everything: {
                files: [SOURCE_DIR + '/**/*.js', SOURCE_DIR + '/**/*.css', SOURCE_DIR + '/**/*.html'],
                tasks: [BUILD_DIR],
                options: {
                    spawn: true,
                    interrupt: true,
                    atBegin: true,
                    livereload: true
                }
            }
        }
    };
    
    // Ensure some file-related defaults.
    grunt.file.defaultEncoding = 'utf8';
    grunt.file.preserveBOM = false;
    
    // Initialize the configuration for Grunt.
    grunt.initConfig(configuration);
    
    // Load all task modules prefixed with "grunt-*".
    require('load-grunt-tasks')(grunt);
    
    // == Tasks == //
    
    // The default task will be to lint everything.
    grunt.registerTask('default', 'jshint');
    
    // Create a build.
    grunt.registerTask('build', 'Create a new build.', ['jshint', 'clean:remove', 'copy']);
    
    // Deploy to localhost.
    grunt.registerTask('deploy', 'Deploy to localhost.', ['connect', 'watch']);
    
    // Package.
    grunt.registerTask('package', 'Package the site.', ['build']);
};
