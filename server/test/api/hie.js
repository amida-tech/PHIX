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

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var supertest = require('supertest');
var config = require('../../config.js');
if (config.server.ssl.enabled) {
  var deploymentLocation = 'https://' + config.server.url + ':' + config.server.port;
} else {
  var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
}
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var common = require('../common/commonFunctions');
var mongoose = require('mongoose');

if (mongoose.connection.readyState === 0) {
    mongoose.connect(databaseLocation);
}

var testName = 'janedoe';

var clinicianOne = {
    clinicianName: 'Dr. Henry Wei',
    clinicianID: 'clinician1',
    directemail: 'doctor@node.amida-demo.com'
};

var clinicianTwo = {
    clinicianName: 'Dr. Charles Xavier',
    clinicianID: 'clinician2',
    directemail: 'doctor@node.amida-demo.com'
};

var clinicianThree = {
    clinicianName: 'Dr. Gregory House',
    clinicianID: 'clinician3',
    directemail: 'doctor@node.amida-demo.com'
};


var data_req = {
    username: testName,
    clinician: clinicianOne,
    permissions: {
        all: false,
        demographics: true,
        procedures: false,
        medications: true,
        allergies: true,
        vitals: true,
        immunizations: true,
        encounters: true,
        problems: true,
        results: true
    },
    er: false,
    timestamp: "10/29/2013"
};

var data_req2 = {
    username: testName,
    clinician: clinicianTwo,
    permissions: {
        all: true,
        demographics: false,
        procedures: false,
        medications: false,
        allergies: false,
        vitals: false,
        immunizations: false,
        encounters: false,
        problems: false,
        results: false
    },
    er: true,
    timestamp: "10/29/2013"
};

var data_req3 = {
    username: testName,
    clinician: clinicianThree,
    permissions: {
        all: true,
        demographics: false,
        procedures: false,
        medications: false,
        allergies: false,
        vitals: false,
        immunizations: false,
        encounters: false,
        problems: false,
        results: false
    },
    er: true,
    timestamp: "10/29/2013"
};

//Pulled out of access, needs to be in this file.
describe('PHR requests (HIE) API', function() {

    it('should create new data request', function(done) {
        api.put('/hie/dr.joe')
            .send({
                request: data_req
            })
        // end handles the response
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });

    it('should create other new data request', function(done) {
        api.put('/hie/dr.joe')
            .send({
                request: data_req2
            })
        // end handles the response
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });

    it('should create other new data request', function(done) {
        api.put('/hie/dr.joe')
            .send({
                request: data_req3
            })
        // end handles the response
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });

    it('should delete data requests for clinician/patient pair', function(done) {
        api.del('/hie/clinician1/janedoe')
        // end handles the response
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });

    it('should delete data requests for clinician/patient pair', function(done) {
        api.del('/hie/clinician2/janedoe')
        // end handles the response
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });

    it('should delete data requests for clinician/patient pair', function(done) {
        api.del('/hie/clinician3/janedoe')
        // end handles the response
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            // this is should.js syntax, very clear
            res.should.have.status(200);
            done();
        });
    });

});