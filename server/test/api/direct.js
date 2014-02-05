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
var Message = require('../../models/message');
var Delegation = require('../../models/delegation');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
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

var testInboxMessage;
var testOutboxMessage;

/*Code block loads user for testing.*/
/*===========================================================*/

var testName = 'mailboxUser';
var testPass = 'mailboxPass';
var testEmail = 'test@demo.org';
var directEmail = '';
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

  it('Test unverified', function(done) {
    api.put('/direct/message')
      .send({
        'doesnt': 'matter'
      })
      .expect(403)
      .end(function(err, res) {
        if (err) {
          done(err);
        }
        done();
      });
  });

  it('Verify Account', function(done) {
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
          api.get('/account')
            .expect(200)
            .end(function(err, res) {
              if (err) {
                done(err);
              }
              directEmail = res.body.directemail;
              done();
            });
        });
      });
  });

});

/*Code block creates a sample message.
/*===========================================================*/
describe('Create Test Message', function() {



  it('Generate Test Inbox Message', function(done) {

    Account.findOne({
      username: testName
    }, function(err, res) {
      if (err) {
        done(err);
      }

      testInboxMessage = {
        owner: res._id,
        sender: 'doctor@node.amida-demo.com',
        recipient: directEmail,
        received: Date.now(),
        subject: 'Your recent visit.',
        contents: 'Your medical records are attached',
        attachments: []
      };

      var sampleMessage = new Message(testInboxMessage);
      sampleMessage.save(function(err, res) {
        if (err) {
          done(err);
        }
        testInboxMessage.message_id = res._id;
        done();
      });


    });
  });

  it('Generate Test Outbox Message', function(done) {

    Account.findOne({
      username: testName
    }, function(err, res) {
      if (err) {
        done(err);
      }

      testOutboxMessage = {
        owner: res._id,
        sender: directEmail,
        recipient: 'testDoc@localhost',
        received: Date.now(),
        subject: 'Medical Records',
        contents: 'Here you go.',
        attachments: []
      };

      var sampleMessage = new Message(testOutboxMessage);
      sampleMessage.save(function(err, res) {
        testOutboxMessage.message_id = res._id;
        if (err) {
          done(err);
        }
        done();
      });
    });

  });

});

/*===========================================================*/

describe('GET Messages', function() {

  it('Get Inbox', function(done) {
    api.get('/direct/inbox')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Get Outbox', function(done) {
    api.get('/direct/outbox')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('Update Message', function() {

  it('POST Message Read', function(done) {
    api.post('/direct/message/' + testInboxMessage.message_id)
      .send({
        read: true
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.get('/direct/inbox')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            for (var i = 0; i < res.body.messages.length; i++) {
              if (String(res.body.messages[i].message_id) === String(testInboxMessage.message_id)) {
                res.body.messages[i].read.should.equal(true);
                done();
              }
            }
          });
      });
  });

  it('POST Message Archived', function(done) {
    api.post('/direct/message/' + testInboxMessage.message_id)
      .send({
        archived: true
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.get('/direct/inbox')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            for (var i = 0; i < res.body.messages.length; i++) {
              if (res.body.messages[i].message_id === testInboxMessage.message_id) {
                return done('Should not be part of return message');
              }
            }
            done();
          });
      });
  });

  it('POST Message Un-archive', function(done) {
    api.post('/direct/message/' + testInboxMessage.message_id)
      .send({
        archived: false
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.get('/direct/inbox')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            for (var i = 0; i < res.body.messages.length; i++) {
              if (String(res.body.messages[i].message_id) === String(testInboxMessage.message_id)) {
                done();
              }
            }
          });
      });
  });

  it('DELETE Message', function(done) {
    api.del('/direct/message/' + testInboxMessage.message_id)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.get('/direct/inbox')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            for (var i = 0; i < res.body.messages.length; i++) {
              if (res.body.messages[i].message_id === testInboxMessage.message_id) {
                return done('Should not be part of return message');
              }
            }
            done();
          });
      });
  });

  it('POST Message Un-archive', function(done) {
    api.post('/direct/message/' + testInboxMessage.message_id)
      .send({
        archived: false
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        api.get('/direct/inbox')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            for (var i = 0; i < res.body.messages.length; i++) {
              if (String(res.body.messages[i].message_id) === String(testInboxMessage.message_id)) {
                done();
              }
            }
          });
      });
  });
});

describe('Send Message', function() {

  it('PUT Message', function(done) {
    api.put('/direct/message')
      .send(testOutboxMessage)
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

  it('Remove Messages', function(done) {
    common.removeMessages(directEmail, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });

});