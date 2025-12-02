Run local:
Backend:
$ node backend/app.js

Frontend:
$ cd frontend
$ npm run dev

Couchbase indexes:
For couchbase to work with the support-tool and the different checks - make these indexes:

CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;

CHECKS:


