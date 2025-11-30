import { connectMongo } from "../../db/mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function countCheckM(email) {
    const fullEmail = emailEnding(email);
    const collection = process.env.COUNT_COLLECTION
    const field = process.env.COUNT_FIELD
    const title = process.env.COUNT_TITLE || "Count Check"

    try {
        const db = await connectMongo();
        const user = await db.collection(collection).findOne({ email: fullEmail });

        if (!user) {
            return {
                status: "fail",
                title,
                message: `Email not found: ${fullEmail}`,
                detail: `Collection: '${collection}'`,
                data: [],
            };
        }

        if (!(field in user)) {
            return {
                status: "fail",
                title,
                message: `Field '${field}' does not exist on ${fullEmail}`,
                detail: `Collection: '${collection}'. Field: '${field}'`,
                data: [],
            };
        }

        const value = user[field];
        const fieldCount = value.length;

        if (fieldCount === 0) {
            return {
                status: "fail",
                title,
                message: `${fullEmail}, has 0 ${field}`,
                detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
                data: [],
            };
        }

        return {
            status: "success",
            title,
            message: `${fullEmail}, has ${fieldCount} ${field}`,
            detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
            data: fieldCount
        };

    } catch (error) {
        return {
            status: "error",
            title,
            message: "MongoDB role-query failed",
            detail: error.message,
        };
    }
}