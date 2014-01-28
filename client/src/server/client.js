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

var express = require("express");
var http = require('http');
var fs = require('fs');
var path = require('path');
var config = require('./config.js');

var app = express();
var viewDir = __dirname + '/views';


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    var viewPath = viewDir + req.path + '.jade';
    fs.exists(viewPath, function (exists) {
      if (exists) {
        res.render(req.path.substr(1));
      } else {
        next();
      }
    });
  });

app.listen(config.client.port);
    console.log("listening on port "+ config.client.port);

