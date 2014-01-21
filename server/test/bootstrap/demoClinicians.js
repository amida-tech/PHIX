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
    api = supertest.agent('http://localhost:3002'),
    common = require('../common/commonFunctions');

if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost/portal_clinician');
};

var testName = 'dr.house';
var testPass = 'test';
var testEmail = 'gregory.house@hospital.com';
    
var testProfile = {firstname: 'Gregory',middlename: 'Q',lastname: 'House',birthdate: '06/19/1976',ssn: '123-45-6789',gender: 'male',address: '123 Fake Street',address2: 'Apt 6',city: 'Arlington',state: 'VA',zipcode: '12345',phone: '2349991234',phonetype: 'mobile'}

var testName2 = 'dr.henry';
var testPass2 = 'test';
var testEmail2 = 'henry.wei@hospital.com';
    
var testProfile2 = {firstname: 'Henry',middlename: 'Q',lastname: 'Wei',birthdate: '06/19/1976',ssn: '123-45-6789',gender: 'male',address: '123 Fake Ave',address2: 'Apt 6',city: 'Arlington',state: 'VA',zipcode: '12345',phone: '2349991234',phonetype: 'mobile'}

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

describe('Create User Two', function () {

    it('Create Account', function (done) {  
        common.createAccount(api, testName2, testPass2, testEmail2, function(err) {
          if (err) return done(err);
          common.loginAccount(api, testName2, testPass2, function(err) {
            if (err) return done(err);  
            done();
          });
        });
    });
    
    it('Generate Profile', function(done) {
     common.createProfile(api, testProfile2, function(err) {
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
    
});