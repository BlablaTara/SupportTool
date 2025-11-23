import { connectCouchbase, BUCKET, SCOPE } from "./couchbaseDriver.js";

export async function emailCheckCB(collection, email) {
    const { cluster } = await connectCouchbase();

    // console.log("Querying Couchbase with:");
    // console.log("Bucket:", BUCKET);
    // console.log("Scope:", SCOPE);
    // console.log("Collection:", collection);

    const query = `
        SELECT * 
        FROM \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`
        WHERE email = $email
    `;

    try {
        const result = await cluster.query(query, { parameters: { email } });
        // console.log("Query result:", result.rows);
        const items = result.rows.map(r => r[collection]);

        return {
            status: items.length ? "success" : "fail",
            message: items.length
                ? `User found: ${email}`
                : `User does not exist`,
            detail: `Collection: ${collection}`,
            items
        };

    } catch (error) {
        // console.error("Couchbase query error:", err);
        const missingIndex = error?.cause?.first_error_code === 4000;
        const keyspaceNotFound = error?.cause?.first_error_message?.includes("Keyspace not found");

        if (missingIndex) {
            return {
                status: "error",
                message: "Required index is missing",
                detail: `CREATE INDEX idx_email ON \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`(email);`
            };
        } else if (keyspaceNotFound) {
            return {
                status: "error",
                message: `The bucket/scope/collection does not exist`,
                detail: error.cause.first_error_message 
            };
        }

        return {
            status: "error",
            message: "Unknown Couchbase error",
            detail: error.message
        };
    }
}
