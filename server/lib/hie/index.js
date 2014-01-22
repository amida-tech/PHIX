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

var Request = require('../../models/request');
var Account = require('../../models/account');
var Personal = require('../../models/personal');
var express = require('express');
var app = module.exports = express();

var fs = require('fs');
var request = require('request');


app.post('/hie/lookup', function(req,res) {

    var queryParameters = req.body;

    if (app.get("role")==="phix") {

        var queryArray = [];
        var queryJSON = {};

        if (queryParameters.middlename) {
            queryJSON = {firstname: queryParameters.firstname, middlename: queryParameters.middlename, lastname: queryParameters.lastname, birthdate: queryParameters.birthdate};
        } else {
            queryJSON = {firstname: queryParameters.firstname, lastname: queryParameters.lastname, birthdate: queryParameters.birthdate};
        }

        Personal.find(queryJSON, function(err, personalQueryResults) {
           if (err) {throw err;}
            if (personalQueryResults.length === 0) {res.send(200, 'no results');}

            function findAccount (personal, iter, callback) {
                Account.findOne({username: personal.username}, function(err, accountQueryResults) {
                    if (err) {throw err;}
                    callback(personal, accountQueryResults, iter);
                });
            }

            function returnAccount (personalResults, accountResults, iteration) {

                    //console.log(personalResults);
                    //console.log(accountResults);
                    //console.log(iteration);

                    var queryResponse = {};

                    if (personalResults.firstname && personalResults.lastname && personalResults.middlename) {
                         queryResponse.fullname = personalResults.firstname + ' ' + personalResults.middlename + ' ' + personalResults.lastname;
                     } else if (personalResults.firstname && personalResults.lastname) {
                         queryResponse.fullname = personalResults.firstname + ' ' + personalResults.lastname;
                     }

                    queryResponse.directemail = accountResults.directemail;
                    queryResponse.username = personalResults.username;
                    queryResponse.city = personalResults.city;
                    queryResponse.state = personalResults.state;
                    queryResponse.zipcode = personalResults.zipcode;

                    queryArray.push(queryResponse);

                    if ((iteration + 1) === personalQueryResults.length) {
                     queryResponse = {accounts: queryArray};
                     res.send(queryResponse);
                    }
                

            }


            for (var i=0;i<personalQueryResults.length;i++) {
                findAccount(personalQueryResults[i], i, returnAccount);
            }



        });
    }
    if (app.get("role")==="clinician") {

      request(
        {url:app.get("phix_path")+'/hie/lookup',
          method:"post",
          headers:{'content-type': 'application/json'},
          body:JSON.stringify(req.body)},

          function (error, response, body) {

                  console.log(JSON.stringify(body));
                  res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                  res.write(body);
                  res.end();
          }

      );
    }
});

//Get clinician's data requests
app.get('/hie/:clinician', function(req, res){
    if (app.get("role")==="phix") {
      var reqQuery = Request.find({clinician: req.params.clinician});

      reqQuery.exec(function (err, val) {
        if (err) {throw err;}
        var reqs={requests:[]};
        for (var r in val) {
          reqs.requests.push(val[r]);
        }

        console.log("requests:");
        console.log(reqs);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(reqs));
        res.end();
      });
    }
    if (app.get("role")==="clinician") {
        var clinician=req.params.clinician;
      //TODO: implement modify rule functionality

      request(
        {url:app.get("phix_path")+'/hie/'+clinician,
          method:"get", //TODO: this call is not used
          headers:{'content-type': 'application/json'},
          body:JSON.stringify(req.body)
        },
        function (error, response, body) {
                if (error) {throw error;}
                console.log(JSON.stringify(body));
                res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                res.write(body);
                res.end();

      });
    }
});

//TODO: this API call is not used (I think?)
//Delete clinician's data request for username's data
app.del('/hie/:clinician/:username', function(req, res){
  var reqQuery = Request.findOne({username: req.params.username, 'clinician.clinicianID':req.params.clinician});

  reqQuery.remove(function (err) {
    if (err) {throw (err);}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({status:"deleted"}));
      res.end();
    });
  });

//TODO: this API call is not used (I think?)
//Add/modify user's new access_rule
app.put('/hie/:clinician', function(req, res){

    var clinician=req.params.clinician;

    if (app.get("role")==="clinician") {
        
        //var reqJSON = req.body.request;

          request(
            {url:app.get("phix_path")+'/hie/'+clinician,
              method:"put",
              headers:{'content-type': 'application/json'},
              body:JSON.stringify(req.body)
            },
            function (error, response, body) {
                    if (error) {throw error;}
                    console.log(JSON.stringify(body));
                    res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                    res.write(body);
                    res.end();

          });
    } else {
  
      var reqJSON = req.body.request;
      //TODO: implement modify rule functionality
      console.log(reqJSON);

      reqJSON.status="pending";
      reqJSON.active=false;

      var r = new Request(reqJSON);

      r.save( function(err, qres) {
        if (err) {throw err;}
                //Log successful save status.
                //req.session.messages = [{'status': 'success', 'description': 'Profile updated successfully.'}];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({status:"saved"}));
                res.end();
              });
    }
});
