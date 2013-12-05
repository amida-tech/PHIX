### Personal Health Information eXchange (PHIX)

### User Guide


#Introduction

Personal Health Information eXchange (PHIX) is a patient centric health
information technology solution that puts patients’ health record in
their control. It enables patients to share their and their dependents’
medical history with their health care providers. Clinicians can send
all patient correspondence directly to PHIX without any HIPAA concerns.
Patients can see all medical history from various sources in one central
place and become the main authority for their medical records.

PHIX is in fact three separate applications that share the same
codebase.

1.  A Patient Web Portal where the patient can see and authorize others
    to see their medical history and send theirs or their dependents’
    medical information such as immunizations to health professionals
    with a click of a button.
2.  A Verification Page where a trusted third party can verify patients’
    identities and provide access to PHIX.
3.  A Clinician Front-End where clinicians can see their patient’s
    medical history and send correspondence such as lab results to their
    patients with a click of a button.

This user guide describes PHIX from all three points of views.

#Patient Web Portal

PHIX patient web portal is a safe, easy, complete and connected Personal
Health Record application where users can see, store, aggregate, share
or request their or their dependents’ health records from multiple
sources.

PHIX uses Blue Button technology to send medical information. This de
facto standard which is used by hundreds of companies and millions of
patients is one of the key technologies that make PHIX secure and
reliable.

##Landing Page

Patient Web Portal landing page provides a brief summary of the
application and provides two functionalities: Enroll and Login.

![phix\_landing](images/000019.png)

## Enrollment Page

PHIX requires an enrollment process where a trusted third party has to
approve the identity of the user. The process can be started from either
of the Enroll buttons on the Patient Web Portal landing page to launch a
signup form which requires a valid e-mail, username and password.

![phix\_signup\_empty.png](images/000012.png)

Username and password entered in this form can later be changed only by
PHIX administrators. E-mail is part of the user profile that can later
be changed. Once the signup form is accepted the enrollment form is
launched. In this form users are required to enter additional
demographic information.

![phix\_enrollmentform.png](images/000026.png)

All the information on this form can be updated until the enrollment
process is approved by a trusted third party. Once the enrollment is
approved, name, birthdate and social security number becomes part of
user identification and can only be changed by PHIX administrators.
Address and phone number become the part of user profile which can be
managed by the patient. Once Enroll button is selected further steps in
the enrollment process is shown in the Next Steps page.

![phix\_enrollment\_next\_strep.png](images/000010.png)

The instructions on this page conclude the PHIX part of the enrollment
process. At this point user is registered in the PHIX system but not
verified. Verification by a trusted third party is required. Required 
documents are similar to those required for passport application or 
passport itself. PHIX provides a separate application for trusted third 
parties where they can verify patient information and approve or reject 
it. This trusted third party verification step is discussed in 
Verification Page section later in this document. Once the patient is 
approved, Login button on the Landing page takes the patient to the default 
page of the Patient Web Portal. Before the verification users can still login 
but have only access to the Enrollment form and Next Steps form.

##Patient Web Portal Pages

![phix\_patient\_home.png](images/000004.png)

There are six pages in the Web Portal: Health, Messages, Store Records,
Privacy and Profile. Each of these pages is described in the coming
sections. In the upper right corner, the name of the user who is account
is being viewed is shown. Right after login this is the user itself. If
the user is granted access to other users’ health records then other
patient names are also available from the drop down menu and user can
select the name for access. Drop down menu also contains a Logout menu
item.

##Health Page

This is the default page on the Patient Web Portal when a patient logs.
It is the aggregated view of all the health information for the patient.
It is organized in six tabs: allergies, encounters, immunizations, labs,
medications, problems and vitals. You can select any tab by clicking on
the names on the left. In the following figure the immunizations tab is
shown.

![PHIX.png](images/000001.png)

All the health records in Health page is added from Stored Records page
as described later in this document. When first added, each piece of the
health record contains Add to master record and Remove from master
record buttons. User can either verify that the individual pieces should
be part of the master health record or reject and remove the individual
piece. PHIX automatically rejects duplicate information.

## Messages Page

This page shows user’s Inbox and Outbox of communications with health
care providers. In addition users compose new messages here.

![phix\_inbox.png](images/000000.png)

All the messages in Inbox and Output lists are clickable. When user
clicks on a particular message an expanded view of the message is shown.

![phix\_message\_detail.png](images/000030.png)

Expanded view shows the content of the message and the attached medical
records. Attached medical records are downloaded here by clicking on an
attached medical record. Each downloaded medical record is stored in the
database and available in Stored Records page.

Compose Message form is launched from the Compose button. This form is
similar to a typical e-mail application where user can specify a subject
and writes down the message in free text format. In addition there are
two types of attachments: files and health records. File attachments are
medical record files. Currently only Blue Button format (CCDA) is
supported.

![phix\_compose\_message\_1.png](images/000034.png)

Medical record attachments are directly created from patient’s overall
medical record that is available in the Health page. User can specify
specific sections of the health record or specify all. The specified
records are converted to Blue Button (CCDA) format and delivered to the
provider as an attached file.

![phix\_compose\_message\_2.png](images/000013.png)

Once user starts to write the clinician’s name a drop down menu is shown
with all the available providers in PHIX database. User can choose any
provider in the list.

![phix\_compose\_message\_3.png](images/000016.png)

Once the provider is selected the address is found from the database and
shown on the form and message is ready to be sent to the selected
provider. This message shows up in provider Inbox in Clinician Front-End
Messages page.

![phix\_compose\_message\_4.png](images/000009.png)

All sent messages are shown in Output tab. User can click on a specific
message to see the details and remove messages when they are no longer
needed.

![phix\_output-tab.png](images/000005.png)

##Stored Records Page

This is where patients can find their individual health records. Each
health record in this list is either uploaded from a health record file
using the Upload button or sent by a provider as an attachment with a
secure message and downloaded by the patient on Inbox tab of Messages
page as discussed previously.

![phix\_stored\_records(2).png](images/000025.png)

Upload button brings up the Upload Record form where an health record
file location and additional details to identify can be specified to
upload the record. Currently only files of type Blue Button (CCDA) are
supported.

![phix\_upload\_page.png](images/000029.png)

Each stored record in the list on Stored Record page is clickable and
brings up a form where the patient can preview the record, add the
record to the master record or delete the record.

![phix\_stored\_recordactions.png](images/000011.png)

Preview shows the content of the file so that patient can make the
decision to add the record to the master health record. The preview
includes the same content that the master health record.

![phix\_preview.png](images/000022.png)

Add to Master Record adds the individual health record to Master Health
record that is available on the Health page. All stored records that are
added to the master record are shown with a check box on the Status
column in stored records list on Stored Records page.

Delete button simply removes the selected health record from the list.

##Privacy Page

Privacy page contains list and management tools of the access rules that
are requested by or granted to healthcare providers. In addition this
page includes Shared Access management where users can specify others
who can use the account on user’s behalf.

![phix\_privacy.png](images/000017.png)

Access Requests lists the names of the providers who requested the
access and the specific portion of the health record that is requested.
The requests that are listed on this page are initiated from Clinician
Front-End Exchange page which is described later in this document. Users
can click on a request in the list to grant or deny access.

![phix\_grant\_access\_exchange.png](images/000033.png)

When patient grants or denies a particular request a message is sent to
the requesting provider and the request is removed from the Access
Request list. If the request is granted the Granted Access list is
updated.

![PHIX (3).png](images/000002.png)

Healthcare provider access grants remain valid until the patient removes
the access. Each item in the Granted Access list is clickable to bring
Update Access form.

![PHIX (4).png](images/000021.png)

Grant Access button on the Privacy page launches the Grant Access form
where the user can select another user and grant full access to the her
account. Users who are granted access have access to all the
functionality as the original users. Typically such users are closely
related such as parent and child.

![PHIX (1).png](images/000032.png)

After login users can see all the other users for whom have been granted
access from the drop down menu near the account holder name on the upper
right corner. This is also where users can switch accounts to
communicate with health care providers on the behalf of another user.

![PHIX (2).png](images/000028.png)

## Profile Page

Profile page can be used to update e-mail, address and telephone
numbers.

![phix\_profile.png](images/000024.png)

#Verification Page

Verification page is a stand-alone page where a third party enters the
code given in the instructions page to verify the patient after checking
the other documentation. Once the verification code is submitted patient
information is displayed. Verification code is provided to the patient
during Enrollment through Patient Web Portal. The third party can then
verify the information using the documents that patient provides. If
everything checks and Approve is clicked the patient is fully registered
and can start using PHIX. If documents are not verified the registration
can be rejected.

![phix\_verification.png](images/000020.png)

![phix\_approve\_reject.png](images/000031.png)

#Clinician Front-End

PHIX Clinician Front-End enables clinicians to communicate with their
patients using secure messaging. PHIX relies on pre-set accounts for
clinicians. Clinician front-end is customized for each health care
institution and relies on single sign on integration with institution’s
information technology platform.

The landing page for the clinician page includes a summary of
functionalities and a Login button. Login credentials can only be reset
by PHIX administrators.

![clinician\_welcome.png](images/000018.png)

After login PHIX Clinician Portal is launched. Here clinicians can
manage all their communications with patients. There are three pages in
the portal: Validate Exchange, and Messages. In addition the clinician
name is displayed on the upper right with a drop down menu. This menu
includes Logout menu item and also includes the names of all the
patients for whom the provider has access.

![PHIX (5).png](images/000015.png)

##Validate Page

PHIX provides patient validation functionality where providers can check
the information that the patient provides. This functionality is
available from the clinician front-end validate button. This button
launches a new page where the clinician can validate user’s name, date
of birth and DIRECT address.

![phix\_clinfe-verify.png](images/000023.png)

Clinicians can validate as many patients as they want on this page. This
page is self-contained and does not provide any back links to the PHIX
Clinician Web Portal.

##Exchange Page

Exchange page is accessed from the Exchange button and initially shows a
patient lookup form to select a patient.

![phix\_clinfe-exchange.png](images/000007.png)

Once the patient is found and selected the Request Access form is shown.
In this page clinicians can filter what is being requested from the
patient.

![phix\_clincfe\_requestaccess.png](images/000014.png)

Once the send button is clicked the requested information is sent to the
patient and PHIX returns to the Exchange page.

After the request is sent, clinicians wait for patient’s approval. Once
the patient approves the request the requested information shows up in
clinician’s inbox.

##Messages Page

![phix\_clinfe\_inbox.png](images/000003.png)

This page is the default one when a clinician logs in to Clinician
front-end. Here clinicians can see their Inbox and Outbox which list all
their previous messaging activity with their patients. Also included is
the Compose button which launches Compose Message form which can be used
to create and send new messages to patients.

![phix\_clinfe\_compose\_message.png](images/000027.png)

Of particular interest here is the Attach File field where providers can
attach a Medical Record file which can include for example record of a
patient visit or lab results. Currently PHIX supports only Blue Button
(CCDA) format. It is expected that these files are generated from EHR
system that the clinician uses. Patient can incorporate medical records
attached to the message automatically to their overall record in PHIX
patient portal as described previously in this document.

Each item in Inbox and Output list is clickable and brings up an
expanded view of the message. The Attachments can be downloaded from
this expanded view as well. The attachments in Inbox messages contain
medical records in Blue Button (CCDA) format and can be imported to EHR
systems which support this format.

![phix\_clinfe\_detail.png](images/000006.png)
