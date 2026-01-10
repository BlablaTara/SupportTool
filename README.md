# Generic Support Tool with Couchbase or MongoDB Backend

> The purpose of this support tool is to make it reusable for different customers.
> Fork it, use it for one customer, then fork it again and use it for another.

> It works whether the customer uses MongoDB or Couchbase as the backend.


## Run Locally

**BACKEND:**

$ `node backend/app.js`

**FRONTEND:**

$ `cd frontend`

$ `npm run dev`

**TESTS:**

$ `cd backend`

$ `npm test`



## DATABASE:

**Testdatabase:**
> Docker Compose starts two containers: one with MongoDB and one with Couchbase.

$ `docker compose up -d`

### Seeding
> To seed the testdatabase follow these steps:

1. Create your database with mongo or couchbase
2. Fill out the connections to the database in you .env-file (follow .env-example)
3. Start the database in the containers with:

$ `docker compose up -d`

4. Now you can seed the database that you have choosen in your .env-file (DATABASE_TYPE)

$ `cd backend`

$ `npm run seed`


### **Couchbase-indexes:**

> For Couchbase to work with the support tool and the different checks, create the following index:

CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;


### **Couchbase error**

> If you encounter a "native-build" error when starting your Couchbase database, follow these steps:

$ `rm -rf node_modules package-lock.json`

$ `npm i`



## **CHECKS:**

> To configure the different checks, see `.env-example`.
> Note that some checks can be "multiplied" if your configuration is set correctly.

> Fx - with the count-check, you can have a check that counts 'orders' and also a count-check that counts 'products'.

### User Validations:

#### **EMAIL-CHECK:**

> Checking if the users email is in the choosen database.
> Configure the EMAIL_ENDING variable (e.g @test.dk) to reuse the same email domain for every user lookup.

! [Validating a user through the Email-check] (frontend/public/images/email-check.png)



---

#### **ROLES-CHECK:**

> Checking if the user has a role and displays it.

---

#### **COUNT-CHECK:**

> Counts how many items (e.g. "orders") the user has.
- You can make several of these
- Notice not to give your Count-check and Dropdown-check the same title

---

#### **DROPDOWN-CHECK:**

> This check displays the payload for the chosen field.
- You can make several of these
- Notice not to give your Count-check and Dropdown-check the same title

**Status:**
> If your payload contains a `status` field matching one of the values below, this will determine the item status. All other values will be treated as neutral.


| Payload status | Item Status  |
|----------------|--------------|
| 'error'        | 'fail'       |
| 'fail'         | 'fail'       |
| 'cancelled'    | 'fail'       |
|----------------|--------------|
| 'success'      | 'success'    |
| 'ok'           | 'success'    |
| 'sent'         | 'success'    |
| 'shipped'      | 'success'    |


---

### DB Validations:

#### **COLLECTIONS-CHECK:**

> Checks all collections defined in your environment variables for data.
- If success -> shows all the collections you choose.
- If fail -> shows all the empty collections

---

#### **METRICS-CHECK:**

> This check provides different metrics depending on whether MongoDB or Couchbase is used.

**MongoDB-metrics**
- Connections
- Memory/Chache
- Network
- CPU 

**Couchbase-metrics**
- Ram Usage in bucket
- Connections
- Network

---

### System Validations:

#### **PING-CHECK:**

> This check pings a URL to see if it is reachable, e.g. an SAP Identity Server.

---

#### **SERVICE-CHECK:**

> This check is similar to a health check, but it renders the selected services' `/version` endpoints, allowing you to see which versions are currently deployed.

