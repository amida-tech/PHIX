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
  Personal = require('../../models/personal'),
  express = require('express'),
  app = module.exports = express(),
  auth = require('../../lib/account');

//Used during registration to create a profile.
app.put('/profile', auth.ensureAuthenticated, function(req, res) {


  var json = req.body;
  json.username = req.user.username;

  Personal.findOne({
    username: req.user.username
  }, function(err, results) {
    if (err) {
      throw err;
    }
    if (results) {
      res.send(400, 'Personal Information Already exists for this account');
    } else {
      validateMessage();
    }
  });

  function validateMessage() {
    var statesAbbr = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

    if (!json.firstname || json.firstname.length === 0 || json.firstname.length > 50) {
      res.send(400, 'First name must be between 0 and 50 characters in length.');
    } else if (!json.lastname || json.lastname.length === 0 || json.lastname.length > 50) {
      res.send(400, 'Last name must be between 0 and 50 characters in length.');
      //TODO:  Add better birthdate checking.
    } else if (!json.birthdate || json.birthdate.length === 0) {
      res.send(400, 'Valid date of birth required');
      //TODO:  Add better SSN checking.
    } else if (!json.ssn || json.ssn.length === 0) {
      res.send(400, 'Valid SSN required');
    } else if (!json.gender || (json.gender !== 'male' && json.gender !== 'female' && json.gender !== 'none')) {
      res.send(400, 'Gender must be male, female, or none.');
    } else if (!json.address || json.address.length === 0 || json.address.length > 100) {
      res.send(400, 'Address must be between 0 and 100 characters in length.');
    } else if (!json.city || json.city.length === 0 || json.city.length > 50) {
      res.send(400, 'City must be between 0 and 50 characters in length.');
    } else if (!json.state || (statesAbbr.indexOf(json.state) > -1) === false) {
      res.send(400, 'State must be a valid state abbreviation.');
    } else if (!json.zipcode || json.zipcode.length === 0 || json.zipcode.length !== 5 || Number(json.zipcode) === 'NaN') {
      res.send(400, 'Valid Zipcode required.');
      //TODO:  Add better phone validation, strip alpha and compare length.
    } else if (!json.phone || json.phone.length === 0) {
      res.send(400, 'Valid US Phone Number required.');
    } else if (!json.phonetype || (json.phonetype !== 'mobile' && json.phonetype !== 'landline')) {
      res.send(400, 'Valid Phone Type required.');
    } else {
      createProfile();
    }
  }

  function createProfile() {

    var personal = new Personal(json);

    personal.save(function(err, smth) {
      if (err) {
        throw err;
      }
      res.send(200);
    });
  }

});

//Retrieve Profile Information.
//TODO:  Add cleaning, no need for db id or version.
app.get('/profile', auth.ensureAuthenticated, function(req, res) {

  Personal.findOne({
    username: req.user.username
  }, function(err, results) {
    if (err) {
      throw err;
    }
    if (!results) {
      res.send(400, 'Profile not found.');
    } else {
      res.send(results);
    }
  });
});

//Validates input, callback in (err, res) form.
function validateInput(json, callback) {

  var statesAbbr = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  if (json.firstname && (json.firstname.length === 0 || json.firstname.length > 50)) {
    callback('Invalid First Name');
  } else if (json.lastname && (json.lastname.length === 0 || json.lastname.length > 50)) {
    callback('Invalid Last Name');
    //TODO:  Add better birthdate checking.
  } else if (json.birthdate && json.birthdate.length === 0) {
    callback('Invalid Date of Birth');
    //TODO:  Add better SSN checking.
  } else if (json.ssn && json.ssn.length === 0) {
    callback('Invalid SSN');
  } else if (json.gender && (json.gender !== 'male' && json.gender !== 'female' && json.gender !== 'none')) {
    callback('Invalid Gender');
  } else if (json.address && (json.address.length === 0 || json.address.length > 100)) {
    callback('Invalid Address Line 1');
  } else if (json.address2 && (json.address2.length === 0 || json.address2.length > 100)) {
    callback('Invalid Address Line 2');
  } else if (json.city && (json.city.length === 0 || json.city.length > 50)) {
    callback('Invalid City');
  } else if (json.state && (statesAbbr.indexOf(json.state) > -1) === false) {
    callback('Invalid State');
  } else if (json.zipcode && (json.zipcode.length === 0 || json.zipcode.length !== 5 || Number(json.zipcode) === 'NaN')) {
    callback('Invalid Zip Code');
    //TODO:  Add better phone validation, strip alpha and compare length.
  } else if (json.phone && json.phone.length === 0) {
    callback('Invalid Phone Number');
  } else if (json.phonetype && (json.phonetype !== 'mobile' && json.phonetype !== 'landline')) {
    callback('Invalid Phone Type');
  } else {
    callback(null, 'validation okay');
  }
}


app.post('/profile', auth.ensureAuthenticated, function(req, res) {

  var json = req.body;
  var verifiedFlag = false;

  //TODO:  Will need to modify this so only users or admins can mod their records.
  Personal.findOne({
    username: req.user.username
  }, function(err, results) {
    if (err) {
      throw err;
    }
    if (!results) {
      res.send(404, 'Profile not found.');
    } else {
      verifiedFlag = results.verified;
      validateInput(json, function(err, validResponse) {
        if (err) {
          throw err;
        }
        updateProfile(json);
      });
    }
  });

  function updateProfile(inputJSON) {
    var updateJSON = {};

    //TODO:  Will need to modify this so only admins can update verified flag.
    if (verifiedFlag) {
      if (inputJSON.email) {
        updateJSON.email = inputJSON.email;
      }
      if (inputJSON.address) {
        updateJSON.address = inputJSON.address;
      }
      if (inputJSON.address2) {
        updateJSON.address2 = inputJSON.address2;
      }
      if (inputJSON.city) {
        updateJSON.city = inputJSON.city;
      }
      if (inputJSON.state) {
        updateJSON.state = inputJSON.state;
      }
      if (inputJSON.zipcode) {
        updateJSON.zipcode = inputJSON.zipcode;
      }
      if (inputJSON.phone) {
        updateJSON.phone = inputJSON.phone;
      }
      if (inputJSON.phonetype) {
        updateJSON.phonetype = inputJSON.phonetype;
      }
    } else {
      updateJSON = inputJSON;
    }

    Personal.update({
      username: req.user.username
    }, updateJSON, function(err, smth) {
      if (err) {
        throw err;
      }
      res.send(200);
    });
  }

});