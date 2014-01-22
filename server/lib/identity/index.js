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
fs = require('fs');

var express = require('express');
var app = module.exports = express();

//get personal info based on {token}
app.get('/identity/account/:token', function(req, res){
    var account=Account.findOne({token:req.params.token}, function(err, account){
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({error:"invalid token"}));
        }

        if (account === null) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({error:"invalid token"}));
        }
        else {
            var personal=Personal.findOne({username:account.username}, function(err, personal){
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({error:"invalid token"}));
                }
                console.log(personal);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({personal:personal}));
        });
        }
    });
});

//approve/reject identity based on {token}
app.put('/identity/validate/:token', function(req, res){
    if (!req.params.token || req.params.token==="") {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({error:"invalid token"}));
    }

    var personal=Account.findOne({token:req.params.token}, function(err, account){
        if (err) {}
            console.log('account:' + account);

        if (account) {

        account.verified=req.body.verified;

        console.log("PUT body: "+JSON.stringify(req.body));

        if (account.verified) {
            var domain="";
            if (app.get("role")==="phix") {domain=app.get("hub_domain");}
            if (app.get("role")==="clinician") {domain=app.get("node_domain");}

            account.directemail=account.username+"@"+domain;
            account.token="";
        }
        else { account.directemail="";}

        account.save(function (err, account) {
          if (err) { console.log("some err in account save call");} // TODO handle the error

          console.log("account saved");

            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (account.verified) {res.end(JSON.stringify({directemail:account.directemail, status:"approved"}));}
            else {res.end(JSON.stringify({directemail:account.directemail, status:"rejected"}));}
        });

        } else {
          res.send(200, 'Profile already validated');
        }
    });

});