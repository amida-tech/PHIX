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

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//This is data model used for Identity Validation and user's profile "personal attributes" (can be used later for something)
var Attachments = new Schema({
    fileName: String, //filename of file.
    identifier: String //identifier pointing to grid record.
}, {autoIndex: false});

var Message = new Schema({
    owner: {type: Schema.ObjectId, required: true },
    type: Boolean,  //true means inbox, false means outbox.
    sender: String,
    recipient: String,
    sent: Date,
    received: Date,
    subject: String,
    contents: String,
    read: {
        type: Boolean,
        "default": false
    },
    archived: {
        type: Boolean,
        "default": false
    },
    attachments: [Attachments]
}, {autoIndex: false});

module.exports = mongoose.model('Message', Message);
module.exports.msg = Message;