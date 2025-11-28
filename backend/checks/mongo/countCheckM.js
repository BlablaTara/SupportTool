import { connectMongo } from "../../db/mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function countCheckM(email) {
    const fullEmail = emailEnding(email);
    const collection = process.env.COUNT_COLLECTION
    const field = process.env.COUNT_FIELD

    try {
        const db = await connectMongo();
        const user = await db.collection(collection).findOne({ email: fullEmail });

        if (!user) {
            return {
                status: "fail",
                message: `Email not found: ${fullEmail}`,
                detail: `Collection: ${collection}`,
                data: [],
            };
        }

        if (!(field in user)) {
            return {
                status: "fail",
                message: `Field '${field}' does not exist on ${fullEmail}`,
                detail: `Collection: '${collection}'. Field: '${field}'`,
                data: [],
            };
        }


        const count = user[field] ?? [];

        const fieldCount = Array.isArray(count) ? count.length : 0;

        if (fieldCount === 0) {
            return {
                status: "fail",
                message: `0 ${field} found on ${fullEmail}`,
                detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
                data: [],
            };
        }

        return {
            status: "success",
            message: `${fieldCount} ${field} found on ${fullEmail}`,
            detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
            data: fieldCount
        };
    } catch (error) {
        return {
            status: "error",
            message: "MongoDB role-query failed",
            detail: error.message,
        };
    }
}