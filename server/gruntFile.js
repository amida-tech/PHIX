/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ['gruntFile.js', 'server.js', 'lib/delegation/index.js'],
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
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};
