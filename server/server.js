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
var fs = require('fs');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var jsdom = require('jsdom');
var config = require('./config.js');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: config.server.session.key, key: config.server.session.name }));
app.use(passport.initialize());
app.use(passport.session());

//Allow CORS requests fix for cross-domain requests.
//TODO:  Need to limit origin to app url.
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});




//app.set('phix_path','http://' + config.server.url + ':' + config.server.port);
/*app.use(function(req, res, next) {
  res.locals.messages = req.session.messages;
  next();
});
*/

// Connect mongoose
mongoose.connect('mongodb://' + config.database.url + '/'+ app.get("database"));



var identity = require('./lib/identity');
var storage = require('./lib/storage');
var access = require('./lib/access');
var hie = require('./lib/hie');
var master = require('./lib/master');
var direct = require('./lib/direct');
var account = require('./lib/account');
var profile = require('./lib/profile');
var provider = require('./lib/provider');
/*var delegation  = require('./lib/delegation');*/



app.use(identity);
app.use(storage);
app.use(access);
app.use(hie);
app.use(master);
app.use(direct);
app.use(account);
app.use(profile);
/*app.use(delegation);*/
app.use(provider);


//app.listen(config.server.port);

//This is code used to override the need of a second database.
var db_settings = {database: 'portal',
                   other_database: 'portal',
                   direct: 'false'};




//launch Nodejs/Express only after DBs are initialized
require('./lib/db').init(db_settings, function(connections) {
    app.set("db_conn",connections["database"]);
    app.set("grid_conn",connections["grid"]);
    if (!app.get("direct")){
        app.set("db_other_conn",connections["other_database"]);
        app.set("grid_other_conn",connections["other_grid"]);
        app.set("message2",connections["message2"]);
    }

    app.listen(config.server.port);
    console.log("listening on port "+ config.server.port);
});

