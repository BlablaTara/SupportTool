import { connectMongo } from "./mongoDriver.js";

export async function emailCheckM(collection, email) {
    try {
        const db = await connectMongo();
        const items = await db.collection(collection).find({ email }).toArray();

        return {
            status: items.length ? "success" : "fail",
            message: items.length
                ? `User found: ${email}`
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