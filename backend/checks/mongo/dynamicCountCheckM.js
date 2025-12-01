import { connectMongo } from "../../db/mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";
import { COUNT_CHECK_CONFIG } from "../../db/db.js";

export async function dynamicCountCheckM(config, email) {
    //const config = COUNT_CHECK_CONFIG[id];
    const fullEmail = emailEnding(email);
    const { title, collection, field } = config;

    try {
        const db = await connectMongo();
        const user = await db.collection(collection).findOne({ email: fullEmail });

        if (!user) {
            return {
                status: "fail",
                title,
                message: `Email not found: ${fullEmail}`,
                detail: `Collection: '${collection}'`,
                data: []
            };
        }

        if (!(field in user)) {
            return {
                status: "fail",
                title,
                message: `Field '${field}' does not exist on ${fullEmail}`,
                detail: `Collection: '${collection}', Field: '${field}'`,
                data: []
            };
        }

        const items = user[field];
        const count = Array.isArray(items) ? items.length : 0;

        return {
            status: "success",
            title,
            message: `${fullEmail} has ${count} ${field}`,
            detail: `Collection: '${collection}', Field: '${field}'`,
            data: count
        };

    } catch (error) {
        return {
            status: "error",
            title,
            message: "MongoDB count-check failed",
            detail: error.message,
            data: []
        };
    }
}
