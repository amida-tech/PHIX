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
var https = require('https');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var jsdom = require('jsdom');
var config = require('./config.js');
var redisStore = require('connect-redis')(express);
var app = express();

app.set("domain", config.server.url);


//Optionally enable ssl.
if (config.server.ssl.enabled) {
  var privateKey  = fs.readFileSync(config.server.ssl.privateKey).toString();
  var certificate = fs.readFileSync(config.server.ssl.certificate).toString();
  var credentials = {key: privateKey, cert: certificate};
  var server = https.createServer(credentials, app);
  var redirectServer = http.createServer(function(req, res){
    res.writeHead(301, {
      "Content-Type": "text/plain",
      "Location": "https://" + config.server.url + ":" + config.server.port,
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    });
    res.end("Redirect to secure server");
  }).listen(config.server.redirectPort);
} else {
  var server = http.createServer(app);
}

//Optionally load SMTP parameters.
if (config.smtp.enabled) {
  app.set('smtp_enabled', true);
  app.set('smtp_debug', config.smtp.debug);
  app.set('smtp_username', config.smtp.username);
  app.set('smtp_password', config.smtp.password);
  app.set('smtp_port', config.smtp.port);
  app.set('smtp_host', config.smtp.host);
}


//Start local client if enabled.
if (config.client.enabled) {

  var viewDir = config.client.location;

  app.set('views', viewDir);
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false,
    'no-debug': true
  });

  app.use(express.favicon(config.client.location + '/favicon.ico'));
  app.use(express.static(config.client.location));
  app.use(function(req, res, next) {
    var requestPath = '';
    if (req.path.substring(req.path.length - 1) === '/') {
      requestPath = req.path.substring(0, req.path.length - 1);
    } else {
      requestPath = req.path;
    }
    var viewPath = viewDir + requestPath + '.jade';
    console.log(viewPath);
    fs.exists(viewPath, function(exists) {
      if (exists) {
        res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        res.render(viewPath);
      } else {
        next();
      }
    });
  });
}


app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

if (config.redis.enabled) {
  var redisConnection = new redisStore({
    host: config.redis.url,
    port: config.redis.port,
    db: config.redis.db
  });
  app.use(express.session({
    secret: config.server.session.key,
    key: config.server.session.name,
    store: redisConnection
  }));
} else {
  app.use(express.session({
    secret: config.server.session.key,
    key: config.server.session.name,
  }));
}
app.use(passport.initialize());
app.use(passport.session());
app.set('template_path', config.template.path);

//Allow CORS requests fix for cross-domain requests.
//TODO:  Need to limit origin to app url.
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return next();
});

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.use(requireHTTPS);


//app.set('phix_path','http://' + config.server.url + ':' + config.server.port);
/*app.use(function(req, res, next) {
  res.locals.messages = req.session.messages;
  next();
});
*/

// Connect mongoose
mongoose.connect('mongodb://' + config.database.url + '/'+ config.database.name);



var identity = require('./lib/identity');
var storage = require('./lib/storage');
var access = require('./lib/access');
var hie = require('./lib/hie');
var master = require('./lib/master');
var direct = require('./lib/direct');
var account = require('./lib/account');
var profile = require('./lib/profile');
var provider = require('./lib/provider');
var delegation  = require('./lib/delegation');



app.use(identity);
app.use(storage);
app.use(access);
app.use(hie);
app.use(master);
app.use(direct);
app.use(account);
app.use(profile);
app.use(delegation);
app.use(provider);

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
    server.listen(config.server.port);
    console.log("Server listening on port "+ config.server.port);
});

