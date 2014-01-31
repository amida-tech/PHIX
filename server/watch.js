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

//Watch inbox dir and add messages to PHIX database
var Account = require('./models/account'),
    Personal = require('./models/personal'),
    Message = require('./models/message'),
    fs = require('fs'),
	blueButton = require('./lib/parse/bluebutton.js'),

    mongoose = require('mongoose'),
    mongo = require('mongodb'),
    ObjectId = require('mongodb').ObjectID,
    Db = mongo.Db,
    Grid = mongo.Grid,

    archiver = require('archiver');

var simplesmptp = require('simplesmtp');

var MailComposer = require("mailcomposer").MailComposer;

var host="";
var receiver=""
var db_name=""

// for phix app
if ('phix' == process.env.NODE_ENV) {
    host="hub.amida-demo.com";
    receiver="node.amida-demo.com";

    db_name="portal";
}

// for clinician app
if ('clinician' == process.env.NODE_ENV) {
    host="node.amida-demo.com";
    receiver="hub.amida-demo.com";

    db_name="portal_clinician";
}


var areWeDone=3*2+3*3+3+3+3+3;

var grid;
var db;

dbConn();

function dbConn() {
  Db.connect('mongodb://localhost/'+db_name, function(err, dbase) {
    if (err) throw err;
    db = dbase;
    grid = new Grid(db, 'storage');
    doit();
  });
}

function doit(){
var fs = require('fs'),
    Message = require('./models/message'),
    ncp = require('ncp').ncp;

var MailParser = require("mailparser").MailParser;

var files_root="./";

// Connect mongoose
//mongoose.connect('mongodb://localhost/portal-test');
mongoose.connect('mongodb://localhost/'+db_name);


var chokidar = require('chokidar');

//TODO: change to production dir
//var watch_dir="/opt/direct/incoming";

var watch_dir="eml";

var watcher = chokidar.watch('file or dir', {ignored: /^\./, persistent: true});

watcher
  .on('add', function(path) {console.log('File', path, 'has been added');})
  .on('change', function(path) {console.log('File', path, 'has been changed');})

// 'add' and 'change' events also receive stat() results as second argument.
// http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('add', function(path, stats) {
  console.log('File', path, 'changed size to', stats.size);

  process_file(path);
  console.log("done processing");
});

watcher.add(watch_dir);

// Only needed if watching is persistent.
watcher.close();


function process_file(filepath) {
		console.log("processing "+filepath);

		var mailparser = new MailParser();

		var att_count=0;

		mailparser.on("end", function(mail_object){

		    console.log("Subject:", mail_object.subject);
		    console.log("From:", mail_object.from);
		    console.log("To:", mail_object.to);
			console.log("Text body:", mail_object.text);
			console.log("Attachments:", mail_object.attachments);

			var username=mail_object.to[0].address.substring(0,mail_object.to[0].address.search("@"));
			console.log('username= '+username);
			//username="janedoe";

    		var messageJSON = {};
	        messageJSON.sender = mail_object.from[0].address;
            messageJSON.recipient = mail_object.to[0].address;
            messageJSON.received = new Date();
            messageJSON.subject = mail_object.subject;
            messageJSON.contents = mail_object.text;
            messageJSON.read = false;
            messageJSON.archived = false;
            messageJSON.attachments = []; //requestJSON.attachments;

            to=messageJSON.recipient.split("@")[0]+"@"+receiver;
            from=messageJSON.sender.split("@")[0]+"@"+host;

	        messageJSON.sender = from;
            messageJSON.recipient = to;
            //messageJSON.recipient = "janedoe@hub.amida-demo.com";

            console.log("to: "+to+", from: "+from);

			att_count=0;
			if (mail_object.attachments) att_count=mail_object.attachments.length;

            if (att_count>0){
            	console.log("we have attachments");
			for (a in mail_object.attachments){


				var attachment=mail_object.attachments[a];
				console.log("generatedFileName "+attachment.generatedFileName);
				//fs.writeFileSync(files_root+"testFiles/"+attachment.generatedFileName, attachment.content);

				//TODO: save attachment to mongo

				console.log("attachment saved");
				var filename=attachment.generatedFileName;
				var content = attachment.content;

				//content is a Buffer
				//console.log(content);

				content=content.toString()

				//console.log(content);

				var fileType="binary/octet";

				  try {
				    var bb = blueButton(content);

				    var bbMeta = bb.document();

				    if (bbMeta.type === 'ccda') {
				      fileType="CCDA";
				    }
				  }
				  catch(e)
				  {
				    //do nothing, keep original fileType
				  }

				  console.log("fileType: "+fileType);

					//Save attacheent to storage
				  var buffer = new Buffer(content);
				  grid.put(buffer, {metadata: {source: "inbox", details: mail_object.subject,owner: username, parsedFlag: false}, 'filename': filename, 'content_type': fileType}, function(err, fileInfo) {
				    if(err) throw err;
				    var recordId = fileInfo._id
				    //console.log("Record Stored in Gridfs: " + recordId);
				    //console.log(fileInfo);

				    identifier=fileInfo._id;

				    //res.send({fileName: fileInfo.filename, identifier: fileInfo._id});
				    messageJSON.attachments.push({fileName: filename, identifier: identifier});
				    done();
				  });
			}
		}
		else{
			console.log("no attachments");
            var inputMessage = new Message(messageJSON);
            inputMessage.save(function(err, res) {
               if (err) throw err;
               //Send the message out.
                //callback();
            });

		}

            var count = 0;

            function done() {
                count = count + 1;
                if (count == att_count) {
                    console.log("saving message with all attachments");
                    var inputMessage = new Message(messageJSON);
                    inputMessage.save(function(err, res) {
                        if (err) throw err;
                        //Send the message out.
                        //callback();
                    });

                }

            }

		});

		//fs.createReadStream("test/email.eml").pipe(mailparser);
		fs.createReadStream(filepath).pipe(mailparser);

		function done(){
			        console.log("done");
		}


};
};