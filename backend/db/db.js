import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectMongo } from "./mongoDriver.js";
import { emailCheckM } from "../checks/mongo/emailCheckM.js";
import { rolesCheckM } from "../checks/mongo/rolesCheckM.js";
import { countCheckM } from "../checks/mongo/countCheckM.js";
import { parseChecks, findDuplicateCheckTitles } from "../utils/parseChecks.js";
import { collectionsCheckM } from "../checks/mongo/collectionsCheckM.js";
import { parseEnvWithComma } from "../utils/parseEnvWithComma.js";
import { dropdownCheckM } from "../checks/mongo/dropdownCheckM.js";
import { metricsCheckM } from "../checks/mongo/metricsCheckM.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env")
});

export const DROPDOWN_CHECK_CONFIG = parseChecks(process.env.DROPDOWN_CHECKS).map(c => ({ ...c, type: "DROPDOWN_CHECK" }));
export const COUNT_CHECK_CONFIG = parseChecks(process.env.COUNT_CHECKS).map(c => ({ ...c, type: "COUNT_CHECK" }));
export const COLLECTIONS_CHECK_CONFIG = parseEnvWithComma(process.env.COLLECTIONS_CHECK);

export const CHECK_CONFIG_ERRORS = findDuplicateCheckTitles(
    COUNT_CHECK_CONFIG,
    DROPDOWN_CHECK_CONFIG
);

let driver = {};

if (process.env.DB_TYPE === "MongoDB") {
    
    await connectMongo();
    driver = {
        findEmail: (email) => emailCheckM(email),
        findRoles: (email) => rolesCheckM(email),
        findCount: (config, email) => countCheckM(config, email),
        checkCollections: () => collectionsCheckM(COLLECTIONS_CHECK_CONFIG),
        checkDropdown: (config, email) => dropdownCheckM(config, email),
        checkMetrics: () => metricsCheckM(),
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
    const { metricsCheckCB } = await import("../checks/couchbase/metricsCheckCB.js");
    
    await connectCouchbase();
    driver = {
        findEmail: (email) => emailCheckCB(email),
        findRoles: (email) => rolesCheckCB(email),
        findCount: (config, email) => countCheckCB(config, email),
        checkCollections: () => collectionsCheckCB(COLLECTIONS_CHECK_CONFIG),
        checkDropdown: (config, email) => dropdownCheckCB(config, email),
        checkMetrics: () => metricsCheckCB(),
    };
}

export default driver;