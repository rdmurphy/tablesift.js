module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/* <%= pkg.name %> - <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                process: {
                    data: {
                        version: '<%= pkg.version %>'
                    }
                }
            },
            basic: {
                src: ['wrapper/begin.js', 'src/utils.js', 'src/tablesift.js', 'wrapper/end.js'],
                dest: 'tmp/<%= pkg.name %>.js'
            },
            underscore: {
                src: ['wrapper/begin.js', 'src/underscore.js', 'src/tablesift.js', 'wrapper/end.js'],
                dest: 'tmp/<%= pkg.name %>.underscore.js'
            }
        },
        jshint: {
            files: ['gruntfile.js', 'tmp/**/*.js'],
            options: {
                eqnull: true
            }
        },
        uglify: {
            options: {
                report: 'gzip'
            },
            minified: {
                files: {
                    'dest/<%= pkg.name %>.min.js': 'tmp/<%= pkg.name %>.js',
                    'dest/<%= pkg.name %>.underscore.min.js': 'tmp/<%= pkg.name %>.underscore.js'
                }
            },
            full: {
                options: {
                    beautify: true,
                    compress: false,
                    mangle: false
                },
                files: {
                    'dest/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js',
                    'dest/<%= pkg.name %>.underscore.js': 'tmp/<%= pkg.name %>.underscore.js'
                }
            }
        },
        watch: {
            files: ['<%= concat.basic.src %>'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
};
