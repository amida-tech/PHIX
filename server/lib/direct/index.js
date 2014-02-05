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
    Message = require('../../models/message'),
    fs = require('fs'),

    mongo = require('mongodb'),
    mongoose = require('mongoose'),

    ObjectId = require('mongodb').ObjectID,
    Db = mongo.Db,
    Grid = mongo.Grid,

    blueButton = require('../parse/bluebutton.js'),

    archiver = require('archiver'),
    express = require('express'),
    app = module.exports = express(),
    auth = require('../../lib/account');

var express = require('express');
var app = module.exports = express();


var simplesmptp = require('simplesmtp');

var MailComposer = require("mailcomposer").MailComposer;

var grid;
var db;

var grid_other;
var db_other;
var Message2;

//get list of incoming emails
app.get('/direct/inbox', auth.ensureAuthenticated, function(req, res) {
    //Lookup DIRECT email address for recipient filtering.
    var getEmailQuery = Account.findOne({
        username: req.user.username
    }, 'directemail');
    getEmailQuery.exec(function(err, queryResults) {
        if (err) {
            throw err;
        }
        //Find all User Messages.
        var message = Message.find({
            recipient: queryResults.directemail,
            archived: false
        });
        message.sort('-received');
        message.exec(function(err, messageResults) {
            if (err) {
                throw err;
            }
            var responseJSON = {};
            responseJSON.messages = [];
            for (var i = 0; i < messageResults.length; i++) {
                var messageJSON = {};
                messageJSON.sender = messageResults[i].sender;
                messageJSON.recipient = messageResults[i].recipient;
                messageJSON.received = messageResults[i].received;
                messageJSON.subject = messageResults[i].subject;
                messageJSON.contents = messageResults[i].contents;
                messageJSON.message_id = messageResults[i]._id;
                messageJSON.read = messageResults[i].read;
                messageJSON.attachments = messageResults[i].attachments;
                responseJSON.messages.push(messageJSON);
            }
            res.send(responseJSON);
        });
    });
});



//get list of outgoing emails
app.get('/direct/outbox', auth.ensureAuthenticated, function(req, res) {

    var getEmailQuery = Account.findOne({
        username: req.user.username
    }, 'directemail');
    getEmailQuery.exec(function(err, queryResults) {
        if (err) {
            throw err;
        }
        //Find all User Messages.
        var message = Message.find({
            sender: queryResults.directemail,
            archived: false
        });
        message.sort('-received');
        message.exec(function(err, messageResults) {
            if (err) {
                throw err;
            }
            var responseJSON = {};
            responseJSON.messages = [];
            for (var i = 0; i < messageResults.length; i++) {
                var messageJSON = {};
                messageJSON.sender = messageResults[i].sender;
                messageJSON.recipient = messageResults[i].recipient;
                messageJSON.received = messageResults[i].received;
                messageJSON.subject = messageResults[i].subject;
                messageJSON.contents = messageResults[i].contents;
                messageJSON.message_id = messageResults[i]._id;
                messageJSON.read = messageResults[i].read;
                messageJSON.attachments = messageResults[i].attachments;
                responseJSON.messages.push(messageJSON);
            }
            res.send(responseJSON);
        });
    });
});

app.post('/direct/message/:message_id', auth.ensureAuthenticated, function(req, res) {

    var updateJSON = {};
    if (req.body.read) {
        updateJSON.read = req.body.read;
    }

    if (typeof(req.body.archived) !== "undefined") {
        updateJSON.archived = req.body.archived;
    }

    var getEmailQuery = Account.findOne({
        username: req.user.username
    }, 'directemail');
    getEmailQuery.exec(function(err, queryResults) {
        if (err) {
            throw err;
        }
        Message.update({
            _id: req.params.message_id
        }, updateJSON, function(err, updateResults) {
            if (err) {
                throw err;
            }
            res.send(200);
        });
    });
});

app.del('/direct/message/:message_id', auth.ensureAuthenticated, function(req, res) {

    var updateJSON = {};
    updateJSON.archived = true;

    var getEmailQuery = Account.findOne({
        username: req.user.username
    }, 'directemail');
    getEmailQuery.exec(function(err, queryResults) {
        if (err) {
            throw err;
        }
        Message.update({
            _id: req.params.message_id
        }, updateJSON, function(err, updateResults) {
            console.log(updateResults);
            if (err) {
                throw err;
            }
            res.send(200);
        });
    });
});

//send message with DIRECT
function sendMessageDirect(requestJSON, callback) {
    db = app.get("db_conn");
    grid = app.get("grid_conn");


        //substitute internal web app domains to direct domains
        //(e.g. hub.amida-demo.com = > test1.amida-demo.com)
        var to = requestJSON.recipient;
        var from = requestJSON.sender;

        //console.log(messageJSON);

        //saving outgoing message to database (outbox)
        var inputMessage = new Message(requestJSON);
        console.log(inputMessage);
        inputMessage.save(function(err, res) {
            if (err) {
                throw err;
            }
            //Send the message out.
            //callback();

            //initiating SMTP client for DIRECT

        if (app.get('smtp_enabled')) {

            var options = {
                secureConnection: true,
                auth: {
                    user: app.get("smtp_user"),
                    pass: app.get("smtp_password")
                },
                debug: app.get("smtp_debug")
            };
            var client = simplesmptp.connect(app.get("smtp_port"), app.get("smtp_host"), options);

            //preparing MIME message
            var mailcomposer = new MailComposer();
            mailcomposer.addHeader("x-mailer", "Nodemailer 1.0");
            mailcomposer.setMessageOption({
                from: from,
                to: to,
                subject: requestJSON.subject,
                body: requestJSON.contents
            });

            //SMTP envelope
            client.once("idle", function() {
                client.useEnvelope({
                    from: from,
                    to: [to]
                });
            });

            //SMTP message
            client.on("message", function() {
                console.log("on message event");

                var att_count = requestJSON.attachments.length;
                var count = 0;

                function findAttachment(err, coll) {
                    if (err) {
                        throw err;
                    }
                    var objectID = new ObjectId(identifier);

                    function transmitAttachment(err, data) {
                        if (err) {
                            throw err;
                        }
                        //attachment content fetched form Grid, save it to string
                        var returnFile = data.toString();
                        console.log("sendmail: " + filename);
                        sendmail(filename, returnFile);
                    }

                    function getAttachment(err, results) {
                        if (err) {
                            throw err;
                        }
                        if (results) {
                            grid.get(objectID, transmitAttachment);
                        }
                    }

                    coll.findOne({
                        "_id": objectID
                    }, getAttachment);
                }


                //just sending message if no attachments
                if (att_count === 0) {
                    mailcomposer.streamMessage();
                    mailcomposer.pipe(client);
                    console.log("on message event, done (no attachments)");
                }
                //processing attachements first
                else {



                    for (var att in requestJSON.attachments) {
                        var filename = requestJSON.attachments[att].fileName;
                        var identifier = requestJSON.attachments[att].identifier;




                        //load file content from storage.files
                        db.collection('storage.files', findAttachment);
                    }
                }

                //add attachments content to MIME message and send it once all attachments added
                function sendmail(filename, contents) {
                    mailcomposer.addAttachment({
                        fileName: filename,
                        contents: contents
                    });
                    count = count + 1;
                    if (count === att_count) {
                        mailcomposer.streamMessage();
                        mailcomposer.pipe(client);
                        console.log("on message event, done (with attachments)");
                    }
                }

            });

            //SMTP send and quit connection
            client.on("ready", function(success, response) {
                if (success) {
                    console.log("The message was transmitted successfully with " + response);
                    client.quit();
                    callback();
                } else {
                    console.log("error on ready " + response);
                }
            });

        } else {
            callback();
        }

            //callback();
        });
}


function sendMessage(requestJSON, callback) {
        sendMessageDirect(requestJSON, callback);
}

//Need to export to function for use to trigger automatic messages.
module.exports.sendMessage = sendMessage;

app.put('/direct/message', auth.ensureAuthenticated, function(req, res) {

    if (!req.user.verified) {
        res.send(401, 'Unverified users cannot transmit messages.');
    };

    var requestJSON = {};
    requestJSON.owner = req.user._id;
    requestJSON.sender = req.user.directemail;
    requestJSON.recipient = req.body.recipient;
    requestJSON.received = new Date();
    requestJSON.subject = req.body.subject;
    requestJSON.contents = req.body.contents;
    requestJSON.attachments = req.body.attachments;
    requestJSON.read = true;
    requestJSON.archived = false;

    sendMessage(requestJSON, function() {
        res.send(200);
    });

});