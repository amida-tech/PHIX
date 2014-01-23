/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

module.exports = function(grunt) {
  env = grunt.option('NODE_ENV') || 'default';
  deploymentLocation = '';
  databaseLocation = '';
    
  console.log('Running for configuration: ' + env);
    
  if (env === 'phix.dev') {
    deploymentLocation = 'http://localhost:3001';
    databaseLocation = 'mongodb://localhost/portal';
    testArray = ['test/api/access.js', 'test/api/account.js', 'test/api/delegation.js', 'test/api/direct.js', 'test/api/hie.js', 'test/api/identity.js', 'test/api/master.js', 'test/api/profile.js', 'test/api/provider.js', 'test/api/storage.js']
  } else if (env === 'clinician.dev') {
    deploymentLocation = 'http://localhost:3002';
    databaseLocation = 'mongodb://localhost/portal_clinician';
    testArray = ['test/api/account.js', 'test/api/delegation.js', 'test/api/direct.js', 'test/api/hie.js', 'test/api/identity.js', 'test/api/master.js', 'test/api/profile.js', 'test/api/provider.js', 'test/api/storage.js']
  } else if (env === 'phix.prod') {
    deploymentLocation = 'http://phix.amida-demo.com';
    databaseLocation = 'mongodb://localhost/portal';
    testArray = ['test/api/access.js', 'test/api/account.js', 'test/api/delegation.js', 'test/api/direct.js', 'test/api/hie.js', 'test/api/identity.js', 'test/api/master.js', 'test/api/profile.js', 'test/api/provider.js', 'test/api/storage.js']
  } else if (env === 'clinician.prod') {
    deploymentLocation = 'http://clinician.amida-demo.com';
    databaseLocation = 'mongodb://localhost/portal_clinician';
    testArray = ['test/api/account.js', 'test/api/delegation.js', 'test/api/direct.js', 'test/api/hie.js', 'test/api/identity.js', 'test/api/master.js', 'test/api/profile.js', 'test/api/provider.js', 'test/api/storage.js']
  }
    
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
            reporter: 'spec',
            timeout: '10000'
        },
       src:testArray
        }
    }  
      });
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('default', 'mochaTest');
};