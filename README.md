PHIX
====

PHIX - Personal Health Record eXchange

[![Build Status](https://travis-ci.org/amida-tech/PHIX.png?branch=build-refactoring)](https://travis-ci.org/amida-tech/PHIX)

### PHIX User Guide
See description of PHIX functionality here [https://github.com/amida-tech/PHIX/blob/master/docs/user_guide/user_guide.md](https://github.com/amida-tech/PHIX/blob/master/docs/user_guide/user_guide.md)

### Quick Start Guide

Prerequisites:

- Node.js [Instructions](http://nodejs.org/download/)
- NPM [Instructions](https://npmjs.org/doc/README.html)
- MongoDB [Instructions](http://docs.mongodb.org/manual/installation/)

Start MongoDB:

On Windows, execute mongod.exe.  On OSX/Linux, bring up the terminal, type 'mongod', and hit enter.

Get PHIX code:

Run MongoDB
    
    mongod
=======
    git clone git@github.com:amida-tech/PHIX.git

The client must be compiled, to build the client:

    cd client
    grunt

Navigate to the server directory and start the server:

    cd ../server
    node server.js

Bootstrap test user:

    cd /test/bootstrap
    mocha -R spec demoPHIX.js -t 10000

You are ready to go!

- [PHIX Portal](http://localhost:3001)
- [Internal Verification App](http://localhost:3001/#/verification)

Test user:

- PHIX - janedoe/test (birthdate: 06/19/1976, name: Jane F. Doe, DIRECT email janedoe@hub.amida-demo.com)

### Testing Instructions

Note:  If testing with SSL enabled, the tests will fail as node by default refuses self signed certs.  To overcome this, set the the environmental variable NODE_TLS_REJECT_UNAUTHORIZED=0.  Never do this in production.  On bash, this would be:

    export NODE_TLS_REJECT_UNAUTHORIZED=0

Running tests on client:

    cd client
    grunt test

Running tests on server:

    cd server
    grunt test

### Deployment of PHIX
For automated deployment of PHIX/DIRECT on Amazon EC2 cloud using Ansible scripts see: 

- DIRECT deployment [https://github.com/amida-tech/DIRECT-ansible](https://github.com/amida-tech/DIRECT-ansible)
- PHIX deployment [https://github.com/amida-tech/PHIX-ansible](https://github.com/amida-tech/PHIX-ansible)

### DIRECT integration
Brief description of the way PHIX is integrated with DIRECT backend [https://github.com/amida-tech/PHIX/blob/master/docs/DIRECT-integration.md](https://github.com/amida-tech/PHIX/blob/master/docs/DIRECT-integration.md)

### Security considerations
For security considerations running PHIX prototype see [https://github.com/amida-tech/PHIX/blob/master/SECURITY-CONSIDERATIONS.md](https://github.com/amida-tech/PHIX/blob/master/SECURITY-CONSIDERATIONS.md)

### License
PHIX is distributed under Apache 2.0 license. See [https://github.com/amida-tech/PHIX/blob/master/LICENSE.md](https://github.com/amida-tech/PHIX/blob/master/LICENSE.md)
