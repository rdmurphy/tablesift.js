module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> - <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                report: 'gzip',
                wrap: 'TableSift'
            },
            minified: {
                files: {
                    'dest/<%= pkg.name %>.min.js': 'raw/<%= pkg.name %>.js',
                    'dest/<%= pkg.name %>.underscore.min.js': 'raw/<%= pkg.name %>.underscore.js'
                }
            },
            full: {
                options: {
                    beautify: true,
                    compress: false,
                    mangle: false
                },
                files: {
                    'dest/<%= pkg.name %>.js': 'raw/<%= pkg.name %>.js',
                    'dest/<%= pkg.name %>.underscore.js': 'raw/<%= pkg.name %>.underscore.js'
                }
            }
        },
        jshint: {
            files: ['gruntfile.js', 'src/*.js'],
            options: {
                eqnull: true
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'uglify']
        },
        concat: {
            basic: {
                src: ['src/utils.js', 'src/tablesift.js'],
                dest: 'raw/<%= pkg.name %>.js'
            },
            underscore: {
                src: ['src/underscore.js', 'src/tablesift.js'],
                dest: 'raw/<%= pkg.name %>.underscore.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('observe', ['watch']);
};
