# Generic Support Tool with Couchbase or MongoDB Backend
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-supported-brightgreen)
![Couchbase](https://img.shields.io/badge/Couchbase-supported-blue)
![Docker](https://img.shields.io/badge/Docker-required-blue)


> The purpose of this support tool is to make it reusable for different customers.
> Fork it, use it for one customer, then fork it again and use it for another.

> It works whether the customer uses MongoDB or Couchbase as the backend.


## Table of Contents

- [Run Locally](#run-locally)
- [Database](#database)
  - [Seeding](#seeding)
  - [Couchbase Indexes](#couchbase-indexes)
  - [Couchbase Error](#couchbase-error)
- [Configurations](#configurations)
- [Environment Variables](#environment-variabels)
  - [General Configurations](#general-configurations)
  - [Database Configurations](#database-configurations)
  - [MongoDB Configurations](#mongodb-configurations)
  - [Couchbase Configurations](#couchbase-configurations)
- [Checks](#checks)
  - [User Validations](#user-validations)
    - [Email Check](#email-check)
    - [Roles Check](#roles-check)
    - [Count Check](#count-check)
    - [Dropdown Check](#dropdown-check)
  - [DB Validations](#db-validations)
    - [Collections Check](#collections-check)
    - [Metrics Check](#metrics-check)
  - [System Validations](#system-validations)
    - [Ping Check](#ping-check)
    - [Service Check](#service-check)
- [Deployment](#deployment)
- [License](#license)


## Run Locally

**BACKEND:**
> ```bash
> node backend/app.js
> ```

**FRONTEND:**
> ```bash
> cd frontend
> npm run dev
> ```

**TESTS:**
> ```bash
> cd backend
> npm test
>```


## DATABASE:

**Testdatabase:**
> Docker Compose starts two containers: one with MongoDB and one with Couchbase.

> ```bash
> docker compose up -d
> ```

### Seeding
> To seed the testdatabase follow these steps:

> 1. Create your database with mongo or couchbase
> 2. Fill out the connections to the database in you .env-file (follow .env-example)
> 3. Start the database in the containers with:

> ```bash
> docker compose up -d
> ```

> 4. Now you can seed the database that you have choosen in your .env-file (DATABASE_TYPE)

> ```bash
> cd backend
> npm run seed
> ```

### Couchbase-indexes:

> For Couchbase to work with the support tool and the different checks, create the following index:

> ```bash
> "CREATE PRIMARY INDEX ON `<BUCKET>`.`<SCOPE>`.`<COLLECTION>`;"
> ```

### Couchbase error:

> If you encounter a "native-build" error when starting your Couchbase database, follow these steps in the backend-directory:

> ```bash
> rm -rf node_modules package-lock.json
> npm install
> ```

## CONFIGURATIONS

> All configuration is handled through environment variables.
> Copy the example file and adjust as needed:

> ```bash
> cp .env-example .env
> ```

## ENVIRONMENT VARIABELS
### General configurations

>| Variable        | Description                         | Example                                        |
>| --------------- | ----------------------------------- | ---------------------------------------------- |
>| ENVIRONMENT     | Environment badge (DEV, TEST, PROD) | DEV                                            |
>| CUSTOMER        | Customer name displayed in the UI   | Google                                         |
>| FRONTEND_URL    | Frontend base URL                   | [http://localhost:5173](http://localhost:5173) |
>| *_CHECK_ENABLED | Enable/diable, showing checks in UI | true/false

### Database configurations

>| Variable | Description      | Allowed values      |
>| -------- | ---------------- | ------------------- |
>| DB_TYPE  | Database backend | MongoDB / Couchbase |

### MongoDB configurations

>| Variable       | Description               |
>| -------------- | ------------------------- |
>| MONGO_URI      | MongoDB connection string |
>| MONGO_USERNAME | MongoDB username          |
>| MONGO_PASSWORD | MongoDB password          |

### Couchbase configurations

>| Variable        | Description                       |
>| --------------- | --------------------------------- |
>| CB_CONNSTR      | Couchbase connection string       |
>| CB_USERNAME     | Couchbase username                |
>| CB_PASSWORD     | Couchbase password                |
>| CB_BUCKET       | Couchbase bucket                  |
>| CB_SCOPE        | Couchbase scope                   |
>| CB_CONNSTR_HTTP | Couchbase HTTP endpoint (metrics) |



## CHECKS:

> To configure the different checks, see `.env-example`.
> Note that some checks can be "multiplied" if your configuration is set correctly.

> Fx - with the count-check, you can have a check that counts 'orders' and also a count-check that counts 'products'.

> You can choose which checks you want to have in your tool, by choosing the FOO_ENABLED to be true/false (e.g. ROLES_CHECK_ENABLED=true).

### User Validations:

#### EMAIL-CHECK:

> Checking if the users email is in the choosen database.
> Configure the EMAIL_ENDING variable (e.g @test.dk) to reuse the same email domain for every user lookup.

> <img 
>  src="frontend/public/images/email-check.png" 
>  alt="Validating a user through the Email-check" 
>  width="400"
>/>

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| EMAIL_COLLECTION | Collection containing users |
>| EMAIL_ENDING | Email domain to validate against (e.g. `@test.dk`) |

---

#### ROLES-CHECK:

> Checking if the user has a role and displays it.

> <img 
>   src="frontend/public/images/role-check.png" 
>   alt="role lookup on user" 
>   width="400"
> />

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| ROLES_CHECK_ENABLED | Enable/disable the roles check |
>| ROLES_FIELD | Field containing user roles |

---

#### COUNT-CHECK:

> Counts how many items (e.g. "orders") the user has.
> - You can make several of these

> <img 
>   src="frontend/public/images/count-check.png" 
>   alt="User field, count lookup" 
>   width="400"
> />

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| COUNT_CHECK_ENABLED | Enable/disable the count check |
>| COUNT_CHECKS | List of checks in format `title:collection.field` |

**Example:**
>```env
>COUNT_CHECKS=Orders:orders.userId,Products:products.userId
>```

---

#### DROPDOWN-CHECK:

> This check displays the payload for the chosen field.
> - You can make several of these

> <img 
>   src="frontend/public/images/dropdown-check.png" 
>   alt="User field, payload lookup" 
>   width="400"
> />

**Status:**
> If your payload contains a `status` field matching one of the values below, this will determine the item status. All other values will be treated as neutral.


> | Payload status | Item Status  |
> |----------------|--------------|
> | 'error'        | 'fail'       |
> | 'fail'         | 'fail'       |
> | 'cancelled'    | 'fail'       |
> |----------------|--------------|
> | 'success'      | 'success'    |
> | 'ok'           | 'success'    |
> | 'sent'         | 'success'    |
> | 'shipped'      | 'success'    |
> |----------------|--------------|
> | 'warning'      | 'warning'    |

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| DROPDOWN_CHECK_ENABLED | Enable/disable the dropdown check |
>| DROPDOWN_CHECKS | List of checks in format `title:collection.field` |

**Example:**
>```env
>DROPDOWN_CHECKS=Order status:orders.status,Payment >type:payments.method
>```

---

### DB Validations:

#### COLLECTIONS-CHECK:

> Checks all collections defined in your environment variables for data.
> - If success -> shows all the collections you choose.
> - If fail -> shows all the empty collections

> <img 
>   src="frontend/public/images/collections-check.png" 
>   alt="Collections lookup" 
>   width="400"
> />

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| COLLECTIONS_CHECK_ENABLED | Enable/disable collections check |
>| COLLECTIONS_CHECK | Comma-separated list of collections |

---

#### METRICS-CHECK:

> This check provides different metrics depending on whether MongoDB or Couchbase is used.

**MongoDB-metrics**
> - Connections
> - Cache usage
> - Network requests
> - CPU usage

> <img 
>   src="frontend/public/images/mongo-metrics-checks1.png" 
>   alt="Mongo Metrics lookup 1" 
>   width="400"
> />

> <img 
>   src="frontend/public/images/mongo-metrics-check2.png" 
>   alt="Mongo Metrics lookup 2" 
>   width="400"
> />

**Thresholds & Accuracy**
> All MongoDB metric thresholds are **manually defined**.

> MongoDB does **not provide official warning or critical thresholds** for most metrics, so the tool uses **conservative default values** to indicate potential risk.

> Important notes:
> - Thresholds are not environment-specific (future todo)
> - Values should be tuned for developing, testing or production workloads
> - Visual indicators are meant to demonstrate trends and health signals (Right now, sat just for show)

> The values of the thresholds are intended as **safe defaults** and should be adjusted based on system capacity and expected traffic.
> For detailed explanations, each metric includes a help dialog in the UI.

**Couchbase-metrics**
> Couchbase metrics are **partially implemented**.

> This is due to differences between MongoDB’s `serverStatus` API, and Couchbase’s available HTTP statistics.

> Planned:
> - Improve Couchbase metric coverage
> - Align Couchbase metrics with MongoDB where possible

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| METRICS_CHECK_ENABLED | Enable/disable metrics check |
>| CB_CONNSTR_HTTP | Couchbase HTTP endpoint (Couchbase only) |

---

### System Validations:

#### PING-CHECK:

> This check pings an URL, to see if it is reachable, e.g. an SAP Identity Server.

> <img 
>   src="frontend/public/images/ping-check.png" 
>   alt="Ping lookup" 
>   width="400"
> />

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| PING_CHECK_ENABLED | Enable/disable ping check |
>| PING_URL | URL to ping (with optional port) |

---

#### SERVICE-CHECK:

> This check is similar to a health check, but it renders the selected services' `/version` endpoints, allowing you to see which versions are currently deployed and which aren't running.

> <img 
>   src="frontend/public/images/service-check.png" 
>   alt="Service lookup" 
>   width="400"
> />

**Environment variables:**

>| Variable | Description |
>|--------|-------------|
>| SERVICE_CHECK_ENABLED | Enable/disable service check |
>| SERVICE_CHECKS | Service definitions per environment |

**Format:**
```text
Service name,devURL,testURL,prodURL;
```
**Example:**
>```env
>SERVICE_CHECKS=Test Service,localhost:8082,localhost:8083,localhost:8084;
>```

---

## Planned Improvements

- Full Couchbase metrics support
- Configurable metric thresholds via environment variables
- New filter-check
- Styling header for UI
- Adding time-limit on 'dropdown-check'


## Deployment
> The manifest.yml file is just an example for Cloud Foundry

## License

MIT