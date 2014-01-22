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

var testName = 'masterUser';
var testPass = 'masterPass';
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


describe('Record API Testing', function() {

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

  describe('Storage API', function() {

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


  describe('Master List API', function() {

    it('Test Demographics Master List', function(done) {
      api.get('/master/testUser/demographics')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Allergies Master List', function(done) {
      api.get('/master/testUser/allergies')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Encounters Master List', function(done) {
      api.get('/master/testUser/encounters')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Immunizations Master List', function(done) {
      api.get('/master/testUser/immunizations')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Results Master List', function(done) {
      api.get('/master/testUser/results')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Medications Master List', function(done) {
      api.get('/master/testUser/medications')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Problems Master List', function(done) {
      api.get('/master/testUser/problems')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Procedures Master List', function(done) {
      api.get('/master/testUser/procedures')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Vitals Master List', function(done) {
      api.get('/master/testUser/vitals')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

  describe('Master POST API', function() {

    it('Test Demographics POST Approved', function(done) {
      api.get('/master/testUser/demographics')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.demographics.length > 0) {
            api.post('/master/testUser/demographics')
              .send({
                identifier: res.body.demographics[0].identifier,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Demographics POST Archived', function(done) {
      api.get('/master/testUser/demographics')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.demographics.length > 0) {
            api.post('/master/testUser/demographics')
              .send({
                identifier: res.body.demographics[0].identifier,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Demographics POST Ignored', function(done) {
      api.get('/master/testUser/demographics')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.demographics.length > 0) {
            api.post('/master/testUser/demographics')
              .send({
                identifier: res.body.demographics[0].identifier,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Allergies POST Approved', function(done) {
      api.get('/master/testUser/allergies')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.allergies.length > 0) {
            api.post('/master/testUser/allergies')
              .send({
                identifier: res.body.allergies[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Allergies POST Archived', function(done) {
      api.get('/master/testUser/allergies')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.allergies.length > 0) {
            api.post('/master/testUser/allergies')
              .send({
                identifier: res.body.allergies[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Allergies POST Ignored', function(done) {
      api.get('/master/testUser/allergies')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.allergies.length > 0) {
            api.post('/master/testUser/allergies')
              .send({
                identifier: res.body.allergies[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Encounters POST Approved', function(done) {
      api.get('/master/testUser/encounters')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.encounters.length > 0) {
            api.post('/master/testUser/encounters')
              .send({
                identifier: res.body.encounters[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Encounters POST Archived', function(done) {
      api.get('/master/testUser/encounters')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.encounters.length > 0) {
            api.post('/master/testUser/encounters')
              .send({
                identifier: res.body.encounters[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Encounters POST Ignored', function(done) {
      api.get('/master/testUser/encounters')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.encounters.length > 0) {
            api.post('/master/testUser/encounters')
              .send({
                identifier: res.body.encounters[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Immunizations POST Approved', function(done) {
      api.get('/master/testUser/immunizations')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.immunizations.length > 0) {
            api.post('/master/testUser/immunizations')
              .send({
                identifier: res.body.immunizations[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Immunizations POST Archived', function(done) {
      api.get('/master/testUser/immunizations')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.immunizations.length > 0) {
            api.post('/master/testUser/immunizations')
              .send({
                identifier: res.body.immunizations[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Immunizations POST Ignored', function(done) {
      api.get('/master/testUser/immunizations')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.immunizations.length > 0) {
            api.post('/master/testUser/immunizations')
              .send({
                identifier: res.body.immunizations[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Results POST Approved', function(done) {
      api.get('/master/testUser/results')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.results.length > 0) {
            api.post('/master/testUser/results')
              .send({
                identifier: res.body.results[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Results POST Archived', function(done) {
      api.get('/master/testUser/results')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.results.length > 0) {
            api.post('/master/testUser/results')
              .send({
                identifier: res.body.results[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Results POST Ignored', function(done) {
      api.get('/master/testUser/results')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.results.length > 0) {
            api.post('/master/testUser/results')
              .send({
                identifier: res.body.results[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Medications POST Approved', function(done) {
      api.get('/master/testUser/medications')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.medications.length > 0) {
            api.post('/master/testUser/medications')
              .send({
                identifier: res.body.medications[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Medications POST Archived', function(done) {
      api.get('/master/testUser/medications')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.medications.length > 0) {
            api.post('/master/testUser/medications')
              .send({
                identifier: res.body.medications[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Medications POST Ignored', function(done) {
      api.get('/master/testUser/medications')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.medications.length > 0) {
            api.post('/master/testUser/medications')
              .send({
                identifier: res.body.medications[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Problems POST Approved', function(done) {
      api.get('/master/testUser/problems')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.problems.length > 0) {
            api.post('/master/testUser/problems')
              .send({
                identifier: res.body.problems[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Problems POST Archived', function(done) {
      api.get('/master/testUser/problems')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.problems.length > 0) {
            api.post('/master/testUser/problems')
              .send({
                identifier: res.body.problems[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Problems POST Ignored', function(done) {
      api.get('/master/testUser/problems')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.problems.length > 0) {
            api.post('/master/testUser/problems')
              .send({
                identifier: res.body.problems[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Procedures POST Approved', function(done) {
      api.get('/master/testUser/procedures')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.procedures.length > 0) {
            api.post('/master/testUser/procedures')
              .send({
                identifier: res.body.procedures[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Procedures POST Archived', function(done) {
      api.get('/master/testUser/procedures')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.procedures.length > 0) {
            api.post('/master/testUser/procedures')
              .send({
                identifier: res.body.procedures[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Procedures POST Ignored', function(done) {
      api.get('/master/testUser/procedures')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.procedures.length > 0) {
            api.post('/master/testUser/procedures')
              .send({
                identifier: res.body.procedures[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Vitals POST Approved', function(done) {
      api.get('/master/testUser/vitals')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.vitals.length > 0) {
            api.post('/master/testUser/vitals')
              .send({
                identifier: res.body.vitals[0]._id,
                approved: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Vitals POST Archived', function(done) {
      api.get('/master/testUser/vitals')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.vitals.length > 0) {
            api.post('/master/testUser/vitals')
              .send({
                identifier: res.body.vitals[0]._id,
                archived: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

    it('Test Vitals POST Ignored', function(done) {
      api.get('/master/testUser/vitals')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          if (res.body.vitals.length > 0) {
            api.post('/master/testUser/vitals')
              .send({
                identifier: res.body.vitals[0]._id,
                ignored: true
              })
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          } else {
            done();
          }
        });
    });

  });

  describe('Master Put API', function() {

    it('Test Demographics Put', function(done) {
      api.put('/master/testUser/demographics')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Allergies Put', function(done) {
      api.put('/master/testUser/allergies')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test',
          status: 'active',
          severity: 'really bad'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Encounters Put', function(done) {
      api.put('/master/testUser/encounters')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Immunizations Put', function(done) {
      api.put('/master/testUser/immunizations')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Results Put', function(done) {
      api.put('/master/testUser/results')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Medications Put', function(done) {
      api.put('/master/testUser/medications')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Problems Put', function(done) {
      api.put('/master/testUser/problems')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Procedures Put', function(done) {
      api.put('/master/testUser/procedures')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Vitals Put', function(done) {
      api.put('/master/testUser/vitals')
        .send({
          owner: testName,
          approved: true,
          archived: false,
          ignored: false,
          name: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('Test Master GET', function(done) {
      api.get('/master')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    //Comment to leave files in DB.    
    it('File Endpoint DELETE Remove', function(done) {
      api.get('/storage')
        .expect(200)
        .end(function(err, res) {
          var identifier = res.body.files[0].identifier;
          if (err) {
            return done(err);
          }
          api.del('/storage/' + identifier)
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

    it('Remove sample records', function(done) {
      var removalArray = ['allergies', 'demographics', 'encounters', 'immunizations', 'medications', 'problems', 'procedures', 'results', 'vitals'];

      function testResults(err) {
        if (err) {
          done(err);
        }
        iteration = iteration + 1;
        if (iteration === removalArray.length) {
          done();
        }
      }

      var iteration = 0;
      for (var i = 0; i < removalArray.length; i++) {
        common.removeCollection(testName, removalArray[i], testResults);
      }
    });

  });



});