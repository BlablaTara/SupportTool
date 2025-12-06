import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectMongo } from "./mongoDriver.js";
import { emailCheckM } from "../checks/mongo/emailCheckM.js";
import { rolesCheckM } from "../checks/mongo/rolesCheckM.js";
import { countCheckM } from "../checks/mongo/countCheckM.js";
import { parseCountChecks } from "../utils/parseCountChecks.js";
import { collectionsCheckM } from "../checks/mongo/collectionsCheckM.js";
import { parseEnvWithComma } from "../utils/parseEnvWithComma.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env")
});

export const COUNT_CHECK_CONFIG = parseCountChecks(process.env.COUNT_CHECKS);
export const COLLECTIONS_CHECK_CONFIG = parseEnvWithComma(process.env.COLLECTIONS_CHECK);

let driver = {};

if (process.env.DB_TYPE === "MongoDB") {
    
    await connectMongo();
    driver = {
        findEmail: (email) => emailCheckM(email),
        findRoles: (email) => rolesCheckM(email),
        findCount: (config, email) => countCheckM(config, email),
        checkCollections: () => collectionsCheckM(COLLECTIONS_CHECK_CONFIG),
    };

} else if (process.env.DB_TYPE === "Couchbase") {
    // imports here else node will crash bc CB will try to load native bindings
    // Therefor only couchbase import if couchbase is choosen.
    const { connectCouchbase } = await import("./couchbaseDriver.js");
    const { emailCheckCB } = await import("../checks/couchbase/emailCheckCB.js");
    const { rolesCheckCB } = await import ("../checks/couchbase/rolesCheckCB.js");
    const { countCheckCB } = await import("../checks/couchbase/countCheckCB.js");
    const { collectionsCheckCB } = await import("../checks/couchbase/collectionsCheckCB.js");
    
    await connectCouchbase();
    driver = {
        findEmail: (email) => emailCheckCB(email),
        findRoles: (email) => rolesCheckCB(email),
        findCount: (config, email) => countCheckCB(config, email),
        checkCollections: () => collectionsCheckCB(COLLECTIONS_CHECK_CONFIG),
    };
}

export default driver;