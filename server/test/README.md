PHIX tests
==========

PHIX - Personal Health Record eXchange

To run tests:

    npm install mocha -g
    grunt --NODE_ENV=[env]

[env] can be: phix.dev, clinician.dev, phix.prod, clinician.prod

Note:  It is advisable to have both a clinician and phix instance running to test, as several of the tests evaluate the instances interaction.

To bootstrap instances with demo configurations:

    mocha -t 5000 bootstrap/demoClinicians
    mocha -t 5000 bootstrap/demoPHIX