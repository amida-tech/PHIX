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

//This is data model used for access rules
var Delegation = new Schema({
	username: String,
	delegate: String,
	active: Boolean,
	granted: Date,
	revoked: Date
});

module.exports = mongoose.model('Delegation', Delegation);