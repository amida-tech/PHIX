/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ['gruntFile.js', 'server.js', 'config.js', './lib/**/index.js', './models/*.js', 'package.json', './test/api/*.js', './test/common/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        globals: {
          'it': true,
          'describe': true,
          'before': true,
          'after': true,
          'done': true
        }
      }
    },
    express: {
      dev: {
        options: {
          script: './server.js'
        }
      }
    },
    watch: {
      all: {
        files: ['./lib/**/index.js', 'config.js', 'gruntFile.js', './models/*.js'],
        tasks: ['default']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: '10000'
        },
        src: ['test/api/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'express:dev', 'mochaTest']);
  //Express omitted for travis build.
  grunt.registerTask('commit', ['jshint', 'mochaTest']);
  grunt.registerTask('mocha', ['express:dev', 'mochaTest']);
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};