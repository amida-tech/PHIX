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

var express = require('express')
, app = module.exports = express()
, mongo = require('mongodb')
, ObjectId = require('mongodb').ObjectID
, Db = mongo.Db
, auth = require('../../lib/account')
, fs = require('fs');

var ejs=require('ejs');

var db;



//app.get('/master', function(req, res) {
//  res.send(400);
//});

app.get('/master', auth.ensureAuthenticated, function (req, res) {
    db=app.get("db_conn");

    console.log(req.isAuthenticated());
    var elementList = ['demographics', 'allergies', 'encounters', 'immunizations',  'results', 'medications', 'problems', 'procedures', 'vitals'];
    var responseJSON = {};
    var elementCount = 0;
    for (var i=0; i<elementList.length; i++) {
    lookupElement(elementList[i], i, elementList.length);
    }

    function lookupDone () {
      if (elementCount === elementList.length) {
          res.send(responseJSON);
      }
    }

    function lookupElement (element) {
    db.collection(element, function(err, coll) {
      coll.find({'owner': req.user.username}, function(err, results) {
        if (err) throw err;
          results.toArray(function(err, docs) {
          responseJSON[element] = docs;
          elementCount = elementCount + 1;
          lookupDone();
          });
      });
    });
    }

});


// Get CCDA file based on Master health record, filtered by section if needed
// expect filter parameter with true/false for every section (or all=true) e.g. filter = {all:false, allergies:true, medications:false, etc}
// filter parameter is passed in the body of HTTP request
app.post('/master/ccda', auth.ensureAuthenticated, function(req, res){

  console.log(req.body);

  var username=req.user.username;

  //fetch actual BB.js record from datastore
  var bb={};
  bb.filter={};

  if (req.body.filter) bb.filter=req.body.filter
  else bb.filter.all=true;

  console.log('bb.filter: ' + JSON.stringify(bb.filter));

  getSection("demographics", req.user.username, done);
  getSection("allergies", req.user.username, done);
  getSection("medications", req.user.username, done);

  getSection("problems", req.user.username, done);
  getSection("procedures", req.user.username, done);
  getSection("results", req.user.username, done);

  getSection("immunizations", req.user.username, done);
  getSection("encounters", req.user.username, done);
  getSection("vitals", req.user.username, done);


  var count=0;

  function done(element, docs) {
    count=count+1;

    if (bb.filter.all || bb.filter[element]) {
      bb[element]=docs;
      //TODO: demographics section should be unique (currently multiple sections possible)
      if (element=="demographics") bb[element]=docs[0];
    }
    else {
      if (element=="demographics") bb[element]=docs[0];
      //bb[element]=[];
    }


    if (count==9) {
      var ccda="<?xml version='1.0'?><empty></empty>";

      //if patients master record is empty return empty file
      if (bb.demographics!=null){
        var template = fs.readFileSync( "./template/ccda-filtered.xml" ).toString('utf-8');
        console.log("bb: "+JSON.stringify(bb, null, 4));

        ccda=ejs.render(template, bb);
      }

      //console.log(ccda);

      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.write(ccda);
      res.end();

    }
  }
});



// Catch all method for merging section of health records
app.post('/master/:element', auth.ensureAuthenticated, function (req, res) {
  postMaster(req, res, req.params.element);
});

module.exports.retrieveMasterFile = retrieveMasterFile;

function retrieveMasterFile (filter, username, callback) {

  var bb = {};
  bb.filter = {};

  if (filter) bb.filter=filter
  else bb.filter.all=true;

  if (bb.filter.all === "false") {
    bb.filter.all = false;
  }

  console.log('bb.filter: ' + JSON.stringify(bb.filter));

  getSection("demographics", username, done);
  getSection("allergies", username, done);
  getSection("medications", username, done);

  getSection("problems", username, done);
  getSection("procedures", username, done);
  getSection("results", username, done);

  getSection("immunizations", username, done);
  getSection("encounters", username, done);
  getSection("vitals", username, done);

  var count=0;

  function done(element, docs) {
    count=count+1;

    if (bb.filter.all || bb.filter[element]) {
      bb[element]=docs;
      //TODO: demographics section should be unique (currently multiple sections possible)
      if (element=="demographics") bb[element]=docs[0];
    }
    else {
      if (element=="demographics") bb[element]=docs[0];
      //bb[element]=[];
    }



    if (count==9) {
      var template = fs.readFileSync( "./template/ccda-filtered.xml" ).toString('utf-8');
      //console.log("bb: "+JSON.stringify(bb, null, 4));

      var ccda="<?xml version='1.0'?><empty></empty>";

      //if patients master record is empty return empty file
      if (bb.demographics!=null){
        var template = fs.readFileSync( "./template/ccda-filtered.xml" ).toString('utf-8');
        console.log("bb: "+JSON.stringify(bb, null, 4));

        try {
            ccda = ejs.render(template, bb);
        } catch (e) {
            console.log("CCDA generation failed");
            console.log(e);
        }
      }



      //console.log(ccda);

      callback(ccda);

    }
  }
};


//Retrieves all elements of a specified type.
function getSection(element, username, done) {
  db=app.get("db_conn");
  console.log("getSection - element: "+element+" user: "+username);
  db.collection(element, function(err, coll) {
    //TODO:  Client Side Filtering of approved items.
    coll.find({'owner': username}, function(err, results) {
      console.log("element: "+element+" user: "+username);
      if (err) throw err;
      results.toArray(function(err, docs) {
        done(element, docs)
      });
    });
  });
}

// Catch all method for merging section of health records
app.post('/master/:element', auth.ensureAuthenticated, function (req, res) {
  postMaster(req, res, req.params.element);
});

//Demographics.

app.get('/master/:user/demographics', auth.ensureAuthenticated, function (req, res) {
getMaster(req, res, 'demographics');
});

app.post('/master/:user/demographics', auth.ensureAuthenticated, function (req, res) {
postMaster(req, res, 'demographics');
});

app.put('/master/:user/demographics', auth.ensureAuthenticated, function (req, res) {
putMaster(req, res, 'demographics');
});

//Allergies.

app.get('/master/:user/allergies', function (req, res) {
getMaster(req, res, 'allergies');
});

app.post('/master/:user/allergies', function (req, res) {
postMaster(req, res, 'allergies');
});

app.put('/master/:user/allergies', function (req, res) {
putMaster(req, res, 'allergies');
});

//Encounters.

app.get('/master/:user/encounters', function (req, res) {
getMaster(req, res, 'encounters');
});

app.post('/master/:user/encounters', function (req, res) {
postMaster(req, res, 'encounters');
});

app.put('/master/:user/encounters', function (req, res) {
putMaster(req, res, 'encounters');
});

//Immunizations.

app.get('/master/:user/immunizations', function (req, res) {
getMaster(req, res, 'immunizations');
});

app.post('/master/:user/immunizations', function (req, res) {
postMaster(req, res, 'immunizations');
});

app.put('/master/:user/immunizations', function (req, res) {
putMaster(req, res, 'immunizations');
});

//Labs (results).

app.get('/master/:user/results', function (req, res) {
getMaster(req, res, 'results');
});

app.post('/master/:user/results', function (req, res) {
postMaster(req, res, 'results');
});

app.put('/master/:user/results', function (req, res) {
putMaster(req, res, 'results');
});

//Medications.

app.get('/master/:user/medications', function (req, res) {
getMaster(req, res, 'medications');
});

app.post('/master/:user/medications', function (req, res) {
postMaster(req, res, 'medications');
});

app.put('/master/:user/medications', function (req, res) {
putMaster(req, res, 'medications');
});

//Problems.

app.get('/master/:user/problems', function (req, res) {
getMaster(req, res, 'problems');
});

app.post('/master/:user/problems', function (req, res) {
postMaster(req, res, 'problems');
});

app.put('/master/:user/problems', function (req, res) {
putMaster(req, res, 'problems');
});

//Procedures.

app.get('/master/:user/procedures', function (req, res) {
getMaster(req, res, 'procedures');
});

app.post('/master/:user/procedures', function (req, res) {
postMaster(req, res, 'procedures');
});

app.put('/master/:user/procedures', function (req, res) {
putMaster(req, res, 'procedures');
});

//Vitals.

app.get('/master/:user/vitals', function (req, res) {
getMaster(req, res, 'vitals');
});

app.post('/master/:user/vitals', function (req, res) {
postMaster(req, res, 'procedures');
});

app.put('/master/:user/vitals', function (req, res) {
putMaster(req, res, 'vitals');
});


//Retrieves all elements of a specified type.
function getMaster(request, response, element) {
    db=app.get("db_conn");

  db.collection(element, function(err, coll) {
    //TODO:  Client Side Filtering of approved items.
    coll.find({'owner': request.params.user}, function(err, results) {
    if (err) throw err;
      results.toArray(function(err, docs) {
        var responseJSON = {};
        responseJSON[element] = docs;
        response.send(responseJSON);
      });
    });
  });
}

//Updates a single element (flags only).
function postMaster (request, response, element) {
    db=app.get("db_conn");

  db.collection(element, function(err, coll) {
      if (err) throw err;
      var objectID = new ObjectId(request.body.identifier);
      var updateCount = 0;
      var updateMax = 3;
      if (request.body.approved) {
        coll.update({"_id": objectID, 'owner': request.user.username}, {$set: {approved: request.body.approved}}, function(err, results) {
          if (err) throw err;
          updateCount = updateCount + 1;
          updateDone();
        });
      } else {
        updateCount = updateCount + 1;
        updateDone();
      }
      if (request.body.ignored) {
        coll.update({"_id": objectID, 'owner': request.user.username}, {$set: {ignored: request.body.ignored}}, function(err, results) {
          if (err) throw err;
          updateCount = updateCount + 1;
          updateDone();
        });
      } else {
        updateCount = updateCount + 1;
        updateDone();
      }
      if (request.body.archived) {
        coll.update({"_id": objectID, 'owner': request.user.username}, {$set: {archived: request.body.archived}}, function(err, results) {
          if (err) throw err;
          updateCount = updateCount + 1;
          updateDone();
        });
      }else {
        updateCount = updateCount + 1;
        updateDone();
      }

      function updateDone() {
        if (updateCount = updateMax) {
          console.log("record updated, count: "+updateCount+" id: "+request.body.identifier+" element: "+element)
          response.statusCode = 200;
          response.end();
        }
      }
    });
}

//Loads a new element into db (for self entered).
function putMaster (request, response, element) {
    db=app.get("db_conn");

  db.collection(element, function(err, coll) {
    if (err) throw err;
    coll.insert(request.body, {safe: true}, function(err, results) {
      if (err) throw err;
      //console.log('record saved');
      response.statusCode = 200;
      response.end();
    });
  });
}
