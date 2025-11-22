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
        return { ok: true, items: result.rows.map(r => r[collection]) };

    } catch (err) {
        // Couchbase missing index = code 4000
        console.error("Couchbase query error:", err);
        const missingIndex = err?.cause?.first_error_code === 4000;
        
        const keyspaceNotFound = err?.cause?.first_error_message?.includes("Keyspace not found");

        if (missingIndex) {
            return {
                ok: false,
                error: "MISSING_INDEX",
                message: "Required index is missing",
                detail: `CREATE INDEX idx_email ON \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`(email);`
            };
        } else if (keyspaceNotFound) {
            return {
                ok: false,
                error: "KEYSPACE_NOT_FOUND",
                message: `The bucket/scope/collection does not exist`,
                detail: err.cause.first_error_message 
            };
        }

        return {
            ok: false,
            error: "QUERY_FAILED",
            message: "Unknown Couchbase error",
            detail: err.message
        };
    }
}
