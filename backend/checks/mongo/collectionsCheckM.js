import { connectMongo } from "../../db/mongoDriver.js";


export async function collectionsCheckM(collections) {
    try {
        const db = await connectMongo();
        const emptyCollections = [];

        for (const name of collections) {
            const count = await db.collection(name).countDocuments();
            if (count === 0) {
                emptyCollections.push(name);
            }
        }
        if (emptyCollections.length > 0) {
            return {
                status: "fail",
                title: "Collections Check",
                message: "One or more collections have no data",
                detail: `Empty collections: ${emptyCollections.join(",")}`,
                data: emptyCollections
            };
        }

        return {
            status: "success",
            title: "Collections Check",
            message: "All collections contain data",
            detail: `Checked: ${collections.join(",")}`,
            data: collections
        };
        
    } catch (error) {
        return {
            status: "error",
            title: "Collections Check",
            message: "MongoDB collection check failed",
            detail: error.message,
            data: []
        };
    }
    
}