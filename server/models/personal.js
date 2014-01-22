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
var Personal = new Schema({
    firstname: String,
    middlename: String,
    lastname: String,

    birthdate: Date,

    ssn: String,

    gender: String,

    address: String,
    address2: String,
    city: String,
    state: String,
    zipcode: String,

    phone: String,

    phonetype: String,

    email: String,

    verified: String,
    token: String,

    username: String,
    
    //DIRECT email assigned after in-person verification
    directemail: String

});

module.exports = mongoose.model('Personal', Personal);