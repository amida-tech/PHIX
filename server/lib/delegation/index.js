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

var Account = require('../../models/account'),
    Delegation = require('../../models/delegation'),
    Personal = require('../../models/personal'),
    express = require('express'),
    app = module.exports = express(),
    auth = require('../../lib/account');

//Used to create new delegation(s).
app.put('/delegation/:delegate', auth.ensureAuthenticated, function(req, res){
    
      var reqDelegate = req.params.delegate;
      var delegateJSON = {delegate: reqDelegate};
    
      findDelegate(reqDelegate, function() {
          res.send(200);
      });
    
    function findDelegate (delegate, callback) {
        if (delegate === req.user.username) {
         res.send(400, 'Cannot delegate yourself.');
        } else {
        //Assign to their account
        Delegation.findOne({'username': req.user.username, 'delegate': delegate, 'active': true}, function(err, results) {
          if (err) throw err;
            console.log(results);
           if (results) {
            res.send(400, 'Delegation already active for this account.');
           } else {
            validateDelegation(delegate, function () {
             callback();
            });
           }
        });
        }
    }
    
    function validateDelegation (delegate, callback) {
     //TODO: Validate that the individual is verified?
     //TODO: Validate that the delegate is verified?
        saveDelegation(delegate, function () {
          callback();   
        });  
    };
    
    function saveDelegation (delegate, callback) {
        delegateJSON.granted = new Date();
        delegateJSON.username = req.user.username;
        delegateJSON.active = true;
        var delegation = new Delegation(delegateJSON);
        delegation.save(function (err, saveResults) {
          console.log(err);
          if (err) throw err;
            
          callback();
        });    
    };
    
});

//Returns a list of those who have delegated to the user.
app.get('/delegation/recieved', auth.ensureAuthenticated, function(req, res) {
 
    resJSON = {delegates: []};
    Delegation.find({delegate: req.user.username, active: true}, function(err, results) {
      if (err) throw err;
      if (results.length === 0) {
       res.send('200', 'No active delegations.'); 
      } else {
          for (var i=0; i < results.length; i++) {
           getPersonals(results[i], function (personals) {
             resJSON.delegates.push(personals);
             //console.log(resJSON.delegates.length);
             if (resJSON.delegates.length === results.length) {
               res.send(resJSON);   
             }
           }); 
        }
      }
        
    function getPersonals(input, callback) {
        Personal.findOne({username: input.username}, 'firstname lastname', function(err, personalData) {
            if (err) throw err;
            if (personalData) {
              strJSON = '{"firstname":"' + personalData.firstname + '", "lastname":"' + personalData.lastname + '", "username":"' + input.username + '", "granted":"' + input.granted + '"}'
              callback(JSON.parse(strJSON));
            } else {
              strJSON = '{"firstname":"' + '", "lastname":"' + '", "username":"' + input.username + '", "granted":"' + input.granted +'"}' 
              callback(JSON.parse(strJSON));
            }
        });
      }
    });
});

//Returns a list of delegations granted by the user.
app.get('/delegation/granted', auth.ensureAuthenticated, function(req, res){

    resJSON = {delegates: []};
    
    Delegation.find({username: req.user.username, active: true}, function(err, results) {
      if (err) throw err;
      if (results.length === 0) {
       res.send('200', 'No active delegations.'); 
      } else {
          for (var i=0; i < results.length; i++) {
           getPersonals(results[i], function (personals) {
             
             resJSON.delegates.push(personals);
             //console.log(resJSON.delegates.length);
             if (resJSON.delegates.length === results.length) {
               console.log(resJSON);
               res.send(resJSON);   
             }
           }); 
          }
      }
        
      function getPersonals(input, callback) {
        console.log(input);
        Personal.findOne({username: input.delegate}, 'firstname lastname', function(err, personalData) {
            if (err) throw err;
            if (personalData) {
                
              grantedDate = new Date(input.granted);
              grantedDateString = grantedDate.toDateString();
                
              strJSON = '{"firstname":"' + personalData.firstname + '", "lastname":"' + personalData.lastname + '", "username":"' + input.delegate + '", "granted":"' + grantedDateString + '"}'
              callback(JSON.parse(strJSON));
            } else {
              strJSON = '{"firstname":"' + '", "lastname":"' + '", "username":"' + input.delegate + '", "granted":"' + grantedDateString +'"}' 
              callback(JSON.parse(strJSON));
            }
        });
      }

    });
    
});

//Marks delegation as inactive and archives them.
app.del('/delegation/:delegate', auth.ensureAuthenticated, function(req, res){
  
   // console.log(req.params.delegate);
    var delegate = req.params.delegate;
    
      removeDelegate(delegate, function() {
          res.send(200);   
      });    
    
    function removeDelegate (delegate, callback) {
        Delegation.update({'username': req.user.username, 'delegate': delegate, 'active': true}, {'active': false, revoked: new Date()}, function(err, results) {
          if (err) throw err;    
          if (results) {
          callback();
          } else {
            res.send(400, 'Removal Failed, no delegation found');
          }
        });
    }
});
