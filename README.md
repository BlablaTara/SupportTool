Run local:
Backend:
$ node backend/app.js

Frontend:
$ cd frontend
$ npm run dev

OBS: changing from MongoDB to Couchbase - may need you to:
$ rm -rf node_modules package-lock.json
$ npm install couchbase@4.6.0 --force

Test database:
docker compose up -d

couchebase UI: 8091

MONGODB collections + testusers:
collection: users
user: test@test.dk

collection: appusers
user: dev@dev.dk


COUCHBASE collections + testusers:
collection: users
user: test@test.dk

collection: appusers
user: dev@dev.dk


Couchbase indexes:
For couchbase to work with the support-tool and the different checks - make these indexes:

Email check: COLLECTION = 'users/appusers'
CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;

CREATE INDEX `idx_email`
ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`(email);