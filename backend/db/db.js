import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectMongo } from "./mongoDriver.js";
import { emailCheckM } from "../checks/mongo/emailCheckM.js";
import { rolesCheckM } from "../checks/mongo/rolesCheckM.js";
import { countCheckM } from "../checks/mongo/countCheckM.js";
import { parseChecks } from "../utils/parseChecks.js";
import { collectionsCheckM } from "../checks/mongo/collectionsCheckM.js";
import { parseEnvWithComma } from "../utils/parseEnvWithComma.js";
import { dropdownCheckM } from "../checks/mongo/dropdownCheckM.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env")
});

export const DROPDOWN_CHECK_CONFIG = parseChecks(process.env.DROPDOWN_CHECKS);
export const COUNT_CHECK_CONFIG = parseChecks(process.env.COUNT_CHECKS);
export const COLLECTIONS_CHECK_CONFIG = parseEnvWithComma(process.env.COLLECTIONS_CHECK);

let driver = {};

if (process.env.DB_TYPE === "MongoDB") {
    
    await connectMongo();
    driver = {
        findEmail: (email) => emailCheckM(email),
        findRoles: (email) => rolesCheckM(email),
        findCount: (config, email) => countCheckM(config, email),
        checkCollections: () => collectionsCheckM(COLLECTIONS_CHECK_CONFIG),
        checkDropdown: (config, email) => dropdownCheckM(config, email),
    };

} else if (process.env.DB_TYPE === "Couchbase") {
    // imports here else node will crash bc CB will try to load native bindings
    // Therefor only couchbase import if couchbase is choosen.
    const { connectCouchbase } = await import("./couchbaseDriver.js");
    const { emailCheckCB } = await import("../checks/couchbase/emailCheckCB.js");
    const { rolesCheckCB } = await import ("../checks/couchbase/rolesCheckCB.js");
    const { countCheckCB } = await import("../checks/couchbase/countCheckCB.js");
    const { collectionsCheckCB } = await import("../checks/couchbase/collectionsCheckCB.js");
    const { dropdownCheckCB } = await import("../checks/couchbase/dropdownCheckCB.js");
    
    await connectCouchbase();
    driver = {
        findEmail: (email) => emailCheckCB(email),
        findRoles: (email) => rolesCheckCB(email),
        findCount: (config, email) => countCheckCB(config, email),
        checkCollections: () => collectionsCheckCB(COLLECTIONS_CHECK_CONFIG),
        checkDropdown: (config, email) => dropdownCheckCB(config, email),
    };
}

export default driver;