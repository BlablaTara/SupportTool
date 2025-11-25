import { connectMongo } from "./mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function emailCheckM(collection, email) {
    const fullEmail = emailEnding(email);
    try {
        const db = await connectMongo();
        const items = await db.collection(collection).find({ email: fullEmail }).toArray();

        return {
            status: items.length ? "success" : "fail",
            message: items.length
                ? `User found: ${fullEmail}`
                : `User does not exist`,
            detail: collection,
            items
        };
    } catch (error) {
        // console.error("Mongo query error:", error);
        return { 
            status: "error",
            message: "MongoDB query failed",
            detail: error.message
        };

    }
}