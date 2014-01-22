/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ['gruntFile.js', 'server.js'],
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
        globals: {}
      }
    },
    express: {
      dev: {
        options: {
          script: './server.js'
        }
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


  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};
