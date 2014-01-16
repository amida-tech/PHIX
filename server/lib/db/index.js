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

// Initialize all required MongoDB/GridFS connections
var Message = require('../../models/message'),

    mongo = require('mongodb'),
    mongoose = require('mongoose'),

    ObjectId = require('mongodb').ObjectID,
    Db = mongo.Db,
    Grid = mongo.Grid;

exports.init = function(settings, callback) {
    var conn_count=0;
    var connections={};

    console.log("initializing DB connections: "+JSON.stringify(settings));

    dbConn(done);

    if (!settings["direct"]) dbConn_other(done);

    function done()
    {
        conn_count=conn_count+2;
        if ((settings["direct"] && conn_count==2) ||
            conn_count==4) {
              callback(connections);

        }

    }

    function dbConn(done) {
        Db.connect('mongodb://localhost/' + settings["database"], function(err, dbase) {
            if (err) throw err;
            connections["database"] = dbase;
            connections["grid"] = new Grid(dbase, 'storage');
            done();
        });
    }

    function dbConn_other(done) {
        Db.connect('mongodb://localhost/' + settings["other_database"], function(err, dbase) {
            if (err) throw err;
            connections["other_database"] = dbase;
            connections["other_grid"] = new Grid(dbase, 'storage');

            var conn2 = mongoose.createConnection('mongodb://localhost/' + settings["other_database"]);
            connections["message2"] = conn2.model('Message', Message.msg);
            //Message2 = db_other.model('Message2', Message);
            done();
        });
    }
};


