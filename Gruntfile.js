module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> - <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                report: 'gzip',
                wrap: 'TableSift'
            },
            basic: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'dest/<%= pkg.name %>.min.js'
            },
            underscore: {
                options: {
                    banner: '/* <%= pkg.name %>.underscore - <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'build/<%= pkg.name %>.underscore.js',
                dest: 'dest/<%= pkg.name %>.underscore.min.js'
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
                dest: 'build/<%= pkg.name %>.js'
            },
            underscore: {
                src: ['src/underscore.js', 'src/tablesift.js'],
                dest: 'build/<%= pkg.name %>.underscore.js'
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
