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
var outboxMessages = require('../records/outboxMessages.json');

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

var generatedDateArray = [];

xdescribe('Create Messages', function() {

  it('Load Sample Outbox Messages', function(done) {

    function postMessages(iteration, outboxMessage) {
      api.post('/mail/messages')
        .send(outboxMessage)
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          if (iteration === (outboxMessages.messages.length - 1)) {
            done();
          }
        });
    }

    for (var i = 0; i < outboxMessages.messages.length; i++) {

      postMessages(i, outboxMessages.messages[i]);
    }
  });

  it('Scramble Dates to test sorting.', function(done) {

    Message.find({'outbox': true}, function(err, res) {

      var messageArray = res;

      function changeDate(iteration, message_id) {
        var myDate = new Date();
        if (iteration % 2 !== 0) {
          myDate.setDate(myDate.getDate() - iteration);
          generatedDateArray.push(myDate);
        } else {
          myDate.setDate(myDate.getDate() + iteration);
          generatedDateArray.push(myDate);
        }
        Message.findByIdAndUpdate(message_id, {
          'stored': myDate
        }, function(err, res) {
          if (err) {
            done(err);
          }
          if (iteration === (messageArray.length - 1)) {
            done();
          }
        });
      }

      for (var i = 0; i < messageArray.length; i++) {
        changeDate(i, messageArray[i]._id);
      }
    });

  });

});

describe('Unauthenticated Direct System API Testing', function(done) {

  it('Test DIRECT POST API without Key.', function(done) {
    api.post('/system/mailbox/messages')
    .send({recipient: 'test@doc.com'})
    .expect(200)
    .end(function(err, res) {
      if (err) {done(err);} else {
        done();
      }
    });
  });

});
