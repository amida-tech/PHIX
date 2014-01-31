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
if (config.server.ssl.enabled) {
  var deploymentLocation = 'https://' + config.server.url + ':' + config.server.port;
} else {
  var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
}
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var common = require('../common/commonFunctions');
var mongoose = require('mongoose');

if (mongoose.connection.readyState === 0) {
  mongoose.connect(databaseLocation);
}


describe('GET Account Unauthorized API Testing', function() {

  it('GET Account Unauthorized', function(done) {
    api.get('/account')
      .expect(401)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('POST Account Unauthorized', function(done) {
    api.get('/account')
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

var testName = 'accountUser';
var testPass = 'test';
var testEmail = 'test@demo.org';
var testProfile = {
  firstname: 'Jane',
  middlename: 'Q',
  lastname: 'Public',
  birthdate: '06/19/1976',
  ssn: '123-45-6789',
  gender: 'female',
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

/*Code block loads user for testing.*/
/*===========================================================*/

var testName2 = 'switchUser';
var testPass2 = 'test';
var testEmail2 = 'test@demo.org';
var testProfile2 = {
  firstname: 'John',
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

/*Code block creates a delegation.*/
/*===========================================================*/

describe('Create Delegation', function() {

  it('Generate Delegation', function(done) {
    common.createDelegation(api, testName2, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

});

describe('Create Verified Delegate', function() {

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


describe('Login Testing', function() {

  var badName = 'wrongGuy';
  var badPass = 'wrongPass';

  before(function(done) {
    common.logoutAccount(api, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

  it('Correct Sample Login', function(done) {
    api.post('/login')
      .send({
        username: testName,
        password: testPass
      })
      .expect(200, done);
  });

  it('Incorrect Sample Login wrong username', function(done) {
    api.post('/login')
      .send({
        username: badName,
        password: testPass
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login wrong password', function(done) {
    api.post('/login')
      .send({
        username: testName,
        password: badPass
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login wrong both', function(done) {
    api.post('/login')
      .send({
        username: badName,
        password: badPass
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login empty username', function(done) {
    api.post('/login')
      .send({
        username: '',
        password: testPass
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login empty password', function(done) {
    api.post('/login')
      .send({
        username: testName,
        password: ''
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login empty both', function(done) {
    api.post('/login')
      .send({
        username: '',
        password: ''
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login null username', function(done) {
    api.post('/login')
      .send({
        username: null,
        password: badPass
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login null password', function(done) {
    api.post('/login')
      .send({
        username: testName,
        password: null
      })
      .expect(401, done);
  });

  it('Incorrect Sample Login null both', function(done) {
    api.post('/login')
      .send({
        username: null,
        password: null
      })
      .expect(401, done);
  });

  after(function(done) {
    common.loginAccount(api, testName2, testPass2, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

});

describe('Username lookup testing', function() {

  it('PUT Valid Lookup Authorized', function(done) {
    api.post('/validuser')
      .send({
        username: testName
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('PUT Empty Lookup Authorized', function(done) {
    api.post('/validuser')
      .send({
        username: ''
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('PUT Absent Lookup Authorized', function(done) {
    api.post('/validuser')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('PUT Invalid Lookup Authorized', function(done) {
    api.post('/validuser')
      .send({
        username: 'asdflknk'
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});

describe('Account switch test', function() {

  it('GET Invalid Delegate', function(done) {
    api.get('/switch/' + 'XXXXXXXXXXXXXXXXXXXXXXXXX')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('GET Switch Delegate', function(done) {
    api.get('/switch/' + testName)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        //Get original 
        api.get('/profile')
          .expect(200)
          .end(function(err, res) {
            res.body.username.should.equal(testName);
            done();
          });
      });
  });

});

describe('GET Account Authorized API Testing', function() {

  it('GET Account Authorized', function(done) {
    api.get('/account')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });


  it('POST Account Authorized', function(done) {
    api.post('/account')
      .send({
        email: 'test@fake.com'
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