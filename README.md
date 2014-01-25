PHIX
====

PHIX - Personal Health Record eXchange

### PHIX User Guide
See description of PHIX functionality here [https://github.com/amida-tech/PHIX/blob/master/docs/user_guide/user_guide.md](https://github.com/amida-tech/PHIX/blob/master/docs/user_guide/user_guide.md)

### Quick Start Guide

Prerequisites:

- Node.js [Instructions](http://nodejs.org/download/)
- NPM [Instructions](https://npmjs.org/doc/README.html)
- MongoDB [Instructions](http://docs.mongodb.org/manual/installation/)

Get PHIX code:

    git clone git@github.com:amida-tech/PHIX.git

Go to PHIX directry:

    npm install

Run MongoDB
    
    mongod

Open terminal/command line window and run PHIX app:

    NODE_ENV=phix.dev node app.js

Open another terminal/command line window and run Clinician Front-end app:

    NODE_ENV=clinician.dev node app.js

Bootstrap test users:

    cd /test/bootstrap
    mocha -R spec demoPHIX.js -t 10000
    mocha -R spec demoClinicians.js -t 10000

You are ready to go!

- [PHIX Portal](http://localhost:3001)
- [Internal Verification App](http://localhost:3001/#/verification)
- [Clinician Fornt-end](http://localhost:3002)

Test users:

- PHIX - janedoe/test (birthdate: 06/19/1976, name: Jane F. Doe, DIRECT email janedoe@hub.amida-demo.com)
- Clinician front end - dr.house/test and dr.henry/test

### More Instructions

To run (Node.js and MongoDB are required):

    npm install
    NODE_ENV=[env] node app.js

[env] can be: phix.dev, clinician.dev, phix.prod, clinician.prod

You can also set environment variable on linux/mac os this way:

    export NODE_ENV=[env]
    node app.sj

Set environment variable on windows that way:

    set NODE_ENV=[env]
    node app.js

Running tests:

    grunt --NODE_ENV='phix.dev'
    grunt --NODE_ENV='clinician.dev'

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
