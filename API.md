API for PHIX.
====================

Documentation for all API calls used in PHIX.

Access
---------------------------
lib/access/index.js

The provider access management interface allows users to manage pending and approved access requests from providers.

```GET /access/pending```
Returns a list of all pending access requests for a user.
Authenticated.

```DELETE /access/pending/{providerID}```
Denies all pending access requests a provider has submitted for a user.
Authenticated.

```POST /access/pending/{providerID}```
Approves all pending access requests a provider has submitted for a user.
Authenticated.
* No JSON required.

```GET /access```
Returns a list of providers who have been granted access for a user.
Authenticated.

```DELETE /access/{providerID}```
Revokes access for a provider who has been granted access for a user.
Authenticated.

```POST /access/{providerID}```
Updates access for a provider who has been granted access for a user.
Authenticated.

Account
-------------------
lib/account/index.js

This interface provides account management functions.

```POST /verify```
Checks whether or not an individual is verified by direct email account.
Unauthenticated.

```POST /validuser```
Used during delegation to check whether or not a specific user name is valid.
Authenticated.

 ```GET /switch/:user```
 Logs out current user, logs in as delegated user.
 Authenticated.
 
```GET /loggedin```
Performs server lookup to see if an account is logged in.
Unauthenticated.

```POST /login```
Logs user in.
Unauthenticated.

```POST /logout```
Logs user out.
Unauthenticated.

```PUT /account```
Creates a new account.
Unauthenticated.

```GET /account```
Returns current users account.
Authenticated.

```POST /account```
Updates account information.
Authenticated. 

Delegation
----------
lib/delegation/index.js

The delegation API provides logged in users with the capability to authorize other user accounts to access their account.

```PUT /delegation/{username}```
Create a delegation for the currently logged in account, granting access to the user with {username}.
Authenticated.

```GET /delegation/recieved```
Retrieve a list of delegations granted to the user from other accounts.
Authenticated.

```GET /delegtion/granted```
Retrieve a list of delegations granted by the user to other accounts.
Authenticated.

```DELETE /delegation/{username}```
Revoke a delegation granted by the user.
Authenticated.

DIRECT
------
lib/direct/index.js

Allows user to interact with mailbox.

```GET /direct/inbox```
Get contents of the users inbox.
Authenticated.

```GET /direct/outbox```
Get contents of the users outbox.
Authenticated.

```PUT /direct/message
Create a new messsage.```
{recipient, subject, contents}
Authenticated.

```POST /direct/message/{message_id}
Update a message, used to adjust 'read' status or 'archive' status.```
Authenticated.

```DELETE /direct/message/{message_id}
Remove a message, sets archived flag to true.```
Authenticated.

HIE
---
lib/hie/index.js

Simulates a health information exchange endpoint for clinician requests to access patient data.

```POST /hie/lookup```
Pass a JSON message query to the server to lookup a patient.
{firstname, middlename, lastname, birthdate}
Un-authenticated.

```GET /hie/{clinician}```
Looks up the outstanding requests for a given clinician.
Un-authenticated.
* NOTE:  Currently not implemented in front end.

```DELETE /hie/{clinician}/{username}```
Remove a pending request from a clinician.
Un-authenticated.
* NOTE:  Currently not implemented in front end.

```PUT /hie/{clinician}```
Create a new request for a clinician, using the attached JSON object.
Un-authenticated.
* NOTE:  Takes clinician off JSON object, url string param currently not implemented.

Identity
--------
lib/identity/index.js

API for end user validation.

```GET /identity/account/{token}```
Takes an input token and displays the demographic information for identity verification.
Un-authenticated.

```PUT /identity/validate/{token}```
Takes an input token with a boolean value to indicate whether or not an individual is verified.
Un-authenticated.

Master
------
lib/master/index.js

Used to interact with the master record of the patient.

```GET /master```
Returns master record as assembled by patient.
Authenticated.

```POST /master/ccda```
Takes a JSON object used to filter the master record, and returns a master ccda.
Authenticated.

```POST /master/{element}```
Catch all method used to update a specific element using json object.
Authenticated.

```GET /master/{username}/{element}```
Used to retrieve a specific element for a user, only current user is accessible.
Authenticated.

```POST /master/{username}/{element}```
Used to update a specific element for a user, only current user is accessible.
Authenticated.

```PUT /master/{username}/{element}```
Used to generate a specific element for a user, only current user is accessible.
Authenticated.

Profile
-------
lib/profile/index.js

Used for profile registration, etc.

```PUT /profile```
Used during registration to create a profile.
Authenticated.

```GET /profile```
Retrieves a logged in users profile.
Authenticated.

```POST /profile```
Allows a logged in user to update profile information.
Authenticated.

Providers
---------
lib/providers/index.js

Used to load and get providers to DIRECT email lookup.

```PUT /providers```
Loads a single provider into the system.
Un-authenticated.

```GET /providers```
Retrieves a list of all providers currently in the system.
Un-authenticated.

Storage
-------
lib/storage/index.js

Manages the storage of health records.

```GET /storage/record```
Takes a JSON object containing file id and returns the file's contents in JSON.
Authenticated.

```GET /storage/record/{identifier}```
Returns the object associated with the identifier as a file download.
Authenticated.

```PUT /storage```
Loads a record into the storage grid, JSON body 'file' contains file data.
Authenticated.

```DELETE /storage/{identifier}```
Removes a record from the file store.
Authenticated.

```POST /storage/preview```
Takes a JSON object of identifier and returns that record for preview.
Authenticated.

```POST /storage```
Allows parsed flag to be passed to trigger parsing of CCDA files.
Authenticated.

```GET /storage```
Gets a listing of all files stored for a specific user.
Authenticated.