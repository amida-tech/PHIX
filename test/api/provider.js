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

var should = require('should'),
    supertest = require('supertest'),
    Profile = require('../../models/personal'),
    Account = require('../../models/account'),
    mongoose = require('mongoose'),
    api = supertest.agent(deploymentLocation),
    common = require('../common/commonFunctions');
    providerJSON = require('../records/providers.json');

if (mongoose.connection.readyState === 0) {
    mongoose.connect(databaseLocation);
};

describe('Provider Loading Test', function () {
     
    it('PUT Provider', function(done) {    
        var iteration = 0;
        for (var i=0;i<providerJSON.providers.length;i++) {
          loadProviders(function() {
            if (iteration === providerJSON.providers.length) {
              done();   
            }    
          });
        }
        function loadProviders (callback) {
          api.put('/providers')
          .send(providerJSON.providers[i])
          .expect(200)
          .end(function(err, res) {
                if (err) return done(err);
                iteration = iteration + 1;
                callback();
           });
          }
    });
    
});

describe('Provider GET Testing', function() {
    
   it('GET Providers', function(done) {
       api.get('/providers')
       .expect(200)
       .end(function(err, res) {
          if (err) return done(err);
          done();
       });
   });
    
});

describe('Cleanup providers', function() {
    
    it('Remove Providers', function(done) {
     common.removeProviders(function(err) {
      if (err) done(err);
      done();
     });
    });

});