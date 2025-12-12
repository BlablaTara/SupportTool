Run local:
Backend:
$ node backend/app.js

Frontend:
$ cd frontend
$ npm run dev

Unittest:
To run unittest:
$ cd backend
$ npm test

Couchbase indexes:
For couchbase to work with the support-tool and the different checks - make these indexes:

CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;

CHECKS:


DROPDOWN-CHECK:
You can make several different dropdown-checks.

The items in the dropdown,will show a status, if you payload contains:

"status:" "x":
x = error, fail === check fail
x = success, ok, sent === check success
