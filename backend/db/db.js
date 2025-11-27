import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectMongo } from "./mongo/mongoDriver.js";
import { emailCheckM } from "./mongo/emailCheckM.js";
import { rolesCheckM } from "./mongo/rolesCheckM.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env")
});


let driver = {};

if (process.env.DB_TYPE === "MongoDB") {
    await connectMongo();
    driver = {
        findEmail: (email) => emailCheckM(email),
        findRoles: (email) => rolesCheckM(email)
    };
} else if (process.env.DB_TYPE === "Couchbase") {
    
    // imports here else node will crash bc CB will try to load native bindings
    // Therefor only couchbase import if couchbase is choosen.
    const { connectCouchbase } = await import( "./couchbase/couchbaseDriver.js");
    const { emailCheckCB } = await import("./couchbase/emailCheckCB.js");
    const { rolesCheckCB } = await import ("./couchbase/rolesCheckCB.js");
    
    await connectCouchbase();
    driver = {
        findEmail: (email) => emailCheckCB(email),
        findRoles: (email) => rolesCheckCB(email)
    };
}

export default driver;