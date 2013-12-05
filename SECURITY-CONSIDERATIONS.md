## Security considerations for running PHIX

Disclaimer: PHIX is a prototype that shows viability of building Personal Health Information eXchange application that ties together variety of Health IT standards (including DIRECT project for secure messaging, BlueButton/CCDA for data format/model, etc).

## PHIX components
- Patient web portal
- Internal verification page
- Clinician front-end
- Back end APIs
- Back end database (MongoDB)
- DIRECT gateways

### Patient web portal
Includes authentication/authorization components.

**** Current deployment scripts do not enable HTTPS

### Internal verification page
Current implementation doesn't include any security (authentication/authorization) for verification page. Rationale for this is that this page/functionality should be deployed into CUSTOMER infrastructure and probably rely on internal Single Sign On or Enterprise LDAP/AD intergation for users/employees authentication/authorization.

### Clinician front-end
Current implementation relies on pre-set accounts for clinicians. Rationale for this is that clinician front-end will be deployed in custom fashion for each HEALTHCARE INSTITUTUION and will rely on some form of SSO integration with it.

### Back-end APIs 
Back end APIs rely on user authentication/authorization.

**** Current deployment scripts do not enable HTTPS

### Back end database
Localhost access is anonymous (e.g. not protected) 

**** For simplicity of deployement/testing current database is open on localhost without login/password

### DIRECT gateways
Default passwords used for web based DIRECT configuration as well as for SMTP/POP over SSL access via catchall account.
Unencrypted messages are saved to local filesystem.

**** Current deployment scripts rely on self generated/signed certificates

















