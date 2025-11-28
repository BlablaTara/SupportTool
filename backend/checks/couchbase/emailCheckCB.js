import { connectCouchbase, BUCKET, SCOPE } from "../../db/couchbaseDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function emailCheckCB(email) {
  const fullEmail = emailEnding(email);
  const collection = process.env.EMAIL_COLLECTION;
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
    const result = await cluster.query(query, {
      parameters: { email: fullEmail },
    });
    // console.log("Query result:", result.rows);
    const data = result.rows.map((r) => r[collection]);

    return {
      status: data.length ? "success" : "fail",
      message: data.length ? `Email found: ${fullEmail}` : `Email not found`,
      detail: `Collection: ' ${collection} '`,
      data,
    };
  } catch (error) {
    // console.error("Couchbase query error:", err);
    const missingIndex = error?.cause?.first_error_code === 4000;
    const keyspaceNotFound =
      error?.cause?.first_error_message?.includes("Keyspace not found");

    if (missingIndex) {
      return {
        status: "error",
        message: "Required index is missing",
        detail: `CREATE PRIMARY INDEX \`#primary\` ON \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`;`,
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
