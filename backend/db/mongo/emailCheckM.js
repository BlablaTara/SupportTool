import { connectMongo } from "./mongoDriver.js";

export async function emailCheckM(collection, email) {
    try {
        const db = await connectMongo();

        const items = await db.collection(collection).find({ email }).toArray();
        return { ok: true, items };
    } catch (error) {
        console.error("Mongo query error:", error);
        return { 
            ok: false, 
            error: "QUERY_FAILED",
            message: "MongoDB query failed",
            detail: error.message
        };

    }
}