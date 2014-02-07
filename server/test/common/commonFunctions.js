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

var Profile = require('../../models/personal');
var Account = require('../../models/account');
var Message = require('../../models/message');
var Delegation = require('../../models/delegation');
var Request = require('../../models/request');
var Provider = require('../../models/provider');
var fs = require('fs');
var mongo = require('mongodb');
var config = require('../../config.js');
var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var ObjectId = require('mongodb').ObjectID;
var Db = mongo.Db;
var Grid = mongo.Grid;

function createProfile(api, profileJSON, done) {
  api.put('/profile')
    .send(profileJSON)
    .expect(200)
    .end(function(err, res) {
      if (res.text === 'Personal Information Already exists for this account') {
        done(null, res);
      } else {
        if (err) {
          return done(err);
        }
        done(null, res);
      }
    });
}

function loginAccount(api, testName, testPass, done) {
  api.post('/login')
    .send({
      username: testName,
      password: testPass
    })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      done(null, res);
    });
}

function logoutAccount(api, done) {
  api.post('/logout')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      done(null, res);
    });
}


function createAccount(api, testName, testPass, testEmail, done) {
  var putJSON = {
    'username': testName,
    'password': testPass,
    'email': testEmail
  };
  api.put('/account')
    .send(putJSON)
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      done(null, res);
    });
}

function verifyAccount(api, token, done) {
  api.put('/identity/validate/' + token)
    .send({
      'verified': true
    })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      done(null, res);
    });
}

function createDelegation(api, delegation, done) {
  api.put('/delegation/' + delegation)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      done();
    });
}

function createMessage(message, done) {
  var myMessage = new Message({
    sender: message.sender,
    recipient: message.recipient,
    received: new Date(),
    subject: message.subject,
    contents: message.contents,
    archived: message.archived,
    read: message.read,
    attachments: message.attachments
  });
  myMessage.save(function(err, res) {
    if (err) {
      done(err);
    }
    done();
  });
}

function createRequest(api, request, done) {
  api.put('/hie/' + request.clinician.clinicianID)
    .send({
      'request': request
    })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      }
      done();
    });
}

function removeRequest(api, request, done) {
  Request.remove({
    'clinician.clinicianID': request.clinician.clinicianID
  }, function(err, res) {
    if (err) {
      done(err);
    }
    done();
  });
}



function approveRequest(api, request, done) {
  api.post('/access/pending/' + request.clinician.clinicianID)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
}


function removeAccessRequest(testName, callback) {
  Delegation.remove({
    username: testName
  }, function(err) {
    if (err) {
      done(err);
    }
    callback();
  });
}

function removeDelegations(testName, callback) {
  Delegation.remove({
    username: testName
  }, function(err) {
    if (err) {
      done(err);
    }
    callback();
  });
}

function removeAccount(testName, callback) {
  Account.remove({
    username: testName
  }, function(err) {
    if (err) {
      done(err);
    }
    callback();
  });
}

function removeProfile(testName, callback) {
  Profile.remove({
    username: testName
  }, function(err) {
    if (err) {
      done(err);
    }
    callback();
  });
}

function loadSampleRecord(callback) {
  fs.readFile(process.cwd() + '/test/records/ccda/hl7/CCD.sample.xml', 'utf8', function(err, data) {
    if (err) {
      callback(err);
    }
    callback(null, data);
  });
}

function removeSampleRecords(userName, callback) {

  var grid;
  var db;

  Db.connect(databaseLocation, function(err, dbase) {
    if (err) {
      throw err;
    }
    db = dbase;
    grid = new Grid(db, 'storage');
    db.collection('storage.files', function(err, coll) {
      if (err) {
        throw err;
      }
      coll.find({
        'metadata.owner': userName
      }, function(err, results) {
        if (err) {
          throw err;
        }
        results.toArray(function(err, docs) {

          function removeFile(iteration) {
            grid['delete'](docs[i]._id, function(err, result) {
              if (err) {
                throw err;
              }
              if (iteration === (docs.length - 1)) {
                db.close();
                callback();
              }
            });
          }

          if (docs.length >= 0) {
            for (var i = 0; i < docs.length; i++) {
              removeFile(i);
            }
          } else {
            callback();
          }
        });
      });
    });
  });
}

function removeProviders(callback) {
  Provider.remove(function(err, res) {
    if (err) {
      callback(err);
    }
    callback(null, res);
  });
}

function removeMessages(testDirectAddress, callback) {
  Message.remove({
    'sender': testDirectAddress
  }, function(err, res) {
    if (err) {
      done(err);
    }
    Message.remove({
      'recipient': testDirectAddress
    }, function(err, res) {
      if (err) {
        done(err);
      }
      callback();
    });
  });
}

function removeCollection(userName, inputCollection, callback) {

  var db;
  Db.connect(databaseLocation, function(err, dbase) {
    if (err) {
      throw err;
    }
    db = dbase;
    db.collection(inputCollection, function(err, coll) {
      if (err) {
        throw err;
      }
      coll.remove({
        'owner': userName
      }, function(err, results) {
        if (err) {
          throw err;
        }
        db.close();
        callback();
      });
    });
  });

}

module.exports.createProfile = createProfile;
module.exports.loginAccount = loginAccount;
module.exports.createAccount = createAccount;
module.exports.createDelegation = createDelegation;
module.exports.removeDelegations = removeDelegations;
module.exports.removeAccount = removeAccount;
module.exports.removeProfile = removeProfile;
module.exports.createMessage = createMessage;
module.exports.createRequest = createRequest;
module.exports.approveRequest = approveRequest;
module.exports.verifyAccount = verifyAccount;
module.exports.removeRequest = removeRequest;
module.exports.logoutAccount = logoutAccount;
module.exports.loadSampleRecord = loadSampleRecord;
module.exports.removeProviders = removeProviders;
module.exports.removeMessages = removeMessages;
module.exports.removeSampleRecords = removeSampleRecords;
module.exports.removeCollection = removeCollection;