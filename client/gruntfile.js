module.exports = function (grunt) {

  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-recess');
  //grunt.loadNpmTasks('grunt-karma');
  //grunt.loadNpmTasks('grunt-html2js');

  // Default task.
  grunt.registerTask('build', ['clean', 'copy:assets']);
  //grunt.registerTask('default', ['jshint','build','karma:unit']);
  //grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  //grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'recess:min','copy:assets']);
  //grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  //var karmaConfig = function(configFile, customOptions) {
  //  var options = { configFile: configFile, keepalive: true };
  //  var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
  //  return grunt.util._.extend(options, customOptions, travisOptions);
  //};

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
      }
    }
  });

};
