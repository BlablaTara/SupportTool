import { connectCouchbase, BUCKET, SCOPE } from "../../db/couchbaseDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function countCheckCB(email) {
    const fullEmail = emailEnding(email);
    const collection = process.env.COUNT_COLLECTION;
    const field = process.env.COUNT_FIELD;
    const { cluster } = await connectCouchbase();

    const query = `
        SELECT \`${field}\`
        FROM \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`
        WHERE email = $email
    `;

    try {
        const result = await cluster.query(query, {
        parameters: { email: fullEmail },
        });

        if (!result.rows || result.rows.length === 0) {
            return {
                status: "fail",
                message: `Email not found: ${fullEmail}`,
                detail: `Collection: '${collection}'`,
                data: [],
            };
        }
        // Extract field from result
        const value = result.rows[0][field];

        if (value === undefined) {
            return {
                status: "fail",
                message: `${fullEmail} has no '${field}' field`,
                detail: `Collection: '${collection}', Field: '${field}'`,
                data: [],
            };
        }

        if (!Array.isArray(value)) {
            return {
                status: "fail",
                message: `'${field}' exists, but is not an array.`,
                detail: `Found type: ${typeof value}`,
                data: [],
            };
        }

        const fieldCount = value.length;
        
        if (fieldCount === 0) {
            return {
                status: "fail",
                message: `${fullEmail}, has 0 ${field}`,
                detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
                data: [],
            };
        }

        return {
            status: "success",
            message: `${fullEmail}, has ${fieldCount} ${field}`,
            detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
            data: fieldCount
        };

    } catch (error) {
        // Couchbase errors: missing index / keyspace not found
        const missingIndex = error?.cause?.first_error_code === 4000;
        const keyspaceNotFound =
            error?.cause?.first_error_message?.includes("Keyspace not found");

        if (missingIndex) {
            return {
                status: "error",
                message: "Required index is missing",
                detail: `CREATE INDEX idx_email ON \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`(email);`,
            };
            
        } else if (keyspaceNotFound) {
            return {
                status: "error",
                message: `The bucket/scope/collection does not exist`,
                detail: error.cause.first_error_message,
            };
        }

        return {
        status: "error",
        message: "Unknown Couchbase error",
        detail: error.message,
        };
    }
}