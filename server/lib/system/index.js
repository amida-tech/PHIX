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
var message = require('../../lib/direct');

/*var Account = require('../../models/account'),
    Message = require('../../models/message'),

    mongo = require('mongodb'),
    mongoose = require('mongoose'),

    ObjectId = require('mongodb').ObjectID,
    Db = mongo.Db,
    Grid = mongo.Grid,

    blueButton = require('../parse/bluebutton.js'),

    archiver = require('archiver'),
    express = require('express'),
    
    auth = require('../../lib/account');


var app = module.exports = express();


var simplesmptp = require('simplesmtp');

var MailComposer = require("mailcomposer").MailComposer;

var grid;
var db;

var grid_other;
var db_other;
var Message2;*/


//TODO:  This will need to built out.
function ensureDirectSystemAuthentication (req, res, next) {
    app.get('direct_api_key');
    if('test' === 'test') {
        return next();
    } else {
        res.send(401);
    }
}


//TODO:  Stubbed without authentication, must be added in.
app.post('/system/mailbox/messages', function(req, res) {


    //If matches a record in the user table, accept, if not, send a 403 code.

    message.checkMessage(req.body, function(results) {
        console.log(results);
        res.send(200);
    });


    console.log(req.body);
    

});






















