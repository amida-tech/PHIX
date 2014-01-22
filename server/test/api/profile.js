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
var Profile = require('../../models/personal');
var Account = require('../../models/account');
var mongoose = require('mongoose');
var config = require('../../config.js');
var deploymentLocation = 'http://' + config.server.url + ':' + config.server.port;
var databaseLocation = 'mongodb://' + config.database.url + '/' + config.database.name;
var api = supertest.agent(deploymentLocation);
var common = require('../common/commonFunctions');

if (mongoose.connection.readyState === 0) {
    mongoose.connect(databaseLocation);
};

describe('Unauthorized Profile API Testing', function() {

  it('GET Profile Unauthorized', function(done) {
    api.get('/profile')
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });  
  });

  it('PUT Profile Unauthorized', function(done) {
    api.put('/profile')
    .send({test: 'fail'})
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
     });  
  });  
    
});


/*Code block loads user for testing.*/
/*===========================================================*/

testName = 'profileUser';
testPass = 'test';
testEmail = 'test@demo.org';

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
});

testJSON = {};
resetTestJSON();    
    
function resetTestJSON () {
  testJSON = {
    firstname: 'Frankie',
    middlename: 'Q',
    lastname: 'Avalon',
    birthdate: '06/19/2013',
    ssn: '123-45-6789',
    gender: 'male',
    address: '123 Fake Street',
    address2: 'Apt 6',
    city: 'Arlington',
    state: 'VA',
    zipcode: '12345',
    phone: '1-234-999-1234',
    phonetype: 'mobile'
  }
}  


describe('testing this thing', function () {
    
it('PUT Enrollment Authorized', function(done) {
    api.put('/profile')
    .send(testJSON)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      resetTestJSON();
      removeProfile(done);
     });  
  });
 

 it('GET Enrollment Authorized', function(done) {
    api.put('/profile')
    .send(testJSON)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
        api.get('/profile')
        .expect(200)
        .end(function(err, res2) {
           resetTestJSON();
           removeProfile(done);
        });
     });  
  });
    
    
it('PUT firstname null', function(done) {
  testJSON.firstname = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT firstname empty', function(done) {
  testJSON.firstname = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});    
    
it('PUT firstname too long', function(done) {
  testJSON.firstname = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT firstname missing', function(done) {
  delete testJSON.firstname
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});   

it('PUT lastname null', function(done) {
  testJSON.lastname = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT lastname empty', function(done) {
  testJSON.lastname = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});    
    
it('PUT lastname too long', function(done) {
  testJSON.lastname = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT lastname missing', function(done) {
  delete testJSON.lastname
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 
    
it('PUT gender missing', function(done) {
  delete testJSON.gender
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT gender null', function(done) {
  testJSON.gender = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT gender empty', function(done) {
  testJSON.gender = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 


it('PUT gender male', function(done) {    
  testJSON.gender = 'male';  
  api.put('/profile')
  .send(testJSON)
  .expect(200)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    removeProfile(done);
   });      
});    

it('PUT gender female', function(done) {
  testJSON.gender = 'female';    
  api.put('/profile')
  .send(testJSON)
  .expect(200)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    removeProfile(done);
   });      
});    

it('PUT gender none', function(done) {
  testJSON.gender = 'none';    
  api.put('/profile')
  .send(testJSON)
  .expect(200)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    removeProfile(done);
   });      
});
 
it('PUT address missing', function(done) {
  delete testJSON.address
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT address null', function(done) {
  testJSON.address = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT address empty', function(done) {
  testJSON.address = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 
    
it('PUT address too long', function(done) {
  testJSON.address = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT city missing', function(done) {
  delete testJSON.city
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT city null', function(done) {
  testJSON.city = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT city empty', function(done) {
  testJSON.city = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 
    
it('PUT city too long', function(done) {
  testJSON.city = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT state missing', function(done) {
  delete testJSON.state
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT state null', function(done) {
  testJSON.state = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT state empty', function(done) {
  testJSON.state = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT state bad value', function(done) {
  testJSON.state = 'XX';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});     

it('PUT state good value', function(done) {
  testJSON.state = 'MD';    
  api.put('/profile')
  .send(testJSON)
  .expect(200)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    removeProfile(done);
   });      
});     

it('PUT zipcode missing', function(done) {
  delete testJSON.zipcode
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT zipcode null', function(done) {
  testJSON.zipcode = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT zipcode empty', function(done) {
  testJSON.zipcode = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT zipcode alpha value', function(done) {
  testJSON.state = '12B34';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});   

it('PUT zipcode too long', function(done) {
  testJSON.state = '1233334';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});  

it('PUT zipcode too short', function(done) {
  testJSON.state = '123';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT phone missing', function(done) {
  delete testJSON.phone
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT phone null', function(done) {
  testJSON.phone = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT phone empty', function(done) {
  testJSON.phone = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT birthdate missing', function(done) {
  delete testJSON.birthdate
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT birthdate null', function(done) {
  testJSON.birthdate = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT birthdate empty', function(done) {
  testJSON.birthdate = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT ssn missing', function(done) {
  delete testJSON.ssn
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT ssn null', function(done) {
  testJSON.ssn = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT ssn empty', function(done) {
  testJSON.ssn = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});
    
it('PUT phonetype missing', function(done) {
  delete testJSON.phonetype
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT phonetype null', function(done) {
  testJSON.phonetype = null;    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});

it('PUT phonetype empty', function(done) {
  testJSON.phonetype = '';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
}); 

it('PUT phonetype invalid', function(done) {
  testJSON.phonetype = 'telegraph';    
  api.put('/profile')
  .send(testJSON)
  .expect(400)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    done();
   });      
});
    
it('PUT phonetype mobile', function(done) {
  testJSON.phonetype = 'mobile';    
  api.put('/profile')
  .send(testJSON)
  .expect(200)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    removeProfile(done);
   });      
}); 
    
it('PUT phonetype landline', function(done) {
  testJSON.phonetype = 'landline';    
  api.put('/profile')
  .send(testJSON)
  .expect(200)
  .end(function(err, res) {
    if (err) return done(err);
    resetTestJSON();
    removeProfile(done);
   });      
});
    
   after(function(done) {
     Profile.remove({username: testName}, function(err) {
      if (err) done(err);
      Account.remove({username: testName}, function(err) {
        if (err) done(err);
        done();   
      });
     });
   });
   
});


function removeProfile (callback) {
  Profile.remove({username: testName}, function(err) {
    if (err) done(err);
    callback();
  });
};