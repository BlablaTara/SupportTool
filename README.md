# GENERIC SUPPORT-TOOL w. COUCHBASE or MONGODB BACKEND


## RUN LOCAL:

**BACKEND:**

$ node backend/app.js


**FRONTEND:**

$ cd frontend
$ npm run dev


**TESTS:**

$ cd backend
$ npm test


### DATABASE:

**Testdatabase:**

$ docker compose up -d

**COUCHBASEINDEXES:**

*For couchbase to work with the support-tool and the different checks - make these indexes:*

CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;



## **CHECKS:**

*How to configure the different checks, look in .env-example.
Notice that some checks has the possibility to "multiply" - if your configurations are sat correct.
Fx - with the count-check, you can have a check that counts 'orders' and also a count-check that counts 'products'*

### User validations:

**EMAIL-CHECK:**

- Checking if the users email is in the choosen database.*


**ROLES-CHECK:**

- Checking if the user has a role and displays it.*


**COUNT-CHECK:**

- Counts how many of - fx 'orders' the user have.
- You can make several of these*


**DROPDOWN-CHECK:**

- This is a check, where you see the payload for det choosen field.
 - You can make several of these

You can make several different dropdown-checks, as long as you follow the format shown in .env-example.

STATUS:
- If you have a 'status'-field in your payload matching one of these, this is will be the status of your items:

"status:" "x":
x = error, fail === check fail
x = success, ok, sent === check success
