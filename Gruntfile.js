'use strict';

module.exports = function(grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end.
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        modulename: 'notific',
        banner: '/*! \n* <%= modulename %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
            '* Licensed MIT \n*/\n\n',
        // Task configuration.
        watch: {
            js: {
                files: ['src/{,*/}*.js'],
                tasks: ['newer:copy'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            styles: {
                files: ['src/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'src/*.*',
                ]
            }
        },
        connect: {
            options: {
                port: 9001,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35731
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },
        copy: {
            js: {
                expand: true,
                cwd: 'src/',
                dest: 'demo/js/lib/',
                src: '{,*/}*.js'
            },
            styles: {
                expand: true,
                cwd: 'src/',
                dest: 'demo/css/',
                src: '{,*/}*.css'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            js: {
                src: ['src/*.js'],
                dest: 'dist/<%= modulename %>.js'
            },
            css: {
                src: ['src/*.css'],
                dest: 'dist/<%= modulename %>.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.js.dest %>',
                dest: 'dist/<%= modulename %>.min.js'
            },
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            },
        },
        cssmin: {
            dist: {
                files: {
                    'dist/<%= modulename %>.min.css': ['dist/<%= modulename %>.css']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 9 versions', 'Firefox ESR', 'Opera 12.1']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '*.css',
                    dest: 'dist'
                }]
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat:js', 'concat:css', 'autoprefixer', 'uglify', 'cssmin']);
    grunt.registerTask('serve', ['connect:livereload','watch']);
};
