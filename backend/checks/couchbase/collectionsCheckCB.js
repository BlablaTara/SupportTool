import { connectCouchbase } from "../../db/couchbaseDriver.js";

export async function collectionsCheckCB(collections) {
    try {
        const { cluster } = await connectCouchbase();
        const emptyCollections = [];

        for (const name of collections) {

            //N1QL cant make COUNT(*) without an existing collection + index
            const query = `
                SELECT COUNT(*) AS count
                FROM \`${BUCKET}\`.\`${SCOPE}\`.\`${name}\`
            `;

            try {
                const result = await cluster.query(query);

                const count = result?.rows?.[0]?.count ?? 0;

                if (count === 0) {
                emptyCollections.push(name);
                }

            } catch (error) {
                const keyspaceNotFound = error?.cause?.first_error_message?.includes("Keyspace not found");

                if (keyspaceNotFound) {
                    return {
                        status: "error",
                        title: "Collections Check",
                        message: `Collection: '${name}' does not exist`,
                        detail: error.cause.first_error_message,
                        data: []
                    };

                }

                const missingIndex = error?.cause?.first_error_code === 4000;
                if (missingIndex) {
                    return {
                        status: "error",
                        title: "Collections Check",
                        message: `Missing indes for collection '${name}'`,
                        detail: `CREATE PRIMARY INDEX idx_${name}_primary ON \`${BUCKET}\`.\`${SCOPE}\`.\`${name}\`;`,
                        data: []
                    }
                };

                return {
                    status: "error",
                    title: "Collections Check",
                    message: `Unknown Couchbase query error in '${name}'`,
                    detail: error.message,
                    data: []
                };
            }
        }

        if (emptyCollections.length > 0) {
            return {
                status: "fail",
                title: "Collections Check",
                message: "One or more collections have no data",
                detail: `Empty collections: ${emptyCollections.join(", ")}`,
                data: emptyCollections
            };
        }

        return {
            status: "success",
            title: "Collections Check",
            message: "All collections contain data",
            detail: `Checked: ${collections.join(", ")}`,
            data: collections
        };

    } catch (error) {
        return {
            status: "error",
            title: "Collections Check",
            message: "Couchbase collection check failed",
            detail: error.message,
            data: []
        };
    }
}