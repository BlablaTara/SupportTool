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
        findEmail: (c, q) => emailCheckM(c, q),
        findRoles: (c, q) => rolesCheckM(c, q)
    };
} else if (process.env.DB_TYPE === "Couchbase") {
    // import here else node will crash bc CB will try to load native bindings
    // Therefor only couchbase import if couchbase is choosen.
    const { connectCouchbase } = await import( "./couchbase/couchbaseDriver.js");
    const { emailCheckCB } = await import("./couchbase/emailCheckCB.js");
    
    await connectCouchbase();
    driver = {
        findEmail: (c, q) => emailCheckCB(c, q)
    };
}

export default driver;