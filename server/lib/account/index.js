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

var express = require('express');
var app = module.exports = express();
var Account = require('../../models/account');
var Personals = require('../../models/personal');
var Delegations = require('../../models/delegation');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Apply inherited extensions from passport-local-mongoose.
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(401);
}

function ensureVerified(req, res, next) {
  if (req.user.verified) {
    return next();  
  }
  res.send(403);
}

module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.ensureVerified = ensureVerified;


//Verify user, used by lookup page.
app.post('/verify', function(req, res) {

  var json = req.body;
  if (!json) {
    res.send(400);
  }

  function checkRecord() {
    Account.findOne({
      directemail: json.directemail
    }, function(err, account) {
      if (err) {
        throw err;
      }
      if (!account) {
        res.send({
          verified: false
        });
      } else {
        Personals.findOne({
          username: account.username
        }, function(err, personal) {
          if (err) {
            throw err;
          }
          var jsonBirthdate = new Date(json.birthdate);
          if (json.middlename) {
            if (json.firstname === personal.firstname && json.middlename === personal.middlename && json.lastname === personal.lastname && jsonBirthdate.getTime() === personal.birthdate.getTime()) {
              res.send({
                verified: true
              });
            } else {
              res.send({
                verified: false
              });
            }
          } else {
            if (json.firstname === personal.firstname && json.lastname === personal.lastname && jsonBirthdate.getTime() === personal.birthdate.getTime()) {
              res.send({
                verified: true
              });
            } else {
              res.send({
                verified: false
              });
            }
          }
        });
      }
    });
  }

  checkRecord();

});


// Lookup to see if a specific username is valid, used in delegation.
app.post('/validuser', ensureAuthenticated, function(req, res) {

  var json = req.body;
  if (!json) {
    res.send(400);
  }

  Account.findOne({
    username: req.body.username
  }, function(err, account) {
    if (account) {
      Personals.findOne({
        username: req.body.username
      }, function(err, personal) {
        var resJSON = {
          firstname: personal.firstname,
          middlename: personal.middlename,
          lastname: personal.lastname
        };
        res.send(resJSON);
      });
    } else {
      res.send(400);
    }
  });

});

//API to allow individual to jump to an approved delegation.
app.get('/switch/:user', ensureAuthenticated, function(req, res) {

  Delegations.findOne({
    username: req.params.user,
    delegate: req.user.username,
    active: true
  }, function(err, delegations) {
    if (!delegations || delegations.length === 0) {
      res.send(400, 'Delegation not found.');
    } else {
      //Grab account for delegate.
      Account.findOne({
        username: req.params.user
      }, function(err, switchAccount) {
        if (err) {
          throw err;
        }
        if (!switchAccount) {
          res.send(400, 'Account not found to log into.');
        } else {

          //passport.authenticate('local', function(err, user, info) {

          req.login(switchAccount, function(err) {
            if (err) {
              throw err;
            }
            res.send(200);
          });
          //});
        }
      });
    }
  });
});


// Test if user is logged in.
app.get('/loggedin', function(req, res) {
  if (req.isAuthenticated()) {
    res.send(200);
  } else {
    res.send(401);
  }
});

// Log user in.
app.post('/login', passport.authenticate('local'), function(req, res) {
  Account.findOne({
    username: req.body.username
  }, function(err, account) {
    if (err) {
      throw err;
    }
    Personals.findOne({
      username: req.body.username
    }, function(err, profile) {
      if (err) {
        throw err;
      }
      if (account && profile) {
        res.send(200);
      } else if (account && !profile) {
        res.send(200, 'Profile not found');
      } else {
        res.send(400, 'Incorrect Username/Password.');
      }
    });

  });
});

// Log user out.
app.post('/logout', function(req, res) {
  req.logOut();
  res.send(200);
});

app.get('/account', ensureAuthenticated, function(req, res) {

  var resJSON = {};

  Account.findOne({
    username: req.user.username
  }, function(err, account) {
    if (err) {
      throw err;
    }
    if (!account) {
      res.send(404, 'Account not found');
    } else {
      Personals.findOne({
        username: req.user.username
      }, function(err, profile) {

        if (profile !== null) {
          if (profile.firstname && profile.lastname && profile.middlename) {
            resJSON.fullname = profile.firstname + ' ' + profile.middlename.substring(0, 1) + '. ' + profile.lastname;
          } else if (profile.firstname && profile.lastname) {
            resJSON.fullname = profile.firstname + ' ' + profile.lastname;
          } else {
            resJSON.fullname = account.username;
          }
        } else {
          resJSON.fullname = account.username;
        }

        if (account.verified === false) {
          resJSON.token = account.token;
        }

        resJSON.username = account.username;
        resJSON.email = account.email;
        resJSON.directemail = account.directemail;
        resJSON.verified = account.verified;
        res.send(resJSON);
      });
    }
  });
});

app.post('/account', ensureAuthenticated, function(req, res) {

  //TODO:  Add in password changing.
  //TODO:  Add in username update.
  var updateJSON = {};

  updateJSON.email = req.body.email;

  Account.findOne({
    username: req.user.username
  }, function(err, account) {
    if (err) {
      throw err;
    }
    if (!account) {
      res.send(404, 'Account not found');
    } else {
      Account.update({
        username: req.user.username
      }, updateJSON, function(err, smth) {
        if (err) {
          throw err;
        }
        res.send(200);
      });
    }
  });

});

app.put('/account', function(req, res) {

  //Check for well formed message.
  function checkMessage(callback) {
    if (req.body.username === null || !req.body.username) {
      res.send(401, "Username is required, please enter a username.");
    } else if (req.body.password === null || !req.body.password) {
      res.send(401, "Password is required, please enter a password.");
    } else if (req.body.email === null || !req.body.email) {
      res.send(401, "Email is required, please enter an email address.");
    } else if (req.body.username.length < 5) {
      res.send(401, "Username must be longer than 5 characters.");
    } else {
      Account.findOne({
        username: req.body.username
      }, function(err, results) {
        if (results) {
          res.send(401, "Username already taken, please select another.");
        } else {
          callback();
        }
      });
    }
  }

  var randomToken = (+new Date()).toString(36); //TODO: need better method to generate tokens

  function registerAccount() {
    var account = new Account({
      username: req.body.username,
      email: req.body.email,
      directemail: "",
      verified: false,
      token: randomToken
    });
    Account.register(account, req.body.password, function(err, account) {
      if (err) {
        throw (err);
      }
      res.send(200);
    });
  }

  checkMessage(registerAccount);

});