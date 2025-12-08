import { connectCouchbase, BUCKET, SCOPE } from "../../db/couchbaseDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";
import crypto from "crypto";

export async function dropdownCheckCB(config, email) {
    const fullEmail = emailEnding(email);
    const { title, collection, field } = config;

    try {
        const { cluster } = await connectCouchbase();

        const query = `
            SELECT \`${field}\`
            FROM \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`
            WHERE email = $email

        `;

        const result = await cluster.query(query, {
            parameters: { email: fullEmail }
        });

        if (!result.rows || result.rows.length === 0) {
            return {
                status: "fail",
                title,
                message: `Email not found: ${fullEmail}`,
                detail: `Collection: '${collection}'`,
                count: 0,
                data: []
            };
        }

        const value = result.rows[0][field];

        if (value === undefined) {
            return {
                status: "fail",
                title,
                message: `Field '${field}' does not exist on ${fullEmail}`,
                detail: `Collection: '${collection}', Field: '${field}'`,
                count: 0,
                data: []
            };
        }

        // Converting to array
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
                detail: `Collection: '${collection}', Field: '${field}'`,
                count,
                data: []
            };
        }

        const items = dataArray.map(item => ({
            id: crypto.randomUUID(),
            value: item
        }));

        return {
            status: "success",
            title,
            message: `${count} recent '${field}' found`,
            detail: `Collection: '${collection}', Field: '${field}'`,
            count,
            data: items
        };

    } catch (error) {
        const missingIndex = error?.cause?.first_error_code === 4000;
        const keyspaceNotFound = error?.cause?.first_error_message?.includes("Keyspace not found");

        if (missingIndex) {
            return {
                status: "error",
                title,
                message: "Required index is missing",
                detail: `CREATE INDEX idx_email ON \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`(email);`,
                count: 0,
                data: []
            };
        }

        if (keyspaceNotFound) {
            return {
                status: "error",
                title,
                message: `The bucket/scope/collection does not exist`,
                detail: error.cause.first_error_message,
                count: 0,
                data: []
            };
        }

        return {
            status: "error",
            title,
            message: "Unknown Couchbase dropdown-query failed",
            detail: error.message,
            count: 0,
            data: []
        };
    }
}