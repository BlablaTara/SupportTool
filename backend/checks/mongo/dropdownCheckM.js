import { connectMongo } from "../../db/mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";
import crypto from "crypto";

export async function dropdownCheckM(config, email) {
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
                count: 0,
                data: [],
            };
        }

        if (!(field in user)) {
            return {
                status: "fail",
                title,
                message: `Field '${field}' does not exist on ${fullEmail}`,
                detail: `Collection: '${collection}'. Field: '${field}'`,
                count: 0,
                data: [],
            };
        }

        const value = user[field];

        let dataArray;
        if (Array.isArray(value)) {
            dataArray = value;
        } else if (value !== null && value !== undefined) {
            dataArray = [value];
        } else {
            dataArray = [];
        }

        const count = dataArray.length;

        if (count === 0) {
            return {
                status: "fail",
                title,
                message: `No recent '${field}' is found`,
                detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
                count,
                data: [],
            }; 
        }

        // generating uniqe id's for each item
        const items = dataArray.map((item) => ({
            id: crypto.randomUUID(),
            value: item
        }));

        return {
            status: "success",
            title,
            message: `${count} recent '${field}' found`,
            detail: `Collection: '${collection}'.  Field: '${field}'`,
            count,
            data: items
        };

    } catch (error) {
        return {
            status: "error",
            title,
            message: "MongoDB dropdown-query failed",
            detail: error.message,
            count: 0,
            data: []
        };

    }
}