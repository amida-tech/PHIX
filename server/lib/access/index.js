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

var Access = require('../../models/access');
var Request = require('../../models/request');
var express = require('express');
var app = module.exports = express();
var auth = require('../../lib/account');
var direct = require('../../lib/direct');
var master = require('../../lib/master');
var storage = require('../../lib/storage');

app.get('/access/pending', auth.ensureAuthenticated, function(req, res) {

  var responseJSON = {};
  console.log(req.user.username);
  Request.find({
    'username': req.user.username,
    'status': 'pending'
  }, function(err, queryResults) {
    if (!queryResults || queryResults.length === 0) {
      console.log(queryResults);
      res.send(404, 'No results found.');
    } else {
      responseJSON.pendingRequests = queryResults;
      res.send(responseJSON);
    }
  });
});

app.del('/access/pending/:clinician', auth.ensureAuthenticated, function(req, res) {

  Request.update({
    'username': req.user.username,
    'status': 'pending',
    'clinician.clinicianID': req.params.clinician
  }, {
    'status': 'denied'
  }, {
    multi: true
  }, function(err, queryResults) {
    if (!queryResults || queryResults.length === 0) {
      res.send(404, 'No records found for update.');
    } else {
      res.send(200);
    }
  });
});

app.post('/access/pending/:clinician', auth.ensureAuthenticated, function(req, res) {
  Request.update({
    'username': req.user.username,
    'status': 'pending',
    'clinician.clinicianID': req.params.clinician
  }, {
    'status': 'approved'
  }, {
    multi: true
  }, function(err, queryResults) {
    if (!queryResults || queryResults.length === 0) {
      res.send(404, 'No records found for update.');
    } else {
      //Need to call to build a message to doctor here.
      Request.findOne({
        'username': req.user.username,
        'status': 'approved',
        'clinician.clinicianID': req.params.clinician
      }, function(err, requestResponse) {
        var permissionRequest = requestResponse.permissions;
        master.retrieveMasterFile(permissionRequest, req.user.username, function(masterRecord) {
          storage.storeFile({
            source: 'outbox',
            details: 'Generated in response to request.',
            filename: 'bluebutton.xml',
            file: masterRecord
          }, req.user.username, function(err, results) {
            var messageJSON = {
              owner: req.user._id,
              username: req.user.username,
              sender: '',
              recipient: requestResponse.clinician.directemail,
              subject: 'Records attached',
              contents: 'Please see attached.',
              attachments: [{
                fileName: results.filename,
                identifier: results._id.toString()
              }]
            };
            direct.sendMessage(messageJSON, function() {
              res.send(200);
            });
          });
        });
        res.send(200);
      });
    }
  });

});

app.get('/access', auth.ensureAuthenticated, function(req, res) {

  var responseJSON = {};

  Request.find({
    'username': req.user.username,
    'status': 'approved'
  }, function(err, queryResults) {
    if (!queryResults || queryResults.length === 0) {
      res.send(404, 'No results found.');
    } else {
      responseJSON.approvedRequests = queryResults;
      res.send(responseJSON);
    }
  });
});

//Delete user's access rule
app.del('/access/:clinician', auth.ensureAuthenticated, function(req, res) {

  console.log(req.params.clinician);


  Request.update({
    'username': req.user.username,
    'status': 'approved',
    'clinician.clinicianID': req.params.clinician
  }, {
    'status': 'removed'
  }, {
    multi: true
  }, function(err, queryResults) {
    if (!queryResults || queryResults.length === 0) {
      res.send(404, 'No records found for update.');
    } else {
      res.send(200);
    }
  });
});

//Update user's access rule.
app.post('/access/:clinician', auth.ensureAuthenticated, function(req, res) {

  var updateJSON = req.body.permissions;

  Request.update({
    'username': req.user.username,
    'status': 'approved',
    'clinician.clinicianID': req.params.clinician
  }, {
    'permissions': updateJSON
  }, {
    multi: true
  }, function(err, queryResults) {
    if (err) {
      throw err;
    }
    if (!queryResults || queryResults.length === 0) {
      res.send(404, 'No records found for update.');
    } else {
      res.send(200);
    }
  });

});