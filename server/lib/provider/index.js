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
    Provider = require('../../models/provider'),
    express = require('express'),
    app = module.exports = express();

//Used to load sample providers.
app.put('/providers', function(req, res){

    var json = req.body;
    
    
    if (json.first_name && json.last_name && json.middle_name && json.credential) {
        json.full_name = json.first_name + " " + json.middle_name.substring(0,1) + ". " + json.last_name + ", " + json.credential;
    } else if (json.first_name && json.last_name && json.credential) {
        json.full_name = json.first_name + " " + json.last_name + ", " + json.credential;
    } else {
        json.full_name = '';   
    }
    
    var provider = new Provider(json);
    provider.save(function (err, saveResults) {
      if (err) {throw err;}
      res.send(200);
    });

});

app.get('/providers', function(req,res){
 
    Provider.find(function(err, results) {
        var resJSON = {};
        resJSON.providers = results;
        res.send(resJSON);
    });
});