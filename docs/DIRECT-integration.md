## DIRECT integration

This document describes how PHIX/Clinician Front-end web aps integrate with DIRECT backend.

### Outgoing DIRECT messages integration

![Outgoing](images/DIRECT%20intergation%20-%20Outgoing.png?raw=true)

To send outgoing DIRECT messages form PHIX web portal, we use secure SMTP connection to DIRECT RI/James mail server.

Every time PHIX need to send a message from web interface, we establish secure SMTP connection to James mailserver and send message out (as MIME envelope with attachments)

### Incoming DIRECT messages integration

![Incoming](images/DIRECT%20intergation%20-%20Incoming.png?raw=true)

To receive incoming DIRECT messages into PHIX web portal, we use following mechanism:

- DIRECT RI receives secure message, pass it through STA and stores decrypted message in filesystem
- watcher.js monitors filesystem and picks up new messages in MIME format and writes them into PHIX MongoDB store.


