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

function getMailMeta(user_id, callback) {

    function done(err) {
        if (err) {
            callback(err);
        }
        if ((mailboxMeta.inbox >= 0) && (mailboxMeta.outbox >= 0) && (mailboxMeta.inboxUnread >= 0) && (mailboxMeta.archived >= 0)) {
            callback(null, mailboxMeta);
        }
    }

    if (!user_id) {
        callback('Error: No user id found.');
    } else {
        var mailboxMeta = {};
        Message.count({
            owner: user_id,
            inbox: true
        }, function(err, count) {
            if (err) {
                done(err);
            }
            mailboxMeta.inbox = count;
            done();
        });
        Message.count({
            owner: user_id,
            inbox: true,
            read: false
        }, function(err, count) {
            if (err) {
                done(err);
            }
            mailboxMeta.inboxUnread = count;
            done();
        });
        Message.count({
            owner: user_id,
            outbox: true
        }, function(err, count) {
            if (err) {
                done(err);
            }
            mailboxMeta.outbox = count;
            done();
        });
        Message.count({
            owner: user_id,
            inbox: false,
            outbox: false
        }, function(err, count) {
            if (err) {
                done(err);
            }
            mailboxMeta.archived = count;
            done();
        });
    }
}

//TODO:  Evaluate if sort applies before or after query.
function getMailInbox(user_id, response_start, response_end, callback) {
    Message.find({
        owner: user_id,
        inbox: true,
        archived: false
    }, 'sender stored subject read', {
        sort: {
            'stored': -1
        },
        skip: response_start,
        limit: response_end
    }, function(err, results) {
        var inboxJSON = {};
        inboxJSON.messages = results;
        if (err) {
            callback(err);
        } else {
            callback(null, inboxJSON);
        }
    });
}

//TODO:  Evaluate if sort applies before or after query.
function getMailOutbox(user_id, response_start, response_end, callback) {
    Message.find({
        owner: user_id,
        outbox: true,
        archived: false
    }, 'recipient stored subject', {
        sort: {
            'stored': -1
        },
        skip: response_start,
        limit: response_end
    }, function(err, results) {
        var outboxJSON = {};
        outboxJSON.messages = results;
        if (err) {
            callback(err);
        } else {
            callback(null, outboxJSON);
        }
    });
}

//TODO:  Evaluate if sort applies before or after query.
function getMailArchive(user_id, response_start, response_end, callback) {
    Message.find({
        owner: user_id,
        archived: true
    }, 'recipient sender stored subject read', {
        sort: {
            'stored': -1
        },
        skip: response_start,
        limit: response_end
    }, function(err, results) {
        var archiveJSON = {};
        archiveJSON.messages = results;
        if (err) {
            callback(err);
        } else {
            callback(null, archiveJSON);
        }
    });
}

//TODO:  Evaluate if sort applies before or after query.
function getMailAll(user_id, response_start, response_end, callback) {
    Message.find({
        owner: user_id
    }, 'sender recipient stored subject read', {
        sort: {
            'sent': -1
        },
        skip: response_start,
        limit: response_end
    }, function(err, results) {
        var allJSON = {};
        allJSON.messages = results;
        if (err) {
            callback(err);
        } else {
            callback(null, allJSON);
        }
    });
}

function getMailMessage(user_id, message_id, callback) {
    Message.findOne({
        owner: user_id,
        _id: message_id
    }, 'sender recipient stored subject contents attachments archived read', function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
}

function checkMessage(message, callback) {
    var checkArray = [];
    //RFC 2822 Suggests 78 Char subject limit.  Subject not required.
    if (message.subject) {
        if (message.subject.length > 77) {
            checkArray.push('Message subject must be under 78 characters in length.');
        }
    }
    //Recipient Required, must be under 255 characters in length, and must match email regex.
    if (message.recipient === undefined || !message.recipient) {
        checkArray.push('Message must have a recipient.');
    }
    if (message.recipient) {
        if (message.recipient.length === 0 || message.recipient === null) {
            checkArray.push('Message must have a recipient');
        }
        var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (emailPattern.test(message.recipient) === false) {
            checkArray.push('Incorrectly formatted email recipient.');
        }
        if (message.recipient.length > 254) {
            checkArray.push('Recipient must be under 255 characters in length.');
        }
    }
    //Max message length set to 1000.
    if (message.contents) {
        if (message.contents.length > 1000) {
            checkArray.push('Message Body too long.');
        }
    }
    //Need to do some attachment validation.
    callback(checkArray);
}

function saveMessage(user_id, message, callback) {
    var messageJSON = {};
    messageJSON.owner = user_id;
    messageJSON.stored = new Date();
    messageJSON.outbox = true;
    if (message.subject) {
        messageJSON.subject = message.subject;
    }
    if (message.recipient) {
        messageJSON.recipient = message.recipient;
    }
    if (message.contents) {
        messageJSON.contents = message.contents;
    }
    if (message.attachments) {
        messageJSON.attachments = message.attachments;
    }

    var persistMessage = new Message(messageJSON);
    persistMessage.save(function(err, res) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
}

app.get('/mail/info', auth.ensureAuthenticated, auth.ensureVerified, function(req, res) {
    getMailMeta(req.user._id, function(err, metaData) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.send(metaData);
        }
    });
});

app.get('/mail/messages/:message_id', auth.ensureAuthenticated, auth.ensureVerified, function(req, res) {

    getMailMessage(req.user._id, req.params.message_id, function(err, mailMessage) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.send(mailMessage);
        }

    });

});

app.post('/mail/messages', auth.ensureAuthenticated, auth.ensureVerified, function(req, res) {

    checkMessage(req.body, function(err) {
        if (err.length > 0) {
            var errorJSON = {};
            errorJSON.errors = err;
            res.send(400, errorJSON);
        } else {
            saveMessage(req.user._id, req.body, function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else {
                    res.send(201);
                }
            });
        }
    });

    //Body has a maximum line length, but no maximum defined message size.  We should set one to keep storage limits down.  Suggest limiting to 1000 for now.
    //Maximum Message size should be set, will do at 10MB for now (hotmail).
});

function updateMessage(user_id, message_id, update_json, callback) {
    query_json = {};
    if (update_json.archived) {
        if (update_json.archived === true || update_json.archived === false) {
            query_json.archived = update_json.archived;
        }
    }
    if (update_json.read) {
        if (update_json.read === true || update_json.read === false) {
            query_json.read = update_json.read;
        }
    }
    Message.findOneAndUpdate({
        owner: user_id,
        _id: message_id
    }, query_json, function(err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
}

app.patch('/mail/messages/:message_id', auth.ensureAuthenticated, auth.ensureVerified, function (req, res) {

    updateMessage(req.user._id, req.params.message_id, req.body, function(err, results) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log(results);
            res.send(200);
        }

    });

});

app.get('/mail/:box', auth.ensureAuthenticated, auth.ensureVerified, function(req, res) {
    var starting_limit = 0;
    var ending_limit = 50;
    if (req.query.start && (isNaN(req.query.start) === false) && req.query.start > 0) {
        console.log(req.query.start);
        starting_limit = req.query.start;
    }
    if (req.query.limit && (isNaN(req.query.limit) === false) && req.query.limit <= 50 && req.query.limit > 0) {
        ending_limit = req.query.limit;
    }


    if (req.params.box === 'inbox') {
        getMailInbox(req.user._id, starting_limit, ending_limit, function(err, inboxResponse) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(inboxResponse);
            }
        });
    } else if (req.params.box === 'outbox') {
        getMailOutbox(req.user._id, starting_limit, ending_limit, function(err, outboxResponse) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(outboxResponse);
            }
        });
    } else if (req.params.box === 'archive') {
        getMailArchive(req.user._id, starting_limit, ending_limit, function(err, archiveResponse) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(archiveResponse);
            }
        });
    } else if (req.params.box === 'all') {
        getMailAll(req.user._id, starting_limit, ending_limit, function(err, allResponse) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(allResponse);
            }
        });
    } else {
        res.send(404);
    }

});




//todo:  add put and del routes.


//Everything below this line going away...

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
        res.send(403, 'Unverified users cannot transmit messages.');
    } else {

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

    }

});