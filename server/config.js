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

var path = require('path');

module.exports = {
  server: {
    url: 'localhost', // The URL where the server is deployed to.  Typically localhost for development.
    port: 3000, // The port on which the ssl protected server will listen, or the unencrypted server if ssl is disabled.
    redirectPort: 3001, //The port on which the unprotected server will listen (only for redirect to encrypted).
    logging: 'dev', // Sets logging levels for server, can be either 'dev' or 'prod'.
    session: {
      name: 'phix.session', // The name of the cookie used to pass session information to the client.
      key: 'test' // The secret key used to generate unique session identifiers.  Should be complex string in production.
    },
    ssl: {
      enabled: true, //Whether or not ssl is enabled.  Should always be on, but may be useful to disable for debugging.
      privateKey: path.resolve(__dirname, 'cert/privateKey.pem'),  //The private key location used for ssl.
      certificate: path.resolve(__dirname, 'cert/certificate.pem')  //The certificate location used for ssl.
    }
  },
  database: {
    url: 'localhost', // The URL where the database server is deployed.
    port: 12345, // The port on which the database server is deployed.
    name: 'portal' // Name of the database.
  },
  client: {
    enabled: true, //Whether or not the local client is enabled.  Should be true for development.
    location: path.resolve(__dirname, '../client/dist'), //Folder location of the client.
    url: 'localhost', // The URL of the server where the browser-based client is located.  Typically localhost for development.
    port: 3001 // The port on which the client is located.  Must be different than server for development.
  },
  smtp: {
    enabled: true, // Enables or disables the SMTP server.
    url: 'localhost', // The URL of the SMTP server used to transmit DIRECT messages.
    port: 465, // The port on which the SMTP server is listenting.
    username: 'test', // The username the SMTP server requires for login.
    password: 'test' // The password associated with the username to login to the SMTP server.
  }
};