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
var config = require('../../config.js');
var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var mongoose = require('mongoose');
var common = require('../common/commonFunctions');

if (mongoose.connection.readyState === 0) {
  mongoose.connect(databaseLocation);
}

/*Code block loads user for testing.*/
/*===========================================================*/

var testName = 'storageUser';
var testPass = 'test';
var testEmail = 'test@demo.org';

var testProfile = {
  firstname: 'Jane',
  middlename: 'Q',
  lastname: 'Public',
  birthdate: '06/19/1976',
  ssn: '123-45-6789',
  gender: 'male',
  address: '123 Fake Street',
  address2: 'Apt 6',
  city: 'Arlington',
  state: 'VA',
  zipcode: '12345',
  phone: '1-234-999-1234',
  phonetype: 'mobile'
};

describe('Create User', function() {

  it('Create Account', function(done) {
    common.createAccount(api, testName, testPass, testEmail, function(err) {
      if (err) {
        return done(err);
      }
      common.loginAccount(api, testName, testPass, function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });

  it('Generate Profile', function(done) {
    common.createProfile(api, testProfile, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

});




describe('Storage API', function() {
  var sampleFile = '';

  before(function(done) {
    common.loadSampleRecord(function(err, file) {
      if (err) {
        done(err);
      }
      sampleFile = file;
      done();
    });
  });

  it('File Endpoint PUT Validation Empty', function(done) {
    api.put('/storage')
      .send({})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('File Endpoint PUT Validation File Name Length', function(done) {
    api.put('/storage')
      .send({
        filename: ''
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('File Endpoint PUT Validation File Empty', function(done) {
    api.put('/storage')
      .send({
        file: ''
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('File Endpoint PUT Correctly', function(done) {
    api.put('/storage')
      .send({
        filename: 'testFile.xml',
        file: sampleFile
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('File Endpoint GET', function(done) {
    api.get('/storage')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });



  it('File Endpoint Update POST Flag Test', function(done) {
    api.get('/storage')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.post('/storage')
          .send({
            identifier: res.body.files[0].identifier,
            parsedFlag: true
          })
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
  });

});

describe('Cleanup Test Account', function() {

  it('Logout Account', function(done) {
    common.logoutAccount(api, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Remove Account', function(done) {
    common.removeAccount(testName, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Remove Profile', function(done) {
    common.removeProfile(testName, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Remove Sample Files from Grid', function(done) {
    common.removeSampleRecords(testName, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Remove parsed records', function(done) {
    var removalArray = ['allergies', 'demographics', 'encounters', 'immunizations', 'medications', 'problems', 'procedures', 'results', 'vitals'];
    var iteration = 0;

    function removeCollectionCallback(err) {
      if (err) {
        done(err);
      }
      iteration = iteration + 1;
      if (iteration === removalArray.length) {
        done();
      }

    }


    for (var i = 0; i < removalArray.length; i++) {
      common.removeCollection(testName, removalArray[i], removeCollectionCallback);
    }
  });


});