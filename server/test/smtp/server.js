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

var simplesmtp = require("simplesmtp");

var smtpServer = simplesmtp.createServer({SMTPBanner:"My Server", debug: true, secureConnection: true, requireAuthentication: true, disableDNSValidation: true}, function(req){
    process.stdout.write("\r\nNew Mail:\r\n");
    req.on("data", function(chunk){
        process.stdout.write(chunk);
    });
    req.accept();
})

smtpServer.listen(2500, function(err){
    if(!err){
        console.log("SMTP server listening on port 2500");
    }else{
        console.log("Could not start server on port 2500.");
        console.log(err.message);
    }
});


smtpServer.on("authorizeUser", function(connection, username, password, callback) {
	callback(null, true);
});


