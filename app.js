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

var express = require("express")
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , passport = require('passport');

var app = express();
var viewDir = __dirname + '/views';
var sessionIdentifier = '';


//TODO: review all of those app settings
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));




//app.set('views', viewDir)
//app.set('view engine', 'jade')
app.use(express.static('public'))
//app.use(express.logger('dev'))
app.use(function (req, res, next) {
    var viewPath = viewDir + req.path + '.jade';
    fs.exists(viewPath, function (exists) {
      if (exists) {
        res.render(req.path.substr(1));
      } else {
        next();
      }
    });
  })




app.use(express.static(path.join(__dirname, 'public')));
//App configuration done

//Allow CORS requests fix for cross-domain requests.
//TODO:  Need to limit origin to app url.
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

function prod_env(){
    console.log("env: production");
    app.use(function(err, req, res, next){
        console.log(err.stack);
        res.send(500, 'Something broke!');
    });
    app.set('phix_path','http://phix.amida-demo.com');
    app.set('clinician_path','http://clinician.amida-demo.com');
    app.set('ip','127.0.0.1');

    app.set('smtp_host','localhost');
    app.set('smtp_port','465');
    app.set('smtp_user', 'catchall');
    app.set('smtp_password', 'password');
    app.set('smtp_debug',true)

    app.set('hub_domain', 'hub.amida-demo.com');
    app.set('node_domain', 'node.amida-demo.com');

    app.set('template_path', '/usr/share/nginx/www/PHIX');

    app.set('direct', true);
}

function dev_env(){
    console.log("env: development");
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('phix_path','http://localhost:3001');
    app.set('clinician_path','http://localhost:3002');
    app.set('ip','0.0.0.0');

    app.set('hub_domain', 'hub.amida-demo.com');
    app.set('node_domain', 'node.amida-demo.com');

    app.set('template_path', '.');

    app.set('direct', false);
}

function phix_env() {
    console.log("app: phix");
    sessionIdentifier = 'phix.sid';
    app.set('database','portal');
    app.set('other_database','portal_clinician');

    app.set('role','phix');
    app.set('port','3001');

    app.set('sender_host', 'test1.amida-demo.com');
    app.set('receiver_host', 'test2.amida-demo.com');

}

function clinician_env(){
    console.log("app: clinician front-end");
    sessionIdentifier = 'clinician.sid';
    app.set('database','portal_clinician');
    app.set('other_database','portal');

    app.set('role','clinician');
    app.set('port','3002');

    app.set('sender_host', 'test2.amida-demo.com');
    app.set('receiver_host', 'test1.amida-demo.com');
}

app.configure('phix.dev', function(){
    phix_env();
    dev_env();
});

app.configure('clinician.dev', function(){
    clinician_env();
    dev_env();
});

app.configure('phix.prod', function(){
    phix_env();
    prod_env();
});

app.configure('clinician.prod', function(){
    clinician_env();
    prod_env();
});

app.use(express.cookieParser('your secret here'));
app.use(express.session({ secret: '<*> ITS A SECRET TO EVERYBODY. <*>', key: sessionIdentifier }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.messages = req.session.messages;
  next();
});

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

// Connect mongoose
mongoose.connect('mongodb://localhost/'+app.get("database"));


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

var db_settings = {
    "database": app.get("database"),
    "other_database": app.get("other_database"),
    "direct": app.get("direct")
};

//launch Nodejs/Express only after DBs are initialized
require('./lib/db').init(db_settings, function(connections) {
    app.set("db_conn",connections["database"]);
    app.set("grid_conn",connections["grid"]);
    if (!app.get("direct")){
        app.set("db_other_conn",connections["other_database"]);
        app.set("grid_other_conn",connections["other_grid"]);
        app.set("message2",connections["message2"]);
    }

    app.listen(app.get('port'));
    console.log("listening on port "+app.get('port'));
});

