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

var should = require('chai').should(),
    supertest = require('supertest'),
    mongoose = require('mongoose'),
    api = supertest.agent('http://localhost:3001'),
    common = require('../common/commonFunctions'),
    providerJSON = require('../records/providers.json');

if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost/portal');
};

var testName = 'janedoe';
var testPass = 'test';
var testEmail = 'jane.doe@example.com';
    
var testProfile = {firstname: 'Jane',middlename: 'Francis',lastname: 'Doe',birthdate: '06/19/1976',ssn: '123-45-6789',gender: 'female',address: '123 Fake Blvd.',address2: 'Apt 16',city: 'Arlington',state: 'VA',zipcode: '12345',phone: '2349991234',phonetype: 'mobile'}

describe('Create User', function () {

    it('Create Account', function (done) {  
        common.createAccount(api, testName, testPass, testEmail, function(err) {
          if (err) return done(err);
          common.loginAccount(api, testName, testPass, function(err) {
            if (err) return done(err);  
            done();
          });
        });
    });
    
    it('Generate Profile', function(done) {
     common.createProfile(api, testProfile, function(err) {
      if (err) done(err);
      done();
     });
    });
    
    it('Verify Account', function(done) {
       api.get('/account')
       .expect(200)
       .end(function(err, res) {
          if (err) done (err);
          common.verifyAccount(api, res.body.token, function(err) {
            if (err) done (err);
            api.get('/account')
            .expect(200)
            .end(function(err, res) {
              if (err) done(err);
              directEmail = res.body.directemail;
              done();
            });
          });
        }); 
    });
    
    it('Logout Account', function(done) {
       common.logoutAccount(api, function(err) {
        if (err) done(err);
        done();
       });
    });
    
});

describe('Load Sample Providers', function () {
     
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