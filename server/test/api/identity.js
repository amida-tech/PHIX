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

var should = require('should');
var supertest = require('supertest');
var config = require('../../config.js')
var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var common = require('../common/commonFunctions');
var mongoose = require('mongoose');

if (mongoose.connection.readyState === 0) {
    mongoose.connect(databaseLocation);
};

/*Code block loads user for testing.*/
/*===========================================================*/

testName = 'identityUser';
testPass = 'test';
testEmail = 'test@demo.org';
testProfile = {firstname: 'Jane',middlename: 'Q',lastname: 'Public',birthdate: '06/19/1976',ssn: '123-45-6789',gender: 'female',address: '123 Fake Street',address2: 'Apt 6',city: 'Arlington',state: 'VA',zipcode: '12345',phone: '1-234-999-1234',phonetype: 'mobile'}

describe('Create Un-Verified Account', function () {

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
    
});



describe('Identity API', function () {
    
    var testToken = '';
    
    before(function(done) {
        api.get('/account')
        .expect(200)
        .end(function(err, res) {
            if (err) done (err);
            testToken = res.body.token;
            done();
        });
    }); 
    
    it('should return user personal info', function (done) {
        api.get('/identity/account/' + testToken)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            res.body.personal.should.have.property("username");
            done();
        });
    });

    it('should successfullly approve user identity', function (done) {
        api.put('/identity/validate/' + testToken)
            .send({
                verified: true
            })
        // end handles the response
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });
});

describe('Cleanup Test Account', function () {
    
    it('Remove Account', function(done) {
     common.removeAccount(testName, function(err) {
      if (err) done(err);
      done();
     });
    });
    
    it('Remove Profile', function(done) {
     common.removeProfile(testName, function(err) {
      if (err) done(err);
      done();
     });
    });
    
});