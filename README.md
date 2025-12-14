# GENERIC SUPPORT-TOOL w. COUCHBASE or MONGODB BACKEND


## RUN LOCAL:

* BACKEND:
$ node backend/app.js

**FRONTEND:**
$ cd frontend
$ npm run dev

**TESTS:**
To run unittest:
$ cd backend
$ npm test


**DATABASE:**

Testdatabase:
$ docker compose up -d

COUCHBASEINDEXES:
For couchbase to work with the support-tool and the different checks - make these indexes:

CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;



**CHECKS:**

EMAIL-CHECK:
Checking if the users email is in the choosen database.

ROLES-CHECK:
Checking if the user has a role and displays it.

COUNT-CHECK:
Counts how many of - fx 'orders' the user have.



DROPDOWN-CHECK:
You can make several different dropdown-checks.

The items in the dropdown,will show a status, if you payload contains:

"status:" "x":
x = error, fail === check fail
x = success, ok, sent === check success
