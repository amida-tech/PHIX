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

var Provider = new Schema({
  npi: String,
  type: String,
  last_name: String,
  first_name: String,
  middle_name: String,
  full_name: String,
  credential: String,
  business_address: String,
  practice_address: {
    address_line: String,
    address_details_line: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    fax: String
  },
  provider_business_practice_location_address_country_code_if_out: String,
  enumeration_date: Date,
  last_update_date: Date,
  gender: String,
  provider_details: String,
  other_identifiers: String,
  sole_proprietor: String,
  direct_email: String
});

module.exports = mongoose.model('Provider', Provider);