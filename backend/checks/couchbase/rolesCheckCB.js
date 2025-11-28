import { connectCouchbase, BUCKET, SCOPE } from "../../db/couchbaseDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function rolesCheckCB(email) {
  const fullEmail = emailEnding(email);
  const collection = process.env.EMAIL_COLLECTION;
  const field = process.env.ROLES_FIELD;
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
        detail: `Collection: ${collection}`,
        data: [],
      };
    }

    // Extract field from result
    const rolesRaw = result.rows[0][field];
    let rolesArray;

    if (Array.isArray(rolesRaw)) {
      rolesArray = rolesRaw;
    } else if (typeof rolesRaw === "string" && rolesRaw.trim() !== "") {
      rolesArray = [rolesRaw];
    } else {
      rolesArray = [];
    }

    if (rolesArray.length === 0) {
      return {
        status: "fail",
        message: `${fullEmail} has 0 roles`,
        detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
        data: [],
      };
    }

    return {
      status: "success",
      message: `${fullEmail} has roles: ${rolesArray.join(", ")}`,
      detail: `Collection: ' ${collection} '.  Field: ' ${field} '`,
      data: rolesArray,
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
