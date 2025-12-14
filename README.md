# GENERIC SUPPORT-TOOL w. COUCHBASE or MONGODB BACKEND

> The purpose with this Support-tool is that its usable for different customers. Fork it - use it, on one custumer - fork it again, and use it for another customer.

> It works wheither the customer use MongoDB or Couchbase in the backend.

## RUN LOCAL:

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
> Docker compose starts two containers, one with mongoDB and the other one with Couchbase. 

$ `docker compose up -d`

### **Couchbase-indexes:**

> For couchbase to work with the support-tool and the different checks - make these indexes:*

`CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;`


### **Couchbase error**

> If you come across a 'native-build'-error when starting you couchbase database then follow these steps:

$ `rm -rf node_modules package-lock.json`

$ `npm i`



## **CHECKS:**

> How to configure the different checks, look in .env-example.
> Notice that some checks has the possibility to "multiply" - if your configurations are sat correct.
> Fx - with the count-check, you can have a check that counts 'orders' and also a count-check that counts 'products'.

### User Validations:

#### **EMAIL-CHECK:**

- Checking if the users email is in the choosen database.

---

#### **ROLES-CHECK:**

- Checking if the user has a role and displays it.

---

#### **COUNT-CHECK:**

- Counts how many of - fx 'orders' the user have.
- You can make several of these

---

#### **DROPDOWN-CHECK:**

- This is a check, where you see the payload for det choosen field.
 - You can make several of these

**Status:**
> If you have a 'status'-field in your payload matching one of these, this is will be the status of your items - everything else will be neutral.

*"status:" "foo":*
Check fail:
- foo = 'error'

Check success:
- foo = 'ok'
- foo = 'success'
- foo = 'sent'

| Payload status | Check Status |
|----------------|--------------|
| 'error'        | 'fail'       |
| 'fail'         | 'fail'       |
| 'cancelled'    | 'fail'       |
|----------------|--------------|
|----------------|--------------|
| 'success'        'success'    |
|----------------|--------------|
| 'ok'             'success'    |
|----------------|--------------|
| 'sent'           'success'    |
|----------------|--------------|
| 'shipped'        'success'    |
|----------------|--------------|

---

### DB Validations:

### **COLLECTIONS-CHECK:**

- Checks all the collections your environment variables has for data.
- If success -> shows all the collections you choose.
- If fail -> shows all the empty collections

### **METRICS-CHECK:**

- This check has different metrics when it comes to either mongoDB og Couchbase.

**MongoDB-metrics**

**Couchbase-metrics**

### System Validations:

### **PING-CHECK:**

- This check, pings a url, to see if it's reachable. Fx. SAP identiry server.

### **SERVICE-CHECK:**

- This check, is like af health-check, but it renders the choosen services' '/version'-endpoints, so you at the same time can see which version is now deployet.

