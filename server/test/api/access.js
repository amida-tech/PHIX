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
var supertest = require('supertest');
var config = require('../../config.js')
var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var common = require('../common/commonFunctions');
var mongoose = require('mongoose');

if (mongoose.connection.readyState === 0) {
    mongoose.connect(databaseLocation);
    console.log(databaseLocation);
};

describe('GET Access Unauthorized API Testing', function() {

  it('GET Access Unauthorized', function(done) {
    api.get('/access')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });
  });

  it('DELETE Access Unauthorized', function(done) {
    api.del('/access/fakedoc')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });
  });

    it('POST Access Unauthorized', function(done) {
    api.post('/access/fakedoc')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });
  });

  it('GET Pending Access Unauthorized', function(done) {
    api.get('/access/pending')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });
  });

  it('DELETE Pending Access Unauthorized', function(done) {
    api.del('/access/pending/fakedoc')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });
  });

    it('POST Account Unauthorized', function(done) {
    api.post('/access/pending/fakedoc')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });
  });

});


var testName = 'accessUser';
var testPass = 'test';
var testEmail = 'test@demo.org';
var directEmail = ''
var testProfile = {firstname: 'Jane',middlename: 'Q',lastname: 'Public',birthdate: '06/19/1976',ssn: '123-45-6789',gender: 'male',address: '123 Fake Street',address2: 'Apt 6',city: 'Arlington',state: 'VA',zipcode: '12345',phone: '1-234-999-1234',phonetype: 'mobile'}

describe('Create User', function () {

    it('Create Account', function (done) {
        common.createAccount(api, testName, testPass, testEmail, function(err) {
          if (err) return done(err);
          common.loginAccount(api, testName, testPass, function(err) {
            if (err) return done(err);
            done();
          });
        });
    });

    it('Generate Profile', function(done) {
     common.createProfile(api, testProfile, function(err) {
      if (err) done(err);
      done();
     });
    });

});


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
    permissions:
      {all:false,
        demographics:true,
        procedures:false,
        medications:true,
        allergies:true,
        vitals:true,
        immunizations:true,
        encounters:true,
        problems: true,
        results: true},
    er:false,
    timestamp: "10/29/2013"
};

var data_req2 = {
    username: testName,
    clinician: clinicianTwo,
    permissions:
      {all:true,
        demographics:false,
        procedures:false,
        medications:false,
        allergies:false,
        vitals:false,
        immunizations:false,
        encounters:false,
        problems:false,
        results: false},
    er:true,
    timestamp: "10/29/2013"
};

var data_req3 = {
    username: testName,
    clinician: clinicianThree,
    permissions:
      {all:true,
        demographics:false,
        procedures:false,
        medications:false,
        allergies:false,
        vitals:false,
        immunizations:false,
        encounters:false,
        problems:false,
        results: false},
    er:true,
    timestamp: "10/29/2013"
};

describe('Test GET Pending API', function () {


    before(function(done) {
        common.createRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

    it('GET Pending Requests', function(done) {
       api.get('/access/pending')
       .expect(200)
       .end(function (err, res) {
          if (err) done(err);
          res.body.pendingRequests.length.should.equal(3);
          done();
       });
    });

    after(function(done) {
        common.removeRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

});

describe('Test DELETE Pending API', function () {

    before(function(done) {
        common.createRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

    it('DELETE Pending Requests', function(done) {
       api.get('/access/pending')
       .expect(200)
       .end(function (err, res) {
          var iter = 0;
          for (var i=0;i<res.body.pendingRequests.length;i++) {
             api.del('/access/pending/' + res.body.pendingRequests[i].clinician.clinicianID)
             .expect(200)
             .end(function (err, res) {
                iter = iter + 1;
                if (iter === 3) {
                    api.get('/access/pending')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) done(err);
                        done();
                    });
                };
             });
          }
       });
    });

    after(function(done) {
        common.removeRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

});


describe('Test POST Pending API', function () {

    before(function(done) {
        common.createRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

    it('POST Pending Requests', function(done) {
       api.get('/access/pending')
       .expect(200)
       .end(function (err, res) {
          var iter = 0;
          for (var i=0;i<res.body.pendingRequests.length;i++) {
             api.post('/access/pending/' + res.body.pendingRequests[i].clinician.clinicianID)
             .expect(200)
             .end(function (err, res) {
                iter = iter + 1;
                if (iter === 3) {
                    api.get('/access/pending')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) done(err);
                        done();
                    });
                };
             });
          }
       });
    });

    after(function(done) {
        common.removeRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

});

describe('Test GET Approved API', function () {

    before(function(done) {
        common.createRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.createRequest(api, data_req3, function(err, res) {
                if (err) done(err);
                    common.approveRequest(api, data_req, function(err, res) {
                        if (err) done(err);
                        common.approveRequest(api, data_req2, function(err, res) {
                            if (err) done(err);
                            common.approveRequest(api, data_req3, function(err, res) {
                            if (err) done(err);
                                done();
                            });
                        });
                    });
                })
            });
        });
    });

     xit('GET Approved Requests', function(done) {
       api.get('/access')
       .expect(200)
       .end(function (err, res) {
          console.log(res);
          if (err) done(err);
           res.body.approvedRequests.length.should.equal(3);
           done();
       });
    });


    after(function(done) {
        common.removeRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.removeRequest(api, data_req3, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

});

describe('Test DELETE Approved API', function () {

    before(function(done) {
        common.createRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.createRequest(api, data_req3, function(err, res) {
                if (err) done(err);
                    common.approveRequest(api, data_req, function(err, res) {
                        if (err) done(err);
                        common.approveRequest(api, data_req2, function(err, res) {
                            if (err) done(err);
                            common.approveRequest(api, data_req3, function(err, res) {
                            if (err) done(err);
                                done();
                            });
                        });
                    });
                })
            });
        });
    });

     it('DELETE Approved Requests', function(done) {
       api.get('/access')
       .expect(200)
       .end(function (err, res) {
          if (err) done(err);
          var iter = 0;
          for (var i=0;i<res.body.approvedRequests.length;i++) {
             api.del('/access/' + res.body.approvedRequests[i].clinician.clinicianID)
             .expect(200)
             .end(function (err, res) {
                iter = iter + 1;
                if (iter === 3) {
                    api.get('/access')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) done(err);
                        done();
                    });
                };
             });
          }
       });
    });


    after(function(done) {
        common.removeRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.removeRequest(api, data_req3, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

});

describe('Test POST Approved API', function () {

    before(function(done) {
        common.createRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.createRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.createRequest(api, data_req3, function(err, res) {
                if (err) done(err);
                    common.approveRequest(api, data_req, function(err, res) {
                        if (err) done(err);
                        common.approveRequest(api, data_req2, function(err, res) {
                            if (err) done(err);
                            common.approveRequest(api, data_req3, function(err, res) {
                            if (err) done(err);
                                done();
                            });
                        });
                    });
                })
            });
        });
    });

     it('POST Approved Requests', function(done) {

       api.get('/access')
       .expect(200)
       .end(function (err, res) {
          if (err) done(err);
          var iter = 0;
          for (var i=0;i<res.body.approvedRequests.length;i++) {
             var data_request = {};
             if (i===0) {data_request = data_req} else if (i===1) {data_request = data_req2} else {data_request = data_req3};
             data_request.permissions.procedures = true;
             api.post('/access/' + res.body.approvedRequests[i].clinician.clinicianID)
             .send(data_request)
             .expect(200)
             .end(function (err, res) {
                iter = iter + 1;
                if (iter === 3) {
                    api.get('/access')
                    .expect(200)
                    .end(function (err, listRes) {
                        if (err) done(err);
                        for (var ii=0;ii<listRes.body.approvedRequests.length;ii++) {
                          listRes.body.approvedRequests[ii].permissions.procedures.should.equal(true);
                          if (ii === (listRes.body.approvedRequests.length - 1)) {
                            done();
                          }
                        }
                    });
                };
             });
          }
       });
    });


     after(function(done) {
        common.removeRequest(api, data_req, function(err, res) {
            if (err) done(err);
            common.removeRequest(api, data_req2, function(err, res) {
                if (err) done(err);
                common.removeRequest(api, data_req3, function(err, res) {
                if (err) done(err);
                done();
                })
            });
        });
    });

});

describe('Cleanup Test Account', function () {

        it('Logout Account', function(done) {
       common.logoutAccount(api, function(err) {
        if (err) done(err);
        done();
       });
    });


    it('Remove Account', function(done) {
     common.removeAccount(testName, function(err) {
      if (err) done(err);
      done();
     });
    });

    it('Remove Profile', function(done) {
     common.removeProfile(testName, function(err) {
      if (err) done(err);
      done();
     });
    });

});
