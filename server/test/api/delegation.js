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
var Profile = require('../../models/personal');
var Account = require('../../models/account');
var Delegation = require('../../models/delegation');
var mongoose = require('mongoose');
var config = require('../../config.js');
if (config.server.ssl.enabled) {
  var deploymentLocation = 'https://' + config.server.url + ':' + config.server.port;
} else {
  var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
}
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var common = require('../common/commonFunctions');


if (mongoose.connection.readyState === 0) {
  mongoose.connect(databaseLocation);
}

describe('Unauthorized Delegation API Testing', function() {

  it('PUT Delegation Unauthorized', function(done) {
    api.put('/delegation/failUser')
      .expect(401)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});

/*Code block loads user for testing.*/
/*===========================================================*/

var testName2 = 'delegationUser2';
var testPass2 = 'delegationPass2';
var testEmail2 = 'test@demo.org';
var testProfile2 = {
  firstname: 'Johnny',
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

describe('Create Verified Account', function() {

  it('Create Account', function(done) {
    common.createAccount(api, testName2, testPass2, testEmail2, function(err) {
      if (err) {
        return done(err);
      }
      common.loginAccount(api, testName2, testPass2, function(err) {
        if (err) {
          return done(err);
        }
        common.createProfile(api, testProfile2, function(err) {
          if (err) {
            return done(err);
          }
          api.get('/account')
            .expect(200)
            .end(function(err, res) {
              if (err) {
                done(err);
              }
              common.verifyAccount(api, res.body.token, function(err) {
                if (err) {
                  done(err);
                }
                done();
              });
            });
        });
      });
    });
  });

});

/*===========================================================*/

/*Code block loads user for testing.*/
/*===========================================================*/

var testName = 'delegationUser';
var testPass = 'delegationPass';
var testEmail = 'test@demo.org';
var directEmail = '';
var verified = false;
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

describe('Create Verified Account', function() {

  it('Create Account', function(done) {
    common.createAccount(api, testName, testPass, testEmail, function(err) {
      if (err) {
        return done(err);
      }
      common.loginAccount(api, testName, testPass, function(err) {
        if (err) {
          return done(err);
        }
        common.createProfile(api, testProfile, function(err) {
          if (err) {
            return done(err);
          }
          api.get('/account')
            .expect(200)
            .end(function(err, res) {
              if (err) {
                done(err);
              }
              common.verifyAccount(api, res.body.token, function(err) {
                if (err) {
                  done(err);
                }
                done();
              });
            });
        });
      });
    });
  });

});

/*===========================================================*/

describe('Authorized Profile API Testing', function() {

  it('PUT Delegation Authorized', function(done) {
    api.put('/delegation/' + testName2)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        common.removeDelegations(testName, function() {
          done();
        });
      });
  });

  it('GET Delegations Recieved', function(done) {
    api.get('/delegation/recieved')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        common.removeDelegations(testName, function() {
          done();
        });
      });
  });



  it('PUT Delegation Authorized', function(done) {
    api.put('/delegation/' + testName2)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.get('/delegation/granted')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            common.removeDelegations(testName, function() {
              done();
            });
          });
      });
  });

  it('DEL Delegation Authorized', function(done) {
    api.put('/delegation/' + testName2)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.del('/delegation/' + testName2)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            common.removeDelegations(testName, function() {
              done();
            });
          });
      });
  });



});

describe('Cleanup Test Account', function() {

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

  it('Remove Delegations', function(done) {
    common.removeDelegations(testName, function(err) {
      if (err) {
        done(err);
      }
      done();
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

  it('Remove Delegations', function(done) {
    common.removeDelegations(testName, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Remove Account2', function(done) {
    common.removeAccount(testName2, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Remove Profile2', function(done) {
    common.removeProfile(testName2, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

});