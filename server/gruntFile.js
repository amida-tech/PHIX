/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  var deploymentLocation = 'http://localhost:3001';
  var databaseLocation = 'mongodb://localhost/portal';

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
  grunt.registerTask('default', ['jshint', 'mochaTest']);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};
